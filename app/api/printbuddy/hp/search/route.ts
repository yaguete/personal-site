import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()
    const locale = searchParams.get('locale')?.trim() || 'es-es'
    
    if (!q) {
      return NextResponse.json({ error: 'q required' }, { status: 400 })
    }

    const target = `https://support.hp.com/${locale}/search?q=${encodeURIComponent(q)}`
    
    // Añadir delay aleatorio para simular comportamiento humano
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500))
    
    const response = await fetch(target, { 
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      }
    })
    
    if (!response.ok) {
      if (response.status === 403) {
        return NextResponse.json({ 
          error: 'HP está bloqueando las peticiones automatizadas. Intenta con una búsqueda diferente o vuelve a intentar más tarde.',
          status: 'blocked'
        }, { status: 403 })
      }
      return NextResponse.json({ error: `hp_status_${response.status}` }, { status: 502 })
    }
    
    const html = await response.text()
    const items = extractLinks(html).slice(0, 100)
    
    return NextResponse.json({ 
      query: q, 
      locale, 
      results: items 
    })
  } catch (error) {
    console.error('HP search error:', error)
    return NextResponse.json(
      { error: 'search_failed', detail: String(error instanceof Error ? error.message : error) },
      { status: 500 }
    )
  }
}

// Utilidad para parsear HTML y extraer enlaces
function extractLinks(html: string) {
  const links: Array<{ title: string | null, url: string, type: 'pdf' | 'video' | 'page' }> = []
  const seenUrls = new Set<string>()
  
  // Múltiples patrones de regex para capturar diferentes formatos de enlaces
  const patterns = [
    /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi,
    /<a[^>]+href=([^>\s]+)[^>]*>([^<]*)<\/a>/gi,
    /href=["']([^"']+)["'][^>]*>([^<]*)<\/a>/gi
  ]
  
  patterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(html)) !== null) {
      const href = match[1].trim()
      const title = match[2].trim() || null
      
      if (!href || seenUrls.has(href) || href.startsWith('#') || href.startsWith('javascript:')) continue
      
      try {
        // Convertir URL relativa a absoluta
        const absoluteUrl = href.startsWith('http') 
          ? href 
          : new URL(href, 'https://support.hp.com').toString()
        
        // Determinar tipo de contenido
        const isPdf = /\.pdf(\?|$)/i.test(absoluteUrl) || 
                     (absoluteUrl.includes('hpcloud') && absoluteUrl.includes('pdf'))
        const isVideo = /youtube|youtu\.be|vimeo|mp4|video/i.test(absoluteUrl)
        const type = isPdf ? 'pdf' : isVideo ? 'video' : 'page'
        
        // Filtrar enlaces irrelevantes
        if (absoluteUrl.includes('support.hp.com') || 
            absoluteUrl.includes('hp.com') || 
            absoluteUrl.includes('hpe.com')) {
          links.push({ title, url: absoluteUrl, type })
          seenUrls.add(href)
        }
      } catch (e) {
        // Ignorar URLs malformadas
        continue
      }
    }
  })
  
  return links
}
