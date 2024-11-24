'use client'

import { useCallback } from 'react'

import { Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useAuth } from '@/components/auth-context'
import { Form } from '@/components/form/form'
import { FormInput } from '@/components/form/input'
import { Button } from '@/components/ui/button'
import useLoadingState from '@/hooks/use-loading-state'
import { useRouter } from '@/i18n/navigation'

import { signUp } from '../actions'
import { SignUpInput, signUpSchema } from '../schemas'

export default function SignUpPassword() {
  const t = useTranslations('auth')

  const router = useRouter()

  const { fetchProfile } = useAuth()

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  })

  const [onSubmit, submitting] = useLoadingState<SubmitHandler<SignUpInput>>(
    useCallback(
      async data => {
        const res = await signUp(data)
        if (res && 'error' in res && res?.error) throw res.error
        if (res && 'session' in res && !!res.session) {
          await fetchProfile()
        }
        router.replace('/')
      },
      [fetchProfile, router]
    ),
    {
      onErrorToast: t('sign-up-error'),
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
          <FormInput
            name="fullName"
            control={form.control}
            placeholder={t('name-surname')}
            label={t('full-name')}
          />
          <FormInput type="password" name="password" control={form.control} label={t('password')} />
          <FormInput
            type="password"
            name="confirmPassword"
            control={form.control}
            label={t('confirm-password')}
          />
        </Stack>
        <Button type="submit" loading={submitting} w="full" mt={8}>
          {t('sign-up')}
        </Button>
      </form>
    </Form>
  )
}
