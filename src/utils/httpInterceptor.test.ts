import { AmtMode, Args, Connection, ConnectionType } from '../models/models'
import { config } from '../test/helper/config'
import { Environment } from './Environment'
import { HttpInterceptor, HttpInterceptorAuthentications } from './httpInterceptor'

// let httpInterceptor: HttpInterceptor = null
Environment.Config = config
// beforeEach(() => {
//   const args: Args = {
//     user: 'admin',
//     pass: 'Intel!123',
//     host: 'localhost',
//     port: 1234
//   }
//   httpInterceptor = new HttpInterceptor(args)
// })

afterEach(() => {
  jest.clearAllMocks()
})

test('processAmtData', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }
  const httpInterceptor = new HttpInterceptor(args)
  jest.spyOn(httpInterceptor, 'processData').mockReturnValueOnce('hello world!!!')

  const result = httpInterceptor.processAmtData('12345')
  expect(result).toBe('hello world!!!')
})

test('processBrowserData', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }
  const httpInterceptor = new HttpInterceptor(args)
  jest.spyOn(httpInterceptor, 'processData').mockReturnValueOnce('hello world!!!')

  const result = httpInterceptor.processBrowserData('12345')
  expect(result).toBe('hello world!!!')
})

test('processData with processDataEx simulated', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: '',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(args)
  jest.spyOn(httpInterceptor, 'processDataEx').mockReturnValueOnce('12345').mockReturnValueOnce('67890')

  const result = httpInterceptor.processData('56789', connection)
  expect(result).toBe('1234567890')
  expect(connection.acc).toEqual('56789')
})

test('test header mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: '',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(args)
  jest.spyOn(httpInterceptor, 'handleHeaderMode').mockReturnValueOnce('handleHeaderMode')
  jest.spyOn(httpInterceptor, 'handleBodyMode').mockReturnValueOnce('handleBodyMode')
  jest.spyOn(httpInterceptor, 'handleChunkedAMTBody').mockReturnValueOnce('handleChunkedAMTBody')
  jest.spyOn(httpInterceptor, 'handleChunkedBrowserBody').mockReturnValueOnce('handleChunkedBrowserBody')
  jest.spyOn(httpInterceptor, 'handleUntilClose').mockReturnValueOnce('handleUntilClose')

  const result = httpInterceptor.processDataEx(connection)
  expect(result).toBe('handleHeaderMode')
})

test('body mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.LENGTHBODY,
    acc: '',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(args)
  jest.spyOn(httpInterceptor, 'handleHeaderMode').mockReturnValueOnce('handleHeaderMode')
  jest.spyOn(httpInterceptor, 'handleBodyMode').mockReturnValueOnce('handleBodyMode')
  jest.spyOn(httpInterceptor, 'handleChunkedAMTBody').mockReturnValueOnce('handleChunkedAMTBody')
  jest.spyOn(httpInterceptor, 'handleChunkedBrowserBody').mockReturnValueOnce('handleChunkedBrowserBody')
  jest.spyOn(httpInterceptor, 'handleUntilClose').mockReturnValueOnce('handleUntilClose')

  const result = httpInterceptor.processDataEx(connection)
  expect(result).toBe('handleBodyMode')
})

test('chunked body with amt', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.CHUNKEDBODY,
    acc: '',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(args)
  jest.spyOn(httpInterceptor, 'handleHeaderMode').mockReturnValueOnce('handleHeaderMode')
  jest.spyOn(httpInterceptor, 'handleBodyMode').mockReturnValueOnce('handleBodyMode')
  jest.spyOn(httpInterceptor, 'handleChunkedAMTBody').mockReturnValueOnce('handleChunkedAMTBody')
  jest.spyOn(httpInterceptor, 'handleChunkedBrowserBody').mockReturnValueOnce('handleChunkedBrowserBody')
  jest.spyOn(httpInterceptor, 'handleUntilClose').mockReturnValueOnce('handleUntilClose')

  const result = httpInterceptor.processDataEx(connection)
  expect(result).toBe('handleChunkedAMTBody')
})

