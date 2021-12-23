/*********************************************************************
* Copyright (c) Intel Corporation 2018-2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

/**
* @description Intel AMT Web server object
* @author Ylian Saint-Hilaire
* @version v0.2.0c
*/

import { Socket } from 'net'

import express, { Request, Response } from 'express'
import { createServer, IncomingMessage, Server } from 'http'
import * as parser from 'body-parser'
import jws from 'jws'
import { certificatesType } from '../models/Config'
import { ErrorResponse } from '../utils/amtHelper'
import { logger as log } from '../utils/logger'
import routes from '../routes'
import WebSocket from 'ws'
import { URL } from 'url'
import cors from 'cors'
import { DbCreatorFactory } from '../factories/DbCreatorFactory'
import { Environment } from '../utils/Environment'
import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { WsRedirect } from '../utils/wsRedirect'
import { WebSocketExt } from '../models/models'

export class WebServer {
  app: express.Express
  server: Server = null
  relaywss: any = null
  secrets: ISecretManagerService
  certs: certificatesType
  wsRedirect: WsRedirect
  // to unit test code
  jws: jws = jws

  constructor (secrets: ISecretManagerService, certs: certificatesType) {
    try {
      this.secrets = secrets
      this.certs = certs
      this.app = express()
      this.wsRedirect = new WsRedirect(this.secrets)

      const options: WebSocket.ServerOptions = {
        noServer: true,
        verifyClient: (info) => this.verifyClientToken(info)
      }
      this.relaywss = new WebSocket.Server(options)

      // Create Server
      this.server = createServer(this.app)
      this.app.use(cors())

      // Handles the Bad JSON exceptions
      this.app.use(parser.json(), (err: any, req: Request, res: Response, next: () => void) => {
        if (err instanceof SyntaxError) {
          return res.status(400).send(ErrorResponse(400))
        }
        next()
      })

      // Relay websocket. KVM & SOL use this websocket.
      this.relaywss.on('connection', async (ws: WebSocketExt, req: IncomingMessage) => {
        try {
          void this.wsRedirect.handleConnection(ws, req)
        } catch (err) {
          log.error('Exception Caught: ', err)
        }
      })

      this.app.use('/api/v1', async (req: Request, res, next) => {
        const newDB = new DbCreatorFactory()
        req.db = await newDB.getDb()
        req.secrets = this.secrets
        req.certs = this.certs
        next()
      }, routes)

      // Handle upgrade on websocket
      this.server.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
        this.handleUpgrade(request, socket, head)
      })
    } catch (error) {
      log.error(`Exception in webserver: ${error}`)
      process.exit(0)
    }
  }

  listen (): void {
    // Validate port number
    let port = 3000
    if (Environment.Config.web_port != null) {
      port = Environment.Config.web_port
    }

    this.server.listen(port, () => {
      log.info(`MPS Microservice running on ${Environment.Config.common_name}:${port}.`)
    }).on('error', function (err: NodeJS.ErrnoException) {
      if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
        log.error('Chosen web port is invalid or not available')
      } else {
        log.error(JSON.stringify(err))
      }
      process.exit(0)
    })
  }

  // Handle Upgrade - WebSocket
  handleUpgrade (request: IncomingMessage, socket: Socket, head: Buffer): void {
    const pathname = (new URL(request.url, 'http://dummy.com')).pathname
    if (pathname === '/relay/webrelay.ashx') {
      this.relaywss.handleUpgrade(request, socket, head, (ws) => {
        this.relaywss.emit('connection', ws, request)
      })
    } else { // Invalid endpoint
      log.debug('Route does not exist. Closing connection...')
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
    }
  }

  verifyClientToken (info): boolean {
    // verify JWT
    try {
      const valid = this.jws.verify(info.req.headers['sec-websocket-protocol'], 'HS256', Environment.Config.jwt_secret)
      if (!valid) {
        return false
      }
    } catch (err) { // reject connection if problem with verify
      return false
    }
    return true
  }
}
