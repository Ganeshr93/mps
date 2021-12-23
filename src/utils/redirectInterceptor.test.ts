import { AmtMode, Args, Connection, ConnectionType } from '../models/models'
import { config } from '../test/helper/config'
import Common from './common'
import { Environment } from './Environment'
import { AuthenticationStatus, AuthenticationType, RedirectCommands, RedirectInterceptor, StartRedirectionSessionReplyStatus } from './redirectInterceptor'

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
  const httpInterceptor = new RedirectInterceptor(args)
  jest.spyOn(httpInterceptor, 'processAmtDataEx').mockReturnValueOnce('hello world!!!')

  const result = httpInterceptor.processAmtData('12345')
  expect(result).toBe('hello world!!!')
})

// Process data coming from AMT in the accumulator
// processAmtDataEx (): string {
//   if (this.amt.acc.length === 0) return ''
//   if (this.amt.direct) {
//     const data = this.amt.acc
//     this.amt.acc = ''
//     return data
//   } else {
//     // console.log(this.amt.acc.charCodeAt(0));
//     switch (this.amt.acc.charCodeAt(0)) {
//       case RedirectCommands.StartRedirectionSessionReply: {
//         return this.handleStartRedirectionSessionReply()
//       }
//       case RedirectCommands.AuthenticateSessionReply: {
//         return this.handleAuthenticateSessionReply()
//       }
//       default: {
//         this.amt.error = true
//         return ''
//       }
//     }
//   }
// }

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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection
  jest.spyOn(redirectInterceptor, 'handleStartRedirectionSessionReply').mockReturnValueOnce('handleStartRedirectionSessionReply')
  jest.spyOn(redirectInterceptor, 'handleAuthenticateSessionReply').mockReturnValueOnce('handleAuthenticateSessionReply')

  const result = redirectInterceptor.processAmtDataEx()
  expect(result).toBe('')
})

test('direct mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: 'abcdefghij1234567890',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: true,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection
  jest.spyOn(redirectInterceptor, 'handleStartRedirectionSessionReply').mockReturnValueOnce('handleStartRedirectionSessionReply')
  jest.spyOn(redirectInterceptor, 'handleAuthenticateSessionReply').mockReturnValueOnce('handleAuthenticateSessionReply')

  const result = redirectInterceptor.processAmtDataEx()
  expect(result).toBe('abcdefghij1234567890')
  expect(connection.acc).toBe('')
})

test('direct mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: String.fromCharCode(RedirectCommands.StartRedirectionSessionReply),
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection
  jest.spyOn(redirectInterceptor, 'handleStartRedirectionSessionReply').mockReturnValueOnce('handleStartRedirectionSessionReply')
  jest.spyOn(redirectInterceptor, 'handleAuthenticateSessionReply').mockReturnValueOnce('handleAuthenticateSessionReply')

  const result = redirectInterceptor.processAmtDataEx()
  expect(result).toBe('handleStartRedirectionSessionReply')
})

test('direct mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: String.fromCharCode(RedirectCommands.AuthenticateSessionReply),
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection
  jest.spyOn(redirectInterceptor, 'handleStartRedirectionSessionReply').mockReturnValueOnce('handleStartRedirectionSessionReply')
  jest.spyOn(redirectInterceptor, 'handleAuthenticateSessionReply').mockReturnValueOnce('handleAuthenticateSessionReply')

  const result = redirectInterceptor.processAmtDataEx()
  expect(result).toBe('handleAuthenticateSessionReply')
})

test('direct mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: '99',
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection
  jest.spyOn(redirectInterceptor, 'handleStartRedirectionSessionReply').mockReturnValueOnce('handleStartRedirectionSessionReply')
  jest.spyOn(redirectInterceptor, 'handleAuthenticateSessionReply').mockReturnValueOnce('handleAuthenticateSessionReply')

  const result = redirectInterceptor.processAmtDataEx()
  expect(result).toBe('')
  expect(connection.error).toBeTruthy()
})

