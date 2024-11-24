import React from 'react'

import { IconButton } from '@chakra-ui/react'
import { IconFilter, IconFilterFilled } from '@tabler/icons-react'
import { Column, RowData } from '@tanstack/react-table'

import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover'

import RadioFilter from './radio-filter'
import TextFilter from './text-filter'

export default function FilterPopover<TData extends RowData, TValue = unknown>({
  column,
}: {
  column: Column<TData, TValue>
}) {
  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <IconButton variant="ghost" rounded="full" size="sm">
          {column.getIsFiltered() ? (
            <IconFilterFilled size={16} />
          ) : (
            <IconFilter color="#868686" size={16} />
          )}
        </IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <FilterContent column={column} />
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  )
}

function FilterContent<TData extends RowData, TValue = unknown>({
  column,
}: {
  column: Column<TData, TValue>
}) {
  switch (column.columnDef.meta?.filter?.variant) {
    case 'text':
      return <TextFilter column={column} />
    case 'radio':
      return <RadioFilter column={column} />
    case 'range':
      // TODO:
      return null
    case 'date-range':
      // TODO:
      return null
  }

  return null
}
