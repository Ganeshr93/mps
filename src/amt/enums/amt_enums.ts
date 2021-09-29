/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum AMT_Methods {
  READ_RECORDS = 'ReadRecords',
  ADD_TRUSTED_ROOT_CERTIFICATE = 'AddTrustedRootCertificate',
  ADD_MPS = 'AddMpServer',
  ADD_REMOTE_ACCESS_POLICY_RULE = 'AddRemoteAccessPolicyRule',
  REQUEST_STATE_CHANGE = 'RequestStateChange'
}

export enum AMT_Actions {
  READ_RECORDS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_AuditLog/ReadRecords',
  ADD_TRUSTED_ROOT_CERTIFICATE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_PublicKeyManagementService/AddTrustedRootCertificate',
  ADD_MPS = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddMpServer',
  ADD_REMOTE_ACCESS_POLICY_RULE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_RemoteAccessService/AddRemoteAccessPolicyRule',
  REQUEST_STATE_CHANGE = 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService/RequestStateChange'
}

export enum AMT_Classes {
  AMT_AUDIT_LOG = 'AMT_AuditLog',
  AMT_REDIRECTION_SERVICE = 'AMT_RedirectionService',
  AMT_SETUP_AND_CONFIGURATION_SERVICE = 'AMT_SetupAndConfigurationService',
  AMT_GENERAL_SETTINGS = 'AMT_GeneralSettings',
  AMT_ETHERNET_PORT_SETTINGS = 'AMT_EthernetPortSettings',
  AMT_REMOTE_ACCESS_POLICY_RULE = 'AMT_RemoteAccessPolicyRule',
  AMT_MANAGEMENT_PRESENCE_REMOTE_SAP = 'AMT_ManagementPresenceRemoteSAP',
  AMT_PUBLIC_KEY_CERTIFICATE = 'AMT_PublicKeyCertificate',
  AMT_ENVIRONMENT_DETECTION_SETTING_DATA = 'AMT_EnvironmentDetectionSettingData',
  AMT_PUBLIC_KEY_MANAGEMENT_SERVICE = 'AMT_PublicKeyManagementService',
  AMT_REMOTE_ACCESS_SERVICE = 'AMT_RemoteAccessService',
  AMT_USER_INITIATED_CONNECTION_SERVICE = 'AMT_UserInitiatedConnectionService',
  AMT_BOOT_SETTING_DATA = 'AMT_BootSettingData'
}

type RecordMap = Record<number, string>
export const SystemSensorType: RecordMap = {
  15: 'System Firmware Status',
  6: 'Authentication failed x times. The system may be under attack.',
  30: 'No bootable media',
  32: 'Operating system lockup or power interrupt',
  35: 'System boot failure',
  37: 'System firmware started (at least one CPU is properly executing).'
}
export const FirmwareProgress: RecordMap = {
  0: 'Unspecified.',
  1: 'Memory initialization.',
  2: 'Starting hard-disk initialization and test',
  3: 'Secondary processor(s) initialization',
  4: 'User authentication',
  5: 'User-initiated system setup',
  6: 'USB resource configuration',
  7: 'PCI resource configuration',
  8: 'Option ROM initialization',
  9: 'Video initialization',
  10: 'Cache initialization',
  11: 'SM Bus initialization',
  12: 'Keyboard controller initialization',
  13: 'Embedded controller/management controller initialization',
  14: 'Docking station attachment',
  15: 'Enabling docking station',
  16: 'Docking station ejection',
  17: 'Disabling docking station',
  18: 'Calling operating system wake-up vector',
  19: 'Starting operating system boot process',
  20: 'Baseboard or motherboard initialization',
  21: 'reserved',
  22: 'Floppy initialization',
  23: 'Keyboard test',
  24: 'Pointing device test',
  25: 'Primary processor initialization'
}
export const FirmwareError: RecordMap = {
  0: 'Unspecified.',
  1: 'No system memory is physically installed in the system.',
  2: 'No usable system memory, all installed memory has experienced an unrecoverable failure.',
  3: 'Unrecoverable hard-disk/ATAPI/IDE device failure.',
  4: 'Unrecoverable system-board failure.',
  5: 'Unrecoverable diskette subsystem failure.',
  6: 'Unrecoverable hard-disk controller failure.',
  7: 'Unrecoverable PS/2 or USB keyboard failure.',
  8: 'Removable boot media not found.',
  9: 'Unrecoverable video controller failure.',
  10: 'No video device detected.',
  11: 'Firmware (BIOS) ROM corruption detected.',
  12: 'CPU voltage mismatch (processors that share same supply have mismatched voltage requirements)',
  13: 'CPU speed matching failure'
}
export const WatchDogStates: RecordMap = {
  1: 'Not Started',
  2: 'Stopped',
  4: 'Running',
  8: 'Expired',
  16: 'Suspended'
}
