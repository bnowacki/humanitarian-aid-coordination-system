'use client'

import { useEffect, useState } from 'react'

import { createListCollection } from '@ark-ui/react'
import { Box, Spinner, Text } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const TasksPage = () => {
  const searchParams = useSearchParams()
  const volunteerId = searchParams.get('volunteerId')

  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  const allowedStatuses = ['pending', 'in_progress', 'completed']

  const statusCollection = createListCollection({
    items: allowedStatuses.map(status => ({ key: status, value: status })),
  })

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      if (!volunteerId) {
        console.error('Volunteer ID is null')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('volunteer_id', volunteerId)

      if (error) {
        console.error('Error fetching tasks:', error.message)
      } else {
        setTasks(data || [])
      }
      setLoading(false)
    }

    fetchTasks()
  }, [supabase, volunteerId])

  const handleCreateTaskClick = async () => {
    if (!volunteerId) {
      console.error('Volunteer ID is null')
      return
    }

    const { data, error } = await supabase
      .from('volunteers')
      .select('aid_organization_id')
      .eq('id', volunteerId)
      .single()

    if (error) {
      console.error('Error fetching organization ID:', error.message)
      return
    }

    const organizationId = data.aid_organization_id
    router.push(`/organizations/createTaskPage/?organization_id=${organizationId}`)
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId)

    if (error) {
      console.error('Error updating task status:', error.message)
    } else {
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === taskId ? { ...task, status: newStatus } : task))
      )
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <Box p={4}>
      <Button colorScheme="blue" onClick={handleCreateTaskClick}>
        Create Task
      </Button>
      <Text fontSize="2xl" mb={4}>
        Volunteer Tasks
      </Text>
      {tasks.length === 0 ? (
        <Text>No tasks found</Text>
      ) : (
        tasks.map(task => (
          <Box key={task.id} borderWidth="1px" borderRadius="md" p={4} mb={3}>
            <Text fontWeight="bold">{task.title}</Text>
            <Text>{task.description}</Text>
            <Text>
              Status:
              <select
                value={task.status}
                onChange={e => handleStatusChange(task.id, e.target.value)}
              >
                {allowedStatuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Text>
          </Box>
        ))
      )}
    </Box>
  )
}

export default TasksPage
