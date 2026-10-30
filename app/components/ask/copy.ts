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

export const SUGGESTION_POOL: Record<AskLocale, readonly string[]> = {
  en: [
    // serious
    'What is your background?',
    'What are you working on right now?',
    'What does a design strategist actually do?',
    'What tools do you actually use?',
    'How do you use AI in your day-to-day?',
    'What side projects have you built?',
    'Tell me about your latest post',
    'How did you build this site?',
    // interesting
    'What is the Dead Internet Theory about?',
    'What will consulting firms sell in 5 years?',
    'What did your Roomba teach you?',
    'Which post of yours should I read first?',
    'What AI opinion have you changed lately?',
    // funny
    'Why is it called Think Make Test?',
    'What do you have against printers?',
    'Would you hire an AI agent?',
    'Tabs or spaces?',
    'What is the worst tech prediction you have made?',
  ],
  es: [
    // serias
    '¿Cuál es tu trayectoria?',
    '¿En qué estás trabajando ahora?',
    '¿Qué hace un design strategist?',
    '¿Qué herramientas usas de verdad?',
    '¿Cómo usas la IA en tu día a día?',
    '¿Qué side projects has construido?',
    'Háblame de tu último post',
    '¿Cómo has construido esta web?',
    // interesantes
    '¿Qué es la teoría del internet muerto?',
    '¿Qué venderán las consultoras en 5 años?',
    '¿Qué te enseñó tu Roomba?',
    '¿Qué post tuyo debería leer primero?',
    '¿Qué opinión sobre IA has cambiado últimamente?',
    // graciosas
    '¿Por qué se llama Think Make Test?',
    '¿Qué tienes contra las impresoras?',
    '¿Contratarías a un agente de IA?',
    '¿Tabs o espacios?',
    '¿Cuál ha sido tu peor predicción tecnológica?',
  ],
}

export function randomSuggestions(
  locale: AskLocale,
  previous?: readonly string[],
): string[] {
  const pool = [...SUGGESTION_POOL[locale]]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  let picked = pool.slice(0, 3)
  if (previous && picked.every((item) => previous.includes(item))) {
    const fresh = pool.slice(3).find((item) => !previous.includes(item))
    if (fresh) picked = [fresh, ...picked.slice(1)]
  }
  return picked
}

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
