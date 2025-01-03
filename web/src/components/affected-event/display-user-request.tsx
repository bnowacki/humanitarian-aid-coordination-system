'use client'

import { useEffect, useState } from 'react'

import { Box, Button, Heading, Spinner, Table } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'

const UserRequestsDialog = ({ userId, eventId }: { userId: string; eventId: string }) => {
  const t = useTranslations('request')
  const [resourceRequests, setResourceRequests] = useState<any[]>([])
  const [helpRequests, setHelpRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch resource requests based on userId and eventId
  const fetchResourceRequests = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('resource_requests')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', eventId)

      if (error) throw error
      setResourceRequests(data)
    } catch (error) {
      console.error('Error fetching resource requests:', error)
    }
  }

  // Fetch help requests based on userId and eventId
  const fetchHelpRequests = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('help_requests')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', eventId)

      if (error) throw error
      setHelpRequests(data)
    } catch (error) {
      console.error('Error fetching help requests:', error)
    }
  }

  // Trigger both request fetchers when the dialog is opened
  const fetchRequests = async () => {
    setLoading(true)
    await Promise.all([fetchResourceRequests(), fetchHelpRequests()])
    setLoading(false)
  }

  return (
    <DialogRoot size="cover" placement="center" motionPreset="slide-in-bottom">
      <DialogTrigger asChild>
        <Button onClick={fetchRequests} colorScheme="blue" size="sm">
          {t('view-requests')}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('requests-for-event')}</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <DialogBody>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100px">
              <Spinner size="lg" />
            </Box>
          ) : (
            <>
              {/* Resource Requests Table */}
              {resourceRequests.length > 0 && (
                <Box mb={4}>
                  <Heading size="md">{t('resource-requests')}</Heading>
                  <Table.Root size="lg">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>{t('name')}</Table.ColumnHeader>
                        <Table.ColumnHeader>{t('description')}</Table.ColumnHeader>
                        <Table.ColumnHeader>{t('quantity')}</Table.ColumnHeader>
                        <Table.ColumnHeader>{t('status')}</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {resourceRequests.map(request => (
                        <Table.Row key={request.id}>
                          <Table.Cell>{request.name}</Table.Cell>
                          <Table.Cell>{request.description}</Table.Cell>
                          <Table.Cell>{request.quantity || t('n/a')}</Table.Cell>
                          <Table.Cell>{request.status}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Box>
              )}

              {/* Help Requests Table */}
              {helpRequests.length > 0 && (
                <Box mb={4}>
                  <Heading size="md">{t('help-requests')}</Heading>
                  <Table.Root size="lg">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>{t('name')}</Table.ColumnHeader>
                        <Table.ColumnHeader>{t('description')}</Table.ColumnHeader>
                        <Table.ColumnHeader>{t('status')}</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {helpRequests.map(request => (
                        <Table.Row key={request.id}>
                          <Table.Cell>{request.name}</Table.Cell>
                          <Table.Cell>{request.description}</Table.Cell>
                          <Table.Cell>{request.status}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Box>
              )}

              {/* If no requests found, show a message */}
              {resourceRequests.length === 0 && helpRequests.length === 0 && (
                <Box textAlign="center">{t('no-requests')}</Box>
              )}
            </>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}

export default UserRequestsDialog
