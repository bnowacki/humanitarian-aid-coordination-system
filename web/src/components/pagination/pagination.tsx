import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'

import styles from './pagination.module.scss'

type Props = {
  page: number
  setPage: (v: number) => void
  pageSize: number
  totalCount: number
  scrollToRef?: React.RefObject<any>
  className?: string
}

export default function Pagination({
  page,
  setPage: _setPage,
  pageSize,
  totalCount,
  scrollToRef,
  className,
}: Props) {
  const t = useTranslations('pagination')

  const inputRef = useRef<HTMLInputElement>(null)

  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [pageSize, totalCount])

  const adjustInputWidth = useCallback(() => {
    if (!inputRef.current) return

    const value = inputRef.current.value

    // Create a canvas element to measure text width
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (context && window.getComputedStyle(inputRef.current)) {
      const font = window.getComputedStyle(inputRef.current).font
      context.font = font
      const textWidth = context.measureText(value).width

      inputRef.current.style.width = `${textWidth + 16}px`
    }
  }, [])

  useEffect(() => {
    adjustInputWidth()
  }, [adjustInputWidth])

  useEffect(() => {
    if (!inputRef.current) return

    inputRef.current.value = page.toString()
    adjustInputWidth()
  }, [page]) // eslint-disable-line

  const handleScrollToRef = useCallback(() => {
    if (!scrollToRef?.current) return

    window.scrollTo({
      top: scrollToRef?.current.getBoundingClientRect().top + window.scrollY - 100,
      behavior: 'smooth',
    })
  }, [scrollToRef])

  const setPage = useCallback(
    (v: number) => {
      handleScrollToRef()
      _setPage(v)
    },
    [_setPage, handleScrollToRef]
  )

  const setValue = useCallback(() => {
    if (!inputRef.current) return

    const s = inputRef.current?.value
    const iOfDot = s.indexOf('.')
    const v = s === '' || isNaN(+s) ? '' : s.slice(0, iOfDot > 0 ? iOfDot : undefined)

    const num = v === '' ? 1 : Math.max(Math.min(+v, totalPages || Infinity), 1 || -Infinity)
    inputRef.current.value = num.toString()
    setPage(num)
    adjustInputWidth()

    inputRef.current.blur()
  }, [adjustInputWidth, setPage, totalPages])

  return (
    <div className={clsx(styles.Container, className)}>
      <button
        className={clsx(styles.Button, page <= 1 && styles.Disabled)}
        onClick={() => setPage(page - 1)}
      >
        <IconChevronLeft size={20} strokeWidth={3} />
      </button>
      <input
        id="pagination-input"
        type="number"
        ref={inputRef}
        className={styles.Input}
        min={1}
        max={totalPages}
        onBlur={setValue}
        onKeyDown={e => e.key === 'Enter' && setValue()}
        onChange={adjustInputWidth}
      />
      <span className={styles.From}>{t('from')}</span>
      <span>{totalPages}</span>
      <button
        className={clsx(styles.Button, page >= totalPages && styles.Disabled)}
        onClick={() => setPage(page + 1)}
      >
        <IconChevronRight size={20} strokeWidth={3} />
      </button>
    </div>
  )
}
