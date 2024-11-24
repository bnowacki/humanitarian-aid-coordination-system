import { Flex } from '@chakra-ui/react'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter as FontSans } from 'next/font/google'
import { notFound } from 'next/navigation'
import NextTopLoader from 'nextjs-toploader'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { routing } from '@/i18n/navigation'
import { Locale } from '@/i18n/types'
import '@/styles/_global.scss'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'HACS',
  description: 'Humanitarian Aid Coordination System',
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode
  params: { locale: Locale }
}>) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={fontSans.variable}>
        <NextTopLoader color="#16a34a" height={5} shadow={`0 0 5px #fff`} showSpinner={false} />
        <Providers>
          <NuqsAdapter>
            <NextIntlClientProvider messages={messages}>
              <Flex minH="100dvh" flexDirection="column" bg="bg">
                <Header />
                {children}
                <Footer />
              </Flex>
            </NextIntlClientProvider>
          </NuqsAdapter>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
