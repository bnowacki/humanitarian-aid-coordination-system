'use client'

import { createListCollection } from '@chakra-ui/react'
import { useLocale } from 'next-intl'

import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select'
import { locales } from '@/i18n'
import { usePathname } from '@/i18n/navigation'
import { Locale } from '@/i18n/types'

const languageNames: Record<Locale, string> = {
  pl: 'Polski (PL)',
  en: 'English (EN)',
}

const languages = createListCollection({
  items: locales.map(l => ({ value: l, label: languageNames[l] })),
})

export default function LocaleSwitch() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <SelectRoot
      value={[locale]}
      onValueChange={async e => {
        window.location.replace(window.location.origin + `/${e.value[0] + pathname}`)
      }}
      collection={languages}
      variant="outline"
      multiple={false}
      maxW="200px"
    >
      <SelectTrigger>
        <SelectValueText />
      </SelectTrigger>
      <SelectContent>
        {languages.items.map(lang => (
          <SelectItem item={lang} key={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}
