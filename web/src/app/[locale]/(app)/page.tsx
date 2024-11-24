import { Heading, Stack } from '@chakra-ui/react'
import { getTranslations } from 'next-intl/server'

import SignOutButton from '@/components/sign-out-button'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { getUser } from '@/lib/supabase/server'

export default async function Index() {
  const t = await getTranslations('home')

  const { profile } = await getUser()

  return (
    <Stack flex={1} w="full" gap={20}>
      <Heading>{t('title')}</Heading>
      <Heading>{profile?.email}</Heading>
      <SignOutButton />
      {profile.role === 'admin' && (
        <Link href="/admin/users" passHref>
          <Button>Admin panel</Button>
        </Link>
      )}
    </Stack>
  )
}
