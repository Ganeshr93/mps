/*********************************************************************
 * Copyright (c) Intel Corporation 2018-2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

// import httpZ, { HttpZResponseModel } from 'http-z'
import { CIRASocket } from '../models/models'
import APFProcessor from './APFProcessor'
import { connectionParams, HttpHandler } from './HttpHandler'
import { logger } from '../utils/logger'
import { EventEmitter } from 'stream'

export class CIRAChannel {
  targetport: number
  channelid: number
  socket: CIRASocket
  state: number
  sendcredits: number
  amtpendingcredits: number
  amtCiraWindow: number
  ciraWindow: number
  write?: (data: string) => Promise<any>
  sendBuffer?: any
  amtchannelid?: number
  closing?: number
  onStateChange?: EventEmitter // (state: number) => void
  onData?: any
  sendchannelclose?: any
  rawChunkedData: string = ''
  digestChallenge: string = ''
  constructor (
    private readonly httpHandler: HttpHandler,
    targetport: number,
    socket: CIRASocket
  ) {
    this.targetport = targetport
    this.channelid = socket.tag.nextchannelid++
    this.socket = socket
    this.state = 1
    this.sendcredits = 0
    this.amtpendingcredits = 0
    this.amtCiraWindow = 0
    this.ciraWindow = 32768
    this.onStateChange = new EventEmitter()
  }

  async writeData (data: string, params: connectionParams): Promise<any> {
    return await new Promise((resolve, reject) => {
      this.onData = (data) => {
        // Set up the timeout
        // const timer = setTimeout(() => {
        //   reject(new Error('Promise timed out after 5000 ms'))
        // }, 5000)
        this.rawChunkedData += data
        // For 401 Unauthorized error during digest authentication message ends with </html>, rest all the messages ends with 0\r\n\r\n
        if (
          this.rawChunkedData.includes('</html>') ||
          this.rawChunkedData.includes('0\r\n\r\n')
        ) {
          // clearTimeout(timer)
          resolve(this.rawChunkedData)
        }
      }

      this.rawChunkedData = ''
      logger.silly(`connection params : ${JSON.stringify(params)}`)
      const wsmanrequest = this.httpHandler.wrapIt(params, data)
      logger.silly(`wsmanrequest : ${wsmanrequest}`)
      if (this.state === 0) return false
      if (
        this.state === 1 ||
        this.sendcredits === 0 ||
        this.sendBuffer != null
      ) {
        if (this.sendBuffer == null) {
          this.sendBuffer = wsmanrequest
        } else {
          this.sendBuffer += wsmanrequest
        }
        return true
      }
      // Compute how much data we can send
      if (wsmanrequest.length <= this.sendcredits) {
        // Send the entire message
        APFProcessor.SendChannelData(
          this.socket,
          this.amtchannelid,
          wsmanrequest
        )
        this.sendcredits -= wsmanrequest.length
        return true
      }
      // Send a part of the message
      this.sendBuffer = wsmanrequest.substring(this.sendcredits)
      APFProcessor.SendChannelData(
        this.socket,
        this.amtchannelid,
        wsmanrequest.substring(0, this.sendcredits)
      )
      this.sendcredits = 0
      return false
    })
  }

  CloseChannel (): number {
    if (this.state === 0 || this.closing === 1) return this.state
    if (this.state === 1) {
      this.closing = 1
      this.state = 0
      return this.state
    }
    this.state = 0
    this.closing = 1
    APFProcessor.SendChannelClose(this.socket, this.amtchannelid)
    return this.state
  }
}
