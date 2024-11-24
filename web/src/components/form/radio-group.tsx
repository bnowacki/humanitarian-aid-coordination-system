import React, { forwardRef } from 'react'

import { RadioGroupRootProps, Stack } from '@chakra-ui/react'
import { FieldError } from 'react-hook-form'

import { RadioGroup as ChakraRadioGroup, Radio } from '@/components/ui/radio'
import { Option } from '@/types/input'

export type RadioGroupProps<V = string> = Omit<RadioGroupRootProps, 'ref' | 'onChange'> & {
  label?: string
  defaultValue?: V
  items: Option<V>[]
  onChange: (v: V) => void
  className?: string
  error?: FieldError
}

const RadioGroupInner = (
  { label, defaultValue, items, onChange, ...rest }: RadioGroupProps,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return (
    <ChakraRadioGroup
      defaultValue={defaultValue}
      aria-label={label}
      onValueChange={({ value }) => {
        onChange(value)
      }}
      ref={ref}
      {...rest}
    >
      <Stack>
        {items.map(i => (
          <Radio key={i.value} id={i.value} value={i.value}>
            {i.label}
          </Radio>
        ))}
      </Stack>
    </ChakraRadioGroup>
  )
}

// https://fettblog.eu/typescript-react-generic-forward-refs/#option-1%3A-type-assertion
const RadioGroup = forwardRef(RadioGroupInner) as <V = string>(
  props: RadioGroupProps<V> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof RadioGroupInner>

export default RadioGroup
