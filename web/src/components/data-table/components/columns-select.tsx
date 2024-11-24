import { IconButton, Stack } from '@chakra-ui/react'
import { IconLayoutColumns } from '@tabler/icons-react'
import { Table } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tooltip } from '@/components/ui/tooltip'

export default function ColumnsSelect({ table }: { table: Table<any> }) {
  const t = useTranslations('table')

  return (
    <>
      <DialogRoot placement="center">
        <Tooltip content={t('columns-select')}>
          <DialogTrigger asChild>
            <IconButton variant="outline" rounded="full">
              <IconLayoutColumns size={20} />
            </IconButton>
          </DialogTrigger>
        </Tooltip>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('columns-select')}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Stack>
              {table.getAllColumns().map(column =>
                !column.getCanHide() ? null : (
                  <Checkbox
                    key={column.id}
                    id={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={v => column.toggleVisibility(!!v.checked)}
                  >
                    {column.columnDef.header?.toString() || '-'}
                  </Checkbox>
                )
              )}
            </Stack>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => table.toggleAllColumnsVisible(!table.getIsAllColumnsVisible())}
            >
              {table.getIsAllColumnsVisible() ? t('deselect-all') : t('select-all')}
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  )
}
