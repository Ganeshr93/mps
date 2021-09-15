/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { Selector, WSManMessageCreator, WSManErrors, WSManBodyObject, WSManCallParameters } from './wsman'
import { CIM_Methods, CIM_Actions, CIM_Classes } from './enums/cim_enums'

export class CIM {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/'

  cim_ServiceAvailableToElement = (method: CIM_Methods.Pull | CIM_Methods.Enumerate, messageId: string, enumerationContext?: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_ServiceAvailableToElement}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri, enumerationContext)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_SoftwareIdentity = (method: CIM_Methods.Pull | CIM_Methods.Enumerate, messageId: string, enumerationContext?: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_SoftwareIdentity}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri, enumerationContext)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_ComputerSystemPackage = (method: CIM_Methods.Get | CIM_Methods.Enumerate, messageId: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_ComputerSystemPackage}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_SystemPackaging = (method: CIM_Methods.Pull | CIM_Methods.Enumerate, messageId: string, enumerationContext?: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_SystemPackaging}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri, enumerationContext)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_KVMRedirectionSAP = (method: CIM_Methods.Get, messageId: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_KVMRedirectionSAP}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_Chassis = (method: CIM_Methods.Get, messageId: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_Chassis}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_Chip = (method: CIM_Methods.Pull | CIM_Methods.Enumerate, messageId: string, enumerationContext?: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_Chip}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri, enumerationContext)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_Card = (method: CIM_Methods.Get, messageId: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_Card}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_BIOSElement = (method: CIM_Methods.Get, messageId: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_BIOSElement}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_Processor = (method: CIM_Methods.Pull | CIM_Methods.Enumerate, messageId: string, enumerationContext?: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_Processor}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri, enumerationContext)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_PhysicalMemory = (method: CIM_Methods.Pull | CIM_Methods.Enumerate, messageId: string, enumerationContext?: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_PhysicalMemory}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri, enumerationContext)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_MediaAccessDevice = (method: CIM_Methods.Pull | CIM_Methods.Enumerate, messageId: string, enumerationContext?: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_MediaAccessDevice}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri, enumerationContext)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_PhysicalPackage = (method: CIM_Methods.Pull | CIM_Methods.Enumerate, messageId: string, enumerationContext?: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_PhysicalPackage}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri, enumerationContext)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_WiFiEndpointSettings = (method: CIM_Methods.Pull | CIM_Methods.Enumerate, messageId: string, enumerationContext?: string): string => {
    const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_WiFiEndpointSettings}`
    const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri, enumerationContext)
    return this.wsmanMessageCreator.createWsman(method, wsmanCallParameters)
  }

  cim_BootService = (method: CIM_Methods.SetBootConfigRole, messageId: string, selector?: Selector, role?: number): string => {
    switch (method) {
      case CIM_Methods.SetBootConfigRole: {
        if (selector == null) { throw new Error(WSManErrors.SELECTOR) }
        if (role == null) { throw new Error(WSManErrors.ROLE) }
        const header = this.wsmanMessageCreator.createHeader({ action: CIM_Actions.SetBootConfigRole, resourceUri: `${this.resourceUriBase}${CIM_Classes.CIM_BootService}`, messageId: messageId })
        const body = `<Body><r:SetBootConfigRole_INPUT xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService"><r:BootConfigSetting><Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="InstanceID">${selector.value}</Selector></SelectorSet></ReferenceParameters></r:BootConfigSetting><r:Role>${role}</r:Role></r:SetBootConfigRole_INPUT></Body>`
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  cim_BootConfigSetting = (method: CIM_Methods.ChangeBootOrder, messageId: string): string => {
    switch (method) {
      case CIM_Methods.ChangeBootOrder: { // TODO: Example used was incomplete, per AMT SDK there is more work on body required for robust support
        const header = this.wsmanMessageCreator.createHeader({ action: CIM_Actions.ChangeBootOrder, resourceUri: `${this.resourceUriBase}${CIM_Classes.CIM_BootConfigSetting}`, messageId: messageId })
        const body = '<Body><r:ChangeBootOrder_INPUT xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting"></r:ChangeBootOrder_INPUT></Body>'
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  cim_PowerManagementService = (method: CIM_Methods.RequestPowerStateChange, messageId: string, powerState: number): string => {
    switch (method) {
      case CIM_Methods.RequestPowerStateChange: {
        if (powerState == null) { throw new Error(WSManErrors.REQUESTED_POWER_STATE_CHANGE) }
        const resourceUri = `${this.resourceUriBase}${CIM_Classes.CIM_PowerManagementService}`
        const header = this.wsmanMessageCreator.createHeader({ action: CIM_Actions.RequestPowerStateChange, resourceUri: resourceUri, messageId: messageId })
        const bodyObject: WSManBodyObject = {
          method: `${method}_INPUT`,
          class: CIM_Classes.CIM_PowerManagementService,
          resourceUri: resourceUri,
          inputs: [{ key: 'PowerState', value: powerState }, { key: 'ManagedElement', value: '<Address xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing">http://schemas.xmlsoap.org/ws/2004/08/addressing</Address><ReferenceParameters xmlns="http://schemas.xmlsoap.org/ws/2004/08/addressing"><ResourceURI xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd">http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ComputerSystem</ResourceURI><SelectorSet xmlns="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd"><Selector Name="CreationClassName">CIM_ComputerSystem</Selector><Selector Name="Name">ManagedSystem</Selector></SelectorSet></ReferenceParameters>' }]
        }
        const body = this.wsmanMessageCreator.createBody(CIM_Methods.Put, bodyObject)
        return this.wsmanMessageCreator.createXml(header, body)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }
}
