import React, { useRef } from 'react'

import { Text } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'

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
import useLoadingState from '@/hooks/use-loading-state'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database.types'

import { Button } from './ui/button'
import { ToastOptions } from './ui/toaster'

type Props = {
  open?: boolean
  onClose: () => void
  onComplete?: () => Promise<void>
  table?: keyof Database['public']['Tables']
  id?: string | number
  onDelete?: () => Promise<void>
  title?: string
  name?: string
  onErrorToast?: string | ToastOptions
  onSuccessToast?: string | ToastOptions
}

const DeleteResourceDialog = ({
  id,
  table,
  onClose,
  open,
  onComplete,
  onDelete,
  title,
  name,
  onErrorToast,
  onSuccessToast,
}: Props) => {
  const t = useTranslations('delete-resource-dialog')

  const cancelRef = useRef<HTMLButtonElement>(null)

  const [handleSubmit, loading] = useLoadingState(
    React.useCallback(async () => {
      if (onDelete) {
        await onDelete()
      } else if (!!id && !!table) {
        const supabase = createClient()
        const { error, count } = await supabase.from(table).delete({ count: 'exact' }).match({ id })
        if (error) throw error
        if (!count) throw new Error('No rows deleted')
      } else {
        throw new Error('Missing item details')
      }

      onComplete?.()
      onClose()
    }, [id, onClose, onComplete, onDelete, table]),
    {
      onErrorToast: onErrorToast || t('error-toast'),
      onSuccessToast: onSuccessToast || t('success-toast'),
    }
  )

  return (
    <DialogRoot
      open={open}
      onOpenChange={e => !e.open && onClose()}
      placement="center"
      initialFocusEl={() => cancelRef.current}
    >
      <DialogBackdrop />
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          <DialogTitle>{title || t('title')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text gap={4}>
            Do you want to delete {name ? <strong>{name}</strong> : 'the resource'}? Changes are
            permament.
          </Text>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild ref={cancelRef}>
            <Button variant="outline" disabled={loading}>
              {t('cancel')}
            </Button>
          </DialogActionTrigger>
          <Button onClick={handleSubmit} loading={loading} colorPalette="red">
            {t('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}

export default DeleteResourceDialog
