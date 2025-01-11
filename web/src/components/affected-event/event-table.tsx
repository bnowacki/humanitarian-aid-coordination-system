'use client'

import { useEffect, useState } from 'react'

import { Box, Heading, Spinner, Table } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

import CreateRequestDialog from '@/components/affected-event/create-request'
import UserRequestsDialog from '@/components/affected-event/display-user-request'
import { createClient } from '@/lib/supabase/client'

export default function EventTable() {
  const t = useTranslations('event')

  const [events, setEvents] = useState<any[]>([]) // Adjust to your event data structure
  const [loading, setLoading] = useState<boolean>(true)
  const [userId, setUserId] = useState<string | null>(null) // Track the current user ID

  // Fetch current user ID
  const fetchUserId = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUserId(user.id)
      }
    } catch (error) {
      console.error('Error fetching user ID:', error)
    }
  }

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('events').select('*')

      if (error) throw error
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserId()
    fetchEvents()
  }, [])

  const handleRequestCreated = async () => {
    console.log('Request created. Optionally refresh data here.')
  }

  return (
    <div>
      <Heading>{t('table-of-events')}</Heading>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100px">
          <Spinner size="lg" />
        </Box>
      ) : (
        <Table.Root size="lg">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>{t('title')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('location')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('status')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('description')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('actions')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('requests')}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {events.map(event => (
              <Table.Row key={event.id}>
                <Table.Cell>{event.title}</Table.Cell>
                <Table.Cell>{event.location}</Table.Cell>
                <Table.Cell>{event.status}</Table.Cell>
                <Table.Cell>{event.description}</Table.Cell>
                <Table.Cell>
                  {userId && (
                    <CreateRequestDialog
                      userId={userId}
                      eventId={event.id}
                      onRequestCreated={handleRequestCreated}
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  {userId && <UserRequestsDialog userId={userId} eventId={event.id} />}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </div>
  )
}
