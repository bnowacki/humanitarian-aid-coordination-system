import React, { ReactNode } from 'react'

import { Box, Heading, Stack, Table } from '@chakra-ui/react'
import { RowData, TableOptions, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import useIsClient from '@/hooks/use-is-client'

import TableBody from './components/table-body'
import TableFooter from './components/table-footer'
import TableHead from './components/table-head'

type Props<TData extends RowData> = Pick<
  TableOptions<TData>,
  | 'data'
  | 'columns'
  | 'getRowId'
  | 'rowCount'
  | 'state'
  | 'initialState'
  | 'onPaginationChange'
  | 'onSortingChange'
> & {
  title?: string
  loading?: boolean
  noDataPlaceholder?: ReactNode
  onRowClick?: (row: TData) => void
}

export default function DataTable<TData extends RowData>({
  loading,
  noDataPlaceholder,
  onRowClick,
  title,
  ...options
}: Props<TData>) {
  const isClient = useIsClient()

  const table = useReactTable({
    ...options,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    sortDescFirst: false,
  })

  return (
    <Stack gap={4} w="full">
      {title && (
        <Heading as="h2" fontSize="2xl">
          {title}
        </Heading>
      )}
      <Table.Root className={loading ? 'skeleton' : undefined} w="full">
        <TableHead table={table} />
        <TableBody table={table} onRowClick={onRowClick} />
      </Table.Root>
      {(loading && !options.data.length) || !isClient ? (
        <Stack align="stretch" mt={2}>
          {Array.from({ length: table.getState().pagination.pageSize }, (_, i) => i).map(i => (
            <Box key={i} data-loadable h="36px" />
          ))}
        </Stack>
      ) : !options.data.length ? (
        noDataPlaceholder
      ) : (
        <TableFooter table={table} />
      )}
    </Stack>
  )
}
