import { Heading, Stack } from '@chakra-ui/react'
import { getTranslations } from 'next-intl/server'

import AddEventDialog from '@/components/affected-event/add-event'
import EventTable from '@/components/affected-event/event-table'

export default async function Index() {
  const t = await getTranslations('home')

  return (
    <Stack flex={1} w="full" gap={20} textAlign="center">
      <Heading>{t('title')}</Heading>
      <EventTable />
    </Stack>
  )
}
