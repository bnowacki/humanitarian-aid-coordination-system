'use client'

import { useTranslations } from 'next-intl'

import AuthForm from '../components/auth-form'
import SignInMagicLink from './magic-link'
import SignInPassword from './password'

export default function SignIn() {
  const t = useTranslations('auth')

  return (
    <AuthForm
      title={t('sign-in')}
      linkForm={<SignInMagicLink />}
      passwordForm={<SignInPassword />}
    />
  )
}
