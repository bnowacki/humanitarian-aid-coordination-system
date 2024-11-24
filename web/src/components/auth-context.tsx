'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import React from 'react'

import useLoadingState from '@/hooks/use-loading-state'
import { createClient } from '@/lib/supabase/client'
import { UserProfile } from '@/types/models'

type AuthContextType = {
  profile: UserProfile | null
  loading: boolean
  isAdmin: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export interface Props {
  [propName: string]: any
}

export const AuthContextProvider = (props: Props) => {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const [getProfile, profileLoading] = useLoadingState(
    useCallback(async () => {
      const supabase = createClient()

      const { data: profile, error: profileError } = await supabase
        .from('user_profile')
        .select('*')
        .single()
      if (profileError) throw profileError

      setProfile(profile)
    }, []),
    {
      onErrorToast: 'Failed to get current user',
    }
  )

  React.useEffect(() => {
    const supabase = createClient()

    const { data } = supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_OUT') {
        setProfile(null)
        return
      }

      if (event === 'SIGNED_IN') {
        getProfile()
        return
      }
    })

    return () => {
      data.subscription.unsubscribe()
    }
  }, []) // eslint-disable-line

  return (
    <AuthContext.Provider
      value={{
        profile,
        isAdmin: !!profile && profile?.role === 'admin',
        loading: profileLoading,
      }}
      {...props}
    />
  )
}

export const useAuth = () => {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthContextProvider')

  return value
}
