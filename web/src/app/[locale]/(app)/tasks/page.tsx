'use client'

import { useEffect, useState } from 'react'

import { Box, Spinner, Text } from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

const TasksPage = () => {
  const searchParams = useSearchParams()
  const volunteerId = searchParams.get('volunteerId')

  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!volunteerId) return

    const fetchTasks = async () => {
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

  if (loading) return <Spinner size="lg" color="blue.500" />

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>
        Volunteer Tasks
      </Text>
      {tasks.length === 0 ? (
        <Text>No tasks assigned yet</Text>
      ) : (
        tasks.map(task => (
          <Box key={task.id} borderWidth="1px" borderRadius="md" p={4} mb={3}>
            <Text fontWeight="bold">{task.title}</Text>
            <Text>{task.description}</Text>
            <Text>Status: {task.status}</Text>
          </Box>
        ))
      )}
    </Box>
  )
}

export default TasksPage
