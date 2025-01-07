'use client'

import { useEffect, useState } from 'react'

import { Box, Button, Heading, Spinner, Table } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

import AllUserRequestsDialog from '@/components/affected-event/requests-for-event'
import { createClient } from '@/lib/supabase/client'

import EditEventDialog from './edit-event'

export default function EventManager() {
  const t = useTranslations('event')

  const [events, setEvents] = useState<any[]>([]) // Adjust to your event data structure
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null) // Track selected event ID for editing
  const [selectedRequestsEventId, setSelectedRequestsEventId] = useState<string | null>(null) // Track selected event ID for requests dialog

  // Fetch events from the database
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

  // Call fetchEvents when the component mounts
  useEffect(() => {
    fetchEvents()
  }, [])

  const handleEventUpdated = async () => {
    await fetchEvents() // Refresh events after update
  }

  const openRequestsDialog = (eventId: string) => {
    setSelectedRequestsEventId(eventId)
  }

  const closeRequestsDialog = () => {
    setSelectedRequestsEventId(null)
  }

  const closeEditDialog = () => {
    setSelectedEventId(null)
  }

  return (
    <Box overflowY="auto">
      <Heading>{t('table-of-events')}</Heading>
      {/* Render the AllUserRequestsDialog when selectedRequestsEventId is not null */}
      {selectedRequestsEventId && (
        <AllUserRequestsDialog
          eventId={selectedRequestsEventId}
          onClose={closeRequestsDialog} // Close the requests dialog
        />
      )}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEventId(event.id)} // Set the selected event ID for editing
                  >
                    {t('edit')}
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openRequestsDialog(event.id)} // Open the requests dialog for this event
                  >
                    {t('view-requests')}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
      {/* Render EditEventDialog if selectedEventId is not null */}
      {selectedEventId && (
        <EditEventDialog
          eventId={selectedEventId}
          onEventUpdated={handleEventUpdated} // Pass the update handler to refresh the events
          onClose={closeEditDialog}
        />
      )}
    </Box>
  )
}
