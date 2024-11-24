'use client'

import { Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { SubmitHandler, useForm } from 'react-hook-form'

import { Form } from '@/components/form/form'
import { FormInput } from '@/components/form/input'
import { Button } from '@/components/ui/button'
import useLoadingState from '@/hooks/use-loading-state'

import { signIn } from '../actions'
import { SignInInput, signInSchema } from '../schemas'

export default function SignInPassword() {
  const t = useTranslations('auth')

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [onSubmit, submitting] = useLoadingState<SubmitHandler<SignInInput>>(
    async data => {
      const res = await signIn(data)
      if (res?.error) {
        console.error(res.error)
        throw new Error('failed server-side validation')
      }
    },
    {
      onErrorToast: t('sign-in-error'),
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
          />
          <FormInput type="password" name="password" control={form.control} label={t('password')} />
        </Stack>
        <Button type="submit" loading={submitting} w="full" mt={8}>
          {t('sign-in')}
        </Button>
      </form>
    </Form>
  )
}
