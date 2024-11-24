import React from 'react'

import { Stack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form'

import {
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'

import { Form } from './form/form'
import { Button } from './ui/button'

export type EditorDialogProps = {
  open: boolean
  onClose: () => void
  onComplete?: () => Promise<void>
}

type Props<T extends FieldValues = FieldValues> = {
  open: boolean
  onOpenChange: (v: boolean) => void
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  title?: React.ReactNode
  form: UseFormReturn<T>
  onSubmit: SubmitHandler<T>
}

export default function EditorDialog<T extends FieldValues = FieldValues>({
  open,
  onOpenChange,
  title,
  children,
  form,
  onSubmit,
  loading,
  disabled,
}: Props<T>) {
  const t = useTranslations('editor-dialog')

  return (
    <DialogRoot open={open} onOpenChange={e => onOpenChange(e.open)} placement="center">
      <DialogBackdrop />
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>{title && <DialogTitle>{title}</DialogTitle>}</DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, e => console.log(e))}>
            <DialogBody>
              <Stack gap={4}>{children}</Stack>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline" disabled={disabled || loading}>
                  {t('cancel')}
                </Button>
              </DialogActionTrigger>
              <Button type="submit" loading={loading} disabled={disabled}>
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </DialogRoot>
  )
}
