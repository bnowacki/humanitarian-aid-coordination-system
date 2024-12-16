import { useEffect, useState } from 'react'

import {
  Box,
  Button,
  HStack,
  Spinner,
  Table,
  TableCaption,
  TableCell,
  TableColumnHeader,
  TableRow,
} from '@chakra-ui/react'

import EditRequestDialog from '@/components/affected-event/editRequestDialog'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'

interface AllUserRequestsDialogProps {
  eventId: string
  onClose: () => void // Function to close the dialog
}

const AllUserRequestsDialog: React.FC<AllUserRequestsDialogProps> = ({ eventId, onClose }) => {
  const [helpRequests, setHelpRequests] = useState<any[]>([])
  const [resourceRequests, setResourceRequests] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null) // To manage the selected request for editing

  // Fetch requests for the event (both help and resource requests)
  const fetchRequests = async () => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Use Promise.all to fetch both requests concurrently
      const [helpRes, resourceRes] = await Promise.all([
        supabase.from('help_requests').select('*').eq('event_id', eventId),
        supabase.from('resource_requests').select('*').eq('event_id', eventId),
      ])

      if (helpRes.error || resourceRes.error) {
        throw new Error('Error fetching requests')
      }

      setHelpRequests(helpRes.data || [])
      setResourceRequests(resourceRes.data || [])
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (eventId) {
      fetchRequests() // Trigger the fetch when the eventId changes
    }
  }, [eventId])

  const handleEditRequest = (request: any) => {
    setSelectedRequest(request) // Set the selected request
  }

  return (
    <HStack wrap="wrap">
      <DialogRoot size="xl" placement="center" open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Management</DialogTitle>
            <DialogCloseTrigger onClick={onClose} />
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
                    <Table.Root size="sm">
                      <TableCaption>Resource Requests</TableCaption>
                      <Table.Header>
                        <TableRow>
                          <TableColumnHeader>Name</TableColumnHeader>
                          <TableColumnHeader>Description</TableColumnHeader>
                          <TableColumnHeader>Quantity</TableColumnHeader>
                          <TableColumnHeader>Status</TableColumnHeader>
                          <TableColumnHeader>Actions</TableColumnHeader> {/* Actions column */}
                        </TableRow>
                      </Table.Header>
                      <Table.Body>
                        {resourceRequests.map(request => (
                          <TableRow key={request.id}>
                            <TableCell>{request.name}</TableCell>
                            <TableCell>{request.description}</TableCell>
                            <TableCell>{request.quantity || 'N/A'}</TableCell>
                            <TableCell>{request.status}</TableCell>
                            <TableCell>
                              <Button onClick={() => handleEditRequest(request)}>Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Box>
                )}

                {/* Help Requests Table */}
                {helpRequests.length > 0 && (
                  <Box mb={4}>
                    <Table.Root size="sm">
                      <TableCaption>Help Requests</TableCaption>
                      <Table.Header>
                        <TableRow>
                          <TableColumnHeader>Name</TableColumnHeader>
                          <TableColumnHeader>Description</TableColumnHeader>
                          <TableColumnHeader>Status</TableColumnHeader>
                          <TableColumnHeader>Actions</TableColumnHeader> {/* Actions column */}
                        </TableRow>
                      </Table.Header>
                      <Table.Body>
                        {helpRequests.map(request => (
                          <TableRow key={request.id}>
                            <TableCell>{request.name}</TableCell>
                            <TableCell>{request.description}</TableCell>
                            <TableCell>{request.status}</TableCell>
                            <TableCell>
                              <Button onClick={() => handleEditRequest(request)}>Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Box>
                )}

                {/* If no requests found, show a message */}
                {resourceRequests.length === 0 && helpRequests.length === 0 && (
                  <Box textAlign="center">No requests found.</Box>
                )}
              </>
            )}
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      {/* Edit Request Dialog */}
      {selectedRequest && (
        <EditRequestDialog
          requestId={selectedRequest.id}
          onClose={() => setSelectedRequest(null)}
          onUpdate={() => fetchRequests()} // Refresh the data after editing
        />
      )}
    </HStack>
  )
}

export default AllUserRequestsDialog
