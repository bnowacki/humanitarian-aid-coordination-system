import React from 'react'

import { HStack } from '@chakra-ui/react'

import { redirect } from '@/i18n/navigation'
import { Locale } from '@/i18n/types'
import { createClient } from '@/lib/supabase/server'

export default async function AuthLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) return redirect({ href: '/', locale })

  return (
    <HStack align="center" justify="center" flex={1}>
      {children}
    </HStack>
  )
}
