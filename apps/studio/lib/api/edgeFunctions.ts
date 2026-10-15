const NIMBUS_PROD_PROJECTS_URL = process.env.NIMBUS_PROD_PROJECTS_URL

export const isValidEdgeFunctionURL = (url: string, isPlatform: boolean) => {
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return false
  }

  if (parsedUrl.username || parsedUrl.password) return false

  const isEdgeFunctionPath = /^\/functions\/v[0-9]{1}\/.*$/.test(parsedUrl.pathname)
  if (!isEdgeFunctionPath) return false

  if (NIMBUS_PROD_PROJECTS_URL !== undefined) {
    const apexDomain = NIMBUS_PROD_PROJECTS_URL.replace('https://*.', '').replace(/\./g, '\\.')
    const nimbusRegex = new RegExp('^[a-z]*\\.' + apexDomain + '$')
    return (
      parsedUrl.protocol === 'https:' && !parsedUrl.port && nimbusRegex.test(parsedUrl.hostname)
    )
  }

  if (!isPlatform) {
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') return false

    const localOrigins = new Set([
      'http://localhost:54321',
      'https://localhost:54321',
      'http://localhost:8000',
      'https://localhost:8000',
      'http://127.0.0.1:54321',
      'https://127.0.0.1:54321',
      'http://127.0.0.1:8000',
      'https://127.0.0.1:8000',
      'http://[::1]:54321',
      'https://[::1]:54321',
      'http://kong:8000',
      'https://kong:8000',
    ])
    if (localOrigins.has(parsedUrl.origin)) return true

    try {
      return parsedUrl.origin === new URL(process.env.SUPABASE_URL ?? '').origin
    } catch {
      return false
    }
  }

  return (
    parsedUrl.protocol === 'https:' &&
    !parsedUrl.port &&
    /^[a-z]{20}\.supabase\.(red|co)$/.test(parsedUrl.hostname)
  )
}
