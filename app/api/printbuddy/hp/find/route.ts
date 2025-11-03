import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// --- env keys (HP via CSE, YouTube via CSE o YouTube Data API) ---
const CSE_KEY = process.env.GOOGLE_CSE_KEY
const CSE_CX_HP = process.env.GOOGLE_CSE_CX           // CSE configurado para HP (support.hp.com, hpcloud)
const CSE_CX_YT = process.env.GOOGLE_CSE_CX_YT || ''  // CSE separado para YouTube (domain youtube.com). Opcional si usas YouTube Data API.
const YT_API_KEY = process.env.GOOGLE_YT_API_KEY || ''// Opcional: YouTube Data API v3 (fallback si no hay CSE de YouTube)

const modeloRe = new RegExp(
    [
      'latex\\s*(?:\\d{3,4}|700w?|800w?|r\\s*series|r1000|r2000)',
      'design\\s*jet\\s*(?:z\\d+|t\\d+|\\d{3,4})',
      'stitch\\s*(?:s\\d{3,4})',
      'page\\s*wide\\s*xl\\s*(?:\\d{3,4}|pro)',
      'scitex\\s*\\w*'
    ].join('|'),
    'i'
  )
const sintomaRe = /(atasco|jam|banding|rayas|stripes|streaks|c[oó]digo|code|error|firmware|calibraci[oó]n|calibration|curing|polimerizaci[oó]n|polymerization|cabezal|printhead|head|sensor|omas|olor|odor|seco|dry|stuck|blocked|clogged|nozzle|ink|tinta|inkjet|laserjet|officejet|pagewide|designjet)/i

