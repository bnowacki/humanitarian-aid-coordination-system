import { CSSProperties } from 'react'

import { Column, ColumnDef, ColumnFiltersState, RowData } from '@tanstack/react-table'
import { Parser, parseAsString, parseAsStringEnum } from 'nuqs'

import { camelToSnakeCase } from '@/lib/string'
import { FilterBuilderFn } from '@/types/supabase'
import { AnyObject } from '@/types/utils'

import { Filter } from './types'

// https://tanstack.com/table/v8/docs/guide/column-defs#unique-column-ids
export function getColumnId<TData extends RowData>(column: ColumnDef<TData>): string {
  if (column.id) return column.id
  if ('accessorKey' in column) return String(column.accessorKey).replaceAll('.', '_')
  if (typeof column.header === 'string') return column.header
  return ''
}

export function filterVariantToQueryParser(column: ColumnDef<any>): Parser<any> {
  switch (column.meta?.filter?.variant) {
    case 'text':
      return parseAsString
    case 'radio':
      return parseAsStringEnum<any>(column.meta?.filter?.options?.map(o => o.value) ?? [])

    // TODO: other variants
    default:
      return parseAsString
  }
}

export function generateFilterFromColumnFilters<TData extends RowData, T extends AnyObject = any>(
  columns: Record<string, ColumnDef<TData>>,
  columnFilters: ColumnFiltersState
): FilterBuilderFn<T> {
  if (!columnFilters.length) return b => b

  const children: Filter[] = []

  for (const filter of columnFilters) {
    if (!filter.value) continue

    const column = columns[filter.id]
    if (!column) continue

    const column_id = column.meta?.filter?.column || camelToSnakeCase(filter.id)

    let child: Filter | null = null
    switch (column.meta?.filter?.variant) {
      case 'text':
        child = {
          column: column_id,
          op: 'ilike',
          value: `%${filter.value as string}%`,
        }
        break
      case 'radio':
        child = {
          column: column_id,
          op: 'eq',
          value: filter.value as string,
        }
        break

      // TODO: other variants
    }

    child && children.push(child)
  }

  return b => {
    children.forEach(ch => {
      if (!ch.column || !ch.value) {
        return
      }

      switch (ch.op) {
        case 'eq':
          b = b.eq(ch.column, ch.value)
          break
        case 'ilike':
          b = b.ilike(ch.column, ch.value)
          break
        default:
          break
      }
    })
    return b
  }
}

//These are the important styles to make sticky column pinning work!
export const getCommonPinningStyles = (column: Column<any>, header?: boolean): CSSProperties => {
  const isPinned = column.getIsPinned()

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'relative',
    width: isPinned ? column.getSize() : undefined,
    zIndex: isPinned ? 1 : 0,
    backdropFilter: isPinned && !header ? 'blur(10px)' : undefined,
  }
}
