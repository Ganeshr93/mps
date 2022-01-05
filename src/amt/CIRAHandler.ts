/*********************************************************************
 * Copyright (c) Intel Corporation 2018-2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { CIRASocket } from '../models/models'
import APFProcessor from './APFProcessor'
import { connectionParams, HttpHandler } from './HttpHandler'
import httpZ, { HttpZResponseModel } from 'http-z'
import { amtPort } from '../utils/constants'
import {
  DigestChallenge,
  Enumerate,
  Pull
} from '@open-amt-cloud-toolkit/wsman-messages/dist/models/common'
import { Common } from '@open-amt-cloud-toolkit/wsman-messages/dist'
import { CIRAChannel } from './CIRAChannel'
import { logger } from '../utils/logger'
export interface PendingRequests {
  xml?: string
  response?: HttpZResponseModel | string
  count?: number
}
export class CIRAHandler {
  digestChallenge: DigestChallenge
  rawChunkedData: string = ''
  xml: string
  httpHandler: HttpHandler
  username: string
  password: string
  pendingRequests: PendingRequests[] = []
  currentRequest: PendingRequests = null
  channel: CIRAChannel
  channelState: number = 0
  socket: CIRASocket
  constructor (httpHandler: HttpHandler, username: string, password: string) {
    this.username = username
    this.password = password
    this.httpHandler = httpHandler
  }

  // Setup CIRA Channel
  SetupCiraChannel (socket: CIRASocket, targetPort: number): CIRAChannel {
    const sourcePort = (socket.tag.nextsourceport++ % 30000) + 1024
    const channel = new CIRAChannel(this.httpHandler, targetPort, socket)
    APFProcessor.SendChannelOpen(
      channel.socket,
      false,
      channel.channelid,
      channel.ciraWindow,
      channel.socket.tag.host,
      channel.targetport,
      '1.2.3.4',
      sourcePort
    )
    channel.write = async (rawXML: string): Promise<any> => {
      const params: connectionParams = {
        guid: this.channel.socket.tag.nodeid,
        port: amtPort,
        digestChallenge: this.digestChallenge,
        username: this.username,
        password: this.password
      }

      return await channel.writeData(rawXML, params)
    }
    socket.tag.channels[channel.channelid] = channel
    return channel
  }

  async Connect (): Promise<number> {
    return await new Promise((resolve, reject) => {
      this.channel = this.SetupCiraChannel(this.socket, amtPort)
      this.channel.onStateChange.on('stateChange', (state: number) => {
        this.channelState = state
        resolve(state)
      })
    })
  }

  async Enumerate (
    socket: CIRASocket,
    rawXml: string
  ): Promise<Common.Models.Response<Enumerate>> {
    return await this.Send(socket, rawXml)
  }

  async Pull<T>(
    socket: CIRASocket,
    rawXml: string
  ): Promise<Common.Models.Response<Pull<T>>> {
    return await this.Send(socket, rawXml)
  }

  async Get<T>(
    socket: CIRASocket,
    rawXml: string
  ): Promise<Common.Models.Response<T>> {
    return await this.Send(socket, rawXml)
  }

  async Send (socket: CIRASocket, rawXml: string): Promise<any> {
    this.pendingRequests.push({ xml: rawXml, response: null, count: 0 })
    this.socket = socket
    return await this.ExecRequest()
    // data needs to be returned here
  }

  async ExecRequest (): Promise<any> {
    if (this.currentRequest == null && this.pendingRequests.length > 0) {
      this.currentRequest = this.pendingRequests.shift()
    }
    if (this.channelState === 0) {
      this.channelState = await this.Connect()
    }
    if (this.channelState === 2) {
      try {
        const data = await this.channel.write(this.currentRequest.xml)
        return this.handleResult(data)
      } catch (error) {
        if (error.message === 'Unauthorized') {
          this.channelState = this.channel.CloseChannel()
          return await this.ExecRequest()
        } else {
          throw error
        }
      }
    }
    return null
  }

  handleAuth (message: HttpZResponseModel): DigestChallenge {
    this.rawChunkedData = ''
    const found = message.headers.find(item => item.name === 'Www-Authenticate')
    if (found != null) {
      return this.httpHandler.parseAuthenticateResponseHeader(found.value)
    }
    return null
  }

  parseBody (message: HttpZResponseModel): any {
    let xmlBody: string = ''
    this.rawChunkedData = ''
    // parse the body until its length is greater than 5, because body ends with '0\r\n\r\n'
    while (message.body.text.length > 5) {
      const clen = message.body.text.indexOf('\r\n')
      if (clen < 0) {
        return
      }
      // converts hexadecimal chunk size to integer
      const csize = parseInt(message.body.text.substring(0, clen), 16)
      if (message.body.text.length < clen + 2 + csize + 2) {
        return
      }
      const data = message.body.text.substring(clen + 2, clen + 2 + csize)
      message.body.text = message.body.text.substring(clen + 2 + csize + 2)
      xmlBody += data
    }
    // pares WSMan xml response to json
    const response = this.httpHandler.parseXML(xmlBody)
    response.statusCode = message.statusCode
    return response
  }

  handleResult (data: string): any {
    logger.debug(data)
    const message = httpZ.parse(data) as HttpZResponseModel
    if (message.statusCode === 401) {
      this.digestChallenge = this.handleAuth(message)
      if (this.digestChallenge != null) {
        // Executing the failed request once again
        throw new Error('Unauthorized') // could be better
      }
    } else if (message.statusCode === 200) {
      const response = this.parseBody(message)
      this.currentRequest = null
      return response
    } else {
      const response = this.parseBody(message)
      this.currentRequest = null
      return response
    }
  }
}
