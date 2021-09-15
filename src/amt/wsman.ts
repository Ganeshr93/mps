/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { AMT_Actions, AMT_Classes } from './enums/amt_enums'
import { CIM_Actions, CIM_Classes, CIM_Methods } from './enums/cim_enums'
import { IPS_Actions, IPS_Classes } from './enums/ips_enums'

type Classes = AMT_Classes | IPS_Classes | CIM_Classes

export enum WSManErrors {
  HEADER = 'missing header',
  BODY = 'missing body',
  ACTION = 'missing action',
  MESSAGE_ID = 'missing messageId',
  RESOURCE_URI = 'missing resourceUri',
  ENUMERATION_CONTEXT = 'missing enumerationContext',
  UNSUPPORTED_METHOD = 'unsupported method',
  INPUT = 'missing input',
  SELECTOR = 'missing selector',
  ROLE = 'missing role',
  REQUESTED_POWER_STATE_CHANGE = 'missing powerState',
  ADMIN_PASS_ENCRYPTION_TYPE = 'missing adminPassEncryptionType',
  ADMIN_PASSWORD = 'missing adminPassword',
  ETHERNET_PORT_OBJECT = 'missing ethernetPortObject',
  ENVIRONMENT_DETECTION_SETTING_DATA = 'missing environmentDetectionSettingData',
  CERTIFICATE_BLOB = 'missing certificateBlob',
  MP_SERVER = 'missing mpServer',
  REMOTE_ACCESS_POLICY_RULE = 'missing remoteAccessPolicyRule',
  BOOT_SETTING_DATA = 'missing bootSettingData',
  WSMAN_BODY_OBJECT = 'missing WSMan Body Object',
  CLASS = 'missing class',
  REQUESTED_STATE = 'missing requestedState',
  POLICY_RULE_NAME = 'missing policyRuleName'
}

export interface WSManCallParameters {
  headerObject: WSManHeaderObject
  bodyObject?: WSManBodyObject
}

export interface WSManHeaderObject {
  action: CIM_Actions | AMT_Actions | IPS_Actions
  resourceUri: string
  messageId: string
  address?: string
  timeout?: string
  selector?: Selector
}

export interface WSManBodyObject {
  method: any
  class?: Classes
  enumerationContext?: string
  resourceUri?: string
  inputs?: input[]
}

export interface Selector {
  name: string
  value: string
}

export interface input {
  key: string
  value: any
}

export class WSManMessageCreator {
  xmlCommonPrefix: string = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope">'
  xmlCommonEnd: string = '</Envelope>'
  anonymousAddress: string = 'http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous'
  defaultTimeout: string = 'PT60S'

