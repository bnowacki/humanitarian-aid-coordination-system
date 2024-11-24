'use client'

import { useCallback } from 'react'

import { useTranslations } from 'next-intl'
import { MdLogout } from 'react-icons/md'

import useLoadingState from '@/hooks/use-loading-state'
import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

import { Button } from './ui/button'

export default function SignOutButton() {
  const t = useTranslations('auth')

  const router = useRouter()

  const [signOut, loading] = useLoadingState(
    useCallback(async () => {
      const { error } = await createClient().auth.signOut()
      if (error) throw error
      router.refresh()
    }, [router])
  )

  return (
    <Button onClick={signOut} loading={loading} variant="outline">
      {t('sign-out')} <MdLogout />
    </Button>
  )
}
