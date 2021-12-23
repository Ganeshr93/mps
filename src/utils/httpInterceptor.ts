/*********************************************************************
 * Copyright (c) Intel Corporation 2021
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

import { AmtMode, Args, Connection, ConnectionType } from '../models/models'
import Common from './common'

export const HttpInterceptorAuthentications: {[key: string]: string} = {}

export class HttpInterceptor {
  args: Args
  amt: Connection
  ws: Connection
  blockAmtStorage: boolean = false

  constructor (args: Args) {
    this.args = args
    this.amt = { acc: '', mode: AmtMode.HEADER, count: 0, error: false, type: ConnectionType.AMT }
    this.ws = { acc: '', mode: AmtMode.HEADER, count: 0, error: false, authCNonce: Common.RandomValueHex(10), authCNonceCount: 1, type: ConnectionType.WS }
  }

  processAmtData (data: any): any {
    return this.processData(data, this.amt)
  }

  processBrowserData (data: any): any {
    return this.processData(data, this.ws)
  }

  // Process data coming from Intel AMT
  processData (data: any, connection: Connection): any {
    connection.acc += data // Add data to accumulator
    data = ''
    let datalen = 0
    do {
      datalen = data.length
      data += this.processDataEx(connection)
    } while (datalen !== data.length) // Process as much data as possible
    return data
  }

  // Process data coming from AMT in the accumulator
  processDataEx (connection: Connection): string {
    switch (connection.mode) {
      case AmtMode.HEADER: {
        return this.handleHeaderMode(connection)
      }
      case AmtMode.LENGTHBODY: {
        return this.handleBodyMode(connection)
      }
      case AmtMode.CHUNKEDBODY: {
        if (connection.type === ConnectionType.AMT) {
          return this.handleChunkedAMTBody(connection)
        } else if (connection.type === ConnectionType.WS) {
          return this.handleChunkedBrowserBody(connection)
        }
        break
      }
      case AmtMode.UNTILCLOSE: {
        return this.handleUntilClose(connection)
      }
    }

    return ''
  }

  handleHeaderMode (connection: Connection): string {
    // Header Mode
    // Decode the HTTP header
    const headerend: number = connection.acc.indexOf('\r\n\r\n')
    if (headerend < 0) return ''
    const headerlines: string[] = connection.acc.substring(0, headerend).split('\r\n')
    connection.acc = connection.acc.substring(headerend + 4)
    connection.directive = headerlines[0].split(' ')
    if (connection.type === ConnectionType.WS && (this.blockAmtStorage) && (connection.directive.length > 1) && (connection.directive[1].indexOf('/amt-storage') === 0)) {
      connection.directive[1] = connection.directive[1].replace('/amt-storage', '/amt-dummy-storage')
    }
    const headers = headerlines.slice(1)
    connection.headers = {}
    connection.mode = AmtMode.UNTILCLOSE
    for (let i = 0; i < headers.length; ++i) {
      const j = headers[i].indexOf(':')
      if (j > 0) {
        const v1: string = headers[i].substring(0, j).trim().toLowerCase()
        const v2: string = headers[i].substring(j + 1).trim()
        connection.headers[v1] = v2
        if (v1.toLowerCase() === 'www-authenticate') {
          HttpInterceptorAuthentications[this.args.host + ':' + this.args.port] = v2
        } else if (v1.toLowerCase() === 'content-length') {
          connection.count = parseInt(v2)
          if (connection.count > 0) {
            connection.mode = AmtMode.LENGTHBODY
          } else {
            connection.mode = AmtMode.HEADER
          }
        } else if (v1.toLowerCase() === 'transfer-encoding' && v2.toLowerCase() === 'chunked') {
          connection.mode = AmtMode.CHUNKEDBODY
        }
      }
    }

    if (connection.type === ConnectionType.WS) {
    // Insert authentication
      if (this.args.user && this.args.pass && HttpInterceptorAuthentications[this.args.host + ':' + this.args.port]) {
      // We have authentication data, lets use it.
        const authArgs = this.GetAuthArgs(HttpInterceptorAuthentications[this.args.host + ':' + this.args.port])
        const hash = Common.ComputeDigesthash(this.args.user, this.args.pass, authArgs.realm, connection.directive[0], connection.directive[1], authArgs.qop, authArgs.nonce, connection.authCNonceCount.toString(), connection.authCNonce)
        let authstr = 'Digest username="' + this.args.user + '",realm="' + authArgs.realm + '",nonce="' + authArgs.nonce + '",uri="' + connection.directive[1] + '",qop=' + authArgs.qop + ',nc=' + connection.authCNonceCount + ',cnonce="' + connection.authCNonce + '",response="' + hash + '"'
        if (authArgs.opaque) { authstr += ',opaque="' + authArgs.opaque + '"' }
        connection.headers.authorization = authstr
        connection.authCNonceCount++
      } else {
      // We don't have authentication, clear it out of the header if needed.
        if (connection.headers.authorization) { delete connection.headers.authorization }
      }
    }

    // Reform the HTTP header
    let r = connection.directive.join(' ') + '\r\n'
    for (const i in connection.headers) { r += (i + ': ' + connection.headers[i] + '\r\n') }
    r += '\r\n'
    return r
  }

  handleBodyMode (connection: Connection): string {
    // Length Body Mode
    // Send the body of content-length size
    let rl = connection.count
    if (rl < connection.acc.length) rl = connection.acc.length
    const r = connection.acc.substring(0, rl)
    connection.acc = connection.acc.substring(rl)
    connection.count -= rl
    if (connection.count === 0) { connection.mode = AmtMode.HEADER }
    return r
  }

  handleChunkedAMTBody (connection: Connection): string {
    // Chunked Body Mode
    // Send data one chunk at a time
    const headerend = connection.acc.indexOf('\r\n')
    if (headerend < 0) return ''
    const chunksize = parseInt(connection.acc.substring(0, headerend), 16)
    if ((chunksize === 0) && (connection.acc.length >= headerend + 4)) {
      // Send the ending chunk (NOTE: We do not support trailing headers)
      const r = connection.acc.substring(0, headerend + 4)
      connection.acc = connection.acc.substring(headerend + 4)
      connection.mode = AmtMode.HEADER
      return r
    } else if ((chunksize > 0) && (connection.acc.length >= (headerend + 4 + chunksize))) {
      // Send a chunk
      const r = connection.acc.substring(0, headerend + chunksize + 4)
      connection.acc = connection.acc.substring(headerend + chunksize + 4)
      return r
    }
  }

  handleUntilClose (connection: Connection): string {
    const r = connection.acc
    connection.acc = ''
    return r
  }

  handleChunkedBrowserBody (connection: Connection): string {
    // Chunked Body Mode
    // Send data one chunk at a time
    let headerend = connection.acc.indexOf('\r\n')
    if (headerend < 0) return ''
    let chunksize = parseInt(connection.acc.substring(0, headerend), 16)
    if (isNaN(chunksize)) { // TODO: Check this path
      // Chunk is not in this batch, move one
      const r = connection.acc.substring(0, headerend + 2)
      connection.acc = connection.acc.substring(headerend + 2)
      // Peek if we next is the end of chunked transfer
      headerend = connection.acc.indexOf('\r\n')
      if (headerend > 0) {
        chunksize = parseInt(connection.acc.substring(0, headerend), 16)
        if (chunksize === 0) { connection.mode = AmtMode.HEADER }
      }
      return r
    } else if (chunksize === 0 && connection.acc.length >= headerend + 4) {
      // Send the ending chunk (NOTE: We do not support trailing headers)
      const r = connection.acc.substring(0, headerend + 4)
      connection.acc = connection.acc.substring(headerend + 4)
      connection.mode = AmtMode.HEADER
      return r
    } else if (chunksize > 0 && connection.acc.length >= headerend + 4) {
      // Send a chunk
      const r = connection.acc.substring(0, headerend + chunksize + 4)
      connection.acc = connection.acc.substring(headerend + chunksize + 4)
      return r
    }
  }

  // Parse authentication values from the HTTP header
  GetAuthArgs (authheader: string): {[key: string]: string} {
    const authargs: {[key: string]: string} = {}
    const authargsstr = authheader.substring(7).split(',')
    for (let j = 0; j < authargsstr.length; ++j) {
      const argstr = authargsstr[j]
      const i = argstr.indexOf('=')
      const k = argstr.substring(0, i).trim().toLowerCase()
      let v = argstr.substring(i + 1).trim()
      if (v.substring(0, 1) === '"') { v = v.substring(1, v.length - 1) }
      if (i > 0) authargs[k] = v
    }
    return authargs
  }
}
