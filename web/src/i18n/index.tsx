import { RichTranslationValues } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

// Can be imported from a shared config
export const defaultLocale = 'pl'
export const locales = [defaultLocale, 'en']

// https://next-intl-docs.vercel.app/docs/routing/middleware#strategies
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const defaultTranslationValues: RichTranslationValues = {
  br: () => <br />,
  b: c => <b>{c}</b>,
  div: c => <div>{c}</div>,
  h2: c => <h2>{c}</h2>,
  h3: c => <h3>{c}</h3>,
  h4: c => <h4>{c}</h4>,
  p: c => <p>{c}</p>,
  ol: c => <ol>{c}</ol>,
  ul: c => <ul>{c}</ul>,
  li: c => <li>{c}</li>,
  span: c => <span>{c}</span>,
}

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`./locales/${locale}.json`)).default,
    defaultTranslationValues,
    timeZone: 'Europe/Warsaw',
  }
})
