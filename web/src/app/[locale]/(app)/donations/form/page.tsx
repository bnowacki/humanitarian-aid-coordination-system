'use client'

import { useState } from 'react'

import { Box, Button, Card, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Field } from '@/components/ui/field'

const FormPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const campaignTitle = searchParams.get('campaign') || ''
  const donationType = searchParams.get('donationType') || 'money'
  const targetAmount = parseFloat(searchParams.get('targetAmount') || '0')
  const donatedAmount = parseFloat(searchParams.get('donatedAmount') || '0')
  const requiredItems = searchParams.get('requiredItems')
    ? JSON.parse(searchParams.get('requiredItems') || '[]')
    : []

  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState('')
  const [items, setItems] = useState(requiredItems)

  const remainingAmount = targetAmount - donatedAmount - parseFloat(amount || '0')

  // Function to handle input changes for item quantities
  const handleItemChange = (index: number, value: string) => {
    const updatedItems = [...items]
    updatedItems[index].donatedQuantity = parseInt(value) || 0
    setItems(updatedItems)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      campaignTitle,
      donationType,
      name,
      surname,
      email,
      message,
      amount,
      items: items.filter(item => item.donatedQuantity > 0), // Only send items with non-zero donations
    })
  }

  return (
    <Card.Root maxW="sm" p={4}>
      <Card.Header>
        <Card.Title>Donation Form for {campaignTitle}</Card.Title>
        <Card.Description>
          {donationType === 'money'
            ? 'Fill in the form below to make your donation.'
            : 'Please check the list of items required and select the quantities you wish to donate.'}
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <Stack gap="4">
          {donationType === 'money' && (
            <>
              <Text fontSize="lg" fontWeight="bold">
                Goal: ${targetAmount}
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="green.600">
                Donated so far: ${donatedAmount}
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="red.600">
                Remaining: ${remainingAmount > 0 ? remainingAmount : 0}
              </Text>
            </>
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
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </Field>

          {/* Donation Type - Money */}
          {donationType === 'money' ? (
            <Field label="Donation Amount">
              <Input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter the amount to donate"
              />
            </Field>
          ) : (
            // Donation Type - Items
            <Box>
              <Text fontWeight="bold" mb={2}>
                Items Needed:
              </Text>
              <Stack gap={2}>
                {items.map((item: any, idx: number) => (
                  <Box key={idx} display="flex" justifyContent="space-between" alignItems="center">
                    <Text>
                      {item.item} (Needed: {item.quantity})
                    </Text>
                    <Input
                      type="number"
                      value={item.donatedQuantity || ''}
                      onChange={e => handleItemChange(idx, e.target.value)}
                      placeholder="0"
                      width="100px"
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Message */}
          <Field label="Additional Message (optional)">
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Enter any additional message"
            />
          </Field>
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button colorScheme="blue" onClick={handleSubmit}>
          Submit Donation
        </Button>
      </Card.Footer>
    </Card.Root>
  )
}

export default FormPage
