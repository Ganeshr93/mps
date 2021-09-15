/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { WSManErrors, WSManMessageCreator, WSManCallParameters, WSManBodyObject, WSManHeaderObject } from './wsman'
import { CIM_Methods } from './enums/cim_enums'
import { IPS_Actions, IPS_Classes, IPS_Methods } from './enums/ips_enums'

export class IPS {
  wsmanMessageCreator: WSManMessageCreator = new WSManMessageCreator()
  readonly resourceUriBase: string = 'http://intel.com/wbem/wscim/1/ips-schema/1/'

  ips_OptInService = (method: CIM_Methods.Get, messageId: string): string => {
    switch (method) {
      case CIM_Methods.Get: {
        const resourceUri = `${this.resourceUriBase}${IPS_Classes.IPS_OptInService}`
        const wsmanCallParameters: WSManCallParameters = this.wsmanMessageCreator.createWsmanCallParameters(method, messageId, resourceUri)
        return this.wsmanMessageCreator.createWsman(CIM_Methods.Get, wsmanCallParameters)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }

  ips_HostBasedSetupService = (method: IPS_Methods.Setup, messageId: string, adminPassEncryptionType: number, adminPassword: string): string => {
    switch (method) {
      case IPS_Methods.Setup: {
        if (adminPassEncryptionType == null) { throw new Error(WSManErrors.ADMIN_PASS_ENCRYPTION_TYPE) }
        if (adminPassword == null) { throw new Error(WSManErrors.ADMIN_PASSWORD) }
        const resourceUri = `${this.resourceUriBase}${IPS_Classes.IPS_HostBasedSetupService}`
        const headerObject: WSManHeaderObject = {
          action: IPS_Actions.Setup,
          resourceUri: resourceUri,
          messageId: messageId
        }
        const bodyObject: WSManBodyObject = {
          method: `${method}_INPUT`,
          class: IPS_Classes.IPS_HostBasedSetupService,
          resourceUri: resourceUri,
          inputs: [{ key: 'NetAdminPassEncryptionType', value: adminPassEncryptionType }, { key: 'NetworkAdminPassword', value: adminPassword }]
        }
        const wsmanCall: WSManCallParameters = {
          headerObject: headerObject,
          bodyObject: bodyObject
        }
        return this.wsmanMessageCreator.createWsman(CIM_Methods.Put, wsmanCall)
      }
      default:
        throw new Error(WSManErrors.UNSUPPORTED_METHOD)
    }
  }
}
