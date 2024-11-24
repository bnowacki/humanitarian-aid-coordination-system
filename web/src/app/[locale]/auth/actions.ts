'use server'

import { getLocale } from 'next-intl/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import { redirect } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'

import { SignInInput, SignUpInput, signInSchema, signUpSchema } from './schemas'

export const signUp = async (input: SignUpInput) => {
  const parsed = signUpSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.format() }
  }

  const origin = headers().get('origin')
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: input.fullName,
      },
    },
  })
  if (error) throw error

  return data
}

export const signIn = async (input: SignInInput) => {
  const parsed = signInSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.format() }
  }

  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    ...input,
  })

  if (error) throw error

  const locale = await getLocale()

  revalidatePath('/', 'layout')
  redirect({ href: '/', locale })
}
