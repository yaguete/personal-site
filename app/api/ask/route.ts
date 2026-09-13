import { createAnthropic } from '@ai-sdk/anthropic'
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from 'ai'
import { getSiteKnowledge } from '@/lib/ai/knowledge'
import { buildSystemPrompt } from '@/lib/ai/persona'
import {
  getClientIp,
  getLastUserText,
  limitAsk,
  MAX_MESSAGE_CHARS,
  trimToUserTurns,
} from '@/lib/ai/rate-limit'

export const maxDuration = 60

function isSpanish(pageUrl?: string, header?: string | null) {
  if (pageUrl?.includes('/es')) return true
  if (pageUrl?.includes('/eng')) return false
  return (header ?? '').toLowerCase().includes('es')
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status })
}

export async function POST(request: Request) {
  const acceptLanguage = request.headers.get('accept-language')

  let body: {
    messages?: UIMessage[]
    pageUrl?: string
    pathname?: string
  }

  try {
    body = await request.json()
  } catch {
    return jsonError('Bad request', 400)
  }

  const spanish = isSpanish(body.pageUrl, acceptLanguage)
  const stuck = spanish
    ? 'Algo se ha atascado. Prueba otra vez en un momento.'
    : 'Something got stuck. Try again in a moment.'
  const tooLong = spanish
    ? 'Eso es demasiado largo. Acótalo un poco.'
    : 'That is a bit long. Try a shorter question.'
  const limited = spanish
    ? 'Has preguntado bastante por ahora. Vuelve un poco más tarde.'
    : 'That is enough questions for now. Try again a bit later.'

  const messages = trimToUserTurns(
    Array.isArray(body.messages) ? body.messages : [],
  )

  const lastText = getLastUserText(messages)
  if (lastText.length > MAX_MESSAGE_CHARS) {
    return jsonError(tooLong, 413)
  }

  const limitedByIp = await limitAsk(getClientIp(request))
  if (!limitedByIp.success) {
    return jsonError(limited, 429)
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return jsonError(stuck, 500)
  }

  const deepseek = createAnthropic({
    apiKey,
    baseURL: 'https://api.deepseek.com/anthropic/v1',
    name: 'ask',
  })

  try {
    const result = streamText({
      model: deepseek(process.env.CHAT_MODEL ?? 'deepseek-flash'),
      system: buildSystemPrompt({
        knowledge: getSiteKnowledge(),
        pageUrl: body.pageUrl,
        pathname: body.pathname,
      }),
      messages: await convertToModelMessages(messages),
      tools: {
        web_search: deepseek.tools.webSearch_20250305({ maxUses: 3 }),
      },
      providerOptions: {
        anthropic: {
          thinking: { type: 'disabled' },
        },
      },
    })

    return result.toUIMessageStreamResponse({
      sendReasoning: false,
      onError: () => stuck,
    })
  } catch {
    return jsonError(stuck, 500)
  }
}
