'use client'

import { z } from 'zod'

import { AdminUser } from '@/types/models'

export const emptyUser: AdminUser = {
  id: '',
  email: '',
  full_name: '',
  role: 'user',
  created_at: '',
  last_sign_in_at: '',
  invited_at: '',
  phone: null,
}

export const userSchema = z.object({
  email: z.string().email().trim(),
  full_name: z
    .string()
    .min(1, 'Required field')
    .max(100, 'Full name can be at most 100 charactes long')
    .trim(),
  role: z.enum(['user', 'admin']),
})