export async function POST(req: NextRequest) {
  try {
    const { query, locale = 'es-es' } = await req.json() as { query: string, locale?: string }
    if (!query?.trim()) return NextResponse.json({ error: 'query_required' }, { status: 400 })

    const key = CSE_KEY
    const cx  = CSE_CX_HP
    if (!key || !cx) return NextResponse.json({ error: 'cse_env_missing_hp' }, { status: 500 })

    const lrHp = '' // No forzar idioma en búsquedas

    // ---- 1) CSE para HP (PDFs/Docs) ----
    const qHp = `(${query}) (site:support.hp.com OR site:kaas.hpcloud.hp.com)`
    const hpParams = new URLSearchParams({ key, cx, q: qHp, num: '10', safe: 'off', fileType: 'pdf' })
    if (lrHp) hpParams.set('lr', lrHp)
    const hpUrl = `https://www.googleapis.com/customsearch/v1?${hpParams.toString()}`
    const hpRes = await fetch(hpUrl, { cache: 'no-store' })
    if (!hpRes.ok) return NextResponse.json({ error: 'cse_http_'+hpRes.status }, { status: 502 })
    const hpJson: any = await hpRes.json()
    const hpItems = Array.isArray(hpJson.items) ? hpJson.items : []
    const hpHits = hpItems.map((it:any)=>({ title: it.title || null, url: it.link as string }))
                          .filter((x: {url: string}) => typeof x.url === 'string')
    const pdfDirect = hpHits.filter((h: {url: string}) => isPdf(h.url))
    const supportPages = hpHits.filter((h: {url: string}) => /support\.hp\.com\/.*\/document\//i.test(h.url))

    // Resolver páginas de soporte → PDFs
    let resolved: { title:string|null, url:string }[] = []
    if (supportPages.length) {
      try {
        const baseUrl = process.env.BASE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001')
        const resolveUrl = `${baseUrl}/api/printbuddy/hp/resolve`
        const rr = await fetch(resolveUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: supportPages.slice(0,5).map((p: {url: string})=>p.url) })
        })
        const j = await rr.json()
        resolved = Array.isArray(j.pdfs) ? j.pdfs : []
      } catch {}
    }
    const allPdfs = dedup([...pdfDirect, ...resolved].filter(p => isPdf(p.url)))

    // ---- 2) Búsqueda de YouTube (vídeos): CSE específico o fallback YouTube Data API ----
    let allVideos: { title: string | null, url: string }[] = []
  
    if (YT_API_KEY) {
      // Usar YouTube Data API (más confiable que CSE)
      const ytParams = new URLSearchParams({
        key: YT_API_KEY,
        part: 'snippet',
        q: `${query}`,
        type: 'video',
        maxResults: '20'
      })
      
      const ytUrl = `https://www.googleapis.com/youtube/v3/search?${ytParams.toString()}`
      const ytRes = await fetch(ytUrl, { cache: 'no-store' })
      const ytJson: any = ytRes.ok ? await ytRes.json() : { error: await ytRes.text(), status: ytRes.status }
      
      
      const ytItems = Array.isArray(ytJson.items) ? ytJson.items : []
      
      // Obtener información de canales para detectar cuentas oficiales
      const channelIds = [...new Set(ytItems.map((it: any) => it.snippet?.channelId).filter(Boolean))]
      const channelInfo: { [key: string]: any } = {}
      
      if (channelIds.length > 0) {
        const channelParams = new URLSearchParams({
          key: YT_API_KEY,
          part: 'snippet',
          id: channelIds.join(',')
        })
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?${channelParams.toString()}`
        const channelRes = await fetch(channelUrl, { cache: 'no-store' })
        const channelJson: any = channelRes.ok ? await channelRes.json() : { items: [] }
        
        if (Array.isArray(channelJson.items)) {
          channelJson.items.forEach((channel: any) => {
            if (channel.id) {
              channelInfo[channel.id] = {
                title: channel.snippet?.title || '',
                customUrl: channel.snippet?.customUrl || ''
              }
            }
          })
        }
      }
      
      const ytHitsRaw = ytItems
        .map((it: any) => ({ 
          title: it.snippet?.title || null, 
          url: `https://www.youtube.com/watch?v=${it.id?.videoId || ''}`,
          channelId: it.snippet?.channelId,
          channelInfo: channelInfo[it.snippet?.channelId] || null
        }))
        .filter((x: { url: string, channelInfo?: any }) => {
          // Solo videos válidos
          if (!isVideo(x.url)) return false
          
          // Solo videos de canales oficiales de HP
          if (!x.channelInfo) return false
          
          const channelTitle = (x.channelInfo.title || '').toLowerCase()
          const channelCustomUrl = (x.channelInfo.customUrl || '').toLowerCase()
          
          return channelTitle.includes('hp inc') || 
                 channelTitle.includes('hp support') ||
                 channelCustomUrl.includes('@hpinc') || 
                 channelCustomUrl.includes('@hpsupport')
        })
      allVideos = dedup(ytHitsRaw)
    } else if (CSE_CX_YT) {
      // Usar Google Custom Search Engine para YouTube
      const ytParams = new URLSearchParams({
        key: CSE_KEY,
        cx: CSE_CX_YT,
        q: `${query}`,
        num: '20'
      })
      
      const ytUrl = `https://www.googleapis.com/customsearch/v1?${ytParams.toString()}`
      const ytRes = await fetch(ytUrl, { cache: 'no-store' })
      const ytJson: any = ytRes.ok ? await ytRes.json() : { error: await ytRes.text(), status: ytRes.status }
      
      const ytItems = Array.isArray(ytJson.items) ? ytJson.items : []
      
      const ytHitsRaw = ytItems
        .map((it: any) => ({ 
          title: it.title || null, 
          url: it.link || ''
        }))
        .filter((x: { url: string }) => {
          // Solo videos válidos
          if (!isVideo(x.url)) return false
          
          // Con CSE no podemos filtrar por canal oficial, así que incluimos todos
          return true
        })
      allVideos = dedup(ytHitsRaw)
    } else {
      // Sin CSE de YouTube ni API de YouTube: no devolvemos vídeos
      allVideos = []
    }

    // ---- 3) Ranking por tipo ----
    const rankedPdfs = rankPdfs(allPdfs, query, locale).slice(0, 5)
    const rankedVideos = rankVideos(allVideos, query, locale).slice(0, 3)

    // ---- 4) Combinar y filtrar por score ----
    // Criterios diferentes: PDFs más estrictos, videos más permisivos
    const filteredPdfs = rankedPdfs.filter(p => p.score >= 5)  // PDFs: score
    const filteredVideos = rankedVideos.filter(v => v.score >= 0)  // Videos: score
    
    const combined = [
      ...filteredPdfs.map(p => ({ ...p, type: 'pdf' as const })),
      ...filteredVideos.map(v => ({ ...v, type: 'video' as const }))
    ]

    const used = CSE_CX_YT ? 'google-cse(hp)+google-cse(yt)' : (YT_API_KEY ? 'google-cse(hp)+youtube-data' : 'google-cse(hp)')
    
    return NextResponse.json({ query, locale, used, results: combined })
  } catch (e:any) {
    return NextResponse.json({ error: 'find_failed', detail: String(e?.message || e) }, { status: 500 })
  }
}

