import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json() as { urls: string[] }
    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'urls_required' }, { status: 400 })
    }

    const resolvedPdfs: Array<{ title: string | null, url: string }> = []

    for (const url of urls.slice(0, 5)) {
      try {
        const response = await fetch(url, {
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

        if (!response.ok) continue

        const html = await response.text()
        const pdfLinks = extractPdfLinks(html, url)
        resolvedPdfs.push(...pdfLinks)
      } catch (error) {
        console.error(`Error resolving ${url}:`, error)
        continue
      }
    }

    return NextResponse.json({ pdfs: resolvedPdfs })
  } catch (e: any) {
    return NextResponse.json({ error: 'resolve_failed', detail: String(e?.message || e) }, { status: 500 })
  }
}

function extractPdfLinks(html: string, baseUrl: string): Array<{ title: string | null, url: string }> {
  const links: Array<{ title: string | null, url: string }> = []
  const seenUrls = new Set<string>()

  // Buscar enlaces directos a PDFs
  const pdfRegex = /<a[^>]+href=["']([^"']*\.pdf[^"']*)["'][^>]*>([^<]*)<\/a>/gi
  let match
  while ((match = pdfRegex.exec(html)) !== null) {
    const href = match[1].trim()
    const title = match[2].trim() || null
    
    if (!href || seenUrls.has(href)) continue
    
    try {
      const absoluteUrl = href.startsWith('http') 
        ? href 
        : new URL(href, baseUrl).toString()
      
      if (isPdfUrl(absoluteUrl)) {
        links.push({ title, url: absoluteUrl })
        seenUrls.add(href)
      }
    } catch (e) {
      continue
    }
  }

  // Buscar enlaces en HP Cloud
  const hpCloudRegex = /<a[^>]+href=["']([^"']*hpcloud[^"']*pdf[^"']*)["'][^>]*>([^<]*)<\/a>/gi
  while ((match = hpCloudRegex.exec(html)) !== null) {
    const href = match[1].trim()
    const title = match[2].trim() || null
    
    if (!href || seenUrls.has(href)) continue
    
    try {
      const absoluteUrl = href.startsWith('http') 
        ? href 
        : new URL(href, baseUrl).toString()
      
      if (isPdfUrl(absoluteUrl)) {
        links.push({ title, url: absoluteUrl })
        seenUrls.add(href)
      }
    } catch (e) {
      continue
    }
  }

  return links
}

function isPdfUrl(url: string): boolean {
  return /\.pdf(\?|$)/i.test(url) || 
         (url.includes('hpcloud.hp.com') && url.toLowerCase().includes('pdf'))
}
