import { useEffect, useRef } from 'react'
import { SendArrow } from './SendArrow'
import { ASK_COPY, type AskLocale } from './copy'

type ChatComposerProps = {
  locale: AskLocale
  value: string
  disabled?: boolean
  autoFocus?: boolean
  onChange: (value: string) => void
  onSubmit: () => void
}

export function ChatComposer({
  locale,
  value,
  disabled,
  autoFocus,
  onChange,
  onSubmit,
}: ChatComposerProps) {
  const copy = ASK_COPY[locale]
  const ref = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${Math.min(node.scrollHeight, 160)}px`
  }, [value])

  useEffect(() => {
    if (autoFocus) ref.current?.focus()
  }, [autoFocus])

  return (
    <form
      className="relative flex items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        if (!value.trim() || disabled) return
        onSubmit()
      }}
    >
      <textarea
        ref={ref}
        rows={1}
        value={value}
        disabled={disabled}
        placeholder={copy.placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            if (!value.trim() || disabled) return
            onSubmit()
          }
        }}
        className="max-h-40 min-h-10 w-full resize-none bg-transparent py-2.5 pr-12 text-base outline-none placeholder:text-zinc-500 sm:text-sm dark:placeholder:text-zinc-400"
        aria-label={copy.placeholder}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="absolute right-0.5 bottom-1 rounded-full bg-zinc-700 p-2 text-white transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40 enabled:cursor-pointer dark:bg-zinc-600"
        aria-label={copy.send}
      >
        <SendArrow className="transition-transform duration-200 hover:-translate-y-0.5 sm:h-5 sm:w-5" />
      </button>
    </form>
  )
}