// handleStartRedirectionSessionReply (): string {
//   if (this.amt.acc.length < 4) return ''
//   if (this.amt.acc.charCodeAt(1) === StartRedirectionSessionReplyStatus.SUCCESS) {
//     if (this.amt.acc.length < 13) return ''
//     const oemlen = this.amt.acc.charCodeAt(12)
//     if (this.amt.acc.length < 13 + oemlen) return ''
//     const r = this.amt.acc.substring(0, 13 + oemlen)
//     this.amt.acc = this.amt.acc.substring(13 + oemlen)
//     return r
//   }
// }

test('direct mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: `0${String.fromCharCode(StartRedirectionSessionReplyStatus.SUCCESS)}00000`,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection

  const result = redirectInterceptor.handleStartRedirectionSessionReply()
  expect(result).toBe('')
})

test('direct mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: `000000000000${String.fromCharCode(StartRedirectionSessionReplyStatus.SUCCESS)}00000`,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection

  const result = redirectInterceptor.handleStartRedirectionSessionReply()
  expect(result).toBeUndefined()
})

test('direct mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: `0${String.fromCharCode(StartRedirectionSessionReplyStatus.BUSY)}000000000000`,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection

  const result = redirectInterceptor.handleStartRedirectionSessionReply()
  expect(result).toBeUndefined()
})

test('direct mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: `0${String.fromCharCode(StartRedirectionSessionReplyStatus.SUCCESS)}0000000000${String.fromCharCode(20)}`,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection

  const result = redirectInterceptor.handleStartRedirectionSessionReply()
  expect(result).toBe('')
})

test('direct mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: '000',
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection

  const result = redirectInterceptor.handleStartRedirectionSessionReply()
  expect(result).toBe('')
})

test('direct mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: `0${String.fromCharCode(StartRedirectionSessionReplyStatus.SUCCESS)}123456789A${String.fromCharCode(0)}`,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection

  const result = redirectInterceptor.handleStartRedirectionSessionReply()
  expect(result).toBe(`0${String.fromCharCode(StartRedirectionSessionReplyStatus.SUCCESS)}123456789A${String.fromCharCode(0)}`)
  expect(connection.acc).toBe('')
})

// handleAuthenticateSessionReply (): string {
//   if (this.amt.acc.length < 9) return '1'
//   const l = Common.ReadIntX(this.amt.acc, 5)
//   if (this.amt.acc.length < 9 + l) return '2'
//   const authstatus = this.amt.acc.charCodeAt(1)
//   const authType = this.amt.acc.charCodeAt(4)

test('acc length less than 9', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: '01234567',
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection

  const result = redirectInterceptor.handleAuthenticateSessionReply()
  expect(result).toBe('')
  expect(connection.acc).toBe('01234567')
})

test('acc length less than 9 + l', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: '0123456789',
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection

  const result = redirectInterceptor.handleAuthenticateSessionReply()
  expect(result).toBe('')
  expect(connection.acc).toBe('0123456789')
})

test('authType === AuthenticationType.DIGEST && authstatus === AuthenticationStatus.FALIURE', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: `0${String.fromCharCode(AuthenticationStatus.FALIURE)}00${String.fromCharCode(AuthenticationType.DIGEST)}AAAA${String.fromCharCode(2)}AA${String.fromCharCode(5)}AAAAA${String.fromCharCode(4)}AAAAAAAAA`,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection

  jest.spyOn(Common, 'ReadIntX').mockReturnValueOnce(0)

  const result = redirectInterceptor.handleAuthenticateSessionReply()
  expect(result).toBe(`0${String.fromCharCode(AuthenticationStatus.FALIURE)}00${String.fromCharCode(AuthenticationType.DIGEST)}AAAA`)
  expect(redirectInterceptor.amt.acc).toBe(`${String.fromCharCode(2)}AA${String.fromCharCode(5)}AAAAA${String.fromCharCode(4)}AAAAAAAAA`)
  expect(redirectInterceptor.amt.digestRealm).toBe('AA')
  expect(redirectInterceptor.amt.digestNonce).toBe('AAAAA')
  expect(redirectInterceptor.amt.digestQOP).toBe('AAAA')
})

