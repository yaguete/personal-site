import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chunks, query } = body
    
    if (!Array.isArray(chunks) || !query) {
      return NextResponse.json({ error: 'chunks_and_query_required' }, { status: 400 })
    }
    
    const searchRegex = new RegExp(query, 'i')
    const hits = chunks
      .filter((chunk: any) => typeof chunk.text === 'string' && searchRegex.test(chunk.text))
      .slice(0, 50)
      .map((chunk: any) => ({
        page: chunk.page,
        snippet: chunk.text.slice(0, 300)
      }))
    
    return NextResponse.json({ query, hits })
  } catch (error) {
    console.error('PDF search error:', error)
    return NextResponse.json(
      { error: 'search_in_pdf_failed', detail: String((error as Error)?.message || error) },
      { status: 500 }
    )
  }
}
