'use client'

import React, { useMemo } from 'react'

import { Badge } from '@chakra-ui/react'
import { IconEdit } from '@tabler/icons-react'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import cellRenderers from '@/components/data-table/cell-renderers'
import ContextMenu from '@/components/data-table/components/context-menu/context-menu'
import DataTable from '@/components/data-table/data-table'
import useTableState from '@/components/data-table/use-table-state'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import useListQuery from '@/hooks/use-list-query'
import useValueDisclosure from '@/hooks/use-value-disclosure'
import { AdminUser, UserRole } from '@/types/models'

import UserEditorDialog from './editor'

export default function AdminUsers() {
  const t = useTranslations('admin.users')

  const {
    value: editorValue,
    onClose: onEditorClose,
    onOpen: onEditorOpen,
  } = useValueDisclosure<AdminUser>()

  const userRoleLabel = React.useMemo<Record<UserRole, string>>(
    () => ({
      user: t('role-basic'),
      admin: t('role-admin'),
    }),
    [t]
  )

  // 1. Define columns
  const columns = useMemo<ColumnDef<AdminUser>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: cellRenderers.Code,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'email',
        header: 'E-mail',
        enableColumnFilter: true,
        meta: {
          initiallyVisible: true,
          filter: {
            column: 'email',
            variant: 'text',
          },
        },
      },
      {
        accessorKey: 'full_name',
        header: t('full-name'),
        enableColumnFilter: true,
        meta: {
          initiallyVisible: true,
          filter: {
            column: 'full_name',
            variant: 'text',
          },
        },
      },
      {
        accessorKey: 'role',
        header: t('role'),

        cell: ({ getValue }) => {
          const role = getValue() as UserRole
          return (
            <Badge colorPalette={role === 'admin' ? 'red' : 'gray'}>{userRoleLabel[role]}</Badge>
          )
        },
        enableColumnFilter: true,
        meta: {
          initiallyVisible: true,
          filter: {
            variant: 'radio',
            options: [
              {
                value: 'admin',
                label: <Badge colorPalette="red">{userRoleLabel['admin']}</Badge>,
              },
              {
                value: 'user',
                label: <Badge>{userRoleLabel['user']}</Badge>,
              },
            ],
          },
        },
      },
      {
        accessorKey: 'created_at',
        header: t('created-at'),
        cell: cellRenderers.Timestamp,
        enableColumnFilter: false,
        meta: {
          filter: { variant: 'date-range' },
        },
      },
      {
        accessorKey: 'invited_at',
        header: t('invited-at'),
        cell: cellRenderers.Timestamp,
        enableColumnFilter: false,
        meta: {
          filter: { variant: 'date-range' },
        },
      },
      {
        accessorKey: 'last_sign_in_at',
        header: t('last-sign-in-at'),
        cell: cellRenderers.Timestamp,
        enableColumnFilter: false,
        meta: {
          filter: { variant: 'date-range' },
          initiallyVisible: true,
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          return (
            <ContextMenu
              items={{
                main: [
                  {
                    type: 'action',
                    callback: () => onEditorOpen(row.original),
                    text: t('edit'),
                    icon: <IconEdit />,
                  },
                ],
                footer: [],
              }}
            />
          )
        },
        enableHiding: false,
        meta: {
          // initialPinning: 'right',
          initiallyVisible: true,
        },
      },
    ],
    [t, userRoleLabel, onEditorOpen]
  )

  // 2. fetch data
  const { data, loading, rows, queryState, fetch } = useListQuery<AdminUser>({
    from: 'admin_users',
  })

  // 3. Initialize table state and manage query state
  const { tableState, initialTableState, stateSetters } = useTableState<AdminUser, AdminUser>({
    columns,
    queryState,
  })

  return (
    <>
      <DataTable<AdminUser>
        data={data}
        columns={columns}
        loading={loading}
        rowCount={rows}
        getRowId={row => row.id}
        state={tableState}
        initialState={initialTableState}
        title={t('title')}
        noDataPlaceholder={
          <EmptyState title={t('no-results')} description={t('no-results-description')}>
            <Button variant="outline" onClick={() => stateSetters.onColumnFiltersChange?.([])}>
              {t('clear-filters')}
            </Button>
          </EmptyState>
        }
        {...stateSetters}
      />
      <UserEditorDialog
        item={editorValue}
        open={!!editorValue}
        onComplete={fetch}
        onClose={onEditorClose}
      />
    </>
  )
}
