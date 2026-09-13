'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import useClickOutside from '@/app/hooks/useClickOutside'
import { ChatPanel } from './ask/ChatPanel'
import { SendArrow } from './ask/SendArrow'
import {
  ASK_COPY,
  type AskLocale,
  emptyForPath,
  isErrorDumpMessage,
  suggestionsForPath,
} from './ask/copy'

const STORAGE_KEY = 'ask-yago-messages'
const PILL_MOTION = {
  hidden: { opacity: 0, x: '-50%', y: 16, scale: 0.96 },
  shown: { opacity: 1, x: '-50%', y: 0, scale: 1 },
}
const TOP_REVEAL = 64
const TOP_HIDE = 20
const FOOTER_HIDE = 12
const FOOTER_REVEAL = -16

function usePillVisibility(pathname: string | null, pinned: boolean) {
  const [visible, setVisible] = useState(false)
  const pinnedRef = useRef(pinned)
  pinnedRef.current = pinned

  useEffect(() => {
    const siteHeader = document.querySelector('body header')
    const footer = document.querySelector('footer')
    let shown = false

    const measure = () => {
      if (pinnedRef.current) {
        if (!shown) {
          shown = true
          setVisible(true)
        }
        return
      }

      const y = window.scrollY || document.documentElement.scrollTop || 0
      const viewport = window.innerHeight
      const footerTop = footer?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY
      const footerOverlap = viewport - footerTop
      const headerBottom = siteHeader?.getBoundingClientRect().bottom ?? 0
      const headerLeaving = headerBottom < 72

      const pastTop = y > (shown ? TOP_HIDE : TOP_REVEAL) || headerLeaving
      const clearOfFooter = footerOverlap < (shown ? FOOTER_HIDE : FOOTER_REVEAL)
      const next = pastTop && clearOfFooter
      if (next !== shown) {
        shown = next
        setVisible(next)
      }
    }

    const observer = new IntersectionObserver(measure, {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    })
    if (siteHeader) observer.observe(siteHeader)
    if (footer) observer.observe(footer)

    measure()
    window.addEventListener('scroll', measure, { passive: true })
    document.addEventListener('scroll', measure, { passive: true, capture: true })
    window.addEventListener('resize', measure, { passive: true })
    window.visualViewport?.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', measure)
      document.removeEventListener('scroll', measure, { capture: true })
      window.removeEventListener('resize', measure)
      window.visualViewport?.removeEventListener('resize', measure)
    }
  }, [pathname, pinned])

  return visible
}

function detectLocale(pathname: string | null): AskLocale {
  if (pathname?.includes('/es')) return 'es'
  if (pathname?.includes('/eng')) return 'en'
  return 'en'
}

function readPageTitle() {
  if (typeof document === 'undefined') return undefined
  const heading = document.querySelector('h1')?.textContent?.trim()
  if (heading) return heading
  const fromDoc = document.title.replace(/\s*\|\s*Think Make Test\s*$/i, '').trim()
  if (!fromDoc || fromDoc === 'Think Make Test') return undefined
  return fromDoc
}

