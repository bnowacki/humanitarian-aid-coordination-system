'use client'

import * as React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { SubmitHandler, useForm } from 'react-hook-form'

import EditorDialog, { EditorDialogProps } from '@/components/editor-dialog'
import { FormInput } from '@/components/form/input'
import { FormSelect } from '@/components/form/select'
import useLoadingState from '@/hooks/use-loading-state'
import { createClient } from '@/lib/supabase/client'
import { SelectOption } from '@/types/input'
import { AdminUser, UserRole } from '@/types/models'

import { emptyUser, userSchema } from './constants'

export default function UserEditorDialog({
  item,
  open,
  onClose,
  onComplete,
}: EditorDialogProps & { item: AdminUser | null; onComplete?: () => Promise<void> }) {
  const t = useTranslations('admin.users')

  const form = useForm<AdminUser>({
    resolver: zodResolver(userSchema),
    defaultValues: item || emptyUser,
  })

  React.useEffect(() => {
    form.reset(item || emptyUser)
  }, [item]) // eslint-disable-line

  const [onSubmit, submitting] = useLoadingState<SubmitHandler<AdminUser>>(
    React.useCallback(
      async data => {
        if (!item?.id) return

        const res = await createClient()
          .from('users')
          .update({
            full_name: data.full_name || undefined,
            role: data.role || 'user',
          })
          .eq('id', item?.id)
        if (res?.error) throw res.error

        await onComplete?.()
        onClose()
      },
      [item?.id, onComplete, onClose]
    ),
    {
      onErrorToast: 'Failed to update user',
    }
  )

  const userRoleLabel = React.useMemo<Record<UserRole, string>>(
    () => ({
      user: t('role-basic'),
      admin: t('role-admin'),
    }),
    [t]
  )

  const userRoleOptions = React.useMemo<SelectOption<UserRole>[]>(
    () => [
      {
        value: 'admin',
        label: userRoleLabel['admin'],
      },
      {
        value: 'user',
        label: userRoleLabel['user'],
      },
    ],
    [userRoleLabel]
  )

  return (
    <EditorDialog<AdminUser>
      open={open}
      form={form}
      onOpenChange={v => !v && onClose()}
      onSubmit={onSubmit}
      loading={submitting}
      title={t('editor-title')}
    >
      <FormInput readOnly name="id" control={form.control} label="ID" />
      <FormInput
        readOnly
        name="email"
        control={form.control}
        placeholder="example@mail.com"
        label="E-mail"
      />
      <FormInput name="full_name" control={form.control} label={t('full-name')} />
      <FormSelect
        name="role"
        control={form.control}
        items={userRoleOptions}
        label={t('role')}
        portalled={false}
      />
    </EditorDialog>
  )
}