  readonly createWsman = (method: CIM_Methods, wsmanCall: WSManCallParameters): string => {
    switch (method) {
      case CIM_Methods.Get:
        return this.get(wsmanCall.headerObject)
      case CIM_Methods.Enumerate:
        return this.enumerate(wsmanCall.headerObject, wsmanCall.bodyObject)
      case CIM_Methods.Pull:
        if (wsmanCall.bodyObject.enumerationContext == null) { throw new Error(WSManErrors.ENUMERATION_CONTEXT) }
        return this.pull(wsmanCall.headerObject, wsmanCall.bodyObject)
      case CIM_Methods.Delete:
        if (wsmanCall.headerObject.selector == null) { throw new Error(WSManErrors.SELECTOR) }
        return this.delete(wsmanCall.headerObject, wsmanCall.bodyObject)
      case CIM_Methods.Put:
        if (wsmanCall.headerObject.action == null) { throw new Error(WSManErrors.ACTION) }
        if (wsmanCall.bodyObject == null) { throw new Error(WSManErrors.WSMAN_BODY_OBJECT) }
        return this.put(wsmanCall.headerObject, wsmanCall.bodyObject)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  readonly get = (headerObject: WSManHeaderObject): string => {
    const header: string = this.createHeader(headerObject)
    const body: string = this.createBody(CIM_Methods.Get, { method: CIM_Methods.Get })
    return this.createXml(header, body)
  }

  readonly enumerate = (headerObject: WSManHeaderObject, bodyObject: WSManBodyObject): string => {
    const header: string = this.createHeader(headerObject)
    const body: string = this.createBody(CIM_Methods.Enumerate, bodyObject)
    return this.createXml(header, body)
  }

  readonly pull = (headerObject: WSManHeaderObject, bodyObject: WSManBodyObject): string => {
    const header: string = this.createHeader(headerObject)
    const body: string = this.createBody(CIM_Methods.Pull, bodyObject)
    return this.createXml(header, body)
  }

  readonly delete = (headerObject: WSManHeaderObject, bodyObject: WSManBodyObject): string => {
    const header: string = this.createHeader(headerObject)
    const body: string = this.createBody(CIM_Methods.Delete, bodyObject)
    return this.createXml(header, body)
  }

  readonly put = (headerObject: WSManHeaderObject, bodyObject: WSManBodyObject): string => {
    const header: string = this.createHeader(headerObject)
    const body: string = this.createBody(CIM_Methods.Put, bodyObject)
    return this.createXml(header, body)
  }

  readonly createHeader = (headerObj: WSManHeaderObject): string => {
    let header: string = '<Header>'
    if (headerObj.action == null) { throw new Error(WSManErrors.ACTION) }
    if (headerObj.resourceUri == null) { throw new Error(WSManErrors.RESOURCE_URI) }
    if (headerObj.messageId == null) { throw new Error(WSManErrors.MESSAGE_ID) }
    header += `<a:Action>${headerObj.action}</a:Action><a:To>/wsman</a:To><w:ResourceURI>${headerObj.resourceUri}</w:ResourceURI><a:MessageID>${headerObj.messageId}</a:MessageID><a:ReplyTo>`
    if (headerObj.address != null) { header += `<a:Address>${headerObj.address}</a:Address>` } else { header += `<a:Address>${this.anonymousAddress}</a:Address>` }
    header += '</a:ReplyTo>'
    if (headerObj.timeout != null) { header += `<w:OperationTimeout>${headerObj.timeout}</w:OperationTimeout>` } else { header += `<w:OperationTimeout>${this.defaultTimeout}</w:OperationTimeout>` }
    if (headerObj.selector != null) { header += `<w:SelectorSet><w:Selector Name="${headerObj.selector.name}">${headerObj.selector.value}</w:Selector></w:SelectorSet>` }
    header += '</Header>'
    return header
  }

  readonly createBody = (method: CIM_Methods, bodyObj: WSManBodyObject): string => {
    if (bodyObj == null) { throw new Error(WSManErrors.WSMAN_BODY_OBJECT) }
    switch (method) {
      case CIM_Methods.Pull:
        if (bodyObj.enumerationContext == null) { throw new Error(WSManErrors.ENUMERATION_CONTEXT) }
        return `<Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${bodyObj.enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body>`
      case CIM_Methods.Enumerate:
        return '<Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body>'
      case CIM_Methods.Get:
      case CIM_Methods.Delete:
        return '<Body />'
      case CIM_Methods.Put:
        if (bodyObj.class == null) { throw new Error(WSManErrors.CLASS) }
        return this.createPutBody(bodyObj)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  readonly createXml = (header: string, body: string): string => {
    if (header == null) throw new Error(WSManErrors.HEADER)
    if (body == null) throw new Error(WSManErrors.BODY)
    return this.xmlCommonPrefix + header + body + this.xmlCommonEnd
  }

  readonly createPutBody = (bodyObject: WSManBodyObject): string => {
    let body: string
    if (!bodyObject.inputs) { return '</Body>' }
    body = '<Body>'
    // Some custom methods use _INPUT appended to the end of the method in the top level r block.  Those that don't use the class name in the top level r block
    if (String(bodyObject.method).slice(-6) === '_INPUT') {
      body += `<r:${bodyObject.method} xmlns:r="${bodyObject.resourceUri}">`
    } else {
      body += `<r:${bodyObject.class} xmlns:r="${bodyObject.resourceUri}">`
    }
    bodyObject.inputs.forEach(item => {
      if (Array.isArray(item.value)) {
        item.value.forEach(element => {
          body += `<r:${item.key}>${element}</r:${item.key}>`
        })
      } else if (typeof item.value === 'boolean') {
        body += `<r:${item.key}>${String(item.value)}</r:${item.key}>`
      } else {
        body += `<r:${item.key}>${item.value}</r:${item.key}>`
      }
    })
    // Some custom methods use _INPUT appended to the end of the method in the top level r block.  Those that don't use the class name in the top level r block
    if (String(bodyObject.method).slice(-6) === '_INPUT') {
      body += `</r:${bodyObject.method}></Body>`
    } else {
      body += `</r:${bodyObject.class}></Body>`
    }
    return body
  }

  private readonly convertToAction = (method: CIM_Methods): CIM_Actions => {
    switch (method) {
      case CIM_Methods.Get:
        return CIM_Actions.Get
      case CIM_Methods.Enumerate:
        return CIM_Actions.Enumerate
      case CIM_Methods.Pull:
        return CIM_Actions.Pull
      case CIM_Methods.Put:
        return CIM_Actions.Put
      case CIM_Methods.Delete:
        return CIM_Actions.Delete
    }
  }

  readonly createWsmanCallParameters = (method: CIM_Methods, messageId: string, resourceUri?: string, enumerationContext?: string, selector?: Selector, bodyObj?: any): WSManCallParameters => {
    if (messageId == null) { throw new Error(WSManErrors.MESSAGE_ID) }
    const headerObject: WSManHeaderObject = {
      action: this.convertToAction(method),
      messageId: messageId,
      resourceUri: resourceUri,
      selector: selector
    }
    const bodyObject: WSManBodyObject = {
      method: method,
      enumerationContext: enumerationContext,
      inputs: this.getInputs(bodyObj)
    }
    const wsmanCallParameters: WSManCallParameters = {
      headerObject: headerObject,
      bodyObject: bodyObject
    }
    return wsmanCallParameters
  }

  readonly getInputs = (object: any): input[] => {
    if (object == null) { return null }
    const items = []
    for (const key in object) {
      items.push({ key: key, value: object[key] })
    }
    return items
  }
}
