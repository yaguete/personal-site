import { useEffect, useRef } from 'react'
import { XIcon } from 'lucide-react'
import type { UIMessage } from 'ai'
import { ChatComposer } from './ChatComposer'
import { ChatMessage } from './ChatMessage'
import { ASK_COPY, type AskLocale, friendlyAskError } from './copy'

type ChatPanelProps = {
  locale: AskLocale
  messages: UIMessage[]
  status: string
  error?: Error
  input: string
  empty?: string
  suggestions?: readonly string[]
  onInputChange: (value: string) => void
  onSubmit: () => void
  onClose: () => void
  onSuggestion: (text: string) => void
  onReset: () => void
}

export function ChatPanel({
  locale,
  messages,
  status,
  error,
  input,
  empty,
  suggestions,
  onInputChange,
  onSubmit,
  onClose,
  onSuggestion,
  onReset,
}: ChatPanelProps) {
  const copy = ASK_COPY[locale]
  const chips = suggestions ?? copy.suggestions
  const intro = empty ?? copy.empty
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    const node = scrollerRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [messages, status])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-yago-title"
      className="flex h-full min-h-0 flex-col overscroll-contain bg-white/90 pt-[env(safe-area-inset-top)] backdrop-blur-xl dark:bg-zinc-900/90 sm:rounded-3xl sm:bg-white/85 sm:pt-0 sm:ring-1 sm:ring-zinc-200/60 sm:dark:bg-zinc-900/85 sm:dark:ring-zinc-800/60"
    >
      <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <img
            src="/favicon.ico"
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 shrink-0 dark:invert"
          />
          <p
            id="ask-yago-title"
            className="text-sm font-medium text-zinc-800 dark:text-zinc-100"
          >
            {copy.title}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 ? (
            <button
              type="button"
              onClick={onReset}
              className="rounded-full px-2.5 py-1 text-xs text-zinc-500 transition-colors hover:bg-zinc-200/70 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              {copy.reset}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-200/70 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label={copy.close}
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div
        ref={scrollerRef}
        data-ask-scroll
        className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 pb-3 sm:px-5"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col justify-end gap-4 pb-2">
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {intro}
            </p>
            <div className="flex flex-wrap gap-2">
              {chips.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSuggestion(suggestion)}
                  className="rounded-full bg-zinc-100 px-3 py-1.5 text-left text-xs text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} locale={locale} />
          ))
        )}
        {busy && messages.at(-1)?.role !== 'assistant' ? (
          <p className="text-xs text-zinc-400">{copy.thinking}</p>
        ) : null}
        {error ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {friendlyAskError(error, copy.error)}
          </p>
        ) : null}
      </div>

      <div className="border-t border-zinc-200/70 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 dark:border-zinc-800/70 sm:px-5">
        <ChatComposer
          locale={locale}
          value={input}
          disabled={busy}
          autoFocus
          onChange={onInputChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  )
}
