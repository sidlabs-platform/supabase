import { ThirdPartyAuthIntegration } from '@/data/third-party-auth/integrations-query'
import { BASE_PATH } from '@/lib/constants'

export const INTEGRATION_TYPES = [
  'firebase',
  'auth0',
  'awsCognito',
  'clerk',
  'workos',
  'custom',
] as const
export type INTEGRATION_TYPES = (typeof INTEGRATION_TYPES)[number]

export const getIntegrationType = (integration?: ThirdPartyAuthIntegration): INTEGRATION_TYPES => {
  if (integration?.type === 'workos') {
    return 'workos'
  }

  const issuerUrl = (() => {
    try {
      return integration?.oidc_issuer_url ? new URL(integration.oidc_issuer_url) : undefined
    } catch {
      return undefined
    }
  })()

  // TODO(hf): Move these to check type as well.
  if (issuerUrl?.protocol === 'https:' && issuerUrl.hostname === 'securetoken.google.com') {
    return 'firebase'
  }

  if (
    issuerUrl?.protocol === 'https:' &&
    (issuerUrl.hostname === 'amazonaws.com' || issuerUrl.hostname.endsWith('.amazonaws.com'))
  ) {
    return 'awsCognito'
  }

  if (
    issuerUrl?.protocol === 'https:' &&
    (issuerUrl.hostname === 'auth0.com' || issuerUrl.hostname.endsWith('.auth0.com'))
  ) {
    return 'auth0'
  }

  if (
    (issuerUrl?.hostname.endsWith('.clerk.accounts.dev') ?? false) ||
    (issuerUrl?.protocol === 'https:' && issuerUrl.hostname.startsWith('clerk.'))
  ) {
    return 'clerk'
  }

  return 'custom'
}

export const getIntegrationTypeLabel = (type: INTEGRATION_TYPES) => {
  switch (type) {
    case 'firebase':
      return 'Firebase'
    case 'auth0':
      return 'Auth0'
    case 'awsCognito':
      return 'Amazon Cognito'
    case 'clerk':
      return 'Clerk'
    case 'workos':
      return 'WorkOS'
    case 'custom':
    default:
      return 'Custom'
  }
}

export const getIntegrationTypeIcon = (type: INTEGRATION_TYPES) => {
  switch (type) {
    case 'firebase':
      return `${BASE_PATH}/img/icons/firebase-icon.svg`
    case 'auth0':
      return `${BASE_PATH}/img/icons/auth0-icon.svg`
    case 'awsCognito':
      return `${BASE_PATH}/img/icons/cognito-icon.svg`
    case 'clerk':
      return `${BASE_PATH}/img/icons/clerk-icon.svg`
    case 'workos':
      return `${BASE_PATH}/img/icons/workos-icon.svg`

    case 'custom':
    default:
      return `${BASE_PATH}/img/icons/cognito-icon.svg`
  }
}