// ----------------- helpers -----------------
function isPdf(u:string) {
  return /\.pdf(\?|$)/i.test(u) || (u.includes('hpcloud.hp.com') && u.toLowerCase().includes('pdf-public'))
}
function isVideo(u: string) {
  // Acepta vídeos (watch, youtu.be, shorts) y descarta canales/perfiles/listas
  if (!/(youtube\.com|youtu\.be|vimeo\.com)/i.test(u)) return false
  if (/youtube\.com\/(channel|c)\/|youtube\.com\/@|\/playlist\?list=/i.test(u)) return false
  return /(^https?:\/\/)?(www\.)?(m\.)?youtube\.com\/watch\?v=|(^https?:\/\/)?(www\.)?youtube\.com\/embed\/|youtu\.be\/|\/shorts\/|vimeo\.com\/\d+/i.test(u)
}
function canonical(u: string) {
  try {
    const x = new URL(u)
    x.hash = ''
    const host = x.hostname.toLowerCase()

    // YouTube watch: conserva ?v=
    if (host.endsWith('youtube.com')) {
      // normaliza www./m.
      if (host.startsWith('m.')) x.hostname = host.replace(/^m\./, 'www.')
      if (x.pathname === '/watch') {
        const v = x.searchParams.get('v')
        if (v) {
          x.search = `?v=${v}`      // conserva el ID
          return x.toString().toLowerCase()
        }
      }
      // shorts → conserva path
      if (x.pathname.startsWith('/shorts/')) {
        x.search = ''              // shorts id va en el path
        return x.toString().toLowerCase()
      }
      // otros paths (embed, etc.): conserva search tal cual
      return x.toString().toLowerCase()
    }

    // youtu.be: el ID va en el path
    if (host.endsWith('youtu.be')) {
      x.search = ''
      return x.toString().toLowerCase()
    }

    // Vimeo: el ID va en el path numérico
    if (host.endsWith('vimeo.com')) {
      x.search = ''
      return x.toString().toLowerCase()
    }

    // PDFs y resto: puedes quitar query/hash sin problema
    x.search = ''
    return x.toString().toLowerCase()
  } catch {
    return u.toLowerCase()
  }
}
function dedup(arr:{title:string|null,url:string}[]) {
  return Array.from(new Map(arr.map(x=>[canonical(x.url),x])).values())
}

// ---- ranking PDFs (tu lógica corregida + pequeños boosts) ----
function rankPdfs(arr:{title:string|null,url:string}[], query:string, locale:string) {
  return arr.map(p => ({ ...p, score: scorePdf(p, query, locale) }))
            .sort((a,b)=> b.score - a.score)
}
function scorePdf(p:{title:string|null,url:string}, query:string, locale:string) {
  const hay = `${p.title||''} ${p.url}`.toLowerCase()
  const q = query.toLowerCase()
  let s = 0
  if (modeloRe.test(hay)) s += 5
  if (sintomaRe.test(hay)) s += 3
  // palabras de la query
  const words = q.split(/\s+/).filter(w => w.length > 2)
  s += words.filter(w => hay.includes(w)).length * 1.5
  // tipo doc
  if (/user guide|troubleshooting|service manual|setup|installation|manual/i.test(hay)) s += 2
  // penalizaciones
  if (/warranty|legal|newsletter/i.test(hay)) s -= 2
  // preferir PDFs de hpcloud/pdf-public
  if (hay.includes('kaas.hpcloud.hp.com/pdf-public')) s += 2
  // versión más nueva
  const rev = /-(\d+)\.pdf$/i.exec(hay)?.[1]
  if (rev) s += Math.min(1, Number(rev)*0.02)
  return Math.max(0, s)
}

// ---- ranking vídeos ----
function rankVideos(arr:{title:string|null,url:string,channelInfo?:any}[], query:string, _locale:string) {
  return arr.map(v => ({ ...v, score: scoreVideo(v, query) }))
            .sort((a,b)=> b.score - a.score)
}
function scoreVideo(v:{title:string|null,url:string,channelInfo?:any}, query:string) {
  const hay = `${v.title||''} ${v.url}`.toLowerCase()
  const q = query.toLowerCase()
  let s = 0
  // Bonus inicial para videos (darles ventaja sobre PDFs)
  s += 3
  if (modeloRe.test(hay)) s += 4
  if (sintomaRe.test(hay)) s += 3
  // /"hp" en título
  if (/(^|[\s-])hp($|[\s-])/i.test(hay)) s += 3
  // keywords útiles
  if (/setup|installation|install|troubleshooting|tips|how to|tutorial|video/i.test(hay)) s += 4
  // Todos los videos son de canales oficiales (ya filtrados)
  s += 5
  // penalizar shorts menos agresivamente
  if (/\/shorts\//i.test(v.url)) s -= 1
  // palabras de la query
  const words = q.split(/\s+/).filter(w => w.length > 2)
  s += words.filter(w => hay.includes(w)).length * 1.5
  // bonus por contenido relacionado con impresoras
  if (/printer|print|latex|designjet|laserjet|officejet|pagewide|inkjet/i.test(hay)) s += 2
  return Math.max(0, s)
}
