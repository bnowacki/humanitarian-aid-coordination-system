'use client'

import { useState } from 'react'

// Import the useTranslations hook
import { Box, Button, Card, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'

import { Field } from '@/components/ui/field'
import { useRouter } from '@/i18n/navigation'

const FormPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const t = useTranslations() // Use translations here

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
        <Card.Title>{t('formPage.title', { campaignTitle })}</Card.Title> {/* Translated title */}
        <Card.Description>
          {donationType === 'money'
            ? t('formPage.moneyDescription') // Translated money description
            : t('formPage.itemsDescription')}{' '}
          {/* Translated items description */}
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <Stack gap="4">
          {donationType === 'money' && (
            <>
              <Text fontSize="lg" fontWeight="bold">
                {t('formPage.goal', { amount: targetAmount })}
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="green.600">
                {t('formPage.donatedSoFar', { amount: donatedAmount })}
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="red.600">
                {t('formPage.remaining', { amount: remainingAmount > 0 ? remainingAmount : 0 })}
              </Text>
            </>
          )}

          {/* Name */}
          <Field label={t('formPage.firstName')}>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('formPage.firstNamePlaceholder')}
            />
          </Field>

          {/* Surname */}
          <Field label={t('formPage.lastName')}>
            <Input
              value={surname}
              onChange={e => setSurname(e.target.value)}
              placeholder={t('formPage.lastNamePlaceholder')}
            />
          </Field>

          {/* Email */}
          <Field label={t('formPage.email')}>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('formPage.emailPlaceholder')}
            />
          </Field>

          {/* Donation Type - Money */}
          {donationType === 'money' ? (
            <Field label={t('formPage.donationAmount')}>
              <Input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder={t('formPage.donationAmountPlaceholder')}
              />
            </Field>
          ) : (
            // Donation Type - Items
            <Box>
              <Text fontWeight="bold" mb={2}>
                {t('formPage.itemsNeeded')}
              </Text>
              <Stack gap={2}>
                {items.map((item: any, idx: number) => (
                  <Box key={idx} display="flex" justifyContent="space-between" alignItems="center">
                    <Text>
                      {t(`formPage.${item.item.toLowerCase()}`) || item.item} (
                      {t('formPage.needed')} {item.quantity})
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
          <Field label={t('formPage.additionalMessage')}>
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={t('formPage.additionalMessagePlaceholder')}
            />
          </Field>
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline" onClick={() => router.back()}>
          {t('formPage.cancel')} {/* Translated Cancel button */}
        </Button>
        <Button colorScheme="blue" onClick={handleSubmit}>
          {t('formPage.submitDonation')} {/* Translated Submit button */}
        </Button>
      </Card.Footer>
    </Card.Root>
  )
}

export default FormPage
