/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Selector, WSManMessageCreator, WSManErrors, WSManBodyObject, WSManCallParameters, WSManHeaderObject } from './wsman'
import { CIM_Actions, CIM_Methods } from './enums/cim_enums'
import { AMT_Actions, AMT_Methods, AMT_Classes } from './enums/amt_enums'
import { AMT_EthernetPortSettings, MPServer, RemoteAccessPolicyRule, AMT_EnvironmentDetectionSettingData, AMT_BootSettingData } from './models/amt_models'
import { CIM } from './cim'

export class AMT {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://intel.com/wbem/wscim/1/amt-schema/1/'
  cimClass: CIM = new CIM()

  amt_AuditLog = (method: AMT_Methods.ReadRecords, messageId: string, startIndex: number): string => {
    let header: string, body: string
    switch (method) {
      case AMT_Methods.ReadRecords:
        header = this.wsmanMessageCreator.createHeader({ action: AMT_Actions.ReadRecords, resourceUri: `${this.resourceUriBase}${AMT_Classes.AMT_AuditLog}`, messageId: messageId })
        body = `<Body><r:ReadRecords_INPUT xmlns:r="${this.resourceUriBase}${AMT_Classes.AMT_AuditLog}"><r:StartIndex>${startIndex}</r:StartIndex></r:ReadRecords_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  amt_RedirectionService = (method: CIM_Methods.Get, messageId: string): string => {
    const resourceUri = `${this.resourceUriBase}${AMT_Classes.AMT_RedirectionService}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  amt_SetupAndConfigurationService = (method: CIM_Methods.Get | AMT_Methods.Unprovision, messageId: string): string => {
    const resourceUri = `${this.resourceUriBase}${AMT_Classes.AMT_SetupAndConfigurationService}`
    switch (method) {
      case CIM_Methods.Get: {
        const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(CIM_Methods.Get, messageId, resourceUri)
        return this.wsmanMessageCreator.createWsman(CIM_Methods.Get, wsmanCallParameters)
      }
      case AMT_Methods.Unprovision: {
        const headerObject: WSManHeaderObject = {
          action: AMT_Actions.Unprovision,
          resourceUri: resourceUri,
          messageId: messageId
        }
        const bodyObject: WSManBodyObject = {
          method: `${AMT_Methods.Unprovision}_INPUT`,
          resourceUri: resourceUri,
          inputs: [{ key: 'ProvisioningMode', value: 2 }]
        }
        const header: string = this.wsmanMessageCreator.createHeader(headerObject)
        const body: string = this.wsmanMessageCreator.createPutBody(bodyObject)
        return this.wsmanMessageCreator.createXml(header, body)
      }
    }
  }

  amt_GeneralSettings = (method: CIM_Methods.Get, messageId: string): string => {
    const resourceUri = `${this.resourceUriBase}${AMT_Classes.AMT_GeneralSettings}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  amt_EthernetPortSettings = (method: CIM_Methods.Pull | CIM_Methods.Enumerate | CIM_Methods.Put, messageId: string, enumerationContext?: string, ethernetPortObject?: AMT_EthernetPortSettings): string => {
    const resourceUri = `${this.resourceUriBase}${AMT_Classes.AMT_EthernetPortSettings}`
    switch (method) {
      case CIM_Methods.Pull:
      case CIM_Methods.Enumerate: {
        const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri, enumerationContext)
        return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
      }
      case CIM_Methods.Put: {
        if (ethernetPortObject == null) { throw new Error(WSManErrors.ETHERNET_PORT_OBJECT) }
        const selector: Selector = { name: 'InstanceID', value: ethernetPortObject.InstanceID }
        const headerObject: WSManHeaderObject = {
          action: CIM_Actions.Put,
          resourceUri: resourceUri,
          messageId: messageId,
          selector: selector
        }
        const bodyObject: WSManBodyObject = {
          method: AMT_Classes.AMT_EthernetPortSettings,
          class: AMT_Classes.AMT_EthernetPortSettings,
          enumerationContext: enumerationContext,
          resourceUri: resourceUri,
          inputs: this.wsmanMessageCreator.getInputs(ethernetPortObject)
        }
        const wsmanCallParameters: WSManCallParameters = {
          headerObject: headerObject, bodyObject: bodyObject
        }
        return this.wsmanMessageCreator.createWsman(CIM_Methods.Put, wsmanCallParameters)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  amt_RemoteAccessPolicyRule = (method: CIM_Methods.Delete, messageId: string, policyRuleName: string): string => {
    if (policyRuleName == null) { throw new Error(WSManErrors.POLICY_RULE_NAME) }
    const selector: Selector = { name: 'PolicyRuleName', value: policyRuleName }
    const resourceUri = `${this.resourceUriBase}${AMT_Classes.AMT_RemoteAccessPolicyRule}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri, null, selector)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  amt_ManagementPresenceRemoteSAP = (method: CIM_Methods.Pull | CIM_Methods.Enumerate, messageId: string, enumerationContext?: string): string => {
    const resourceUri = `${this.resourceUriBase}${AMT_Classes.AMT_ManagementPresenceRemoteSAP}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri, enumerationContext)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  amt_PublicKeyCertificate = (method: CIM_Methods.Pull | CIM_Methods.Enumerate, messageId: string, enumerationContext?: string): string => {
    const resourceUri = `${this.resourceUriBase}${AMT_Classes.AMT_PublicKeyCertificate}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri, enumerationContext)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  amt_EnvironmentDetectionSettingData = (method: CIM_Methods.Get | CIM_Methods.Put, messageId: string, environmentDetectionSettingData?: AMT_EnvironmentDetectionSettingData): string => {
    const resourceUri = `${this.resourceUriBase}${AMT_Classes.AMT_EnvironmentDetectionSettingData}`
    switch (method) {
      case CIM_Methods.Get: {
        const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri)
        return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
      }
      case CIM_Methods.Put: {
        if (environmentDetectionSettingData == null) { throw new Error(WSManErrors.ENVIRONMENT_DETECTION_SETTING_DATA) }
        const selector: Selector = { name: 'InstanceID', value: environmentDetectionSettingData.InstanceID }
        const headerObject: WSManHeaderObject = {
          action: CIM_Actions.Put,
          resourceUri: resourceUri,
          messageId: messageId,
          selector: selector
        }
        const bodyObject: WSManBodyObject = {
          method: AMT_Classes.AMT_EnvironmentDetectionSettingData,
          class: AMT_Classes.AMT_EnvironmentDetectionSettingData,
          resourceUri: resourceUri,
          inputs: this.wsmanMessageCreator.getInputs(environmentDetectionSettingData)
        }
        const wsmanCallParameters: WSManCallParameters = {
          headerObject: headerObject, bodyObject: bodyObject
        }
        return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  amt_PublicKeyManagementService = (method: AMT_Methods.AddTrustedRootCertificate, messageId: string, certificateBlob?: string): string => {
    switch (method) {
      case AMT_Methods.AddTrustedRootCertificate: {
        if (certificateBlob == null) { throw new Error(WSManErrors.CERTIFICATE_BLOB) }
        const header = this.wsmanMessageCreator.createHeader({ action: AMT_Actions.AddTrustedRootCertificate, resourceUri: `${this.resourceUriBase}${AMT_Classes.AMT_PublicKeyManagementService}`, messageId: messageId })
        const body = `<Body><r:AddTrustedRootCertificate_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService"><r:CertificateBlob>${certificateBlob}</r:CertificateBlob></r:AddTrustedRootCertificate_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  amt_RemoteAccessService = (method: AMT_Methods.AddMpServer | AMT_Methods.AddRemoteAccessPolicyRule, messageId: string, mpServer?: MPServer, remoteAccessPolicyRule?: RemoteAccessPolicyRule, policyRuleName?: string): string => {
    switch (method) {
      case AMT_Methods.AddMpServer: {
        if (mpServer == null) { throw new Error(WSManErrors.MP_SERVER) }
        const header = this.wsmanMessageCreator.createHeader({ action: AMT_Actions.AddMpServer, resourceUri: `${this.resourceUriBase}${AMT_Classes.AMT_RemoteAccessService}`, messageId: messageId })
        const body = `<Body><r:AddMpServer_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:AccessInfo>${mpServer.AccessInfo}</r:AccessInfo><r:InfoFormat>${mpServer.InfoFormat}</r:InfoFormat><r:Port>${mpServer.Port}</r:Port><r:AuthMethod>${mpServer.AuthMethod}</r:AuthMethod><r:Username>${mpServer.Username}</r:Username><r:Password>${mpServer.Password}</r:Password><r:CN>${mpServer.CommonName}</r:CN></r:AddMpServer_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      case AMT_Methods.AddRemoteAccessPolicyRule: {
        if (remoteAccessPolicyRule == null) { throw new Error(WSManErrors.REMOTE_ACCESS_POLICY_RULE) }
        if (policyRuleName == null) { throw new Error(WSManErrors.POLICY_RULE_NAME) }
        const selector: Selector = { name: 'Name', value: policyRuleName }
        const header = this.wsmanMessageCreator.createHeader({ action: AMT_Actions.AddRemoteAccessPolicyRule, resourceUri: `${this.resourceUriBase}${AMT_Classes.AMT_RemoteAccessService}`, messageId: messageId })
        const body = `<Body><r:AddRemoteAccessPolicyRule_INPUT xmlns:r="http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService"><r:Trigger>${remoteAccessPolicyRule.Trigger}</r:Trigger><r:TunnelLifeTime>${remoteAccessPolicyRule.TunnelLifeTime}</r:TunnelLifeTime><r:ExtendedData>${remoteAccessPolicyRule.ExtendedData}</r:ExtendedData><r:MpServer><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://intel.com/wbem/wscim/1/amt-schema/1/AMT_ManagementPresenceRemoteSAP</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="${selector.name}">${selector.value}</Selector></SelectorSet></ReferenceParameters></r:MpServer></r:AddRemoteAccessPolicyRule_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  amt_UserInitiatedConnectionService = (method: AMT_Methods.RequestStateChange, messageId: string, requestedState: number): string => {
    if (requestedState == null) { throw new Error(WSManErrors.REQUESTED_STATE) }
    const resourceUri = `${this.resourceUriBase}${AMT_Classes.AMT_UserInitiatedConnectionService}`
    const headerObject: WSManHeaderObject = {
      action: AMT_Actions.RequestStateChange,
      resourceUri: resourceUri,
      messageId: messageId
    }
    const bodyObject: WSManBodyObject = {
      method: `${method}_INPUT`,
      class: AMT_Classes.AMT_UserInitiatedConnectionService,
      resourceUri: `${this.resourceUriBase}${AMT_Classes.AMT_UserInitiatedConnectionService}`,
      inputs: [{ key: 'RequestedState', value: requestedState }]
    }
    const wsmanCallParameters: WSManCallParameters = {
      headerObject: headerObject, bodyObject: bodyObject
    }
    return this.wsmanMessageCreator.createWsman(CIM_Methods.Put, wsmanCallParameters)
  }

  amt_BootSettingData = (method: CIM_Methods.Get | CIM_Methods.Put, messageId: string, bootSettingData?: AMT_BootSettingData): string => {
    const resourceUri = `${this.resourceUriBase}${AMT_Classes.AMT_BootSettingData}`
    switch (method) {
      case CIM_Methods.Get: {
        const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri)
        return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
      }
      case CIM_Methods.Put: {
        if (bootSettingData == null) { throw new Error(WSManErrors.BOOT_SETTING_DATA) }
        const headerObject: WSManHeaderObject = {
          action: CIM_Actions.Put,
          resourceUri: resourceUri,
          messageId: messageId
        }
        const bodyObject: WSManBodyObject = {
          method: AMT_Methods.AMT_BootSettingData,
          class: AMT_Classes.AMT_BootSettingData,
          resourceUri: resourceUri,
          inputs: this.wsmanMessageCreator.getInputs(bootSettingData)
        }
        const wsmanCallParameters: WSManCallParameters = {
          headerObject: headerObject, bodyObject: bodyObject
        }
        return this.wsmanMessageCreator.createWsman(CIM_Methods.Put, wsmanCallParameters)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }
}
