import { createServerClient } from '@supabase/ssr'
import { getLocale } from 'next-intl/server'
import { cookies } from 'next/headers'

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/constants'
import { redirect } from '@/i18n/navigation'
import { Database } from '@/types/database.types'

export const createClient = (key: string = SUPABASE_ANON_KEY!) => {
  const cookieStore = cookies()

  return createServerClient<Database>(SUPABASE_URL!, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export const getUser = async () => {
  const supabase = createClient()

  const locale = await getLocale()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: '/auth/sign-in', locale })
  }

  const { data: profile, error: profileError } = await supabase
    .from('user_profile')
    .select('*')
    .single()
  if (profileError) throw profileError

  if (!profile) {
    return redirect({ href: '/auth/sign-in', locale })
  }

  return { profile, user }
}
