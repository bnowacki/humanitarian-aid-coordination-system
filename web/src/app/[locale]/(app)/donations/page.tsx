'use client'

import { Box, Button, Stack, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/navigation'

// Import useTranslations

const DonationsPage = () => {
  const router = useRouter()
  const t = useTranslations() // Use translations here

  const goToEvent = (type: string) => {
    router.push(`/donations/event?type=${type}`) // Pass type as a query parameter
  }

  return (
    <Stack spacing={6} align="center" justify="center" h="100vh">
      <Text fontSize="3xl" fontWeight="bold">
        {t('donationsPage.title')} {/* Translated title */}
      </Text>
      <Box display="flex" gap={4}>
        <Button onClick={() => goToEvent('clothes')} colorScheme="blue" size="lg" width="200px">
          {t('donationsPage.donateClothes')} {/* Translated button text */}
        </Button>
        <Button onClick={() => goToEvent('food')} colorScheme="green" size="lg" width="200px">
          {t('donationsPage.donateFood')} {/* Translated button text */}
        </Button>
        <Button onClick={() => goToEvent('money')} colorScheme="yellow" size="lg" width="200px">
          {t('donationsPage.donateMoney')} {/* Translated button text */}
        </Button>
      </Box>
    </Stack>
  )
}

export default DonationsPage
