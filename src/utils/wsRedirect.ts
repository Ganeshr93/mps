import { connect } from 'tls'
import { constants } from 'crypto'
import { logger as log } from '../utils/logger'
import { Socket } from 'net'
import { IncomingMessage } from 'http'
import { queryParams } from '../models/Config'
import { WebSocketExt } from '../models/models'
import { devices } from '../server/mpsserver'
import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { HttpInterceptor } from './httpInterceptor'
import { RedirectInterceptor } from './redirectInterceptor'

export class WsRedirect {
  secrets: ISecretManagerService

  constructor (secrets: ISecretManagerService) {
    this.secrets = secrets
  }

  handleConnection = async (ws: WebSocketExt, req: IncomingMessage): Promise<void> => {
    const reqQueryURL = new URL(req.url, 'http://dummy.com')
    const params: queryParams = {
      host: reqQueryURL.searchParams.get('host'),
      port: Number(reqQueryURL.searchParams.get('port')),
      p: Number(reqQueryURL.searchParams.get('p')),
      tls: Number(reqQueryURL.searchParams.get('tls')),
      tls1only: Number(reqQueryURL.searchParams.get('tls1only'))
    }

    ws._socket.pause()
    // console.log('Socket paused', ws._socket);

    // When data is received from the web socket, forward the data into the associated TCP connection.
    // If the TCP connection is pending, buffer up the data until it connects.
    ws.on('message', msg => {
      this.handleMessage(ws, msg)
    })

    // If the web socket is closed, close the associated TCP connection.
    ws.on('close', () => {
      this.handleClose(ws, params)
    })

    // We got a new web socket connection, initiate a TCP connection to the target Intel AMT host/port.
    log.debug(`Opening web socket connection to ${params.host}: ${params.port}.`)

    // Fetch Intel AMT credentials & Setup interceptor
    const credentials = await this.secrets.getAMTCredentials(params.host)
    if (credentials != null) {
      this.createCredential(ws, params, credentials)
    }

    if (params.tls === 0) {
      this.setNormalTCP(ws, params)
    } else {
      this.setupTLSSocket(ws, params)
    }

    // Add handlers to socket.
    if (ws.forwardclient instanceof Socket) {
      this.forwardToClient(ws, params, req)
    }

    if (params.tls === 0) {
      if (!devices[params.host]) {
        // A TCP connection to Intel AMT just connected, send any pending data and start forwarding.
        ws.forwardclient.connect(params.port, params.host, () => {
          log.debug(`TCP connected to ${params.host}:${params.port}.`)
          ws._socket.resume()
        })
      }
    }
  }

  handleMessage (ws: WebSocketExt, msg: any): void {
    // Convert a buffer into a string, "msg = msg.toString('ascii');" does not work
    // var msg2 = "";
    // for (var i = 0; i < msg.length; i++) { msg2 += String.fromCharCode(msg[i]); }
    // msg = msg2;
    msg = msg.toString('binary')

    if (ws.interceptor) {
      msg = ws.interceptor.processBrowserData(msg)
    } // Run data thru interceptor
    ws.forwardclient.write(msg) // Forward data to the associated TCP connection.
  }

  handleClose (ws: WebSocketExt, params: queryParams): void {
    log.debug(
      `Closing web socket connection to  ${params.host}: ${params.port}.`
    )
    if (ws.forwardclient) {
      if (ws.forwardclient.close) {
        ws.forwardclient.close()
      }
      try {
        if (ws.forwardclient.destroy) {
          ws.forwardclient.destroy()
        }
      } catch (e) {
        log.error(`Exception while destroying AMT CIRA channel: ${e}`)
      }
    }
  }

  createCredential (ws: WebSocketExt, params: queryParams, credentials: any[]): void {
    if (credentials != null) {
      log.debug('Creating credential')
      if (params.p === 1) {
        ws.interceptor = new HttpInterceptor({
          host: params.host,
          port: params.port,
          user: credentials[0],
          pass: credentials[1]
        })
      } else if (params.p === 2) {
        ws.interceptor = new RedirectInterceptor({
          user: credentials[0],
          pass: credentials[1]
        })
      }
    }
  }

  setNormalTCP (ws: WebSocketExt, params: queryParams): void {
    // If this is TCP (without TLS) set a normal TCP socket
    // check if this is MPS connection
    const uuid: string = params.host
    const ciraConn = devices[uuid]
    if (uuid && ciraConn) {
      ws.forwardclient = ciraConn.ciraHandler.SetupCiraChannel(ciraConn.ciraSocket, params.port)

      ws.forwardclient.xtls = 0
      ws.forwardclient.onData = (data: any): void => {
        // Run data thru interceptor
        if (ws.interceptor) {
          data = ws.interceptor.processAmtData(data)
        }
        try {
          ws.send(data)
        } catch (e) {
          log.error(`Exception while forwarding data to client: ${e}`)
        }
      }

      ws.forwardclient.onStateChange = (ciraconn: any, state: number): void => {
        // console.log('Relay CIRA state change:'+state);
        if (state === 0) {
          try {
            // console.log("Closing websocket.");
            ws.close()
          } catch (e) {
            log.error(`Exception while closing client websocket connection: ${e}`)
          }
        }
      }
      ws._socket.resume()
    } else {
      ws.forwardclient = new Socket()
      ws.forwardclient.setEncoding('binary')
      ws.forwardclient.forwardwsocket = ws
    }
  }

  setupTLSSocket (ws: WebSocketExt, params: queryParams): void {
    // If TLS is going to be used, setup a TLS socket
    log.info('TLS Enabled!')
    const tlsoptions = {
      secureProtocol:
          params.tls1only === 1 ? 'TLSv1_method' : 'SSLv23_method',
      ciphers: 'RSA+AES:!aNULL:!MD5:!DSS',
      secureOptions:
          constants.SSL_OP_NO_SSLv2 |
          constants.SSL_OP_NO_SSLv3 |
          constants.SSL_OP_NO_COMPRESSION |
          constants.SSL_OP_CIPHER_SERVER_PREFERENCE,
      rejectUnauthorized: false
    }
    ws.forwardclient = connect(
      params.port,
      params.host,
      tlsoptions,
      () => {
        // The TLS connection method is the same as TCP, but located a bit differently.
        log.debug(`TLS connected to ${params.host}: ${params.port}.`)
        ws._socket.resume()
      }
    )
    ws.forwardclient.setEncoding('binary')
    ws.forwardclient.forwardwsocket = ws
  }

  forwardToClient (ws: WebSocketExt, params: queryParams, req: IncomingMessage): void {
    // When we receive data on the TCP connection, forward it back into the web socket connection.
    ws.forwardclient.on('data', data => {
      if (ws.interceptor) {
        data = ws.interceptor.processAmtData(data)
      } // Run data thru interceptor
      try {
        ws.send(data)
      } catch (e) {
        log.error(`Exception while forwarding data to client: ${e}`)
      }
    })

    // If the TCP connection closes, disconnect the associated web socket.
    ws.forwardclient.on('close', () => {
      log.debug(
          `TCP disconnected from ${params.host} : ${params.port}.`
      )
      try {
        ws.close()
      } catch (e) { }
    })

    // If the TCP connection causes an error, disconnect the associated web socket.
    ws.forwardclient.on('error', (err: { code: any }) => {
      log.debug(`TCP disconnected with error from ${params.host}:${params.port}:${err.code},${req.url}`)
      try {
        ws.close()
      } catch (e) { }
    })
  }
}
