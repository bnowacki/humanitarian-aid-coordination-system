import { createBrowserClient } from '@supabase/ssr'

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/constants'
import { Database } from '@/types/database.types'

export const createClient = () => createBrowserClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!)
