import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { base64 } = body
    
    if (!base64) {
      return NextResponse.json({ error: 'base64_required' }, { status: 400 })
    }
    
    const buffer = Buffer.from(base64, 'base64')
    const data = await pdfParse(buffer)
    
    const pages = data.numpages || 0
    const meta = data.info || {}
    
    // Dividir texto por páginas usando saltos de página
    const rawText = (data.text || '').split('\f')
    const chunks: Array<{ page: number, offset: number, text: string }> = []
    const chunkSize = 2000
    
    rawText.forEach((pageText, index) => {
      const text = (pageText || '').trim()
      for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push({
          page: index + 1,
          offset: i,
          text: text.slice(i, i + chunkSize)
        })
      }
    })
    
    return NextResponse.json({ pages, meta, chunks })
  } catch (error) {
    console.error('PDF extract error:', error)
    return NextResponse.json(
      { error: 'extract_failed', detail: String(error?.message || error) },
      { status: 500 }
    )
  }
}
