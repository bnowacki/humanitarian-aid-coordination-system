import React from 'react'

import { Column, RowData } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import RadioGroup from '@/components/form/radio-group'

export default function RadioFilter<TData extends RowData, TValue = unknown>({
  column,
}: {
  column: Column<TData, TValue>
}) {
  const t = useTranslations('table')

  if (!column.columnDef.meta?.filter?.options) return null

  return (
    <RadioGroup
      defaultValue={(column.getFilterValue() ?? 'all') as string}
      items={[{ value: 'all', label: t('all') }, ...column.columnDef.meta?.filter?.options]}
      onChange={v => column.setFilterValue(v === 'all' ? null : v)}
      size="sm"
    />
  )
}
