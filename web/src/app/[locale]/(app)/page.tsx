import { Heading, Stack } from '@chakra-ui/react';
import { getTranslations } from 'next-intl/server';
import AdminAidOrganizations from '../admin/aid-organizations/page'; // Import the AdminAidOrganizations component

export default async function Index() {
  const t = await getTranslations('home');

  return (
    <Stack flex={1} w="full" gap={20} textAlign="center">
      <Heading>{t('title')}</Heading>
      <h1>hello buła</h1>
      <Heading>TODO: List of events here</Heading>
      <AdminAidOrganizations /> 
    </Stack>
  );
}