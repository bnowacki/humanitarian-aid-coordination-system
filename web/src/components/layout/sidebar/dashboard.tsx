import React from 'react'

import { FaIceCream, FaShieldAlt } from 'react-icons/fa'

import SignOutButton from '@/components/sign-out-button'

import Sidebar, { SidebarItem } from './sidebar'

const items: SidebarItem[] = [
  {
    label: 'Recipies',
    href: '/recipies',
    icon: <FaIceCream />,
  },
  {
    label: 'Chat',
    href: '/chat',
    icon: <FaIceCream />,
  },
  {
    label: 'Team members',
    href: '/team',
    icon: <FaIceCream />,
  },
]

const itemsBottom: SidebarItem[] = [
  {
    label: 'Admin panel',
    href: '/admin',
    admin: true,
    icon: <FaShieldAlt />,
  },
  {
    element: <SignOutButton />,
  },
]

export default function DashboardSidebar() {
  return <Sidebar items={items} itemsBottom={itemsBottom} />
}
