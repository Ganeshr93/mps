/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { CIM_ManagedElement, CIM_SettingData, CIM_EthernetPort, CIM_BootSettingData, CIM_Credential } from './cim_models'

export interface amtAuthenticateObject {
  Nonce?: number[]
  UUID?: string[]
  FQDN?: string
  FWVersion?: string
  AMTSVN?: number
  SignatureMechanism?: number
  Signature?: number[]
  LengthOfCertificates?: number[]
  Certificates?: number[]
}

export interface AMT_GeneralSettings extends CIM_SettingData<AMT_GeneralSettings> {
  NetworkInterfaceEnabled?: boolean
  DigestRealm?: string
  IdleWakeTimeout?: number
  HostName?: string
  DomainName?: string
  PingResponseEnabled?: boolean
  WsmanOnlyMode?: boolean
  PreferredAddressFamily?: number
  DHCPv6ConfigurationTimeout?: number
  DDNSUpdateByDHCPServerEnabled?: boolean
  SharedFQDN?: boolean
  HostOSFQDN?: string
  DDNSTTL?: number
  AMTNetworkEnabled?: number
  RmcpPingResponseEnabled?: boolean
  DDNSPeriodicUpdateInterval?: number
  PresenceNotificationInterval?: number
  PrivacyLevel?: number
  PowerSource?: number
  ThunderboltDockEnabled?: number
  amtAuthenticate?: (mcNonce: number[]) => amtAuthenticateObject
}

export interface AMT_EthernetPortSettings extends CIM_SettingData<AMT_EthernetPortSettings> {
  SharedMAC?: boolean
  MACAddress?: string
  LinkIsUp?: boolean
  LinkPolicy?: number[]
  LinkPreference?: number
  LinkControl?: number
  SharedStaticIp?: boolean
  SharedDynamicIP?: boolean
  IpSyncEnabled?: boolean
  DHCPEnabled?: boolean
  IPAddress?: string
  SubnetMask?: string
  DefaultGateway?: string
  PrimaryDNS?: string
  SecondaryDNS?: string
  ConsoleTcpMaxRetransmissions?: number
  WLANLinkProtectionLevel?: number
  PhysicalConnectionType?: number
  PhysicalNicMedium?: number
  setLinkPreferences?: (linkPreference: number, timeout: number) => number
  cancelLinkProtection?: () => number
  restoreLinkProtection?: () => number
}

export interface MPServer {
  AccessInfo?: string
  InfoFormat?: number
  Port?: number
  AuthMethod?: number
  Certificate?: AMT_PublicKeyCertificate
  Username?: string
  Password?: string
  CommonName?: string
}

export interface RemoteAccessPolicyRule {
  Trigger?: number
  TunnelLifeTime?: number
  ExtendedData?: string
}

export interface AMT_EnvironmentDetectionSettingData extends CIM_SettingData<AMT_EnvironmentDetectionSettingData> {
  DetectionAlgorithm?: number
  DetectionStrings?: string[]
  DetectionIPv6LocalPrefixes?: string[]
  setSystemDefensePolicy?: (policy: AMT_SystemDefencePolicy) => number
  enableVpnRouting?: (enable: boolean) => number
}

export interface AMT_SystemDefencePolicy extends CIM_ManagedElement<AMT_SystemDefencePolicy> {
  PolicyName?: string
  PolicyPrecedence?: number
  AntiSpoofingSupport?: number
  FilterCreationHandles?: number[]
  TxDefaultDrop?: boolean
  TxDefaultMatchEvent?: boolean
  TxDefaultCount?: boolean
  RxDefaultDrop?: boolean
  RxDefaultMatchEvent?: boolean
  RxDefaultCount?: boolean
  getTimeout?: () => number
  setTimeout?: (number) => number
  updateStatistics?: (networkInterface: CIM_EthernetPort, resetOnRead: boolean) => number
}

export interface AMT_BootSettingData extends CIM_BootSettingData<AMT_BootSettingData> {
  UseSOL?: boolean
  UseSafeMode?: boolean
  ReflashBIOS?: boolean
  BIOSSetup?: boolean
  BIOSPause?: boolean
  LockPowerButton?: boolean
  LockResetButton?: boolean
  LockKeyboard?: boolean
  LockSleepButton?: boolean
  UserPasswordBypass?: boolean
  ForcedProgressEvents?: boolean
  FirmwareVerbosity?: number
  ConfigurationDataReset?: boolean
  IDERBootDevice?: number
  UseIDER?: boolean
  EnforceSecureBoot?: boolean
  BootMediaIndex?: number
  SecureErase?: boolean
  RSEPassword?: string
  OptionsCleared?: boolean
  WinREBootEnabled?: boolean
  UEFILocalPBABootEnabled?: boolean
  UEFIHTTPSBootEnabled?: boolean
  SecureBootControlEnabled?: boolean
  BootguardStatus?: boolean
  BIOSLastStatus?: number[]
  UEFIBootParametersArray?: number[]
  UEFIBootNumberOfParams?: number[]
}

export interface AMT_PublicKeyCertificate extends CIM_Credential<AMT_PublicKeyCertificate> {
  X509Certificate?: any
  TrustedRootCertificate?: boolean
  Issuer?: string
  Subject?: string
}
