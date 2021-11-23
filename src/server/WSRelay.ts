import { queryParams } from '../models/Config'
import { logger } from '../utils/logger'
import WebSocket from 'ws'
import { Socket } from 'net'
import { CreateHttpInterceptor, CreateRedirInterceptor } from '../utils/interceptor'
import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { IncomingMessage } from 'http'

export class WSRelay {
  websocket: WebSocket | any
  server: WebSocket.Server
  params: queryParams
  secrets: ISecretManagerService
  constructor (options: WebSocket.ServerOptions, secrets: ISecretManagerService) {
    this.server = new WebSocket.Server(options)
    this.server.on('connection', this.onConnection)
  }

  async onConnection (ws: WebSocket, req: IncomingMessage): Promise<void> {
    const reqQueryURL = new URL(req.url, 'http://dummy.com')
    this.params = {
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
    ws.on('message', this.onMessage)

    // If the web socket is closed, close the associated TCP connection.
    ws.on('close', this.onClose)

    // We got a new web socket connection, initiate a TCP connection to the target Intel AMT host/port.
    logger.debug(`Opening web socket connection to ${this.params.host}: ${this.params.port}.`)

    try {
      // Fetch Intel AMT credentials & Setup interceptor
      const credentials = await this.secrets.getAMTCredentials(this.params.host)
      if (credentials != null) {
        logger.debug('Creating credential')
        ws.interceptor = CreateRedirInterceptor({
          user: credentials[0],
          pass: credentials[1]
        })
      }

      // If this is TCP (without TLS) set a normal TCP socket
      // check if this is MPS connection
      const uuid = this.params.host
      const ciraConn = this.mpsService.mpsserver.ciraConnections[uuid]
      if (uuid && ciraConn) {
        ws.forwardclient = this.mpsService.mpsserver.SetupCiraChannel(
          ciraConn,
          this.params.port
        )
        ws.forwardclient.xtls = 0
        ws.forwardclient.onData = (ciraconn, data): void => {
          // Run data thru interceptor
          if (ws.interceptor) {
            data = ws.interceptor.processAmtData(data)
          }
          try {
            ws.send(data)
          } catch (e) {
            logger.error(`Exception while forwarding data to client: ${e}`)
          }
        }
        ws.forwardclient.onStateChange = (ciraconn, state): void => {
          // console.log('Relay CIRA state change:'+state);
          if (state === 0) {
            try {
              // console.log("Closing websocket.");
              ws.close()
            } catch (e) {
              logger.error(`Exception while closing client websocket connection: ${e}`)
            }
          }
        }
        ws._socket.resume()
      } else {
        ws.forwardclient = new Socket()
        ws.forwardclient.setEncoding('binary')
        ws.forwardclient.forwardwsocket = ws
      }

      // Add handlers to socket.
      if (ws.forwardclient instanceof Socket) {
        // When we receive data on the TCP connection, forward it back into the web socket connection.
        ws.forwardclient.on('data', data => {
          if (ws.interceptor) {
            data = ws.interceptor.processAmtData(data)
          } // Run data thru interceptor
          try {
            ws.send(data)
          } catch (e) {
            logger.error(`Exception while forwarding data to client: ${e}`)
          }
        })
        // If the TCP connection closes, disconnect the associated web socket.
        ws.forwardclient.on('close', () => {
          logger.debug(
                `TCP disconnected from ${this.params.host} : ${this.params.port}.`
          )
          try {
            ws.close()
          } catch (e) { }
        })
        // If the TCP connection causes an error, disconnect the associated web socket.
        ws.forwardclient.on('error', err => {
          logger.debug(`TCP disconnected with error from ${this.params.host}:${this.params.port}:${err.code},${req.url}`)
          try {
            ws.close()
          } catch (e) { }
        })
      }

      // if (!this.mpsService.mpsComputerList[this.params.host]) {
      // // A TCP connection to Intel AMT just connected, send any pending data and start forwarding.
      // ws.forwardclient.connect(this.params.port, this.params.host, () => {
      //     logger.debug(`TCP connected to ${this.params.host}:${this.params.port}.`)
      //     ws._socket.resume()
      // })
      // }
    } catch (err) {
      logger.error('Exception Caught: ', err)
    }
  }

  // When data is received from the web socket, forward the data into the associated TCP connection.
  // If the TCP connection is pending, buffer up the data until it connects.
  onMessage (msg: WebSocket.RawData): void {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    let data = msg.toString('binary')

    if (this.websocket.interceptor) {
      data = this.websocket.interceptor.processBrowserData(data)
    } // Run data thru interceptor
    this.websocket.forwardclient.write(data) // Forward data to the associated TCP connection.
  }

  // If the web socket is closed, close the associated TCP connection.

  onClose (code: Number, reason: Buffer): void {
    logger.debug(`Closing web socket connection to  ${this.params.host}: ${this.params.port}. Code: ${code} Reason: ${reason.toString()}`)
    if (this.websocket.forwardclient) {
      if (this.websocket.forwardclient.close) {
        this.websocket.forwardclient.close()
      }
      try {
        if (this.websocket.forwardclient.destroy) {
          this.websocket.forwardclient.destroy()
        }
      } catch (e) {
        logger.error(`Exception while destroying AMT CIRA channel: ${e}`)
      }
    }
  }
}