test('chunked body with ws', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.CHUNKEDBODY,
    acc: '',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(args)
  jest.spyOn(httpInterceptor, 'handleHeaderMode').mockReturnValueOnce('handleHeaderMode')
  jest.spyOn(httpInterceptor, 'handleBodyMode').mockReturnValueOnce('handleBodyMode')
  jest.spyOn(httpInterceptor, 'handleChunkedAMTBody').mockReturnValueOnce('handleChunkedAMTBody')
  jest.spyOn(httpInterceptor, 'handleChunkedBrowserBody').mockReturnValueOnce('handleChunkedBrowserBody')
  jest.spyOn(httpInterceptor, 'handleUntilClose').mockReturnValueOnce('handleUntilClose')

  const result = httpInterceptor.processDataEx(connection)
  expect(result).toBe('handleChunkedBrowserBody')
})

test('until close', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.UNTILCLOSE,
    acc: '',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(args)
  jest.spyOn(httpInterceptor, 'handleHeaderMode').mockReturnValueOnce('handleHeaderMode')
  jest.spyOn(httpInterceptor, 'handleBodyMode').mockReturnValueOnce('handleBodyMode')
  jest.spyOn(httpInterceptor, 'handleChunkedAMTBody').mockReturnValueOnce('handleChunkedAMTBody')
  jest.spyOn(httpInterceptor, 'handleChunkedBrowserBody').mockReturnValueOnce('handleChunkedBrowserBody')
  jest.spyOn(httpInterceptor, 'handleUntilClose').mockReturnValueOnce('handleUntilClose')

  const result = httpInterceptor.processDataEx(connection)
  expect(result).toBe('handleUntilClose')
})

// handleChunkedAMTBody (connection: Connection): string {
//     // Chunked Body Mode
//     // Send data one chunk at a time
//     const headerend = connection.acc.indexOf('\r\n')
//     if (headerend < 0) return ''
//     const chunksize = parseInt(connection.acc.substring(0, headerend), 16)
//     if ((chunksize === 0) && (connection.acc.length >= headerend + 4)) {
//       // Send the ending chunk (NOTE: We do not support trailing headers)
//       const r = connection.acc.substring(0, headerend + 4)
//       connection.acc = connection.acc.substring(headerend + 4)
//       connection.mode = AmtMode.HEADER
//       return r
//     } else if ((chunksize > 0) && (connection.acc.length >= (headerend + 4 + chunksize))) {
//       // Send a chunk
//       const r = connection.acc.substring(0, headerend + chunksize + 4)
//       connection.acc = connection.acc.substring(headerend + chunksize + 4)
//       return r
//     }
//   }

test('handle chunked body', () => {
  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.CHUNKEDBODY,
    acc: '10A',
    directive: null,
    count: 5,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(null)
  const result = httpInterceptor.handleChunkedAMTBody(connection)
  expect(result).toBe('')
  expect(connection.mode).toBe(AmtMode.CHUNKEDBODY)
})

test('handle chunked body alternate path', () => {
  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.CHUNKEDBODY,
    acc: '01\r\nAAAA',
    directive: null,
    count: 5,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(null)
  const result = httpInterceptor.handleChunkedAMTBody(connection)
  expect(result).toBe('01\r\nAAA')
  expect(connection.mode).toBe(AmtMode.CHUNKEDBODY)
  expect(connection.acc).toBe('A')
})

test('handle body', () => {
  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.UNTILCLOSE,
    acc: '10',
    directive: null,
    count: 5,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(null)
  const result = httpInterceptor.handleBodyMode(connection)
  expect(result).toBe('10')
  expect(connection.mode).toBe(AmtMode.HEADER)
})

test('handle body mode until close', () => {
  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.UNTILCLOSE,
    acc: '10',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(null)
  const result = httpInterceptor.handleBodyMode(connection)
  expect(result).toBe('10')
  expect(connection.mode).toBe(AmtMode.UNTILCLOSE)
})

