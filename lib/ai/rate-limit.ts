import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const MAX_MESSAGE_CHARS = 1000
export const MAX_USER_TURNS = 12

type LimitResult = {
  success: boolean
  remaining?: number
}

const memoryHits = new Map<string, number[]>()
const WINDOW_MS = 60 * 60 * 1000
const MAX_HITS = 20

function memoryLimit(identifier: string): LimitResult {
  const now = Date.now()
  const recent = (memoryHits.get(identifier) ?? []).filter(
    (stamp) => now - stamp < WINDOW_MS,
  )
  if (recent.length >= MAX_HITS) {
    memoryHits.set(identifier, recent)
    return { success: false, remaining: 0 }
  }
  recent.push(now)
  memoryHits.set(identifier, recent)
  return { success: true, remaining: MAX_HITS - recent.length }
}

let upstash: Ratelimit | null | undefined

function getUpstash() {
  if (upstash !== undefined) return upstash
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    upstash = null
    return upstash
  }
  upstash = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(MAX_HITS, '1 h'),
    prefix: 'ask',
    analytics: false,
  })
  return upstash
}

export async function limitAsk(identifier: string): Promise<LimitResult> {
  const limiter = getUpstash()
  if (!limiter) return memoryLimit(identifier)
  const result = await limiter.limit(identifier)
  return { success: result.success, remaining: result.remaining }
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'anonymous'
  return request.headers.get('x-real-ip')?.trim() || 'anonymous'
}

export function countUserTurns(
  messages: Array<{ role?: string }> | undefined,
) {
  if (!Array.isArray(messages)) return 0
  return messages.filter((message) => message.role === 'user').length
}

export function trimToUserTurns<T extends { role?: string }>(
  messages: T[],
  maxTurns: number = MAX_USER_TURNS,
): T[] {
  const userIndexes = messages
    .map((message, index) => (message.role === 'user' ? index : -1))
    .filter((index) => index >= 0)
  if (userIndexes.length <= maxTurns) return messages
  const start = userIndexes[userIndexes.length - maxTurns]
  return messages.slice(start)
}

export function getLastUserText(
  messages: Array<{
    role?: string
    parts?: Array<{ type?: string; text?: string }>
  }> | undefined,
) {
  if (!Array.isArray(messages)) return ''
  const lastUser = [...messages].reverse().find((message) => message.role === 'user')
  if (!lastUser?.parts) return ''
  return lastUser.parts
    .filter((part) => part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text ?? '')
    .join('\n')
}
