// // donate/[type]/form.tsx
// 'use client'

// import { Button, FormControl, FormLabel, Input, Stack, Text } from '@chakra-ui/react'
// import { useRouter } from 'next/router'

// // donate/[type]/form.tsx

// const DonationForm = ({ params }: { params: { type: string; event: string } }) => {
//   const router = useRouter()
//   const { type, event } = params // type is either clothes, food, or money

//   return (
//     <Stack spacing={4} align="center" justify="center" w="full" p={4}>
//       <Text fontSize="2xl">
//         Donate to {event} ({type})
//       </Text>

//       {/* Donation form */}
//       <FormControl>
//         <FormLabel>Your Name</FormLabel>
//         <Input placeholder="Enter your name" />
//       </FormControl>
//       <FormControl>
//         <FormLabel>Amount</FormLabel>
//         <Input placeholder="Enter donation amount" type="number" />
//       </FormControl>

//       <Button colorScheme="blue" onClick={() => router.push('/thank-you')}>
//         Donate to {event}
//       </Button>
//     </Stack>
//   )
// }

// export default DonationForm
