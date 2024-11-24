import { SelectLabel, SelectRootProps, createListCollection } from '@chakra-ui/react'
import { ControllerProps, FieldError, FieldPath, FieldValues } from 'react-hook-form'

import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select'
import { SelectOption } from '@/types/input'

import { FormControl, FormFieldController, FormItem } from './form'

export type SelectProps<V = string> = Omit<
  SelectRootProps,
  'ref' | 'onChange' | 'value' | 'collection'
> & {
  label?: string
  items: SelectOption<V>[]
  value?: V
  onChange: (v: V) => void
  error?: FieldError
  portalled?: boolean
}

export function Select<V = string>({
  value,
  items,
  onChange,
  label,
  portalled,
  ...props
}: SelectProps<V>) {
  const collection = createListCollection({
    items: items,
  })

  return (
    <SelectRoot
      collection={collection}
      value={(collection.items.filter(i => i.value === value).map(i => i.value) || []) as string[]}
      onValueChange={e => {
        onChange(e.value[0] as V)
      }}
      variant="outline"
      multiple={false}
      {...props}
    >
      {label && <SelectLabel>{label}</SelectLabel>}
      <SelectTrigger>
        <SelectValueText />
      </SelectTrigger>
      <SelectContent portalled={portalled}>
        {collection.items.map((item, i) => (
          <SelectItem item={item} key={i}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}

export type FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  Omit<SelectProps, 'value' | 'onChange'> & {
    helperText?: string
    portalled?: boolean
  }

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  helperText,
  name,
  rules,
  shouldUnregister,
  defaultValue,
  control,
  disabled,
  items,
  portalled,
  ...props
}: FormSelectProps<TFieldValues, TName>) {
  const collection = createListCollection({
    items: items,
  })

  return (
    <FormFieldController
      {...{ name, rules, shouldUnregister, defaultValue, control, disabled }}
      render={({ field }) => (
        <FormItem label={label} helperText={helperText}>
          <FormControl>
            <SelectRoot
              name={field.name}
              onValueChange={({ value }) => field.onChange(value[0])}
              onInteractOutside={() => field.onBlur()}
              collection={collection}
              value={
                (collection.items
                  .filter(i => i.value === field.value)
                  .map(i => i.value) as string[]) || ([] as string[])
              }
              variant="outline"
              multiple={false}
              {...props}
            >
              <SelectTrigger>
                <SelectValueText placeholder="Select role" />
              </SelectTrigger>
              <SelectContent portalled={portalled}>
                {collection.items.map((item, i) => (
                  <SelectItem item={item} key={i}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
