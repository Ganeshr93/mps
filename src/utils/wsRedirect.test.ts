import { WsRedirect } from './wsRedirect'
import { queryParams } from '../models/Config'
import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { logger as log } from '../utils/logger'
import { HttpInterceptor } from './httpInterceptor'
import { RedirectInterceptor } from './redirectInterceptor'
import { devices } from '../server/mpsserver'
import { ConnectedDevice } from '../amt/ConnectedDevice'
import { Socket } from 'net'

let secretManagerService: ISecretManagerService
let wsRedirect: WsRedirect
const fakeGuid = '00000000-0000-0000-0000-000000000000'

describe('WsRedirect tests', () => {
  beforeEach(() => {
    secretManagerService = {
      getSecretFromKey: async (path: string, key: string) => { return 'P@ssw0rd' },
      getSecretAtPath: async (path: string) => { return {} as any },
      getAMTCredentials: async (path: string) => { return ['admin', 'P@ssw0rd'] },
      health: async () => { return {} }
    }
  })

  describe('handleConnection tests', () => {
    it('should handle connection with TCP socket', async () => {
      const mockWebSocket = {
        pause: jest.fn()
      }
      const mockSocket = new Socket()
      mockSocket.connect = jest.fn()

      const mockWebSocketExt = {
        _socket: mockWebSocket,
        forwardclient: mockSocket,
        on: jest.fn()
      }

      const webSocketExtOnSpy = jest.spyOn(mockWebSocketExt, 'on')
      const mockIncomingMessage = {
        url: 'https://iotg.com?tls=0'
      }
      const socketPauseSpy = jest.spyOn(mockWebSocket, 'pause')
      devices[fakeGuid] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')

      wsRedirect = new WsRedirect(secretManagerService)
      const setNormalTCPSpy = jest.spyOn(wsRedirect, 'setNormalTCP').mockReturnValue()
      wsRedirect.forwardToClient = jest.fn()
      await wsRedirect.handleConnection(mockWebSocketExt as any, mockIncomingMessage as any)

      expect(socketPauseSpy).toBeCalled()
      expect(webSocketExtOnSpy).toBeCalled()
      expect(setNormalTCPSpy).toBeCalled()
    })
    it('should handle connection with TLS socket', async () => {
      const mockWebSocket = {
        pause: jest.fn()
      }
      const mockSocket = new Socket()
      mockSocket.connect = jest.fn()

      const mockWebSocketExt = {
        _socket: mockWebSocket,
        forwardclient: mockSocket,
        on: jest.fn()
      }

      const webSocketExtOnSpy = jest.spyOn(mockWebSocketExt, 'on')
      const mockIncomingMessage = {
        url: 'https://iotg.com?tls=1'
      }
      const socketPauseSpy = jest.spyOn(mockWebSocket, 'pause')
      devices[fakeGuid] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')

      wsRedirect = new WsRedirect(secretManagerService)
      const setupTLSSocketSpy = jest.spyOn(wsRedirect, 'setupTLSSocket').mockReturnValue()
      wsRedirect.forwardToClient = jest.fn()
      await wsRedirect.handleConnection(mockWebSocketExt as any, mockIncomingMessage as any)

      expect(socketPauseSpy).toBeCalled()
      expect(webSocketExtOnSpy).toBeCalled()
      expect(setupTLSSocketSpy).toBeCalled()
    })
  })

  it('should handle message', () => {
    const message: any = 'hello'

    const mockWebSocketExt = {
      interceptor: {
        processBrowserData: jest.fn().mockReturnValue(message)
      },
      forwardclient: {
        write: jest.fn()
      }
    }

    wsRedirect = new WsRedirect(secretManagerService)
    wsRedirect.handleMessage(mockWebSocketExt as any, message)

    expect(mockWebSocketExt.interceptor.processBrowserData).toBeCalledWith(message)
    expect(mockWebSocketExt.forwardclient.write).toBeCalledWith(message)
  })

  describe('handleClose tests', () => {
    const params: queryParams = {
      host: 'localhost',
      port: 1111
    } as any

    it('should handle close happily', () => {
      const mockWebSocketExt = {
        forwardclient: {
          close: jest.fn(),
          destroy: jest.fn()
        }
      }

      wsRedirect = new WsRedirect(secretManagerService)
      wsRedirect.handleClose(mockWebSocketExt as any, params)

      expect(mockWebSocketExt.forwardclient.close).toBeCalled()
      expect(mockWebSocketExt.forwardclient.destroy).toBeCalled()
    })

    it('should handle close and log any error on destroy', () => {
      const mockWebSocketExt = {
        forwardclient: {
          close: jest.fn(),
          destroy: jest.fn().mockImplementation(() => {
            throw new Error()
          })
        }
      }
      const logSpy = jest.spyOn(log, 'error')

      wsRedirect = new WsRedirect(secretManagerService)
      wsRedirect.handleClose(mockWebSocketExt as any, params)

      expect(mockWebSocketExt.forwardclient.close).toBeCalled()
      expect(mockWebSocketExt.forwardclient.destroy).toBeCalled()
      expect(logSpy).toBeCalled()
    })
  })

  describe('createCredential tests', () => {
    it('should create credential for HttpInterceptor', () => {
      const mockWebSocketExt = {
        interceptor: null
      }
      const paramsWithPof1 = {
        p: 1,
        host: 'localhost',
        port: 12345
      }
      const credentials = ['joe blow', 'P@ssw0rd']

      wsRedirect = new WsRedirect(secretManagerService)
      wsRedirect.createCredential(mockWebSocketExt as any, paramsWithPof1 as any, credentials as any)
      expect(mockWebSocketExt.interceptor).toBeInstanceOf(HttpInterceptor)
      expect(mockWebSocketExt.interceptor.args).toMatchObject({
        host: paramsWithPof1.host,
        port: paramsWithPof1.port,
        user: credentials[0],
        pass: credentials[1]
      })
    })

    it('should create credential for RedirectInterceptor', () => {
      const mockWebSocketExt = {
        interceptor: null
      }
      const paramsWithPof2 = {
        p: 2
      }
      const credentials = ['joe blow', 'P@ssw0rd']

      wsRedirect = new WsRedirect(secretManagerService)
      wsRedirect.createCredential(mockWebSocketExt as any, paramsWithPof2 as any, credentials as any)
      expect(mockWebSocketExt.interceptor).toBeInstanceOf(RedirectInterceptor)
      expect(mockWebSocketExt.interceptor.args).toMatchObject({
        user: credentials[0],
        pass: credentials[1]
      })
    })

    it('should not create credential if none are passed in', () => {
      const mockWebSocketExt = {
        interceptor: null
      }
      const paramsWithPof2 = {
        p: 2
      }
      const credentials = null

      wsRedirect = new WsRedirect(secretManagerService)
      wsRedirect.createCredential(mockWebSocketExt as any, paramsWithPof2 as any, credentials)
      expect(mockWebSocketExt.interceptor).toBeFalsy()
    })
  })

  describe('setnormalTCP test', () => {
    it('should set normal tcp socket for mps connection', () => {
      const params: queryParams = {
        host: fakeGuid
      } as any

      wsRedirect = new WsRedirect(secretManagerService)
      const mockWebSocketExt = {
        interceptor: {
          processAmtData: jest.fn().mockReturnValue('any data')
        },
        _socket: {
          resume: jest.fn()
        },
        send: jest.fn()
      }

      devices[fakeGuid] = new ConnectedDevice(null, 'admin', 'P@ssw0rd')
      const mockCiraChannel = {
        xlts: 0
      } as any
      devices[fakeGuid].ciraHandler = {
        SetupCiraChannel: jest.fn().mockReturnValue(mockCiraChannel)
      } as any

      wsRedirect.setNormalTCP(mockWebSocketExt as any, params as any)
      expect(mockWebSocketExt._socket.resume).toHaveBeenCalled()
    })

    it('should set normal tcp socket for non-mps connection', () => {
      const mockWebSocketExt = {
        interceptor: null,
        forwardclient: {
          forwardwsocket: null
        }
      }
      const paramsWithoutHost = {
      }
      devices[fakeGuid] = null

      wsRedirect = new WsRedirect(secretManagerService)
      wsRedirect.setNormalTCP(mockWebSocketExt as any, paramsWithoutHost as any)
      expect(mockWebSocketExt.forwardclient.forwardwsocket).toEqual(mockWebSocketExt)
    })
  })

  it.skip('should set up TLS socket', () => {
    const params: queryParams = {
      host: fakeGuid,
      port: 1234
    } as any
    const mockWebSocketExt = {
      forwardclient: null
    }

    wsRedirect = new WsRedirect(secretManagerService)
    wsRedirect.setupTLSSocket(mockWebSocketExt as any, params as any)

    expect(mockWebSocketExt.forwardclient).toBeDefined()
  })

  it.skip('should forward to client', () => {
    const params: queryParams = {
      host: fakeGuid,
      port: 6666
    } as any
    const mockForwardClient = {
      on: jest.fn()
    }
    const mockWebSocketExt = {
      forwardclient: mockForwardClient
    }
    const forwardClientOnSpy = jest.spyOn(mockForwardClient, 'on')
    const mockIncomingMessage = {
      url: 'http://chocolate.com'
    }

    wsRedirect = new WsRedirect(secretManagerService)
    wsRedirect.forwardToClient(mockWebSocketExt as any, params as any, mockIncomingMessage as any)

    expect(forwardClientOnSpy).toBeCalled()
  })
})
