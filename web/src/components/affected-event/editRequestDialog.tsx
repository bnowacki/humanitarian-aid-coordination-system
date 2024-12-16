'use client'

import { useEffect, useState } from 'react'

import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { NativeSelectField, NativeSelectRoot } from '@/components/ui/native-select'
import { createClient } from '@/lib/supabase/client'

const statuses = ['pending', 'approved', 'rejected']

const EditRequestDialog = ({
  requestId,
  onClose,
  onnUpdate,
}: {
  requestId: string
  onClose: () => void
  onnUpdate: () => void
}) => {
  const t = useTranslations('request')
  const { control, handleSubmit, reset } = useForm()
  const [loading, setLoading] = useState(false)
  const [request, setRequest] = useState<any>(null)

  const tables = ['help_requests', 'resource_requests']

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        let requestData: any = null
        for (let i = 0; i < tables.length; i++) {
          const { data, error } = await supabase
            .from(tables[i])
            .select('*')
            .eq('id', requestId)
            .single()

          if (data) {
            requestData = data
            break
          }
          if (error && i === tables.length - 1) {
            console.error('Error fetching request:', error)
          }
        }

        if (requestData) {
          setRequest(requestData)
          reset(requestData)
        }
      } catch (error) {
        console.error('Error fetching request:', error)
      } finally {
        setLoading(false)
      }
    }

    if (requestId) {
      fetchRequest()
    }
  }, [requestId, reset])

  // Handle request update
  const onUpdate = async (data: any) => {
    if (!requestId) {
      console.error('Invalid requestId:', requestId)
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      let requestType = request?.hasOwnProperty('quantity') ? 'resource_requests' : 'help_requests'

      const { error } = await supabase
        .from(requestType)
        .update({
          status: data.status,
        })
        .eq('id', requestId)

      if (error) throw error
      onClose() // Close dialog after update
      onnUpdate()
    } catch (error) {
      console.error('Error updating request:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle request deletion
  const onDelete = async () => {
    if (window.confirm(t('delete-request-confirm'))) {
      setLoading(true)
      try {
        const supabase = createClient()
        let requestType = request?.hasOwnProperty('quantity')
          ? 'resource_requests'
          : 'help_requests'

        const { error } = await supabase.from(requestType).delete().eq('id', requestId)

        if (error) {
          console.error('Error deleting request:', error)
          throw error
        }

        // Close dialog after deletion
        onClose()
        onnUpdate()
      } catch (error) {
        console.error('Error deleting request:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <DialogRoot size="lg" placement="center" motionPreset="slide-in-bottom" open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('edit-request')}</DialogTitle>
          <DialogCloseTrigger onClick={onClose} />
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit(onUpdate)}>
            <Field label={t('status')}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <NativeSelectRoot>
                    <NativeSelectField
                      {...field}
                      items={statuses}
                      onChange={e => field.onChange(e.target.value)}
                    />
                  </NativeSelectRoot>
                )}
              />
            </Field>

            <Button
              type="submit"
              colorScheme="blue"
              loading={loading}
              loadingText="Submitting"
              width="full"
            >
              {t('update-request')}
            </Button>
          </form>

          <Button
            variant="outline"
            colorScheme="red"
            onClick={onDelete}
            loading={loading}
            width="full"
            mt={4}
          >
            {t('delete-request')}
          </Button>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}

export default EditRequestDialog
