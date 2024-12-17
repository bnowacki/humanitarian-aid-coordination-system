'use client'

import { useEffect, useState } from 'react'

import { Box, Spinner, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const OrganizationsPage = ({ userId }: { userId: string }) => {
  const [organizations, setOrganizations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selecting, setSelecting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Fetch all organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      const { data, error } = await supabase.from('organizations').select('*')
      if (error) {
        console.error('Error fetching organizations:', error.message)
      } else {
        setOrganizations(data || [])
      }
      setLoading(false)
    }

    fetchOrganizations()
  }, [supabase])

  // Handle "Choose" button

  const handleChooseOrganization = async (organizationId: string) => {
    const supabase = createClient()
    const user = await supabase.auth.getUser() // Get current user
    const userId = user.data?.user?.id

    if (!userId) {
      console.error('User is not authenticated.')
      return
    }

    try {
      // Check if volunteer already exists
      const { data: existingVolunteer, error: fetchError } = await supabase
        .from('volunteers')
        .select('id')
        .eq('user_id', userId)
        .eq('aid_organization_id', organizationId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      let volunteerId = existingVolunteer?.id

      if (!volunteerId) {
        // Insert new volunteer
        const { data: insertedVolunteer, error: insertError } = await supabase
          .from('volunteers')
          .insert([
            {
              user_id: userId,
              aid_organization_id: organizationId,
              availability: true,
            },
          ])
          .select('id') // Return the inserted ID
          .single()

        if (insertError) throw insertError
        volunteerId = insertedVolunteer.id
      }

      // Redirect to tasks page with volunteerId
      router.push(`/tasks?volunteerId=${volunteerId}`)
    } catch (error) {
      console.error('Error handling choose organization:')
    }
  }

  if (loading) return <Spinner size="lg" color="blue.500" />

  return (
    <Box p={4}>
      <Text fontSize="2xl" mb={4}>
        Choose an Organization
      </Text>
      {organizations.length === 0 ? (
        <Text>No organizations available</Text>
      ) : (
        <Box>
          {organizations.map(org => (
            <Box
              key={org.id}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              mb={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>{org.name}</Text>
              <Button
                colorScheme="blue"
                onClick={() => handleChooseOrganization(org.id)}
                loading={selecting === org.id}
                loadingText="Choosing"
              >
                Choose
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default OrganizationsPage