//   handleBodyMode (connection: Connection): string {
//     // Length Body Mode
//     // Send the body of content-length size
//     let rl = connection.count
//     if (rl < connection.acc.length) rl = connection.acc.length
//     const r = connection.acc.substring(0, rl)
//     connection.acc = connection.acc.substring(rl)
//     connection.count -= rl
//     if (connection.count === 0) { connection.mode = AmtMode.HEADER }
//     return r
//   }

// handleUntilClose (connection: Connection): string {
//     const r = connection.acc
//     connection.acc = ''
//     return r
//   }

test('handle until close', () => {
  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.UNTILCLOSE,
    acc: '12345',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(null)
  const result = httpInterceptor.handleUntilClose(connection)
  expect(result).toBe('12345')
  expect(connection.acc).toBe('')
})

// // Parse authentication values from the HTTP header
// GetAuthArgs (authheader: string): {[key: string]: string} {
//   const authargs: {[key: string]: string} = {}
//   const authargsstr = authheader.substring(7).split(',')
//   for (let j = 0; j < authargsstr.length; ++j) {
//     const argstr = authargsstr[j]
//     const i = argstr.indexOf('=')
//     const k = argstr.substring(0, i).trim().toLowerCase()
//     let v = argstr.substring(i + 1).trim()
//     if (v.substring(0, 1) === '"') { v = v.substring(1, v.length - 1) }
//     if (i > 0) authargs[k] = v
//   }
//   return authargs
// }

test('parse auth headers', () => {
  const httpInterceptor = new HttpInterceptor(null)
  const result = httpInterceptor.GetAuthArgs('')
  expect(Object.keys(result).length).toBe(0)
})

test('parse auth headers', () => {
  const httpInterceptor = new HttpInterceptor(null)
  const result = httpInterceptor.GetAuthArgs('0123456key1=value1,key2=value2')
  expect(result.key1).toBeDefined()
  expect(result.key2).toBeDefined()
  expect(result.key1).toBe('value1')
  expect(result.key2).toBe('value2')
})

// handleChunkedBrowserBody (connection: Connection): string {
//   // Chunked Body Mode
//   // Send data one chunk at a time
//   let headerend = connection.acc.indexOf('\r\n')
//   if (headerend < 0) return ''
//   let chunksize = parseInt(connection.acc.substring(0, headerend), 16)
//   if (isNaN(chunksize)) { // TODO: Check this path
//     // Chunk is not in this batch, move one
//     const r = connection.acc.substring(0, headerend + 2)
//     connection.acc = connection.acc.substring(headerend + 2)
//     // Peek if we next is the end of chunked transfer
//     headerend = connection.acc.indexOf('\r\n')
//     if (headerend > 0) {
//       chunksize = parseInt(connection.acc.substring(0, headerend), 16)
//       if (chunksize === 0) { connection.mode = AmtMode.HEADER }
//     }
//     return r
//   } else if (chunksize === 0 && connection.acc.length >= headerend + 4) {
//     // Send the ending chunk (NOTE: We do not support trailing headers)
//     const r = connection.acc.substring(0, headerend + 4)
//     connection.acc = connection.acc.substring(headerend + 4)
//     connection.mode = AmtMode.HEADER
//     return r
//   } else if (chunksize > 0 && connection.acc.length >= headerend + 4) {
//     // Send a chunk
//     const r = connection.acc.substring(0, headerend + chunksize + 4)
//     connection.acc = connection.acc.substring(headerend + chunksize + 4)
//     return r
//   }
// }

test('handle until close', () => {
  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.UNTILCLOSE,
    acc: '01\r\nAAAA',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(null)
  const result = httpInterceptor.handleChunkedBrowserBody(connection)
  expect(result).toBe('01\r\nAAA')
  expect(connection.acc).toBe('A')
})

