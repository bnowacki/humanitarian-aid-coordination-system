import React from 'react'

import { Text } from '@chakra-ui/react'
import { RowData, Table } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { Select } from '@/components/form/select'
import Pagination from '@/components/pagination/pagination'
import { SelectOption } from '@/types/input'

import ColumnsSelect from './columns-select'
import styles from './table-footer.module.scss'

const pageSizeOptions: SelectOption<number>[] = [
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '75', value: 75 },
  { label: '100', value: 100 },
]

export default function TableFooter<TData extends RowData>({ table }: { table: Table<TData> }) {
  const t = useTranslations('table')

  return (
    <div className={styles.Container}>
      <div className={styles.DisplayControls}>
        <Text id="page-size-select" as="label">
          {t('display')}
        </Text>
        <Select<number>
          id="page-size-select"
          onChange={value => value && table.setPageSize(value)}
          value={table.getState().pagination.pageSize}
          items={pageSizeOptions}
          maxW="72px"
        />
        <ColumnsSelect table={table} />
      </div>
      <div className={styles.Pagination}>
        <Pagination
          page={table.getState().pagination.pageIndex + 1}
          setPage={page => table.setPageIndex(page - 1)}
          pageSize={table.getState().pagination.pageSize}
          totalCount={table.getRowCount()}
        />
      </div>
    </div>
  )
}
