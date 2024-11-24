import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  ColumnDef,
  ColumnFiltersState,
  InitialTableState,
  OnChangeFn,
  PaginationState,
  RowData,
  RowSelectionState,
  SortingState,
  TableOptions,
  TableState,
  VisibilityState,
} from '@tanstack/react-table'
import { Parser, useQueryStates } from 'nuqs'

import { QueryState } from '@/hooks/use-query-state'
import { camelToSnakeCase } from '@/lib/string'
import { AnyObject } from '@/types/utils'

import { filterVariantToQueryParser, generateFilterFromColumnFilters, getColumnId } from './utils'

export default function useTableState<TData extends RowData, T extends AnyObject = any>({
  columns,
  queryState,
}: {
  columns: ColumnDef<TData>[]
  queryState: QueryState<T>
}) {
  const columnsById = useMemo(
    () =>
      columns.reduce<Record<string, ColumnDef<TData>>>(
        (res, col) => ({ ...res, [getColumnId(col)]: col }),
        {}
      ),
    [columns]
  )

  // Pagination
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    queryState.setPage(pagination.pageIndex)
  }, [pagination.pageIndex]) // eslint-disable-line

  useEffect(() => {
    queryState.setPage(0)
    queryState.setLimit(pagination.pageSize)
  }, [pagination.pageSize]) // eslint-disable-line

  // Sorting
  const [sorting, setSorting] = useState<SortingState>([])

  useEffect(() => {
    queryState.setPage(0)
    queryState.setOrder(
      sorting.map(s => {
        const col = columnsById[s.id]

        return {
          name: (col.meta?.sortByColumn || camelToSnakeCase(s.id)) as Extract<keyof T, string>,
          descending: s.desc,
        }
      })
    )
  }, [sorting]) // eslint-disable-line

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // Filters

  const filtersKeyMap = useMemo(
    () =>
      columns
        .filter(col => !!col.meta?.filter?.variant && col.enableColumnFilter)
        .reduce<
          Record<string, Parser<any>>
        >((res, col) => ({ ...res, [getColumnId(col)]: filterVariantToQueryParser(col) }), {}),
    [columns]
  )
  const emptyFilters = useMemo(
    () =>
      columns
        .filter(col => !!col.meta?.filter?.variant && col.enableColumnFilter)
        .reduce<
          Record<string, any | null>
        >((res, col) => ({ ...res, [getColumnId(col)]: null }), {}),
    [columns]
  )

  const [columnFiltersQuery, setColumnFiltersQuery] = useQueryStates(filtersKeyMap)
  const columnFilters = useMemo<ColumnFiltersState>(
    () =>
      Object.entries(columnFiltersQuery)
        .map(([id, value]) => ({
          id,
          value,
        }))
        .filter(f => f.value !== null),
    [columnFiltersQuery]
  )
  const setColumnFilters = useCallback<OnChangeFn<ColumnFiltersState>>(
    updater => {
      setColumnFiltersQuery(old => {
        let value = updater

        if (typeof value === 'function') {
          value = value(
            Object.entries(old).map(([id, value]) => ({
              id,
              value,
            }))
          )
        }

        return value
          .filter(c => c.value)
          .reduce((res, curr) => ({ ...res, [curr.id]: curr.value }), emptyFilters)
      })
    },
    [emptyFilters, setColumnFiltersQuery]
  )

  useEffect(() => {
    queryState.setPage(0)
    queryState.setFilter(generateFilterFromColumnFilters<TData, T>(columnsById, columnFilters))
  }, [columnFilters]) // eslint-disable-line

  // for some reason autoResetPageIndex https://tanstack.com/table/latest/docs/api/features/pagination#autoresetpageindex
  // also resets on page index change, basically breaking pagination so we have to reset page index manually in this useEffect
  useEffect(() => {
    setPagination(p => ({ ...p, pageIndex: 0 }))
  }, [sorting, columnFilters])

  useEffect(() => {
    setColumnVisibility(() =>
      columns.reduce<VisibilityState>(
        (res, col) => ({ ...res, [getColumnId(col)]: !!col.meta?.initiallyVisible }),
        {}
      )
    )
  }, [columns])

  const initialTableState = useMemo(() => {
    const state: InitialTableState = {}
    for (const column of columns) {
      const id = getColumnId(column)

      if (column.meta?.initialPinning) {
        state.columnPinning = {
          ...state.columnPinning,
          [column.meta?.initialPinning]: [
            ...(state.columnPinning?.[column.meta?.initialPinning] || []),
            id,
          ],
        }
      }
    }

    return state
  }, [columns])

  const tableState = useMemo<Partial<TableState>>(
    () => ({
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    }),
    [rowSelection, pagination, sorting, columnFilters, columnVisibility]
  )

  const stateSetters = useMemo<
    Pick<
      TableOptions<TData>,
      | 'onPaginationChange'
      | 'onSortingChange'
      | 'onColumnFiltersChange'
      | 'onColumnVisibilityChange'
      | 'onRowSelectionChange'
    >
  >(
    () => ({
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
    }),
    [setColumnFilters]
  )

  return {
    tableState,
    initialTableState,
    stateSetters,
  }
}
