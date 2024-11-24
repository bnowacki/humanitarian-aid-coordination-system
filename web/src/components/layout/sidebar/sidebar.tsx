'use client'

import React, { ReactNode } from 'react'

import { Spacer, Stack } from '@chakra-ui/react'

import { useAuth } from '@/components/auth-context'
import { Button } from '@/components/ui/button'
import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'

export type SidebarItem =
  | ({
      label: string
      icon?: ReactNode
    } & (
      | {
          href: string
          admin?: boolean
          onClick?: never
          element?: never
        }
      | {
          href?: never
          element?: never
          onClick: () => void
        }
    ))
  | { element: ReactNode }

type Props = {
  items: SidebarItem[]
  itemsBottom?: SidebarItem[]
}

export default function Sidebar({ items, itemsBottom }: Props) {
  return (
    <Stack as="nav" p={2} h="100dvh" w={64} bg="gray.300">
      {items.map((item, i) => (
        <SidebarButton key={i} item={item} />
      ))}
      {!!itemsBottom?.length && (
        <>
          <Spacer />
          {itemsBottom?.map((item, i) => <SidebarButton key={i} item={item} />)}
        </>
      )}
    </Stack>
  )
}

function SidebarButton({ item }: { item: SidebarItem }) {
  const { isAdmin } = useAuth()
  const pathname = usePathname()

  const isActive = React.useMemo(
    () => 'href' in item && item.href && pathname === item.href,
    [item, pathname]
  )

  return 'label' in item ? (
    item.href ? (
      !item.admin || isAdmin ? (
        <Link href={item.href} passHref>
          <Button variant={isActive ? 'solid' : 'surface'} justifyContent="flex-start" w="full">
            {item.icon} <span>{item.label}</span>
          </Button>
        </Link>
      ) : null
    ) : (
      <Button onClick={item.onClick} variant="ghost" justifyContent="flex-start" w="full">
        {item.icon} {item.label}
      </Button>
    )
  ) : (
    item.element
  )
}
