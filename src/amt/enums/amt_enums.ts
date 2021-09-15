/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum AMT_Methods {
  ReadRecords = 'ReadRecords',
  AddTrustedRootCertificate = 'AddTrustedRootCertificate',
  AddMpServer = 'AddMpServer',
  AddRemoteAccessPolicyRule = 'AddRemoteAccessPolicyRule',
  RequestStateChange = 'RequestStateChange',
  SetMEBxPassword = 'SetMEBxPassword',
  AMT_BootSettingData = 'AMT_BootSettingData',
  Unprovision = 'Unprovision'
}

export enum AMT_Actions {
  ReadRecords = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords',
  AddTrustedRootCertificate = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddTrustedRootCertificate',
  AddMpServer = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddMpServer',
  AddRemoteAccessPolicyRule = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddRemoteAccessPolicyRule',
  RequestStateChange = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService/RequestStateChange',
  SetMEBxPassword = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/SetMEBxPassword',
  AMT_BootSettingData = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_BootSettingData',
  Unprovision = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService/Unprovision'
}

export enum AMT_Classes {
  AMT_AuditLog = 'AMT_AuditLog',
  AMT_RedirectionService = 'AMT_RedirectionService',
  AMT_SetupAndConfigurationService = 'AMT_SetupAndConfigurationService',
  AMT_GeneralSettings = 'AMT_GeneralSettings',
  AMT_EthernetPortSettings = 'AMT_EthernetPortSettings',
  AMT_RemoteAccessPolicyRule = 'AMT_RemoteAccessPolicyRule',
  AMT_ManagementPresenceRemoteSAP = 'AMT_ManagementPresenceRemoteSAP',
  AMT_PublicKeyCertificate = 'AMT_PublicKeyCertificate',
  AMT_EnvironmentDetectionSettingData = 'AMT_EnvironmentDetectionSettingData',
  AMT_PublicKeyManagementService = 'AMT_PublicKeyManagementService',
  AMT_RemoteAccessService = 'AMT_RemoteAccessService',
  AMT_UserInitiatedConnectionService = 'AMT_UserInitiatedConnectionService',
  AMT_BootSettingData = 'AMT_BootSettingData'
}
