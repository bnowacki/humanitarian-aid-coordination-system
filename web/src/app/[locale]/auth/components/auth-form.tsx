'use client'

import React, { ReactNode, useMemo } from 'react'

import { Heading, Stack, Tabs } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { parseAsStringEnum, useQueryState } from 'nuqs'

import { usePathname } from '@/i18n/navigation'

import FormDivider from './divider'
import LinkButton from './link-button'
import SocialLoginButtons from './social-login-buttons'

enum AuthTab {
  link = 'link',
  password = 'password',
}

type Props = {
  title: string
  linkForm: ReactNode
  passwordForm: ReactNode
  disabled?: boolean
}

export default function AuthForm({ title, linkForm, passwordForm, disabled }: Props) {
  const t = useTranslations('auth')

  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringEnum<AuthTab>(Object.values(AuthTab)).withDefault(AuthTab.password)
  )
  const pathname = usePathname()
  const isSignUp = useMemo(() => pathname.includes('sign-up'), [pathname])

  return (
    <Stack flex={1} w="full" px={6} py={8} justify="center" gap={6} rounded="lg" maxW="md">
      <Heading textAlign="center">{title}</Heading>
      <Tabs.Root value={tab} onValueChange={e => setTab(e.value as AuthTab)} fitted variant="plain">
        <Tabs.List bg="bg.muted" rounded="l3" p="1">
          <Tabs.Trigger value="password">{t('password')}</Tabs.Trigger>
          <Tabs.Trigger value="link">{t('magic-link')}</Tabs.Trigger>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
        <Tabs.Content value="password" display="flex" flexDirection="column" gap={8}>
          {passwordForm}
        </Tabs.Content>
        <Tabs.Content value="link" display="flex" flexDirection="column" gap={8}>
          {linkForm}
        </Tabs.Content>
      </Tabs.Root>
      <Stack gap={4}>
        <FormDivider text={isSignUp ? t('already-have-an-account') : t('new-here')} />
        <LinkButton href={isSignUp ? '/auth/sign-in' : '/auth/sign-up'}>
          {isSignUp ? t('sign-in') : t('sign-up')}
        </LinkButton>
        <SocialLoginButtons disabled={disabled} />
      </Stack>
    </Stack>
  )
}