test('AuthenticationStatus.SUCCESS', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: `0${String.fromCharCode(AuthenticationStatus.SUCCESS)}00${String.fromCharCode(AuthenticationType.DIGEST)}AAAA${String.fromCharCode(2)}AA${String.fromCharCode(5)}AAAAA${String.fromCharCode(4)}AAAAAAAAA`,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = connection

  jest.spyOn(Common, 'ReadIntX').mockReturnValueOnce(0)

  const result = redirectInterceptor.handleAuthenticateSessionReply()

  expect(result).toBe(`0${String.fromCharCode(AuthenticationStatus.SUCCESS)}00${String.fromCharCode(AuthenticationType.DIGEST)}AAAA`)
  expect(redirectInterceptor.amt.acc).toBe(`${String.fromCharCode(2)}AA${String.fromCharCode(5)}AAAAA${String.fromCharCode(4)}AAAAAAAAA`)
  expect(redirectInterceptor.amt.direct).toBeTruthy()
  expect(redirectInterceptor.ws.direct).toBeTruthy()
})

test('processAmtData', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }
  const httpInterceptor = new RedirectInterceptor(args)
  jest.spyOn(httpInterceptor, 'processBrowserDataEx').mockReturnValueOnce('hello world!!!')

  const result = httpInterceptor.processBrowserData('12345')
  expect(result).toBe('hello world!!!')
})

// processBrowserDataEx (): string {
//   if (this.ws.acc.length === 0) return ''
//   if (this.ws.direct) {
//     const data = this.ws.acc
//     this.ws.acc = ''
//     return data
//   } else {
//     switch (this.ws.acc.charCodeAt(0)) {
//       case RedirectCommands.StartRedirectionSession: {
//         return this.handleStartRedirectionSession()
//       }
//       case RedirectCommands.EndRedirectionSession: {
//         return this.handleEndRedirectionSession()
//       }
//       case RedirectCommands.AuthenticateSession: {
//         return this.handleAuthenticateSession()
//       }
//       default: {
//         this.ws.error = true
//         return ''
//       }
//     }
//   }
// }

test('test header mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection
  jest.spyOn(redirectInterceptor, 'handleStartRedirectionSession').mockReturnValueOnce('handleStartRedirectionSession')
  jest.spyOn(redirectInterceptor, 'handleEndRedirectionSession').mockReturnValueOnce('handleEndRedirectionSession')
  jest.spyOn(redirectInterceptor, 'handleAuthenticateSession').mockReturnValueOnce('handleAuthenticateSession')

  const result = redirectInterceptor.processBrowserDataEx()
  expect(result).toBe('')
})

test('test direct mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: '1234567890',
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: true,
    digestRealm: '',
    digestNonce: '',
    digestQOP: ''
  }

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection
  jest.spyOn(redirectInterceptor, 'handleStartRedirectionSession').mockReturnValueOnce('handleStartRedirectionSession')
  jest.spyOn(redirectInterceptor, 'handleEndRedirectionSession').mockReturnValueOnce('handleEndRedirectionSession')
  jest.spyOn(redirectInterceptor, 'handleAuthenticateSession').mockReturnValueOnce('handleAuthenticateSession')

  const result = redirectInterceptor.processBrowserDataEx()
  expect(result).toBe('1234567890')
  expect(redirectInterceptor.ws.acc).toBe('')
})

test('test handleStartRedirectionSession mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: `${String.fromCharCode(RedirectCommands.StartRedirectionSession)}1234567890`,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection
  jest.spyOn(redirectInterceptor, 'handleStartRedirectionSession').mockReturnValueOnce('handleStartRedirectionSession')
  jest.spyOn(redirectInterceptor, 'handleEndRedirectionSession').mockReturnValueOnce('handleEndRedirectionSession')
  jest.spyOn(redirectInterceptor, 'handleAuthenticateSession').mockReturnValueOnce('handleAuthenticateSession')

  const result = redirectInterceptor.processBrowserDataEx()
  expect(result).toBe('handleStartRedirectionSession')
})

