import React, { useCallback } from 'react'

import { useTranslations } from 'next-intl'

import useLoadingState from './use-loading-state'

export function useCopyToClipboard(text: string) {
  const t = useTranslations('copy-to-clipboard')

  const [copied, setCopied] = React.useState(false)
  const timeoutID = React.useRef<NodeJS.Timeout | null>(null)

  const [copy, copying] = useLoadingState(
    useCallback(async () => {
      if (!text || !navigator) return
      setCopied(false)
      if (timeoutID.current) {
        clearTimeout(timeoutID.current)
      }

      await navigator.clipboard.writeText(text)
      setCopied(true)

      timeoutID.current = setTimeout(() => {
        setCopied(false)
        timeoutID.current = null
      }, 2000)
    }, [text]),
    {
      onErrorToast: t('failed-to-copy-link'),
    }
  )

  return { copy, copied, copying }
}
