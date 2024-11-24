import React, { useMemo } from 'react'

import {
  IconFirstAidKit,
  IconGavel,
  IconHome,
  IconLayoutDashboard,
  IconUsers,
} from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

import SignOutButton from '@/components/sign-out-button'

import Sidebar, { SidebarItem } from './sidebar'

export default function AdminSidebar() {
  const t = useTranslations('admin.sidebar')

  const items = useMemo<SidebarItem[]>(
    () => [
      {
        label: t('dashboard'),
        href: '/admin',
        icon: <IconLayoutDashboard />,
      },
      {
        label: t('users'),
        href: '/admin/users',
        icon: <IconUsers />,
      },
      {
        label: t('governments'),
        href: '/admin/governments',
        icon: <IconGavel />,
      },
      {
        label: t('aid-organizations'),
        href: '/admin/aid-organizations',
        icon: <IconFirstAidKit />,
      },
    ],
    [t]
  )

  const itemsBottom = useMemo<SidebarItem[]>(
    () => [
      {
        label: t('home'),
        href: '/',
        icon: <IconHome />,
      },
      {
        element: <SignOutButton />,
      },
    ],
    [t]
  )

  return <Sidebar items={items} itemsBottom={itemsBottom} />
}
