import { describe, expect, test } from 'vitest'

import { HubSpotClient } from './hubspot'

const VALID_PORTAL_ID = '12345678'
const VALID_FORM_GUID = 'a1b2c3d4-e5f6-4789-a123-1234567890ab'

describe('HubSpotClient', () => {
  test('constructs successfully with valid portalId and formGuid', () => {
    expect(
      () => new HubSpotClient({ portalId: VALID_PORTAL_ID, formGuid: VALID_FORM_GUID })
    ).not.toThrow()
  })

  test('throws when portalId is missing', () => {
    expect(() => new HubSpotClient({ portalId: '', formGuid: VALID_FORM_GUID })).toThrow(
      'portalId is required'
    )
  })

  test('throws when formGuid is missing', () => {
    expect(() => new HubSpotClient({ portalId: VALID_PORTAL_ID, formGuid: '' })).toThrow(
      'formGuid is required'
    )
  })

  test('throws when portalId contains non-numeric characters', () => {
    expect(
      () =>
        new HubSpotClient({
          portalId: '123/../internal',
          formGuid: VALID_FORM_GUID,
        })
    ).toThrow('portalId is invalid')
  })

  test('throws when formGuid is not a valid UUID', () => {
    expect(
      () =>
        new HubSpotClient({
          portalId: VALID_PORTAL_ID,
          formGuid: '../../attacker-controlled',
        })
    ).toThrow('formGuid is invalid')
  })
})
