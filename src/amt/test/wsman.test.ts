/*********************************************************************
* Copyright (c) Intel Corporation 2021
* SPDX-License-Identifier: Apache-2.0
**********************************************************************/

import { AMT_Classes, AMT_Methods } from '../enums/amt_enums'
import { CIM_Actions, CIM_Classes, CIM_Methods } from '../enums/cim_enums'
import { Selector, WSManBodyObject, WSManCallParameters, WSManErrors, WSManHeaderObject, WSManMessageCreator } from '../wsman'

const wsmanMessageCreator = new WSManMessageCreator()
describe('WSManMessageCreator Tests', () => {
  const messageId = '1'
  const selector: Selector = { name: 'InstanceID', value: 'Intel(r) AMT Device 0' }
  const resourceUri = 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chassis'
  describe('createWsman Tests', () => {
    it('should create a valid Get call', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</a:Action><a:To>/wsman</a:To><w:ResourceURI>${resourceUri}</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body /></Envelope>`
      const headerObject: WSManHeaderObject = {
        action: CIM_Actions.Get,
        messageId: messageId,
        resourceUri: resourceUri
      }
      const bodyObject: WSManBodyObject = {
        method: CIM_Methods.Get
      }
      const wsmanCallParameters: WSManCallParameters = {
        headerObject: headerObject,
        bodyObject: bodyObject
      }
      const response = wsmanMessageCreator.createWsman(CIM_Methods.Get, wsmanCallParameters)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid Enumerate call', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>${resourceUri}</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>`
      const headerObject: WSManHeaderObject = {
        action: CIM_Actions.Enumerate,
        messageId: messageId,
        resourceUri: resourceUri
      }
      const bodyObject: WSManBodyObject = {
        method: CIM_Methods.Enumerate
      }
      const wsmanCallParameters: WSManCallParameters = {
        headerObject: headerObject,
        bodyObject: bodyObject
      }
      const response = wsmanMessageCreator.createWsman(CIM_Methods.Enumerate, wsmanCallParameters)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid Pull call', () => {
      const enumerationContext = 'AC070000-0000-0000-0000-000000000000'
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>${resourceUri}</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>${enumerationContext}</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>`
      const headerObject: WSManHeaderObject = {
        action: CIM_Actions.Pull,
        messageId: messageId,
        resourceUri: resourceUri
      }
      const bodyObject: WSManBodyObject = {
        method: CIM_Methods.Pull,
        resourceUri: resourceUri,
        enumerationContext: enumerationContext
      }
      const wsmanCallParameters: WSManCallParameters = {
        headerObject: headerObject,
        bodyObject: bodyObject
      }
      const response = wsmanMessageCreator.createWsman(CIM_Methods.Pull, wsmanCallParameters)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid Delete call', () => {
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete</a:Action><a:To>/wsman</a:To><w:ResourceURI>${resourceUri}</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout><w:SelectorSet><w:Selector Name="PolicyRuleName">User Initiated</w:Selector></w:SelectorSet></Header><Body /></Envelope>`
      const selector: Selector = {
        name: 'PolicyRuleName',
        value: 'User Initiated'
      }
      const headerObject: WSManHeaderObject = {
        action: CIM_Actions.Delete,
        messageId: messageId,
        resourceUri: resourceUri,
        selector: selector
      }
      const bodyObject: WSManBodyObject = {
        method: CIM_Methods.Delete,
        resourceUri: resourceUri
      }
      const wsmanCallParameters: WSManCallParameters = {
        headerObject: headerObject,
        bodyObject: bodyObject
      }
      const response = wsmanMessageCreator.createWsman(CIM_Methods.Delete, wsmanCallParameters)
      expect(response).toEqual(correctResponse)
    })
    it('should create a valid Put call', () => {
      const selector: Selector = {
        name: 'InstanceID',
        value: 'CIM_Chassis'
      }
      const correctResponse = `<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Put</a:Action><a:To>/wsman</a:To><w:ResourceURI>${resourceUri}</w:ResourceURI><a:MessageID>${messageId}</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">CIM_Chassis</w:Selector></w:SelectorSet></Header><Body><r:CIM_Chassis xmlns:r="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_Chassis"><r:ChassisPackageType>1</r:ChassisPackageType></r:CIM_Chassis></Body></Envelope>`
      const headerObject: WSManHeaderObject = {
        action: CIM_Actions.Put,
        messageId: messageId,
        resourceUri: resourceUri,
        selector: selector
      }
      const bodyObject: WSManBodyObject = {
        method: CIM_Methods.Put,
        class: CIM_Classes.CIM_Chassis,
        resourceUri: resourceUri,
        inputs: [{ key: 'ChassisPackageType', value: 1 }]
      }
      const wsmanCallParameters: WSManCallParameters = {
        headerObject: headerObject,
        bodyObject: bodyObject
      }
      const response = wsmanMessageCreator.createWsman(CIM_Methods.Put, wsmanCallParameters)
      expect(response).toEqual(correctResponse)
    })
  })
  describe('createXml Tests', () => {
    it('creates an enumerate wsman string when provided a header and body to createXml', () => {
      let header = wsmanMessageCreator.createHeader({ action: CIM_Actions.Enumerate, resourceUri: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId: messageId })
      let body = wsmanMessageCreator.createBody(CIM_Methods.Enumerate, { method: CIM_Methods.Enumerate })
      let response = wsmanMessageCreator.createXml(header, body)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('creates a pull wsman string when provided a header and body to createXml', () => {
      let header = wsmanMessageCreator.createHeader({ action: CIM_Actions.Pull, resourceUri: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId: messageId })
      let body = wsmanMessageCreator.createBody(CIM_Methods.Pull, { method: CIM_Methods.Pull, enumerationContext: 'A4070000-0000-0000-0000-000000000000' })
      let response = wsmanMessageCreator.createXml(header, body)
      const correctResponse = '<?xml version="1.0" encoding="utf-8"?><Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:w="http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd" xmlns="http://www.w3.org/2003/05/soap-envelope"><Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Pull</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header><Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>A4070000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body></Envelope>'
      expect(response).toEqual(correctResponse)
    })
    it('should throw error if header is null/undefined in createXml', () => {
      let header = null
      let body = wsmanMessageCreator.createBody(CIM_Methods.Enumerate, { method: CIM_Methods.Enumerate })
      expect(() => { wsmanMessageCreator.createXml(header, body) }).toThrow(WSManErrors.HEADER)
    })
    it('should throw error if body is null/undefined in createXml', () => {
      let header = wsmanMessageCreator.createHeader({ action: CIM_Actions.Pull, resourceUri: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId: messageId })
      let body = null
      expect(() => { wsmanMessageCreator.createXml(header, body) }).toThrow(WSManErrors.BODY)
    })
  })
  describe('createHeader Tests', () => {
    it('creates a correct header with action, resourceUri, and messageId provided for createHeader', () => {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header>'
      let header = wsmanMessageCreator.createHeader({ action: CIM_Actions.Enumerate, resourceUri: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId: messageId })
      expect(header).toEqual(correctHeader)
    })
    it('should throw error if missing action in createHeader', () => {
      expect(() => { wsmanMessageCreator.createHeader({ action: null, resourceUri: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId: messageId }) }).toThrow(WSManErrors.ACTION)
    })
    it('should throw error if missing resourceUri in createHeader', () => {
      expect(() => { wsmanMessageCreator.createHeader({ action: CIM_Actions.Enumerate, resourceUri: null, messageId: messageId }) }).toThrow(WSManErrors.RESOURCE_URI)
    })
    it('should throw error if missing messageId in createHeader', () => {
      expect(() => { wsmanMessageCreator.createHeader({ action: CIM_Actions.Enumerate, resourceUri: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId: null }) }).toThrow(WSManErrors.MESSAGE_ID)
    })
    it('applies custom address correctly in createHeader', () => {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>customAddress</a:Address></a:ReplyTo><w:OperationTimeout>PT60S</w:OperationTimeout></Header>'
      let header = wsmanMessageCreator.createHeader({ action: CIM_Actions.Enumerate, resourceUri: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId: messageId, address: 'customAddress' })
      expect(header).toEqual(correctHeader)
    })
    it('applies custom timeout correctly in createHeader', () => {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT30S</w:OperationTimeout></Header>'
      let header = wsmanMessageCreator.createHeader({ action: CIM_Actions.Enumerate, resourceUri: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId: messageId, address: null, timeout: 'PT30S' })
      expect(header).toEqual(correctHeader)
    })
    it('applies custom selector correctly in createHeader', () => {
      const correctHeader = '<Header><a:Action>http://schemas.xmlsoap.org/ws/2004/09/enumeration/Enumerate</a:Action><a:To>/wsman</a:To><w:ResourceURI>http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement</w:ResourceURI><a:MessageID>1</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><w:OperationTimeout>PT30S</w:OperationTimeout><w:SelectorSet><w:Selector Name="InstanceID">Intel(r) AMT Device 0</w:Selector></w:SelectorSet></Header>'
      let header = wsmanMessageCreator.createHeader({ action: CIM_Actions.Enumerate, resourceUri: 'http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ServiceAvailableToElement', messageId: messageId, address: null, timeout: 'PT30S', selector: selector })
      expect(header).toEqual(correctHeader)
    })
  })
  describe('createBody Tests', () => {
    it('creates correct Pull body for createBody', () => {
      const correctBody = '<Body><Pull xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration"><EnumerationContext>A4070000-0000-0000-0000-000000000000</EnumerationContext><MaxElements>999</MaxElements><MaxCharacters>99999</MaxCharacters></Pull></Body>'
      let body = wsmanMessageCreator.createBody(CIM_Methods.Pull, { method: CIM_Methods.Pull, enumerationContext: 'A4070000-0000-0000-0000-000000000000' })
      expect(body).toEqual(correctBody)
    })
    it('creates correct Enumerate body for createBody', () => {
      const correctBody = '<Body><Enumerate xmlns="http://schemas.xmlsoap.org/ws/2004/09/enumeration" /></Body>'
      let body = wsmanMessageCreator.createBody(CIM_Methods.Enumerate, { method: CIM_Methods.Enumerate })
      expect(body).toEqual(correctBody)
    })
    it('creates correct Get body for createBody', () => {
      const correctBody = '<Body />'
      let body = wsmanMessageCreator.createBody(CIM_Methods.Get, { method: CIM_Methods.Get })
      expect(body).toEqual(correctBody)
    })
    it('creates correct Delete body for createBody', () => {
      const correctBody = '<Body />'
      let body = wsmanMessageCreator.createBody(CIM_Methods.Delete, { method: CIM_Methods.Delete })
      expect(body).toEqual(correctBody)
    })
    it('should throw error if Pull is missing enumerationContext in createBody', () => {
      expect(() => { wsmanMessageCreator.createBody(CIM_Methods.Pull, { method: CIM_Methods.Pull }) }).toThrow(WSManErrors.ENUMERATION_CONTEXT)
    })
    it('should create a correct Put body for createBody', () => {
      const bodyObject: WSManBodyObject = {
        method: `${AMT_Methods.SetMEBxPassword}_INPUT`,
        class: AMT_Classes.AMT_SetupAndConfigurationService,
        resourceUri: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_SetupAndConfigurationService',
        inputs: [{ key: 'Password', value: 'P@ssw0rd' }]
      }
      const correctBody = `<Body><r:${bodyObject.method} xmlns:r="${bodyObject.resourceUri}"><r:${bodyObject.inputs[0].key}>${bodyObject.inputs[0].value}</r:${bodyObject.inputs[0].key}></r:${bodyObject.method}></Body>`
      const body = wsmanMessageCreator.createBody(CIM_Methods.Put, bodyObject)
      expect(body).toEqual(correctBody)
    })
    it('should return empty body if parameters is missing or empty', () => {
      const bodyObject: WSManBodyObject = {
        method: CIM_Methods.Put,
        class: AMT_Classes.AMT_UserInitiatedConnectionService,
        resourceUri: 'http://intel.com/wbem/wscim/1/amt-schema/1/AMT_UserInitiatedConnectionService'
      }
      const correctBody = '</Body>'
      const body = wsmanMessageCreator.createBody(CIM_Methods.Put, bodyObject)
      expect(body).toEqual(correctBody)
    })
  })
})
