import React from 'react'

import { Table as ChakraTable } from '@chakra-ui/react'
import { RowData, Table, flexRender } from '@tanstack/react-table'
import clsx from 'clsx'

import { getCommonPinningStyles } from '../utils'
import styles from './table-body.module.scss'

export default function TableBody<TData extends RowData>({
  table,
  onRowClick,
}: {
  table: Table<TData>
  onRowClick?: (row: TData) => void
}) {
  return (
    <ChakraTable.Body className={styles.TBody}>
      {table.getRowModel().rows.map(row => (
        <ChakraTable.Row
          key={row.id}
          className={clsx(styles.Row, onRowClick && styles.Clickable)}
          onClick={() => onRowClick?.(row.original)}
        >
          {row.getVisibleCells().map(cell => (
            <ChakraTable.Cell key={cell.id} style={{ ...getCommonPinningStyles(cell.column) }}>
              <div data-loadable>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
            </ChakraTable.Cell>
          ))}
        </ChakraTable.Row>
      ))}
    </ChakraTable.Body>
  )
}
