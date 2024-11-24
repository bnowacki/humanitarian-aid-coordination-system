import React from 'react'

import { Box, Center, Text } from '@chakra-ui/react'

const FormDivider = ({ text }: { text: string }) => {
  return (
    <Box position="relative" py={2}>
      <Center position="absolute" inset={0}>
        <Text w="full" borderTop="1px solid" borderColor="gray.400" />
      </Center>
      {text && (
        <Center position="relative">
          <Text textTransform="uppercase" bg="bg" fontSize="xs" px={2}>
            {text}
          </Text>
        </Center>
      )}
    </Box>
  )
}

export default FormDivider
