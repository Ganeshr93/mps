import { queryParams } from '../models/Config'
import { logger } from '../utils/logger'
import WebSocket from 'ws'

export class WSRelay {
  websocket: WebSocket | any
  server: WebSocket.Server
  params: queryParams
  constructor (options: WebSocket.ServerOptions) {
    this.server = new WebSocket.Server(options)
  }

  onConnection (ws: any, req: any): void {
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
  }

  // When data is received from the web socket, forward the data into the associated TCP connection.
  // If the TCP connection is pending, buffer up the data until it connects.
  onMessage (msg: any): void {
    msg = msg.toString('binary')

    if (this.websocket.interceptor) {
      msg = this.websocket.interceptor.processBrowserData(msg)
    } // Run data thru interceptor
    this.websocket.forwardclient.write(msg) // Forward data to the associated TCP connection.
  }

  // If the web socket is closed, close the associated TCP connection.

  onClose (): void {
    logger.debug(`Closing web socket connection to  ${this.params.host}: ${this.params.port}.`)
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

// // Relay websocket. KVM & SOL use this websocket.
// this.relaywss.on('connection', async (ws, req) => {
//     try {
//       // Fetch Intel AMT credentials & Setup interceptor
//       const credentials = await this.mpsService.secrets.getAMTCredentials(params.host)
//       if (credentials != null) {
//         log.debug('Creating credential')
//         if (params.p === 1) {
//           ws.interceptor = CreateHttpInterceptor({
//             host: params.host,
//             port: params.port,
//             user: credentials[0],
//             pass: credentials[1]
//           })
//         } else if (params.p === 2) {
//           ws.interceptor = CreateRedirInterceptor({
//             user: credentials[0],
//             pass: credentials[1]
//           })
//         }
//       }

//       if (params.tls === 0) {
//         // If this is TCP (without TLS) set a normal TCP socket
//         // check if this is MPS connection
//         const uuid = params.host
//         const ciraConn = this.mpsService.mpsserver.ciraConnections[uuid]
//         if (uuid && ciraConn) {
//           ws.forwardclient = this.mpsService.mpsserver.SetupCiraChannel(
//             ciraConn,
//             params.port
//           )

//           ws.forwardclient.xtls = 0
//           ws.forwardclient.onData = (ciraconn, data): void => {
//             // Run data thru interceptor
//             if (ws.interceptor) {
//               data = ws.interceptor.processAmtData(data)
//             }
//             try {
//               ws.send(data)
//             } catch (e) {
//               log.error(`Exception while forwarding data to client: ${e}`)
//             }
//           }

//           ws.forwardclient.onStateChange = (ciraconn, state): void => {
//             // console.log('Relay CIRA state change:'+state);
//             if (state === 0) {
//               try {
//                 // console.log("Closing websocket.");
//                 ws.close()
//               } catch (e) {
//                 log.error(`Exception while closing client websocket connection: ${e}`)
//               }
//             }
//           }
//           ws._socket.resume()
//         } else {
//           ws.forwardclient = new Socket()
//           ws.forwardclient.setEncoding('binary')
//           ws.forwardclient.forwardwsocket = ws
//         }
//       } else {
//         // If TLS is going to be used, setup a TLS socket
//         log.info('TLS Enabled!')
//         const tlsoptions = {
//           secureProtocol:
//             params.tls1only === 1 ? 'TLSv1_method' : 'SSLv23_method',
//           ciphers: 'RSA+AES:!aNULL:!MD5:!DSS',
//           secureOptions:
//             constants.SSL_OP_NO_SSLv2 |
//             constants.SSL_OP_NO_SSLv3 |
//             constants.SSL_OP_NO_COMPRESSION |
//             constants.SSL_OP_CIPHER_SERVER_PREFERENCE,
//           rejectUnauthorized: false
//         }
//         ws.forwardclient = connect(
//           params.port,
//           params.host,
//           tlsoptions,
//           () => {
//             // The TLS connection method is the same as TCP, but located a bit differently.
//             log.debug(`TLS connected to ${params.host}: ${params.port}.`)
//             ws._socket.resume()
//           }
//         )
//         ws.forwardclient.setEncoding('binary')
//         ws.forwardclient.forwardwsocket = ws
//       }

//       // Add handlers to socket.
//       if (ws.forwardclient instanceof Socket) {
//         // When we receive data on the TCP connection, forward it back into the web socket connection.
//         ws.forwardclient.on('data', data => {
//           if (ws.interceptor) {
//             data = ws.interceptor.processAmtData(data)
//           } // Run data thru interceptor
//           try {
//             ws.send(data)
//           } catch (e) {
//             log.error(`Exception while forwarding data to client: ${e}`)
//           }
//         })

//         // If the TCP connection closes, disconnect the associated web socket.
//         ws.forwardclient.on('close', () => {
//           log.debug(
//             `TCP disconnected from ${params.host} : ${params.port}.`
//           )
//           try {
//             ws.close()
//           } catch (e) { }
//         })

//         // If the TCP connection causes an error, disconnect the associated web socket.
//         ws.forwardclient.on('error', err => {
//           log.debug(`TCP disconnected with error from ${params.host}:${params.port}:${err.code},${req.url}`)
//           try {
//             ws.close()
//           } catch (e) { }
//         })
//       }

//       if (params.tls === 0) {
//         if (!this.mpsService.mpsComputerList[params.host]) {
//           // A TCP connection to Intel AMT just connected, send any pending data and start forwarding.
//           ws.forwardclient.connect(params.port, params.host, () => {
//             log.debug(`TCP connected to ${params.host}:${params.port}.`)
//             ws._socket.resume()
//           })
//         }
//       }
//     } catch (err) {
//       log.error('Exception Caught: ', err)
//     }
//   })
