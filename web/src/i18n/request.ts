import { getRequestConfig } from 'next-intl/server'

import { defaultTranslationValues } from '.'
import { routing } from './navigation'

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
    defaultTranslationValues: defaultTranslationValues,
  }
})
