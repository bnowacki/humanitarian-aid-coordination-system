'use client'

import React, { ReactNode } from 'react'

import { Box, IconButton, PopoverCloseTrigger, Stack, StackSeparator } from '@chakra-ui/react'
import { IconDotsVertical } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Link } from '@/i18n/navigation'

export type ContextMenuItem = {
  type: 'link' | 'action'
  text: string
  icon: ReactNode
  href?: string
  colorPalette?: React.ComponentProps<typeof Button>['colorPalette']
  callback?: () => void
  download?: boolean
  disabled?: boolean
  disabledTooltip?: string
}

export type ContextMenuItems = { main: ContextMenuItem[]; footer: ContextMenuItem[] }

interface ContextMenuProps {
  items: ContextMenuItems
}

const ContextMenu = ({ items }: ContextMenuProps) => {
  const renderItems = (itemList: ContextMenuItem[]) => (
    <Stack>
      {itemList.map((item, index) => (
        <PopoverCloseTrigger key={index} asChild>
          {item.type === 'link' && item.href ? (
            <Link
              download={item.download}
              href={item.href}
              style={{
                pointerEvents: item.disabled ? 'none' : undefined,
              }}
              aria-disabled={item.disabled}
            >
              {item.icon}
              {item.text}
            </Link>
          ) : (
            <Button
              onClick={() => !item.disabled && item.callback?.()}
              variant="ghost"
              justifyContent="flex-start"
              colorPalette={item.colorPalette}
            >
              {item.icon} {item.text}
            </Button>
          )}
        </PopoverCloseTrigger>
      ))}
    </Stack>
  )

  return (
    <PopoverRoot size="xs" positioning={{ placement: 'bottom-end' }}>
      <PopoverTrigger asChild>
        <IconButton variant="ghost" rounded="full" size="sm">
          <IconDotsVertical />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent w="196px">
        <PopoverArrow />
        <PopoverBody>
          <Stack separator={<StackSeparator />}>
            <Box>{renderItems(items.main)}</Box>
            {items.footer?.length ? <Box>{renderItems(items.footer)}</Box> : null}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  )
}

export default ContextMenu
