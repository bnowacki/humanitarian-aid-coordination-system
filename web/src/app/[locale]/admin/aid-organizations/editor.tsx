'use client';

import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { SubmitHandler, useForm } from 'react-hook-form';

import EditorDialog, { EditorDialogProps } from '@/components/editor-dialog';
import { FormInput } from '@/components/form/input';
import useLoadingState from '@/hooks/use-loading-state';
import { createClient } from '@/lib/supabase/client';
import { Organization } from '@/types/models';

import { emptyOrganization, organizationSchema } from './constants';

export default function OrganizationEditorDialog({
    item,
    open,
    onClose,
    onComplete,
  }: EditorDialogProps & { item: Organization | null; onComplete?: () => Promise<void> }) {
    const t = useTranslations('admin.organizations');
  
    const form = useForm<Omit<Organization, 'id'>>({
      resolver: zodResolver(organizationSchema),
      defaultValues: item
        ? { name: item.name, description: item.description || '' } // For editing, use existing data
        : { name: '', description: '' }, // For adding, initialize with empty strings
    });
  
    React.useEffect(() => {
      form.reset(
        item
          ? { name: item.name, description: item.description || '' }
          : { name: '', description: '' }
      );
    }, [item]); // Reset form on item change
  
    const [onSubmit, submitting] = useLoadingState<SubmitHandler<Omit<Organization, 'id'>>>(
      React.useCallback(
        async data => {
          const client = createClient();
  
          if (item?.id) {
            // Update existing organization
            const res = await client
              .from('organizations')
              .update({
                name: data.name,
                description: data.description || null,
              })
              .eq('id', item.id);
  
            if (res.error) throw res.error;
          } else {
            // Add new organization
            const res = await client.from('organizations').insert({
              name: data.name,
              description: data.description || null,
            });
  
            if (res.error) throw res.error;
          }
  
          await onComplete?.();
          onClose();
        },
        [item, onComplete, onClose]
      ),
      {
        onErrorToast: t('save-error') || 'Failed to save organization',
      }
    );
  
    return (
      <EditorDialog<Omit<Organization, 'id'>>
        open={open}
        form={form}
        onOpenChange={v => !v && onClose()}
        onSubmit={onSubmit}
        loading={submitting}
        title={item ? t('editor-title') : t('create-title')}
      >
        <FormInput name="name" control={form.control} label={t('name')} />
        <FormInput name="description" control={form.control} label={t('description')} />
      </EditorDialog>
    );
  }

export const deleteOrganization = async (
  organizationId: string,
  t?: (key: string) => string,
  onComplete?: () => Promise<void>,
  onClose?: () => void
) => {

  const client = createClient();
  const res = await client.from('organizations').delete().eq('id', organizationId);

  if (res.error) throw res.error;

  await onComplete?.();
  onClose?.();
};
