import React, { useEffect, useState } from 'react'

import { Input } from '@chakra-ui/react'
import { Column, RowData } from '@tanstack/react-table'
import { useDebounce } from '@uidotdev/usehooks'
import { useTranslations } from 'next-intl'

export default function TextFilter<TData extends RowData, TValue = unknown>({
  column,
}: {
  column: Column<TData, TValue>
}) {
  const t = useTranslations('table')

  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 300)

  const columnFilterValue = column.getFilterValue()
  useEffect(() => {
    setValue((columnFilterValue ?? '') as string)
  }, [columnFilterValue])

  useEffect(() => {
    column.setFilterValue(debouncedValue)
  }, [debouncedValue]) // eslint-disable-line

  return (
    <Input
      id={`${column.id}_filter`}
      marginBottom="none"
      placeholder={t('search')}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  )
}
