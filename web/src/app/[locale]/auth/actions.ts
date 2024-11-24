'use server'

import { getLocale } from 'next-intl/server'
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

  const { error } = await supabase.auth.signUp({
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
  const locale = await getLocale()

  redirect({ href: '/auth/sign-in?message=Check email to continue sign in process', locale })
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

  redirect({ href: '/', locale })
}
