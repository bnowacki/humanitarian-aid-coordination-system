'use client'

import { useState } from 'react'

import { Box, Button, Flex, Grid, Heading, Image, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

// Example campaigns (can be filtered dynamically based on the type)
const donationCampaigns = {
  clothes: [
    {
      title: 'Winter Clothes for the Homeless',
      description: 'Help provide warm clothes for those in need during the winter.',
      image:
        'https://images.unsplash.com/photo-1542367787-4baf35f3037d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      altText: 'Winter Clothes',
      targetAmount: 5000,
      donatedAmount: 2500,
    },
    {
      title: 'School Uniforms for Kids',
      description: 'Provide essential school uniforms for underprivileged children.',
      image:
        'https://images.unsplash.com/photo-1636320804382-912276801e97?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      altText: 'School Uniforms',
      targetAmount: 4000,
      donatedAmount: 1500,
    },
    {
      title: 'Blankets for Refugees',
      description: 'Distribute warm blankets to refugees in need.',
      image:
        'https://plus.unsplash.com/premium_photo-1683135030516-6317ed744628?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      altText: 'Blankets',
      targetAmount: 3000,
      donatedAmount: 1000,
    },
  ],
  food: [
    {
      title: 'Food for Flood Victims',
      description: 'Provide essential meals to families affected by recent floods.',
      image:
        'https://images.unsplash.com/photo-1609520778163-a16fb3862581?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      altText: 'Food Donations',
      targetAmount: 3000,
      donatedAmount: 1000,
    },
    {
      title: 'Meals for Homeless Shelters',
      description: 'Help fund meals for those in shelters.',
      image:
        'https://images.unsplash.com/photo-1519430044529-9a9a57177865?q=80&w=2510&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      altText: 'Homeless Meals',
      targetAmount: 2000,
      donatedAmount: 500,
    },
    {
      title: 'Emergency Food Kits for Disaster Areas',
      description: 'Provide emergency food kits to families in disaster-hit regions.',
      image:
        'https://images.unsplash.com/photo-1507427100689-2bf8574e32d4?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      altText: 'Emergency Food Kits',
      targetAmount: 5000,
      donatedAmount: 2000,
    },
  ],
  money: [
    {
      title: 'Financial Aid for Earthquake Survivors',
      description: 'Support those rebuilding their lives after the recent earthquake.',
      image:
        'https://plus.unsplash.com/premium_photo-1716717998303-803fdbc38747?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      altText: 'Earthquake Relief',
      targetAmount: 10000,
      donatedAmount: 7000,
    },
    {
      title: 'Support Education for Children in Need',
      description: 'Donate to provide scholarships and resources for underprivileged kids.',
      image:
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      altText: 'Education Support',
      targetAmount: 6000,
      donatedAmount: 2500,
    },
    {
      title: 'The earthquake caused many injuries ',
      description:
        'Provide medical supplies to people injured during terrible earthquake',
      image:
        'https://plus.unsplash.com/premium_photo-1695566086196-1cdadbaa1988?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      altText: 'Medical Aid',
      targetAmount: 8000,
      donatedAmount: 4000,
    },
  ],
}

const EventPage = () => {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') // Get the donation type from the query parameters

  const campaigns = donationCampaigns[type as keyof typeof donationCampaigns] || []
  const router = useRouter() // Initialize router to navigate programmatically

  const handleDonateClick = (campaign: any) => {
    const title = campaign?.title || 'default-campaign-title' // Provide a default title if missing
    const formattedTitle = title.replace(/\s+/g, '-').toLowerCase()
    router.push(
      `/donations/form?campaign=${formattedTitle}&targetAmount=${campaign.targetAmount}&donatedAmount=${campaign.donatedAmount}`
    )
  }

  return (
    <Flex direction="column" align="center" gap={6} p={4}>
      <Heading fontSize="2xl" mb={4}>
        {type ? `Donation Campaigns for ${type}` : 'Donation Campaigns'}
      </Heading>

      <Grid
        templateColumns="repeat(3, 1fr)" // Creates 3 equal columns
        gap={6} // Adds space between the grid items
        justifyItems="center" // Centers the items horizontally
        alignItems="stretch" // Makes sure the items stretch to fill the grid cell
        w="full" // Ensures the grid takes full width
      >
        {campaigns.map((campaign, index) => (
          <Box
            key={index}
            borderWidth={1}
            borderRadius="lg"
            overflow="hidden"
            width="300px" // Set fixed width for each item
            boxShadow="md"
            display="flex"
            flexDirection="column"
            height="500px" // Set fixed height for each box
          >
            <Image
              src={campaign.image}
              alt={campaign.altText}
              height="250px"
              width="100%" // Ensure the image takes full width of the box
              objectFit="cover"
            />
            <Box
              p={4}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              flex="1" // Ensure content takes remaining space
            >
              <Box>
                <Heading fontSize="lg" mb={2}>
                  {campaign.title}
                </Heading>
                <Text mb={4}>{campaign.description}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={4}>
                  Remaining: ${campaign.targetAmount - campaign.donatedAmount}
                </Text>
                <Button
                  colorScheme="blue"
                  width="full"
                  mt="auto"
                  onClick={() => handleDonateClick(campaign)} // On click, navigate to the form page
                >
                  Donate Now
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Grid>
    </Flex>
  )
}

export default EventPage
