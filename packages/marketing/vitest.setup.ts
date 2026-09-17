import { vi } from 'vitest'

// Prevent errors about importing server-only modules outside of a Server Component,
// mirroring the setup used by other packages/apps in this monorepo (e.g. apps/docs).
vi.mock('server-only', () => {
  return {}
})
