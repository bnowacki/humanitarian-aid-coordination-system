import { ReactNode } from 'react'

import { Input, InputProps } from '@chakra-ui/react'
import { ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { PasswordInput } from '@/components/ui/password-input'

import { FormControl, FormFieldController, FormItem } from './form'

export type FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  InputProps & {
    label?: string
    helperText?: ReactNode
    type?: 'text' | 'password'
  }

export const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  helperText,
  type = 'text',
  name,
  rules,
  shouldUnregister,
  defaultValue,
  control,
  disabled,
  ...props
}: FormInputProps<TFieldValues, TName>) => {
  return (
    <FormFieldController
      {...{ name, rules, shouldUnregister, defaultValue, control, disabled }}
      render={({ field }) => (
        <FormItem label={label} helperText={helperText}>
          <FormControl>
            {type === 'text' ? (
              <Input
                {...props}
                {...field}
                _readOnly={{
                  opacity: 0.6,
                  cursor: 'default',
                }}
              />
            ) : (
              <PasswordInput {...props} {...field} />
            )}
          </FormControl>
        </FormItem>
      )}
    />
  )
}
