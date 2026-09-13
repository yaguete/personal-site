import type { UIMessage } from 'ai'
import Markdown from 'react-markdown'
import { SearchIndicator } from './SearchIndicator'
import { ASK_COPY, type AskLocale, isToolPart } from './copy'

export function ChatMessage({
  message,
  locale,
}: {
  message: UIMessage
  locale: AskLocale
}) {
  const copy = ASK_COPY[locale]
  const isUser = message.role === 'user'
  const text = message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
    .trim()

  if (isUser) {
    if (!text) return null
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-zinc-200/80 px-3.5 py-2 text-sm leading-relaxed text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
          {text}
        </div>
      </div>
    )
  }

  const hasSearch = message.parts.some(isToolPart)
  if (!text && !hasSearch) return null

  return (
    <div className="max-w-[95%]">
      <SearchIndicator message={message} label={copy.searching} />
      {text ? (
        <div className="prose prose-sm prose-zinc max-w-none dark:prose-invert prose-p:my-2 prose-headings:font-medium prose-a:font-normal">
          <Markdown>{text}</Markdown>
        </div>
      ) : null}
    </div>
  )
}
