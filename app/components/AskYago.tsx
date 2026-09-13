'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { AnimatePresence, motion } from 'motion/react'
import useClickOutside from '@/app/hooks/useClickOutside'
import { ChatPanel } from './ask/ChatPanel'
import { SendArrow } from './ask/SendArrow'
import { ASK_COPY, type AskLocale, emptyForPath, suggestionsForPath } from './ask/copy'

const STORAGE_KEY = 'ask-yago-messages'

function detectLocale(pathname: string | null): AskLocale {
  if (pathname?.includes('/es')) return 'es'
  if (pathname?.includes('/eng')) return 'en'
  return 'en'
}

function readStoredMessages() {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function AskYago() {
  const pathname = usePathname()
  const locale = detectLocale(pathname)
  const copy = ASK_COPY[locale]
  const [open, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [pillValue, setPillValue] = useState('')
  const [composerValue, setComposerValue] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null!)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/ask',
        body: () => ({
          pageUrl: window.location.href,
          pathname: window.location.pathname,
        }),
      }),
    [],
  )

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport,
  })

  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    const stored = readStoredMessages()
    if (stored.length) setMessages(stored)
    setHydrated(true)
  }, [setMessages])

  useEffect(() => {
    if (!hydrated) return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages, hydrated])

  const close = useCallback(() => setOpen(false), [])

  useClickOutside(wrapperRef, () => {
    if (open && window.matchMedia('(min-width: 640px)').matches) close()
  })

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const mobile = window.matchMedia('(max-width: 639px)').matches
    if (!mobile) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  function submitText(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    setOpen(true)
    setPillValue('')
    setComposerValue('')
    sendMessage({ text: trimmed })
  }

  return (
    <div ref={wrapperRef}>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto fixed inset-0 z-50 sm:inset-auto sm:bottom-20 sm:left-1/2 sm:h-[min(560px,70vh)] sm:w-[420px] sm:-translate-x-1/2"
          >
            <ChatPanel
              locale={locale}
              messages={messages}
              status={status}
              error={error}
              input={composerValue}
              empty={emptyForPath(locale, pathname)}
              suggestions={suggestionsForPath(locale, pathname)}
              onInputChange={setComposerValue}
              onSubmit={() => submitText(composerValue)}
              onClose={close}
              onSuggestion={submitText}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!open ? (
        <div className="pointer-events-auto fixed bottom-4 left-1/2 z-50 -translate-x-1/2 sm:bottom-6">
          <form
            className="group relative"
            onSubmit={(event) => {
              event.preventDefault()
              if (!pillValue.trim()) return
              submitText(pillValue)
            }}
          >
            <label className="relative flex min-w-[200px] w-52 cursor-text items-center overflow-hidden rounded-[24px] bg-gray-200/80 px-4 py-1 shadow-none backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] group-focus-within:w-80 hover:scale-105 hover:-translate-y-0.5 hover:shadow-none dark:bg-gray-800/80">
              <input
                type="text"
                value={pillValue}
                onChange={(event) => setPillValue(event.target.value)}
                placeholder={copy.placeholder}
                className="h-9 flex-1 truncate overflow-hidden bg-transparent pr-8 text-base outline-none placeholder:text-gray-600 sm:pr-10 sm:text-sm dark:placeholder:text-gray-400"
                aria-label={copy.placeholder}
              />
              <button
                type="submit"
                disabled={!pillValue.trim()}
                className="absolute right-1.5 flex-shrink-0 rounded-full bg-gray-600/80 p-2 text-white transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40 enabled:cursor-pointer"
                aria-label={copy.send}
              >
                <SendArrow className="transition-transform duration-200 hover:-translate-y-0.5 sm:h-[20px] sm:w-[20px]" />
              </button>
            </label>
          </form>
        </div>
      ) : null}
    </div>
  )
}
