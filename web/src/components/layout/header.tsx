'use client'

import React from 'react'

import { Container, HStack, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

import { useAuth } from '../auth-context'
import { Button } from '../ui/button'
import UserMenu from './user-menu'

export default function Header() {
  const t = useTranslations('header')

  const { profile } = useAuth()

  return (
    <Container fluid centerContent py={4} bg="green.subtle">
      <HStack w="full" maxW="breakpoint-xl" justifyContent="space-between">
        <Link href="/" passHref>
          <Text fontWeight="bold">Humanitarian Aid Coordination System</Text>
        </Link>
        {!profile ? (
          <HStack>
            <Link href="/auth/sign-in" passHref>
              <Button variant="outline">{t('sign-in')}</Button>
            </Link>
            <Link href="/auth/sign-up" passHref>
              <Button>{t('sign-up')}</Button>
            </Link>
          </HStack>
        ) : (
          <UserMenu />
        )}
      </HStack>
    </Container>
  )
}
