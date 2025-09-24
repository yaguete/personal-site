import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body
    
    if (!url || !/^https:\/\//i.test(url)) {
      return NextResponse.json({ error: 'url_invalid' }, { status: 400 })
    }
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PrintBuddy/1.0)'
      }
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: `fetch_status_${response.status}` }, { status: 502 })
    }
    
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    
    return NextResponse.json({ base64 })
  } catch (error) {
    console.error('PDF fetch error:', error)
    return NextResponse.json(
      { error: 'fetch_failed', detail: String(error?.message || error) },
      { status: 500 }
    )
  }
}
