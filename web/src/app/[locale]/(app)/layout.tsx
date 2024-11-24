import React, { ReactNode } from 'react'

import { Box, Container } from '@chakra-ui/react'

import { getUser } from '@/lib/supabase/server'

export default async function layout({ children }: { children: ReactNode }) {
  // redirects if user is not logged in
  await getUser()

  return (
    <Container centerContent maxW="xl" m="auto">
      <Box p={4} flex={1}>
        {children}
      </Box>
    </Container>
  )
}
