'use client'

import React, { useCallback } from 'react'

import { IconLogout, IconShield } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '@/components/ui/menu'
import useLoadingState from '@/hooks/use-loading-state'
import { Link, useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

import { useAuth } from '../auth-context'

export default function UserMenu() {
  const t = useTranslations('header')

  const { profile } = useAuth()

  const router = useRouter()

  const [signOut, signingOut] = useLoadingState(
    useCallback(async () => {
      const { error } = await createClient().auth.signOut()
      if (error) throw error
      router.refresh()
    }, [router])
  )

  if (!profile) return null

  return (
    <MenuRoot positioning={{ placement: 'bottom-end' }}>
      <MenuTrigger asChild>
        <Button size="sm" variant="ghost">
          {profile.full_name}
        </Button>
      </MenuTrigger>
      <MenuContent>
        {profile.role === 'admin' && (
          <MenuItem value="admin-panel" asChild>
            <Link href="/admin" passHref>
              <IconShield /> {t('admin-panel')}
            </Link>
          </MenuItem>
        )}
        <MenuItem value="sign-out" onClick={signOut} disabled={signingOut}>
          <IconLogout /> {t('sign-out')}
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  )
}
