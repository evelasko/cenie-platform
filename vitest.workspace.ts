import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/errors',
  'packages/logger',
  // Add other packages as needed
  // 'packages/ui',
  // 'packages/firebase',
  // 'packages/supabase',
  // 'packages/auth-client',
])

