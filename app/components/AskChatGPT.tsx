"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import useClickOutside from "@/hooks/useClickOutside"

type FloatingAskChatGPTProps = {
  position?: "bottom-right" | "bottom-left" | "bottom-center"
  placeholder?: string
  locale?: "en" | "es"
}

/**
 * FloatingAskChatGPT
 *
 * Botón/entrada flotante fija similar al widget del blog de OpenAI.
 * Al enviar, abre ChatGPT en una nueva pestaña con el mensaje del usuario
 * y la URL actual incluida en el texto para facilitar la navegación web.
 */
export default function FloatingAskChatGPT({
  position = "bottom-center",
  placeholder = "Ask ChatGPT",
  locale = "en",
}: FloatingAskChatGPTProps) {
  const [inputValue, setInputValue] = useState("")
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const containerPositionClass = useMemo(() => {
    switch (position) {
      case "bottom-right":
        return "right-4 sm:right-6"
      case "bottom-left":
        return "left-4 sm:left-6"
      default:
        return "left-1/2 -translate-x-1/2"
    }
  }, [position])

  function buildChatUrl(query: string, pageUrl: string): string {
    const message =
      locale === "en"
        ? `I'm on: ${pageUrl}\n- ${query}\n\nBrowse the web to read that URL before answering.`
        : `Estoy en: ${pageUrl}\n- ${query}\n\nNavega la web para leer esa URL antes de responder.`
    const encoded = encodeURIComponent(message)

    // Preferimos el dominio actual de ChatGPT; fallback al antiguo por si acaso
    const base = "https://chatgpt.com"
    return `${base}/?q=${encoded}&temporary-chat=true`
  }

  function handleSubmit(event?: React.FormEvent) {
    event?.preventDefault()
    if (!inputValue.trim()) return
    const originUrl = typeof window !== "undefined" ? window.location.href : ""
    const url = buildChatUrl(inputValue.trim(), originUrl)
    window.open(url, "_blank", "noopener,noreferrer")
    setInputValue("")
  }

  return (
    <div
      ref={containerRef}
      className={`pointer-events-auto fixed bottom-4 sm:bottom-6 z-40 ${containerPositionClass}`}
      aria-live="polite"
    >
      <form className="group relative" onSubmit={handleSubmit}>
        <label
          className="relative flex items-center bg-gray-200/80 backdrop-blur-md shadow-none rounded-[24px] px-4 py-2 w-48 transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] group-focus-within:w-80 overflow-hidden cursor-text hover:shadow-none hover:scale-105 hover:-translate-y-0.5 dark:bg-gray-800/80 min-w-[200px]"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent h-9 outline-none text-[15px] md:text-sm placeholder:text-gray-600 dark:placeholder:text-gray-400 pr-8 sm:pr-10 group-focus-within:pr-8 sm:group-focus-within:pr-10 truncate overflow-hidden"
            aria-label="Message ChatGPT"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 p-1 sm:p-2 rounded-full bg-gray-600/80 text-white hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 enabled:cursor-pointer"
            aria-label="Send prompt to ChatGPT"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              className="transition-transform duration-200 hover:-translate-y-0.5 sm:w-[25px] sm:h-[25px]"
            >
              <path
                d="M10 14L10 6M10 6L7 9M10 6L13 9"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </label>
      </form>
    </div>
  )
}