test('handle until close', () => {
  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.UNTILCLOSE,
    acc: '01\r\n',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(null)
  const result = httpInterceptor.handleChunkedBrowserBody(connection)
  expect(result).toBeUndefined()
})

test('handle until close', () => {
  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.UNTILCLOSE,
    acc: '\r\nAA',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(null)
  const result = httpInterceptor.handleChunkedBrowserBody(connection)
  expect(result).toBe('\r\n')
  expect(connection.acc).toBe('AA')
})

test('handle until close', () => {
  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.UNTILCLOSE,
    acc: '00\r\nAA',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(null)
  const result = httpInterceptor.handleChunkedBrowserBody(connection)
  expect(result).toBe('00\r\nAA')
  expect(connection.acc).toBe('')
  expect(connection.mode).toBe(AmtMode.HEADER)
})

test('handle header mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }
  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: 'token68\r\nwww-authenticate:Basic\r\n BB CC\r\n\r\n',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(args)
  const result = httpInterceptor.handleHeaderMode(connection)
  expect(result).toBe('token68\r\nwww-authenticate: Basic\r\n\r\n')
  expect(connection.directive[0]).toBe('token68')
  expect(connection.headers['www-authenticate']).toBe('Basic')
  expect(connection.count).toBe(0)
  expect(connection.acc).toBe('')
  expect(connection.mode).toBe(AmtMode.UNTILCLOSE)
  expect(HttpInterceptorAuthentications[args.host + ':' + args.port]).toBe('Basic')
})

test('handle header mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }
  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: 'token68\r\ncontent-length:5\r\n BB CC\r\n\r\n',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(args)
  const result = httpInterceptor.handleHeaderMode(connection)
  expect(result).toBe('token68\r\ncontent-length: 5\r\n\r\n')
  expect(connection.directive[0]).toBe('token68')
  expect(connection.headers['content-length']).toBe('5')
  expect(connection.count).toBe(5)
  expect(connection.acc).toBe('')
  expect(connection.mode).toBe(AmtMode.LENGTHBODY)
  expect(HttpInterceptorAuthentications[args.host + ':' + args.port]).toBe('Basic')
})

test('handle header mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }
  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: 'token68\r\ncontent-length:0\r\n BB CC\r\n\r\n',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(args)
  const result = httpInterceptor.handleHeaderMode(connection)
  expect(result).toBe('token68\r\ncontent-length: 0\r\n\r\n')
  expect(connection.directive[0]).toBe('token68')
  expect(connection.headers['content-length']).toBe('0')
  expect(connection.count).toBe(0)
  expect(connection.acc).toBe('')
  expect(connection.mode).toBe(AmtMode.HEADER)
})

test('handle header mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }
  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: 'token68\r\ntransfer-encoding:chunked\r\n BB CC\r\n\r\n',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(args)
  const result = httpInterceptor.handleHeaderMode(connection)
  expect(result).toBe('token68\r\ntransfer-encoding: chunked\r\n\r\n')
  expect(connection.directive[0]).toBe('token68')
  expect(connection.headers['transfer-encoding']).toBe('chunked')
  expect(connection.count).toBe(0)
  expect(connection.acc).toBe('')
  expect(connection.mode).toBe(AmtMode.CHUNKEDBODY)
})

test('handle header mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }
  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: 'token68 /amt-storage\r\ntransfer-encoding:chunked\r\n BB CC\r\n\r\n',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const httpInterceptor = new HttpInterceptor(args)
  httpInterceptor.blockAmtStorage = true
  httpInterceptor.handleHeaderMode(connection)
  expect(connection.directive[0]).toBe('token68')
  expect(connection.directive[1]).toBe('/amt-dummy-storage')
  expect(connection.headers['transfer-encoding']).toBe('chunked')
  expect(connection.count).toBe(0)
  expect(connection.acc).toBe('')
  expect(connection.mode).toBe(AmtMode.CHUNKEDBODY)
})
