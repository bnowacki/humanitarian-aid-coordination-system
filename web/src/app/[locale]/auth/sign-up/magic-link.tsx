import React from 'react'

import { Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Form } from '@/components/form/form'
import { FormInput } from '@/components/form/input'
import { Button } from '@/components/ui/button'
import useLoadingState from '@/hooks/use-loading-state'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email().trim(),
  fullName: z
    .string()
    .min(1, 'Required field')
    .max(100, 'Full name can be at most 100 charactes long')
    .trim(),
})

type InputType = z.infer<typeof schema>

export default function SignUpMagicLink() {
  const t = useTranslations('auth')

  const form = useForm<InputType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      fullName: '',
    },
  })

  const [onSubmit, submitting] = useLoadingState<SubmitHandler<InputType>>(
    async data => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          data: { full_name: data.fullName },
        },
      })
      if (error) throw error
    },
    {
      onErrorToast: t('magic-link-error'),
    }
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack>
          <FormInput
            name="email"
            control={form.control}
            placeholder="you@example.com"
            label="Email"
            helperText={t('magic-link-helper-text')}
          />
          <FormInput
            name="fullName"
            control={form.control}
            placeholder={t('name-surname')}
            label={t('full-name')}
          />
        </Stack>
        <Button type="submit" loading={submitting} w="full" mt={8}>
          {t('send-link')}
        </Button>
      </form>
    </Form>
  )
}
