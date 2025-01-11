'use client'

import { Box, Button, Flex, Grid, Heading, Image, Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'

import { useRouter } from '@/i18n/navigation'

// Original donation campaigns with 3 events for each type
const donationCampaigns = {
  clothes: [
    {
      title: 'winterClothesTitle',
      description: 'winterClothesDescription',
      image:
        'https://images.unsplash.com/photo-1542367787-4baf35f3037d?q=80&w=2670&auto=format&fit=crop',
      altText: 'Winter Clothes',
      requiredItems: [
        { item: 'Jackets', quantity: 100 },
        { item: 'Scarves', quantity: 150 },
        { item: 'Gloves', quantity: 200 },
      ],
    },
    {
      title: 'schoolUniformsTitle',
      description: 'schoolUniformsDescription',
      image:
        'https://images.unsplash.com/photo-1636320804382-912276801e97?q=80&w=2671&auto=format&fit=crop',
      altText: 'School Uniforms',
      requiredItems: [
        { item: 'Uniform Sets', quantity: 50 },
        { item: 'Shoes', quantity: 50 },
      ],
    },
    {
      title: 'warmBlanketsTitle',
      description: 'warmBlanketsDescription',
      image:
        'https://images.unsplash.com/photo-1507427100689-2bf8574e32d4?q=80&w=2574&auto=format&fit=crop',
      altText: 'Warm Blankets',
      requiredItems: [{ item: 'Blankets', quantity: 300 }],
    },
  ],
  food: [
    {
      title: 'foodForFloodVictimsTitle',
      description: 'foodForFloodVictimsDescription',
      image:
        'https://images.unsplash.com/photo-1609520778163-a16fb3862581?q=80&w=2574&auto=format&fit=crop',
      altText: 'Food Donations',
      requiredItems: [
        { item: 'Rice Bags (5kg)', quantity: 200 },
        { item: 'Canned Goods', quantity: 500 },
      ],
    },
    {
      title: 'emergencyFoodKitsTitle',
      description: 'emergencyFoodKitsDescription',
      image:
        'https://images.unsplash.com/photo-1507427100689-2bf8574e32d4?q=80&w=2574&auto=format&fit=crop',
      altText: 'Emergency Food Kits',
      requiredItems: [
        { item: 'Food Kits', quantity: 150 },
        { item: 'Instant Noodles', quantity: 400 },
      ],
    },
    {
      title: 'mealsForOrphanagesTitle',
      description: 'mealsForOrphanagesDescription',
      image:
        'https://plus.unsplash.com/premium_photo-1683140523610-13deecbd20b1?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      altText: 'Orphanage Meals',
      requiredItems: [
        { item: 'Meal Boxes', quantity: 300 },
        { item: 'Juice Boxes', quantity: 200 },
      ],
    },
  ],
  money: [
    {
      title: 'financialAidForEarthquakeSurvivorsTitle',
      description: 'financialAidForEarthquakeSurvivorsDescription',
      image:
        'https://plus.unsplash.com/premium_photo-1716717998303-803fdbc38747?q=80&w=2532&auto=format&fit=crop',
      altText: 'Earthquake Relief',
      targetAmount: 10000,
      donatedAmount: 7000,
    },
    {
      title: 'supportEducationForChildrenInNeedTitle',
      description: 'supportEducationForChildrenInNeedDescription',
      image:
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2464&auto=format&fit=crop',
      altText: 'Education Support',
      targetAmount: 6000,
      donatedAmount: 2500,
    },
    {
      title: 'medicalAidForRefugeesTitle',
      description: 'medicalAidForRefugeesDescription',
      image:
        'https://images.unsplash.com/photo-1581056771392-8a90ddb76831?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      altText: 'Medical Aid',
      targetAmount: 8000,
      donatedAmount: 4500,
    },
  ],
}

const EventPage = () => {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') // Get the donation type (e.g., 'money', 'clothes', 'food')
  const campaigns = donationCampaigns[type as keyof typeof donationCampaigns] || []
  const router = useRouter()
  const t = useTranslations() // Use translations here

  const handleDonateClick = (campaign: any) => {
    const title = campaign?.title || 'default-campaign-title'
    const formattedTitle = title.replace(/\s+/g, '-').toLowerCase()

    const donationType = campaign.requiredItems ? 'items' : 'money'

    const queryParams = new URLSearchParams({
      campaign: formattedTitle,
      donationType: donationType,
      targetAmount: campaign.targetAmount?.toString() || '0',
      donatedAmount: campaign.donatedAmount?.toString() || '0',
      requiredItems: campaign.requiredItems ? JSON.stringify(campaign.requiredItems) : '',
    })

    router.push(`/donations/form?${queryParams.toString()}`)
  }

  return (
    <Flex direction="column" align="center" gap={6} p={4}>
      <Heading fontSize="2xl" mb={4}>
        {t(`donationCampaigns.title.${type || 'default'}`)}
      </Heading>

      <Grid templateColumns="repeat(3, 1fr)" gap={6} justifyItems="center" w="full">
        {campaigns.map((campaign, index) => (
          <Box
            key={index}
            borderWidth={1}
            borderRadius="lg"
            overflow="hidden"
            width="300px"
            boxShadow="md"
            display="flex"
            flexDirection="column"
            height="500px"
          >
            <Image
              src={campaign.image}
              alt={campaign.altText}
              height="250px"
              width="100%"
              objectFit="cover"
            />
            <Box p={4} flex="1">
              <Heading fontSize="lg" mb={2}>
                {t(`donationCampaigns.${campaign.title}`)}
              </Heading>
              <Text mb={4}>{t(`donationCampaigns.${campaign.description}`)}</Text>
              {campaign.requiredItems ? (
                <Text fontWeight="bold" mb={4}>
                  {t('donationCampaigns.itemsNeeded', { count: campaign.requiredItems.length })}
                </Text>
              ) : (
                <Text fontWeight="bold" mb={4}>
                  {t('donationCampaigns.remaining', {
                    remaining: campaign.targetAmount - campaign.donatedAmount,
                  })}
                </Text>
              )}
              <Button
                colorScheme="blue"
                width="full"
                mt="auto"
                onClick={() => handleDonateClick(campaign)}
              >
                {campaign.requiredItems
                  ? t('donationCampaigns.donateItems')
                  : t('donationCampaigns.donateNow')}
              </Button>
            </Box>
          </Box>
        ))}
      </Grid>
    </Flex>
  )
}

export default EventPage
