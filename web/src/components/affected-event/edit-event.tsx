'use client'

import { useEffect, useState } from 'react'

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
import { NativeSelectField, NativeSelectRoot } from '@/components/ui/native-select'
import { createClient } from '@/lib/supabase/client'

const statuses = ['active', 'completed', 'canceled']

const EditEventDialog = ({
  eventId,
  onEventUpdated,
}: {
  eventId: string
  onEventUpdated: () => void
}) => {
  const t = useTranslations('event')
  const { control, handleSubmit, reset } = useForm()
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch the event data when the component mounts or when `eventId` changes
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single()

        if (error) throw error
        setEvent(data)
        reset(data) // Pre-fill the form with fetched event data
        setIsDialogOpen(true) // Automatically open the dialog once data is fetched
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setLoading(false)
      }
    }

    if (eventId) fetchEvent()
  }, [eventId, reset])

  // Handle event update
  const onUpdate = async (data: any) => {
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('events')
        .update({
          title: data.title,
          location: data.location,
          status: data.status,
          description: data.description,
        })
        .eq('id', eventId)

      if (error) throw error

      // Trigger the parent component to refresh the events list
      onEventUpdated()
      setIsDialogOpen(false) // Close the dialog after update
    } catch (error) {
      console.error('Error updating event:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle event deletion
  const onDelete = async () => {
    if (window.confirm(t('delete-event-confirm'))) {
      setLoading(true)

      try {
        const supabase = createClient()
        const { error } = await supabase.from('events').delete().eq('id', eventId)

        if (error) throw error

        // Trigger the parent component to refresh the events list
        onEventUpdated()
        setIsDialogOpen(false) // Close the dialog after deletion
      } catch (error) {
        console.error('Error deleting event:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading || !event) {
    return (
      <DialogRoot
        size="cover"
        placement="center"
        motionPreset="slide-in-bottom"
        open={isDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('loading')}</DialogTitle>
          </DialogHeader>
          <DialogBody></DialogBody>
        </DialogContent>
      </DialogRoot>
    )
  }

  return (
    <DialogRoot size="cover" placement="center" motionPreset="slide-in-bottom" open={isDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('edit-event')}</DialogTitle>
          <DialogCloseTrigger onClick={() => setIsDialogOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit(onUpdate)}>
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
                      {...field}
                      items={statuses}
                      onChange={e => field.onChange(e.target.value)}
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
              {t('update-event')}
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
            {t('delete-event')}
          </Button>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}

export default EditEventDialog