test('test handleStartRedirectionSession mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: `${String.fromCharCode(RedirectCommands.EndRedirectionSession)}1234567890`,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection
  jest.spyOn(redirectInterceptor, 'handleStartRedirectionSession').mockReturnValueOnce('handleStartRedirectionSession')
  jest.spyOn(redirectInterceptor, 'handleEndRedirectionSession').mockReturnValueOnce('handleEndRedirectionSession')
  jest.spyOn(redirectInterceptor, 'handleAuthenticateSession').mockReturnValueOnce('handleAuthenticateSession')

  const result = redirectInterceptor.processBrowserDataEx()
  expect(result).toBe('handleEndRedirectionSession')
})

test('test handleAuthenticateSession mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: `${String.fromCharCode(RedirectCommands.AuthenticateSession)}1234567890`,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection
  jest.spyOn(redirectInterceptor, 'handleStartRedirectionSession').mockReturnValueOnce('handleStartRedirectionSession')
  jest.spyOn(redirectInterceptor, 'handleEndRedirectionSession').mockReturnValueOnce('handleEndRedirectionSession')
  jest.spyOn(redirectInterceptor, 'handleAuthenticateSession').mockReturnValueOnce('handleAuthenticateSession')

  const result = redirectInterceptor.processBrowserDataEx()
  expect(result).toBe('handleAuthenticateSession')
})

test('test default mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: `${String.fromCharCode(99)}1234567890`,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection
  jest.spyOn(redirectInterceptor, 'handleStartRedirectionSession').mockReturnValueOnce('handleStartRedirectionSession')
  jest.spyOn(redirectInterceptor, 'handleEndRedirectionSession').mockReturnValueOnce('handleEndRedirectionSession')
  jest.spyOn(redirectInterceptor, 'handleAuthenticateSession').mockReturnValueOnce('handleAuthenticateSession')

  const result = redirectInterceptor.processBrowserDataEx()
  expect(result).toBe('')
  expect(redirectInterceptor.ws.error).toBeTruthy()
})

// handleStartRedirectionSession (): string {
//   if (this.ws.acc.length < 8) return ''
//   const r = this.ws.acc.substring(0, 8)
//   this.ws.acc = this.ws.acc.substring(8)
//   return r
// }

test('test default mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: '1234567',
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection

  const result = redirectInterceptor.handleStartRedirectionSession()
  expect(result).toBe('')
})

test('test default mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: '12345678',
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection

  const result = redirectInterceptor.handleStartRedirectionSession()
  expect(result).toBe('12345678')
  expect(redirectInterceptor.ws.acc).toBe('')
})

test('test default mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: '123456789',
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection

  const result = redirectInterceptor.handleStartRedirectionSession()
  expect(result).toBe('12345678')
  expect(redirectInterceptor.ws.acc).toBe('9')
})

// handleEndRedirectionSession (): string {
//   if (this.ws.acc.length < 4) return ''
//   const r = this.ws.acc.substring(0, 4)
//   this.ws.acc = this.ws.acc.substring(4)
//   return r
// }

test('test default mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: '123',
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection

  const result = redirectInterceptor.handleEndRedirectionSession()
  expect(result).toBe('')
})

test('test default mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: '1234',
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection

  const result = redirectInterceptor.handleEndRedirectionSession()
  expect(result).toBe('1234')
  expect(redirectInterceptor.ws.acc).toBe('')
})

test('test default mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: '123456789',
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection

  const result = redirectInterceptor.handleEndRedirectionSession()
  expect(result).toBe('1234')
  expect(redirectInterceptor.ws.acc).toBe('56789')
})

// handleAuthenticateSession (): string {
//   if (this.ws.acc.length < 9) return ''
//   const l = Common.ReadIntX(this.ws.acc, 5)
//   if (this.ws.acc.length < 9 + l) return ''

