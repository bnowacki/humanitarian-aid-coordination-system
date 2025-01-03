import { Stack } from '@chakra-ui/react'

import AddEventDialog from '@/components/affected-event/add-event'
import EventManager from '@/components/affected-event/event-manager'
import { getUser } from '@/lib/supabase/server'

export default async function Page() {
  const { profile } = await getUser()

  return (
    <Stack w="full" overflow="auto">
      <h1>Welcome to the admin panel</h1>
      <h1>{profile.email}</h1>
      <h1>{profile.role}</h1>
      <AddEventDialog />
      <EventManager />
    </Stack>
  )
}
