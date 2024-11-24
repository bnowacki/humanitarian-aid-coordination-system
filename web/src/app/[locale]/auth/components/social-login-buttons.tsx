'use client'

import React from 'react'

import { HStack, Icon } from '@chakra-ui/react'
import { Provider } from '@supabase/supabase-js'
import { useTranslations } from 'next-intl'
import { FcGoogle } from 'react-icons/fc'
import { SiLinkedin } from 'react-icons/si'

import { Button } from '@/components/ui/button'
import { toaster } from '@/components/ui/toaster'
import { createClient } from '@/lib/supabase/client'

import FormDivider from './divider'

export default function SocialLoginButtons({ disabled }: { disabled?: boolean }) {
  const t = useTranslations('auth')

  const supabase = createClient()
  const [providerLoading, setProviderLoading] = React.useState<Provider | null>(null)

  const handleProvider = React.useCallback(
    async (provider: Provider) => {
      setProviderLoading(provider)
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: window.location.origin + '/auth/callback',
          },
        })
        if (error) throw error
      } catch (e) {
        console.error(e)
        setProviderLoading(null)
        toaster.create({ title: 'Failed to sign in', type: 'error' })
      }
    },
    [supabase]
  )

  return (
    <>
      <FormDivider text={t('or-continue-with')} />
      <Button
        onClick={() => handleProvider('google')}
        disabled={disabled || !!providerLoading}
        w="full"
      >
        <HStack>
          <Icon h={4} w={4}>
            <FcGoogle />
          </Icon>
          <span>Google</span>
        </HStack>
      </Button>
      <Button
        onClick={() => handleProvider('linkedin_oidc')}
        disabled={disabled || !!providerLoading}
        w="full"
        colorPalette="cyan"
      >
        <HStack>
          <Icon h={4} w={4}>
            <SiLinkedin />
          </Icon>
          <span>LinkedIn</span>
        </HStack>
      </Button>
    </>
  )
}
