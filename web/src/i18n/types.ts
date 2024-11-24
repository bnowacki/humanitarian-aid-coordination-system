import { useTranslations } from 'next-intl'

import { locales } from '.'

export type Locale = (typeof locales)[number]

export type TFunciton<NestedKey> = ReturnType<typeof useTranslations<NestedKey>>
