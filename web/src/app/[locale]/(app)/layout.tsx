import React, { ReactNode } from 'react'

import { Box, Container } from '@chakra-ui/react'

export default async function layout({ children }: { children: ReactNode }) {
  return (
    <Container centerContent maxW="xl" m="auto">
      <Box p={4} flex={1}>
        {children}
      </Box>
    </Container>
  )
}
