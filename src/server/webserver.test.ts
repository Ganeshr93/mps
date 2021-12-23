import * as fs from 'fs'
import { Certificates } from '../utils/certificates'
import { certificatesType } from '../models/Config'
import { ISecretManagerService } from '../interfaces/ISecretManagerService'
import { config } from '../test/helper/config'
import { WebServer } from './webserver'
import { Environment } from '../utils/Environment'
import { IncomingMessage } from 'http'
import { Socket } from 'net'

Environment.Config = config

let certs: certificatesType
const certPath = config.cert_path
let secrets: ISecretManagerService
let web: WebServer

beforeAll(async function () {
  jest.setTimeout(60000)
  try {
    if (!fs.existsSync(certPath)) { fs.mkdirSync(certPath, { recursive: true }) }
  } catch (e) {
    console.log(`Failed to create Cert path ${certPath}. Create if it doesn't exist`)
  }
  const certificates = new Certificates(config, secrets)
  certs = certificates.generateCertificates()
  secrets = {
    getSecretFromKey: async (path: string, key: string) => { return 'P@ssw0rd' },
    getSecretAtPath: async (path: string) => { return {} as any },
    getAMTCredentials: async (path: string) => { return ['admin', 'P@ssw0rd'] },
    health: async () => { return {} }
  }
  web = new WebServer(secrets, certs)
})

describe('WEB Server test', () => {
  it('Create WEBServer', () => {
    expect(web).toBeDefined()
    expect(web.app).toBeDefined()
    expect(web.relaywss).toBeDefined()
    expect(web.wsRedirect).toBeDefined()
    expect(web.certs).toBeDefined()
    expect(web.app).toBeDefined()
    expect(web.server).toBeDefined()
  })
})

describe('verify client token', () => {
  it('should return false when client jwt token is invalid', () => {
    const jwsSpy = jest.spyOn(web.jws, 'verify')
    jwsSpy.mockImplementationOnce(() => false)
    const info = { req: { headers: ['sec-websocket-protocol:invalid'] } }
    const result = web.verifyClientToken(info)
    expect(result).toBe(false)
  })
  it('should return true when client jwt token is valid', () => {
    const jwsSpy = jest.spyOn(web.jws, 'verify')
    jwsSpy.mockImplementationOnce(() => true)
    const info = { req: { headers: ['sec-websocket-protocol:supersecret'] } }
    const result = web.verifyClientToken(info)
    expect(result).toBe(true)
  })
  it('should return false and handle error while client jwt token is verified', () => {
    const jwsSpy = jest.spyOn(web.jws, 'verify')
    jwsSpy.mockImplementationOnce(() => {
      throw new Error()
    })
    const info = { req: { headers: ['sec-websocket-protocol:invalid'] } }
    const result = web.verifyClientToken(info)
    expect(result).toBe(false)
  })
})

describe('handle upgrade', () => {
  it('should return unauthorized error when route does not exist', () => {
    const request = new IncomingMessage(null)
    const socket: Socket = new Socket()
    const writeSpy = jest.spyOn(socket, 'write')
    const destroySpy = jest.spyOn(socket, 'destroy')
    const head: Buffer = null
    web.handleUpgrade(request, socket, head)
    expect(writeSpy).toHaveBeenCalledTimes(1)
    expect(destroySpy).toHaveBeenCalledTimes(1)
  })
  it('should route the message', () => {
    const request = new IncomingMessage(null)
    request.url = '/relay/webrelay.ashx?p=2&host=4c4c4544-004b-4210-8033-b6c04f504633&port=16994&tls=0&tls1only=0'
    const socket: Socket = new Socket()
    const head: Buffer = null
    const handleUpgradeSpy = jest.spyOn(web.relaywss, 'handleUpgrade')
    web.handleUpgrade(request, socket, head)
    expect(handleUpgradeSpy).toHaveBeenCalledTimes(1)
  })
})

describe('listen', () => {
  it('should listen on port 3000', () => {
    const listenSpy = jest.spyOn(web.server, 'listen')
    web.listen()
    expect(listenSpy).toHaveBeenCalledTimes(1)
    web.server.close()
  })
  it('should route the message', () => {
    // const listenSpy = jest.spyOn(web.server, 'listen')
    // listenSpy.mockImplementationOnce(() => {
    //   throw new Error()
    // })
    // web.listen()
    // expect(listenSpy).toHaveBeenCalledTimes(1)
    // web.server.close()
  })
})

afterAll(function () {
})
