import React from 'react'

import { Table as ChakraTable } from '@chakra-ui/react'
import { RowData, Table, flexRender } from '@tanstack/react-table'
import clsx from 'clsx'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'

import { getCommonPinningStyles } from '../utils'
import FilterPopover from './filter/filter-popover'
import styles from './table-head.module.scss'

export default function TableHead<TData extends RowData>({ table }: { table: Table<TData> }) {
  return (
    <ChakraTable.Header className={styles.Thead}>
      {table.getHeaderGroups().map(headerGroup => (
        <ChakraTable.Row key={headerGroup.id}>
          {headerGroup.headers.map(header => {
            const isSorted = header.column.getIsSorted()

            return (
              <ChakraTable.ColumnHeader
                key={header.id}
                colSpan={header.colSpan}
                style={{ ...getCommonPinningStyles(header.column, true) }}
              >
                <div className={styles.HeaderWrapper}>
                  <div
                    className={clsx(styles.Header, header.column.getCanSort() && styles.Sortable)}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {!header.column.getCanSort() ? null : isSorted ? (
                      isSorted === 'asc' ? (
                        <FaSortDown />
                      ) : (
                        <FaSortUp />
                      )
                    ) : (
                      <FaSort />
                    )}
                  </div>
                  {header.column.getCanFilter() && <FilterPopover column={header.column} />}
                </div>
              </ChakraTable.ColumnHeader>
            )
          })}
        </ChakraTable.Row>
      ))}
    </ChakraTable.Header>
  )
}
