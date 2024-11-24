'use client'

import { useTranslations } from 'next-intl'

import AuthForm from '../components/auth-form'
import SignUpMagicLink from './magic-link'
import SignUpPassword from './password'

export default function SignUp() {
  const t = useTranslations('auth')

  return (
    <AuthForm
      title={t('sign-up')}
      passwordForm={<SignUpPassword />}
      linkForm={<SignUpMagicLink />}
    />
  )
}
