'use client'

import { Box, Button, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

const DonationsPage = () => {
  const router = useRouter()

  const goToEvent = (type: string) => {
    router.push(`/donations/event?type=${type}`) // Pass type as a query parameter
  }

  return (
    <Stack spacing={6} align="center" justify="center" h="100vh">
      <Text fontSize="3xl" fontWeight="bold">
        What would you like to donate?
      </Text>
      <Box display="flex" gap={4}>
        <Button onClick={() => goToEvent('clothes')} colorScheme="blue" size="lg" width="200px">
          Donate Clothes
        </Button>
        <Button onClick={() => goToEvent('food')} colorScheme="green" size="lg" width="200px">
          Donate Food
        </Button>
        <Button onClick={() => goToEvent('money')} colorScheme="yellow" size="lg" width="200px">
          Donate Money
        </Button>
      </Box>
    </Stack>
  )
}

export default DonationsPage
