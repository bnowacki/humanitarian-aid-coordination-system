'use client';

import React, { useMemo, useState } from 'react';

import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import ContextMenu from '@/components/data-table/components/context-menu/context-menu';

import cellRenderers from '@/components/data-table/cell-renderers';
import DataTable from '@/components/data-table/data-table';
import useTableState from '@/components/data-table/use-table-state';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import useListQuery from '@/hooks/use-list-query';
import useValueDisclosure from '@/hooks/use-value-disclosure';
import { Organization } from '@/types/models';

import OrganizationEditorDialog, { deleteOrganization } from './editor';
import DeleteDialog from './deleteDialog'; // Assuming this is your DeleteDialog component

export default function AidOrganizations() {
  const t = useTranslations('admin.organizations');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<Organization | null>(null);

  const {
    value: editorValue,
    onClose: onEditorClose,
    onOpen: onEditorOpen,
  } = useValueDisclosure<Organization>();

  const handleDeleteConfirm = async () => {
    if (!organizationToDelete) return;

    try {
      await deleteOrganization(organizationToDelete.id, t, fetch);
      setDeleteDialogOpen(false);
      setOrganizationToDelete(null);
    } catch (error) {
      console.error(error);
      alert(t('delete-error') || 'Failed to delete organization');
    }
  };

  const columns = useMemo<ColumnDef<Organization>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: cellRenderers.Code,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'name',
        header: t('name'),
        enableColumnFilter: true,
        meta: {
          initiallyVisible: true,
          filter: {
            column: 'name',
            variant: 'text',
          },
        },
      },
      {
        accessorKey: 'description',
        header: t('description'),
        enableColumnFilter: true,
        meta: {
          initiallyVisible: true,
          filter: {
            column: 'description',
            variant: 'text',
          },
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <ContextMenu
            items={{
              main: [
                {
                  type: 'action',
                  callback: () => onEditorOpen(row.original),
                  text: t('edit'),
                  icon: <IconEdit />,
                },
                {
                  type: 'action',
                  callback: () => {
                    setOrganizationToDelete(row.original);
                    setDeleteDialogOpen(true);
                  },
                  text: t('delete'),
                  icon: <IconTrash />,
                },
              ],
              footer: [],
            }}
          />
        ),
        enableHiding: false,
        meta: {
          initiallyVisible: true,
        },
      },
    ],
    [t, onEditorOpen]
  );

  const { data, loading, rows, queryState, fetch } = useListQuery<Organization>({
    from: 'organizations',
  });

  const { tableState, initialTableState, stateSetters } = useTableState<Organization, Organization>({
    columns,
    queryState,
  });

  return (
    <>
      {/* Dialog for Editing Organizations */}
      <OrganizationEditorDialog
        item={editorValue}
        open={!!editorValue}
        onClose={onEditorClose}
        onComplete={fetch}
      />

      {/* Dialog for Creating Organizations */}
      <OrganizationEditorDialog
        item={null} // Pass null to indicate creation
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onComplete={fetch}
      />

      {/* Dialog for Deleting Organizations */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('delete-dialog-title') || 'Delete Organization'}
        description={
          t('delete-dialog-description') ||
          `Are you sure you want to delete the organization "${organizationToDelete?.name}"?`
        }
        confirmText={t('delete') || 'Delete'}
        cancelText={t('cancel') || 'Cancel'}
      />

      {/* Add Button and Table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <IconPlus style={{ marginRight: '0.5rem' }} />
          {t('create-organization')}
        </Button>
      </div>

      <DataTable<Organization>
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
    </>
  );
}
