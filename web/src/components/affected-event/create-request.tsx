'use client'

import { useState } from 'react'

import { Input } from '@chakra-ui/react'
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
import { createClient } from '@/lib/supabase/client'

const requestTypes = ['help', 'resource'] // Options for the type of request

const CreateRequestDialog = ({
  userId,
  eventId,
  onRequestCreated,
}: {
  userId: string
  eventId: string
  onRequestCreated: () => void
}) => {
  const t = useTranslations('request')
  const { control, handleSubmit, reset, watch } = useForm()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Watch the `type` field to conditionally show the `quantity` field
  const selectedType = watch('type', 'help')

  const onCreate = async (data: any) => {
    setLoading(true)

    try {
      const supabase = createClient()
      const tableName = data.type === 'help' ? 'help_requests' : 'resource_requests'
      const payload: any = {
        user_id: userId,
        event_id: eventId,
        name: data.name,
        description: data.description,
      }

      if (data.type === 'resource') {
        payload.quantity = data.quantity
      }

      const { error } = await supabase.from(tableName).insert(payload)

      if (error) throw error

      // Trigger the parent component to refresh the requests list
      onRequestCreated()
      setIsDialogOpen(false) // Close dialog after successful submission
      reset() // Reset form fields
    } catch (error) {
      console.error('Error creating request:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogRoot size="cover" placement="center" motionPreset="slide-in-bottom" open={isDialogOpen}>
      <Button onClick={() => setIsDialogOpen(true)} colorScheme="blue" size="sm">
        {t('create-request')}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('create-request')}</DialogTitle>
          <DialogCloseTrigger onClick={() => setIsDialogOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit(onCreate)}>
            <Field label={t('request-type')}>
              <Controller
                name="type"
                control={control}
                defaultValue="help"
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={e => field.onChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                    }}
                  >
                    {requestTypes.map(type => (
                      <option key={type} value={type}>
                        {t(type)}
                      </option>
                    ))}
                  </select>
                )}
              />
            </Field>

            <Field label={t('name')}>
              <Controller
                name="name"
                control={control}
                rules={{ required: t('name-required') }}
                render={({ field }) => <Input {...field} placeholder={t('request-name')} />}
              />
            </Field>

            <Field label={t('description')}>
              <Controller
                name="description"
                control={control}
                rules={{ required: t('description-required') }}
                render={({ field }) => <Input {...field} placeholder={t('request-description')} />}
              />
            </Field>

            {/* Show the quantity field only if the selected type is "resource" */}
            {selectedType === 'resource' && (
              <Field label={t('quantity')}>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{ required: t('quantity-required') }}
                  render={({ field }) => (
                    <Input
                      type="number"
                      {...field}
                      placeholder={t('quantity-placeholder')}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              </Field>
            )}

            <Button
              type="submit"
              colorScheme="blue"
              loading={loading}
              loadingText={t('submitting')}
              width="full"
            >
              {t('create-request')}
            </Button>
          </form>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}

export default CreateRequestDialog
