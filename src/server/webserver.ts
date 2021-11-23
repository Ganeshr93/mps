/*********************************************************************
* Copyright (c) Intel Corporation 2018-2019
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

/**
* @description Intel AMT Web server object
* @author Ylian Saint-Hilaire
* @version v0.2.0c
*/

import { Server } from 'net'
import express, { Request } from 'express'
import { createServer } from 'http'
import jws from 'jws'
import { configType, certificatesType } from '../models/Config'
import { ErrorResponse } from '../utils/amtHelper'
import { logger } from '../utils/logger'
import { MPSMicroservice } from '../mpsMicroservice'
import AMTStackFactory from '../amt_libraries/amt-connection-factory'
import routes from '../routes'
import WebSocket from 'ws'
import { URL } from 'url'
import cors from 'cors'
import { DbCreatorFactory } from '../factories/DbCreatorFactory'
import { IDB } from '../interfaces/IDb'
import { WSRelay } from './WSRelay'

export class WebServer {
  db: IDB
  app: express.Express
  server: Server = null
  relaywss: WebSocket.Server = null
  mpsService: MPSMicroservice
  config: configType
  certs: certificatesType

  constructor (mpsService: MPSMicroservice) {
    try {
      this.mpsService = mpsService
      this.db = this.mpsService.db
      this.config = this.mpsService.config
      this.certs = this.mpsService.certs
      this.app = express()

      // Create Server
      this.server = createServer(this.app)
      this.app.use(cors())

      // Handles the Bad JSON exceptions
      this.app.use(express.json(), (err, req, res, next) => {
        if (err instanceof SyntaxError) {
          return res.status(400).send(ErrorResponse(400))
        }
        next()
      })

      // set up routes and attach some middleware
      this.app.use('/api/v1', async (req: Request, res, next) => {
        req.mpsService = this.mpsService
        const newDB = new DbCreatorFactory(this.mpsService.config)
        req.db = await newDB.getDb()
        req.amtFactory = new AMTStackFactory(this.mpsService)
        next()
      }, routes)

      // Handle upgrade on websocket
      this.server.on('upgrade', (request, socket, head) => {
        this.handleUpgrade(request, socket, head)
      })

      // Start the ExpressJS web server
      this.server.listen(this.config.web_port || 3000, this.onListenSuccess).on('error', this.onListenError)
    } catch (error) {
      logger.error(`Exception in webserver: ${error}`)
      process.exit(0)
    }
  }

  onListenSuccess (): void {
    logger.info(`MPS Microservice running on ${this.config.common_name}:${this.config.web_port || 3000}.`)
  }

  onListenError (err): void {
    if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
      logger.error('Chosen web port is invalid or not available')
    } else {
      logger.error(err)
    }
    process.exit(0)
  }

  // Handle Upgrade - WebSocket
  handleUpgrade (request, socket, head): void {
    const pathname = (new URL(request.url, 'http://dummy.com')).pathname

    if (pathname === '/relay/webrelay.ashx') {
      const options: WebSocket.ServerOptions = {
        noServer: true,
        verifyClient: (info) => {
          // verify JWT
          try {
            const valid = jws.verify(info.req.headers['sec-websocket-protocol'], 'HS256', this.config.jwt_secret)
            if (!valid) {
              return false
            }
          } catch (err) { // reject connection if problem with verify
            return false
          }
          return true
        }
      }
      const wssRelay = new WSRelay(options, this.mpsService.secrets)
      wssRelay.server.handleUpgrade(request, socket, head, (ws) => {
        wssRelay.server.emit('connection', ws, request)
      })
    } else { // Invalid endpoint
      logger.debug('Route does not exist. Closing connection...')
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      socket.destroy()
    }
  }
}