//   const authType = this.ws.acc.charCodeAt(4)
//   if (authType === AuthenticationType.DIGEST && this.args.user && this.args.pass) {
//     const authurl = '/RedirectionService'
//     if (this.amt.digestRealm) {
//       // Replace this authentication digest with a server created one
//       // We have everything we need to authenticate
//       const nc = this.ws.authCNonceCount
//       this.ws.authCNonceCount++
//       const digest = Common.ComputeDigesthash(this.args.user, this.args.pass, this.amt.digestRealm, 'POST', authurl, this.amt.digestQOP, this.amt.digestNonce, nc.toString(), this.ws.authCNonce)

//       // Replace this authentication digest with a server created one
//       // We have everything we need to authenticate
//       let r = String.fromCharCode(0x13, 0x00, 0x00, 0x00, 0x04)
//       r += Common.IntToStrX(this.args.user.length + this.amt.digestRealm.length + this.amt.digestNonce.length + authurl.length + this.ws.authCNonce.length + nc.toString().length + digest.length + this.amt.digestQOP.length + 8)
//       r += String.fromCharCode(this.args.user.length) // Username Length
//       r += this.args.user // Username
//       r += String.fromCharCode(this.amt.digestRealm.length) // Realm Length
//       r += this.amt.digestRealm // Realm
//       r += String.fromCharCode(this.amt.digestNonce.length) // Nonce Length
//       r += this.amt.digestNonce // Nonce
//       r += String.fromCharCode(authurl.length) // Authentication URL "/RedirectionService" Length
//       r += authurl // Authentication URL
//       r += String.fromCharCode(this.ws.authCNonce.length) // CNonce Length
//       r += this.ws.authCNonce // CNonce
//       r += String.fromCharCode(nc.toString().length) // NonceCount Length
//       r += nc.toString() // NonceCount
//       r += String.fromCharCode(digest.length) // Response Length
//       r += digest // Response
//       r += String.fromCharCode(this.amt.digestQOP.length) // QOP Length
//       r += this.amt.digestQOP // QOP

//       this.ws.acc = this.ws.acc.substring(9 + l) // Don't relay the original message
//       return r
//     } else {
//       // Replace this authentication digest with a server created one
//       // Since we don't have authentication parameters, fill them in with blanks to get an error back what that info.
//       let r = String.fromCharCode(0x13, 0x00, 0x00, 0x00, 0x04)
//       r += Common.IntToStrX(this.args.user.length + authurl.length + 8)
//       r += String.fromCharCode(this.args.user.length)
//       r += this.args.user
//       r += String.fromCharCode(0x00, 0x00, authurl.length)
//       r += authurl
//       r += String.fromCharCode(0x00, 0x00, 0x00, 0x00)
//       this.ws.acc = this.ws.acc.substring(9 + l) // Don't relay the original message
//       return r
//     }
//   }

//   const r = this.ws.acc.substring(0, 9 + l)
//   this.ws.acc = this.ws.acc.substring(9 + l)
//   return r
// }

test('test default mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: '1234',
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection

  const result = redirectInterceptor.handleAuthenticateSession()
  expect(result).toBe('')
})

test('test default mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'Intel!123',
    host: 'localhost',
    port: 1234
  }

  const connection: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: '123456789',
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.ws = connection

  jest.spyOn(Common, 'ReadIntX').mockReturnValueOnce(1)

  const result = redirectInterceptor.handleAuthenticateSession()
  expect(result).toBe('')
})

