import { ReactNode } from 'react'

export type Option<V = string> = {
  value: V
  label: string | ReactNode
}

export type SelectOption<V = string> = {
  value: V
  label: string
  index?: number
}

export type SelectOptionsGroup<V = string> = {
  value: V // group id
  label: string
  options: SelectOption<V>[]
}
