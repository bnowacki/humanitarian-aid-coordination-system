import { useEffect, useRef, useState } from 'react'

import { Code as ChakraCode, HStack, Text } from '@chakra-ui/react'
import { CellContext, RowData } from '@tanstack/react-table'

import { ClipboardIconButton, ClipboardRoot } from '@/components/ui/clipboard'
import { Tooltip } from '@/components/ui/tooltip'
import { formatDate, formatTimestamp } from '@/lib/date'

const Timestamp = <TData extends RowData>({ getValue }: CellContext<TData, any>) => {
  const v = getValue()
  return v ? formatTimestamp(v) : '-'
}

const Date = <TData extends RowData>({ getValue }: CellContext<TData, any>) => {
  const v = getValue<any>()
  return v ? formatDate(v) : '-'
}

const Email = <TData extends RowData>({ getValue }: CellContext<TData, any>) => {
  const v = getValue()
  return <a href={`mailto:${v}`}>{v}</a>
}

const LongText = <TData extends RowData>({ getValue }: CellContext<TData, any>) => {
  const v = getValue()

  const ref = useRef<HTMLParagraphElement>(null)

  const [withTooltip, setWithTooltip] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    if (ref.current.getBoundingClientRect().width >= 240) {
      setWithTooltip(true)
    }
  }, [])

  if ((typeof v !== 'string' && !Array.isArray(v)) || v.length === 0) return '-'

  let text = '-'
  if (typeof v === 'string') {
    text = v
  } else if (Array.isArray(v) && v.length !== 0) {
    text = v.join(', ')
  }

  return (
    <Tooltip content={withTooltip ? text : undefined}>
      <Text ref={ref} maxW="240px" truncate>
        {text}
      </Text>
    </Tooltip>
  )
}

const Code = <TData extends RowData>({ getValue }: CellContext<TData, any>) => {
  const v = getValue() as string
  return (
    <HStack>
      <ClipboardRoot value={v}>
        <ClipboardIconButton rounded="full" variant="ghost" />
      </ClipboardRoot>
      <ChakraCode>{v}</ChakraCode>
    </HStack>
  )
}

const cellRenderers = {
  Timestamp,
  Date,
  Email,
  LongText,
  Code,
}

export default cellRenderers
