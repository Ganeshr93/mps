/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

export enum IPS_Methods {
  Setup = 'Setup'
}

export enum IPS_Actions {
  Setup = 'http://intel.com/wbem/wscim/1/ips-schema/1/IPS_HostBasedSetupService/Setup'
}

export enum IPS_Classes {
  IPS_OptInService = 'IPS_OptInService',
  IPS_HostBasedSetupService = 'IPS_HostBasedSetupService'
}
