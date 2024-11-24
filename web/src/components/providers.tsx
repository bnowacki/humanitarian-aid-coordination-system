'use client'

import { ReactNode } from 'react'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

import { AuthContextProvider } from './auth-context'
import { ColorModeProvider } from './ui/color-mode'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider defaultTheme="light">
        <AuthContextProvider>{children}</AuthContextProvider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}
