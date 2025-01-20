'use client'

import { useEffect, useState } from 'react'

import { Box, Button, Input, Spinner, Text } from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'

import { useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'

const CreateTaskPage = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const organizationId = searchParams.get('organization_id')

  const [volunteers, setVolunteers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVolunteer, setSelectedVolunteer] = useState<string | null>(null)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('volunteers')
        .select(
          `
          id,
          user_id,
          users (
            full_name
          )
        `
        )
        .eq('aid_organization_id', organizationId || '')

      if (error) {
        console.error('Error fetching volunteers:', error.message)
      } else {
        const formattedVolunteers = data.map(volunteer => ({
          id: volunteer.id,
          name: (volunteer.users as any)?.full_name || 'Unknown',
        }))
        setVolunteers(formattedVolunteers)
      }
      setLoading(false)
    }

    fetchVolunteers()
  }, [supabase, organizationId])

  const handleCreateTask = async () => {
    if (!selectedVolunteer || !taskTitle || !taskDescription) {
      alert('All fields are required')
      console.log({ selectedVolunteer, taskTitle, taskDescription })
      return
    }

    const { error } = await supabase.from('tasks').insert({
      volunteer_id: selectedVolunteer,
      title: taskTitle,
      description: taskDescription,
      status: 'pending',
    })

    if (error) {
      console.error('Error creating task:', error.message)
      alert('Error creating task')
    } else {
      alert('Task created successfully')
      // Optionally, redirect or clear the form
      router.back()
    }
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>
        Create Task
      </Text>
      <select value={selectedVolunteer || ''} onChange={e => setSelectedVolunteer(e.target.value)}>
        <option key="none" value={null}>
          Select volunteer
        </option>
        {volunteers.map(volunteer => (
          <option key={volunteer.id} value={volunteer.id}>
            {volunteer.name} ({volunteer.email})
          </option>
        ))}
      </select>
      <Input
        placeholder="Task Title"
        value={taskTitle}
        onChange={e => setTaskTitle(e.target.value)}
        mb={4}
      />
      <Input
        placeholder="Task Description"
        value={taskDescription}
        onChange={e => setTaskDescription(e.target.value)}
        mb={4}
      />
      <Button colorScheme="blue" onClick={handleCreateTask}>
        Create Task
      </Button>
    </Box>
  )
}

export default CreateTaskPage
