import React from 'react'

import { Container, HStack, Text } from '@chakra-ui/react'

import LocaleSwitch from '../locale-switch'

export default function Footer() {
  return (
    <Container fluid centerContent py={4} bg="bg.muted">
      <HStack w="full" maxW="breakpoint-xl" justifyContent="space-between">
        <Text>Humanitarian Aid Coordination System</Text>
        <LocaleSwitch />
      </HStack>
    </Container>
  )
}
