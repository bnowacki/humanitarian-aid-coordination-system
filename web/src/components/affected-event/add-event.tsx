'use client'

import { useState } from 'react'

import { Input } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'

import fetchEvents from '@/components/affected-event/event-manager'
import { Button } from '@/components/ui/button'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field } from '@/components/ui/field'
import { NativeSelectField, NativeSelectRoot } from '@/components/ui/native-select'
import { createClient } from '@/lib/supabase/client'

// Define the event status options for the NativeSelect
const statuses = ['active', 'completed', 'canceled']

const AddEventDialog = ({ onEventAdded }: { onEventAdded: () => void }) => {
  const t = useTranslations('event')

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      status: 'active', // Set the default value of status to 'active'
    },
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: any) => {
    setLoading(true)

    try {
      const supabase = createClient()

      // Insert the new event into the Supabase 'events' table
      const { error } = await supabase.from('events').insert([
        {
          title: data.title,
          location: data.location,
          status: data.status,
          description: data.description,
        },
      ])

      if (error) throw error

      // Trigger the parent component to refresh the events list
      onEventAdded()

      // Reset the form after successful submission
      reset()
      fetchEvents()
    } catch (error) {
      console.error('Error adding event:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogRoot size="cover" placement="center" motionPreset="slide-in-bottom">
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {t('add-event')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('add-new-event')}</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field label={t('title')}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input {...field} placeholder={t('event-title')} />}
                rules={{ required: 'Title is required' }}
              />
            </Field>

            <Field label={t('location')}>
              <Controller
                name="location"
                control={control}
                render={({ field }) => <Input {...field} placeholder={t('event-location')} />}
                rules={{ required: 'Location is required' }}
              />
            </Field>

            <Field label={t('status')}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <NativeSelectRoot>
                    <NativeSelectField
                      {...field} // Connect the NativeSelect to react-hook-form
                      items={statuses} // Pass status options to the NativeSelectField
                      onChange={e => field.onChange(e.target.value)} // Handle selection change
                    />
                  </NativeSelectRoot>
                )}
              />
            </Field>

            <Field label={t('description')}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Input {...field} placeholder={t('event-description')} />}
              />
            </Field>

            <Button
              type="submit"
              colorScheme="blue"
              loading={loading}
              loadingText="Submitting"
              width="full"
            >
              {t('add-event')}
            </Button>
          </form>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}

export default AddEventDialog
