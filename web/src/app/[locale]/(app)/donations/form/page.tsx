'use client'

import { useEffect, useState } from 'react'

import { Button, Card, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Field } from '@/components/ui/field'

// Use search params to get query parameters

const FormPage = () => {
  const searchParams = useSearchParams() // Access the query parameters
  const router = useRouter()

  const campaignTitle = searchParams.get('campaign') || ''
  const targetAmount = parseFloat(searchParams.get('targetAmount') || '0')
  const donatedAmount = parseFloat(searchParams.get('donatedAmount') || '0')

  const [selectedOrganization, setSelectedOrganization] = useState(campaignTitle)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    // Set the donation goal and amount after the page loads
    if (campaignTitle) {
      setSelectedOrganization(campaignTitle) // Set campaign title as the organization
    }
  }, [campaignTitle])

  // Calculate remaining amount live based on the donation amount input
  const remainingAmount = targetAmount - donatedAmount - parseFloat(amount || '0')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // You can process the donation here or send it to your backend
    console.log('confirmation')
    console.log({
      selectedOrganization,
      name,
      surname,
      email,
      message,
      amount,
    })
  }

  return (
    <Card.Root maxW="sm" p={4}>
      <Card.Header>
        <Card.Title>Donation Form for {selectedOrganization}</Card.Title>
        <Card.Description>Fill in the form below to make your donation</Card.Description>
      </Card.Header>
      <Card.Body>
        <Stack gap="4" w="full">
          {/* Display the donation goal progress */}
          {selectedOrganization && (
            <Stack spacing={2} mb={4}>
              <Text fontSize="xl" fontWeight="bold" color="gray.700">
                Goal: ${targetAmount}
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="green.600">
                Donated so far: ${donatedAmount}
              </Text>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={remainingAmount > 0 ? 'red.600' : 'gray.400'}
              >
                Remaining: ${remainingAmount > 0 ? remainingAmount : 0}
              </Text>
            </Stack>
          )}

          {/* Name */}
          <Field label="First Name">
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your first name"
            />
          </Field>

          {/* Surname */}
          <Field label="Last Name">
            <Input
              value={surname}
              onChange={e => setSurname(e.target.value)}
              placeholder="Enter your last name"
            />
          </Field>

          {/* Email */}
          <Field label="Email Address">
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </Field>

          {/* Supportive Message */}
          <Field label="Supportive Message">
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write a message (optional)"
            />
          </Field>

          {/* Donation Amount */}
          <Field label="Donation Amount">
            <Input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Enter the amount to donate"
            />
          </Field>
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button variant="solid" colorScheme="blue" onClick={handleSubmit}>
          Submit Donation
        </Button>
      </Card.Footer>
    </Card.Root>
  )
}

export default FormPage
