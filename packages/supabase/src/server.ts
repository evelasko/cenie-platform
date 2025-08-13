import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import type { Database } from './types/database'

export function createNextServerClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookies()).getAll()
        },
      },
    }
  )
}