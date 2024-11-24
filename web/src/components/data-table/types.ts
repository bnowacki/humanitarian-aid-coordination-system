import { ColumnPinningPosition, RowData } from '@tanstack/react-table'

import { Option } from '@/types/input'

export type FilterVariant = 'text' | 'range' | 'radio' | 'date-range'

export type Operator =
  | 'and'
  | 'eq'
  | 'gt'
  | 'gte'
  | 'ilike'
  | 'lt'
  | 'lte'
  | 'noteq'
  | 'notilike'
  | 'notnull'
  | 'null'
  | 'or'
  | 'ov'
  | 'notov'
  | 'empty'
  | 'notempty'

export type Filter = {
  op: Operator
  column?: string
  value?: string
  children?: Filter[]
}

declare module '@tanstack/react-table' {
  //allows us to define custom properties for our columns
  // eslint-disable-next-line
  interface ColumnMeta<TData extends RowData, TValue> {
    // name of database column to sort by (defaults to snake case column id)
    sortByColumn?: string
    filter?: {
      // name of database column to filter by (defaults to snake case column id)
      column?: string
      variant: FilterVariant
      // for enum variant
      options?: Option[]
    }
    initiallyVisible?: boolean
    initialPinning?: ColumnPinningPosition
  }
}
