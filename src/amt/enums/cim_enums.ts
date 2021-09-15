/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum CIM_Methods {
  Get = 'Get',
  Pull = 'Pull',
  Enumerate = 'Enumerate',
  Put = 'Put',
  Delete = 'Delete',
  SetBootConfigRole = 'SetBootConfigRole',
  ChangeBootOrder = 'ChangeBootOrder',
  RequestPowerStateChange = 'RequestPowerStateChange'
}

export enum CIM_Actions {
  Enumerate = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate',
  Pull = 'http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull',
  Get = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Get',
  Put = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Put',
  Delete = 'http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete',
  SetBootConfigRole = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootService/SetBootConfigRole',
  ChangeBootOrder = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_BootConfigSetting/ChangeBootOrder',
  RequestPowerStateChange = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_PowerManagementService/RequestPowerStateChange'
}

export enum CIM_Classes {
  CIM_ServiceAvailableToElement = 'CIM_ServiceAvailableToElement',
  CIM_SoftwareIdentity = 'CIM_SoftwareIdentity',
  CIM_ComputerSystemPackage = 'CIM_ComputerSystemPackage',
  CIM_SystemPackaging = 'CIM_SystemPackaging',
  CIM_KVMRedirectionSAP = 'CIM_KVMRedirectionSAP',
  CIM_Chassis = 'CIM_Chassis',
  CIM_Chip = 'CIM_Chip',
  CIM_Card = 'CIM_Card',
  CIM_BIOSElement = 'CIM_BIOSElement',
  CIM_Processor = 'CIM_Processor',
  CIM_PhysicalMemory = 'CIM_PhysicalMemory',
  CIM_MediaAccessDevice = 'CIM_MediaAccessDevice',
  CIM_PhysicalPackage = 'CIM_PhysicalPackage',
  CIM_WiFiEndpointSettings = 'CIM_WiFiEndpointSettings',
  CIM_BootService = 'CIM_BootService',
  CIM_BootConfigSetting = 'CIM_BootConfigSetting',
  CIM_PowerManagementService = 'CIM_PowerManagementService'
}