test('test default mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'P@ssw0rd',
    host: 'localhost',
    port: 1234
  }

  const amt: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: `1234${String.fromCharCode(AuthenticationType.DIGEST)}56789`,
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: 'digestRealm1',
    digestNonce: '',
    digestQOP: ''
  }

  const ws: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: `1234${String.fromCharCode(AuthenticationType.DIGEST)}56789`,
    directive: null,
    count: 0,
    headers: null,
    authCNonceCount: 0,
    authCNonce: '',
    error: false,
    direct: false,
    digestRealm: 'digestRealm1',
    digestNonce: '',
    digestQOP: ''
  }

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = amt
  redirectInterceptor.ws = ws

  jest.spyOn(Common, 'ReadIntX').mockReturnValueOnce(1)
  jest.spyOn(Common, 'ComputeDigesthash').mockReturnValueOnce('digest')

  const authurl = '/RedirectionService'
  const nc = ws.authCNonceCount
  const digest = 'digest'

  let r = String.fromCharCode(0x13, 0x00, 0x00, 0x00, 0x04)
  r += Common.IntToStrX(args.user.length + amt.digestRealm.length + amt.digestNonce.length + authurl.length + ws.authCNonce.length + nc.toString().length + digest.length + amt.digestQOP.length + 8)
  r += String.fromCharCode(args.user.length) // Username Length
  r += args.user // Username
  r += String.fromCharCode(amt.digestRealm.length) // Realm Length
  r += amt.digestRealm // Realm
  r += String.fromCharCode(amt.digestNonce.length) // Nonce Length
  r += amt.digestNonce // Nonce
  r += String.fromCharCode(authurl.length) // Authentication URL "/RedirectionService" Length
  r += authurl // Authentication URL
  r += String.fromCharCode(ws.authCNonce.length) // CNonce Length
  r += ws.authCNonce // CNonce
  r += String.fromCharCode(nc.toString().length) // NonceCount Length
  r += nc.toString() // NonceCount
  r += String.fromCharCode(digest.length) // Response Length
  r += digest // Response
  r += String.fromCharCode(amt.digestQOP.length) // QOP Length
  r += amt.digestQOP // QOP

  const result = redirectInterceptor.handleAuthenticateSession()
  expect(result).toBe(r)
  expect(ws.acc).toBe('')
  expect(ws.authCNonceCount).toBe(nc + 1)
})

test('test default mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'P@ssw0rd',
    host: 'localhost',
    port: 1234
  }

  const amt: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: `1234${String.fromCharCode(AuthenticationType.DIGEST)}56789`,
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

  const ws: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: `1234${String.fromCharCode(AuthenticationType.DIGEST)}56789`,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = amt
  redirectInterceptor.ws = ws

  jest.spyOn(Common, 'ReadIntX').mockReturnValueOnce(1)

  const authurl = '/RedirectionService'

  let r = String.fromCharCode(0x13, 0x00, 0x00, 0x00, 0x04)
  r += Common.IntToStrX(args.user.length + authurl.length + 8)
  r += String.fromCharCode(args.user.length)
  r += args.user
  r += String.fromCharCode(0x00, 0x00, authurl.length)
  r += authurl
  r += String.fromCharCode(0x00, 0x00, 0x00, 0x00)

  const result = redirectInterceptor.handleAuthenticateSession()
  expect(result).toBe(r)
  expect(ws.acc).toBe('')
})

test('test default mode', () => {
  const args: Args = {
    user: 'admin',
    pass: 'P@ssw0rd',
    host: 'localhost',
    port: 1234
  }

  const amt: Connection = {
    type: ConnectionType.AMT,
    mode: AmtMode.HEADER,
    acc: `1234${String.fromCharCode(AuthenticationType.DIGEST)}56789`,
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

  const ws: Connection = {
    type: ConnectionType.WS,
    mode: AmtMode.HEADER,
    acc: `1234${String.fromCharCode(AuthenticationType.BADDIGEST)}56789`,
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

  const redirectInterceptor = new RedirectInterceptor(args)
  redirectInterceptor.amt = amt
  redirectInterceptor.ws = ws

  jest.spyOn(Common, 'ReadIntX').mockReturnValueOnce(1)

  const result = redirectInterceptor.handleAuthenticateSession()
  expect(result).toBe(`1234${String.fromCharCode(AuthenticationType.BADDIGEST)}56789`)
  expect(ws.acc).toBe('')
})
