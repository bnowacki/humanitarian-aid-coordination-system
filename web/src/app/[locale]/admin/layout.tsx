import React from 'react'

import { Box, Flex } from '@chakra-ui/react'

import { AdminSidebar } from '@/components/layout/sidebar'
import { redirect } from '@/i18n/navigation'
import { Locale } from '@/i18n/types'
import { getUser } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  const { profile } = await getUser()

  if (profile.role !== 'admin') {
    redirect({ href: '/', locale })
  }

  return (
    <Flex w="full" gap={4}>
      <AdminSidebar />
      <Box p={4} flex={1}>
        {children}
      </Box>
    </Flex>
  )
}
