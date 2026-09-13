import type { UIMessage } from 'ai'

export type AskLocale = 'en' | 'es'

export const ASK_COPY = {
  en: {
    placeholder: 'Ask me anything',
    title: 'Ask me',
    close: 'Close chat',
    send: 'Send',
    thinking: 'One second…',
    searching: 'Looking it up…',
    empty:
      'Ask about the work, the writing, the tools — or whatever you landed here for.',
    error: 'Something got stuck. Try again in a moment.',
    reset: 'New conversation',
    suggestions: [
      'What is your background?',
      'What tools do you actually use?',
      'Tell me about your latest post',
    ],
  },
  es: {
    placeholder: 'Pregunta lo que quieras',
    title: 'Pregúntame',
    close: 'Cerrar chat',
    send: 'Enviar',
    thinking: 'Un segundo…',
    searching: 'Lo estoy mirando…',
    empty:
      'Pregunta por la trayectoria, los textos, las herramientas — o por lo que te haya traído hasta aquí.',
    error: 'Algo se ha atascado. Prueba otra vez en un momento.',
    reset: 'Nueva conversación',
    suggestions: [
      '¿Cuál es tu trayectoria?',
      '¿Qué herramientas usas de verdad?',
      'Háblame de tu último post',
    ],
  },
} as const

export function suggestionsForPath(locale: AskLocale, pathname: string | null) {
  const path = pathname ?? '/'
  if (path.includes('/blog/')) {
    return locale === 'es'
      ? [
          '¿Cuál es la tesis de este artículo?',
          'Resúmeme lo que dices aquí',
          '¿Qué debería llevarme de aquí?',
        ]
      : [
          'What is the thesis of this piece?',
          'Walk me through the main argument',
          'What should I take from this?',
        ]
  }
  if (path.includes('/playground/')) {
    return locale === 'es'
      ? [
          '¿Para qué sirve esta herramienta?',
          '¿Por qué la construiste?',
          '¿Cómo se usa?',
        ]
      : [
          'What does this tool do?',
          'Why did you build it?',
          'How do I use it?',
        ]
  }
  return ASK_COPY[locale].suggestions
}

function quotedEmpty(locale: AskLocale, title: string) {
  return locale === 'es'
    ? `Estás en '${title}', ¿qué dudas tienes?`
    : `You're on '${title}'. What do you want to ask?`
}

export function emptyForPath(
  locale: AskLocale,
  pathname: string | null,
  pageTitle?: string,
) {
  const path = pathname ?? '/'
  const title = pageTitle?.trim()
  if (path.includes('/blog/')) {
    if (title) return quotedEmpty(locale, title)
    return locale === 'es'
      ? 'Estás en este artículo. Pregunta por la tesis, un ejemplo, o si no estás de acuerdo.'
      : 'You are on this article. Ask about the thesis, an example, or where you disagree.'
  }
  if (path.includes('/playground/')) {
    if (title) return quotedEmpty(locale, title)
    return locale === 'es'
      ? 'Estás en esta herramienta. Pregunta qué hace, por qué existe, o cómo usarla.'
      : 'You are on this tool. Ask what it does, why it exists, or how to use it.'
  }
  return ASK_COPY[locale].empty
}

export function isToolPart(
  part: UIMessage['parts'][number],
): part is Extract<UIMessage['parts'][number], { type: string; state?: string }> {
  return part.type.startsWith('tool-') || part.type === 'dynamic-tool'
}

export function messageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
    .trim()
}

export function isErrorDumpMessage(message: UIMessage) {
  const text = messageText(message)
  if (!text.startsWith('{')) return false
  try {
    const parsed = JSON.parse(text)
    return typeof parsed?.error === 'string'
  } catch {
    return false
  }
}

export function friendlyAskError(error: Error | undefined, fallback: string) {
  if (!error?.message) return fallback
  const raw = error.message.trim()
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed?.error === 'string') return parsed.error
  } catch {
    // not JSON
  }
  if (raw.startsWith('{')) return fallback
  return raw
}

export function isSearchPart(part: UIMessage['parts'][number]) {
  if (part.type === 'tool-web_search') return true
  return (
    part.type === 'dynamic-tool' &&
    'toolName' in part &&
    part.toolName === 'web_search'
  )
}
