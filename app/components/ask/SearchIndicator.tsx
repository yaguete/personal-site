import type { UIMessage } from 'ai'
import { isSearchPart } from './copy'

type SearchResult = {
  url?: string
  title?: string | null
}

function asResults(output: unknown): SearchResult[] {
  if (!Array.isArray(output)) return []
  return output.filter(
    (item): item is SearchResult =>
      typeof item === 'object' && item !== null && 'url' in item,
  )
}

export function SearchIndicator({
  message,
  label,
}: {
  message: UIMessage
  label: string
}) {
  const searchParts = message.parts.filter(isSearchPart)
  if (searchParts.length === 0) return null

  const pending = searchParts.some(
    (part) =>
      'state' in part &&
      (part.state === 'input-streaming' || part.state === 'input-available'),
  )
  const sources = searchParts.flatMap((part) =>
    'output' in part ? asResults(part.output) : [],
  )

  if (pending) {
    return (
      <p className="mb-2 text-xs tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
    )
  }

  if (sources.length === 0) return null

  const unique = sources.filter(
    (item, index, list) =>
      item.url && list.findIndex((other) => other.url === item.url) === index,
  )

  return (
    <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
      {unique.slice(0, 5).map((source) => (
        <li key={source.url}>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-zinc-300 underline-offset-2 hover:text-zinc-800 dark:decoration-zinc-600 dark:hover:text-zinc-200"
          >
            {source.title || source.url}
          </a>
        </li>
      ))}
    </ul>
  )
}