function readStoredMessages() {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((message) => !isErrorDumpMessage(message))
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
  const [pageTitle, setPageTitle] = useState<string>()
  const [pillFocused, setPillFocused] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null!)
  const suggestions = suggestionsForPath(locale, pathname)
  const emptyPill = pillValue.length === 0

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

  const { messages, sendMessage, status, error, setMessages, clearError } =
    useChat({
      transport,
    })

  const busy = status === 'submitted' || status === 'streaming'
  const hasConversation = messages.some(
    (message) => !isErrorDumpMessage(message),
  )
  const pillVisible = usePillVisibility(
    pathname,
    pillFocused && !hasConversation,
  )

  useEffect(() => {
    const stored = readStoredMessages()
    if (stored.length) setMessages(stored)
    setHydrated(true)
  }, [setMessages])

  useEffect(() => {
    setPageTitle(readPageTitle())
    setPillFocused(false)
  }, [pathname])

  useEffect(() => {
    if (!hydrated) return
    const clean = messages.filter((message) => !isErrorDumpMessage(message))
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
  }, [messages, hydrated])

  const openPanel = useCallback(() => {
    setPillFocused(false)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setOpen(true)
  }, [])

  const close = useCallback(() => {
    setPillFocused(false)
    setOpen(false)
  }, [])

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

    const html = document.documentElement
    const body = document.body
    const scrollY = window.scrollY
    const scrollbar = window.innerWidth - html.clientWidth
    const previous = {
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscroll: body.style.overscrollBehavior,
      bodyPaddingRight: body.style.paddingRight,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
    }

    html.style.overflow = 'hidden'
    html.style.overscrollBehavior = 'none'
    body.style.overflow = 'hidden'
    body.style.overscrollBehavior = 'none'
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    const allowInnerScroll = (target: EventTarget | null) => {
      if (!(target instanceof Node)) return false
      const panel = wrapperRef.current?.querySelector('[data-ask-panel]')
      return Boolean(panel?.contains(target))
    }

    const blockPageScroll = (event: WheelEvent | TouchEvent) => {
      if (allowInnerScroll(event.target)) return
      event.preventDefault()
    }

    window.addEventListener('wheel', blockPageScroll, { passive: false })
    window.addEventListener('touchmove', blockPageScroll, { passive: false })

    return () => {
      html.style.overflow = previous.htmlOverflow
      html.style.overscrollBehavior = previous.htmlOverscroll
      body.style.overflow = previous.bodyOverflow
      body.style.overscrollBehavior = previous.bodyOverscroll
      body.style.paddingRight = previous.bodyPaddingRight
      body.style.position = previous.bodyPosition
      body.style.top = previous.bodyTop
      body.style.left = previous.bodyLeft
      body.style.right = previous.bodyRight
      body.style.width = previous.bodyWidth
      window.scrollTo(0, scrollY)
      window.removeEventListener('wheel', blockPageScroll)
      window.removeEventListener('touchmove', blockPageScroll)
    }
  }, [open])

  function resetConversation() {
    setMessages([])
    clearError()
    setPillFocused(false)
    sessionStorage.removeItem(STORAGE_KEY)
  }

  function submitText(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    if (error) clearError()
    openPanel()
    setPillValue('')
    setComposerValue('')
    sendMessage({ text: trimmed })
  }

  return (
    <div ref={wrapperRef}>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto fixed inset-0 z-40 cursor-pointer bg-white/15 backdrop-blur-sm dark:bg-zinc-950/25"
            onClick={close}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto fixed inset-0 z-50 sm:inset-auto sm:bottom-16 sm:left-1/2 sm:h-[min(680px,82vh)] sm:w-[420px] sm:-translate-x-1/2"
            data-ask-panel
          >
            <ChatPanel
              locale={locale}
              messages={messages}
              status={status}
              error={error}
              input={composerValue}
              empty={emptyForPath(locale, pathname, pageTitle)}
              suggestions={suggestionsForPath(locale, pathname)}
              onInputChange={setComposerValue}
              onSubmit={() => submitText(composerValue)}
              onClose={close}
              onSuggestion={submitText}
              onReset={resetConversation}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!open ? (
        <motion.div
          initial="hidden"
          animate={pillVisible ? 'shown' : 'hidden'}
          variants={PILL_MOTION}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden={!pillVisible}
          inert={!pillVisible ? true : undefined}
          className={cn(
            'fixed bottom-4 left-1/2 z-50 origin-bottom sm:bottom-6',
            pillVisible ? 'pointer-events-auto' : 'pointer-events-none',
          )}
        >
          <form
            className="group relative"
            onSubmit={(event) => {
              event.preventDefault()
              if (hasConversation) {
                openPanel()
                return
              }
              if (!pillValue.trim()) return
              submitText(pillValue)
            }}
          >
            {!hasConversation ? (
            <div
              className={cn(
                'absolute bottom-full left-0 mb-2 flex flex-col items-start gap-1.5 transition-opacity duration-200 delay-0',
                emptyPill
                  ? 'pointer-events-none opacity-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-focus-within:delay-500'
                  : 'pointer-events-none opacity-0',
              )}
            >
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => submitText(suggestion)}
                  className="cursor-pointer rounded-full bg-zinc-100/90 px-3 py-1.5 text-left text-xs text-zinc-700 shadow-none backdrop-blur-md transition-colors hover:bg-zinc-200 dark:bg-zinc-800/90 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            ) : null}
            <div className="relative">
            <label
              className={cn(
                'relative flex min-w-[200px] w-52 items-center overflow-hidden rounded-[24px] bg-gray-200/80 px-4 py-1 shadow-none backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] hover:scale-105 hover:-translate-y-0.5 hover:shadow-none dark:bg-gray-800/80',
                hasConversation
                  ? 'cursor-pointer'
                  : 'cursor-text group-focus-within:w-80 group-focus-within:hover:scale-100 group-focus-within:hover:translate-y-0',
              )}
            >
              <input
                type="text"
                value={pillValue}
                readOnly={hasConversation}
                tabIndex={hasConversation ? -1 : undefined}
                onChange={(event) => setPillValue(event.target.value)}
                onFocus={() => {
                  if (!hasConversation) setPillFocused(true)
                }}
                onBlur={(event) => {
                  const next = event.relatedTarget
                  if (
                    !(next instanceof Node) ||
                    !event.currentTarget.closest('form')?.contains(next)
                  ) {
                    setPillFocused(false)
                  }
                }}
                placeholder={copy.placeholder}
                className="h-9 flex-1 truncate overflow-hidden bg-transparent pr-8 text-base outline-none placeholder:text-gray-600 sm:pr-10 sm:text-sm dark:placeholder:text-gray-400"
                aria-label={hasConversation ? copy.title : copy.placeholder}
              />
              <button
                type="submit"
                disabled={!pillValue.trim()}
                tabIndex={hasConversation ? -1 : undefined}
                className="absolute right-1.5 flex-shrink-0 rounded-full bg-gray-600/80 p-2 text-white transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40 enabled:cursor-pointer"
                aria-label={copy.send}
              >
                <SendArrow className="transition-transform duration-200 hover:-translate-y-0.5 sm:h-[20px] sm:w-[20px]" />
              </button>
            </label>
              {hasConversation ? (
                <button
                  type="button"
                  className="absolute inset-0 z-10 cursor-pointer rounded-[24px]"
                  aria-label={copy.title}
                  onClick={() => openPanel()}
                />
              ) : null}
            </div>
          </form>
        </motion.div>
      ) : null}
    </div>
  )
}
