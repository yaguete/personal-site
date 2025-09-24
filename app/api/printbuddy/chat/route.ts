import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { message, locale = 'es-es', conversation } = await req.json() as {
      message: string
      locale?: string
      conversation: Array<{ type: string, content: string }>
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: 'message_required' }, { status: 400 })
    }

    // 1. Usar la query original del usuario (más específica y efectiva)
    let searchQuery = message
    
    // Detectar si el usuario pide videos (solo para priorización, no para búsqueda)
    const wantsVideo = /video|vídeo|youtube|tutorial|instalación|installation|setup|configuración/i.test(message)
    console.log('Video detection:', { message, wantsVideo })
    console.log('Search query:', searchQuery)

    // 2. Buscar documentación relevante
    const searchResponse = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/printbuddy/hp/find`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchQuery, locale })
    })

    let context = ''
    let sources: Array<{ title: string, url: string, type: 'pdf' | 'video' }> = []

    if (searchResponse.ok) {
      const searchData = await searchResponse.json()
      console.log('Search data:', JSON.stringify(searchData, null, 2))
      const topResults = searchData.results?.slice(0, 12) || [] // Aumentar límite para incluir más videos
      console.log('Top results:', JSON.stringify(topResults, null, 2))
      
      // Separa por tipo
      const pdfResults = topResults.filter((r: any) => r.type === 'pdf')
      const videoResults = topResults.filter((r: any) => r.type === 'video')
      
      // Depuración
      console.log('Counts → pdf:', pdfResults.length, 'video:', videoResults.length, 'used:', searchData.used)
      
      // 2. Parsear PDFs de alto scoring para contexto (limitar para evitar errores de OpenAI)
      for (const result of topResults.slice(0, 3)) {
        if (result.type === 'pdf' && result.score > 0) { // Incluir solo los primeros 3 PDFs
          try {
            const pdfResponse = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/printbuddy/pdf/fetch`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: result.url })
            })
            
            if (pdfResponse.ok) {
              const pdfData = await pdfResponse.json()
              const extractResponse = await fetch(`${process.env.BASE_URL || 'http://localhost:3000'}/api/printbuddy/pdf/extract`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ base64: pdfData.base64 })
              })
              
              if (extractResponse.ok) {
                const extractData = await extractResponse.json()
                // Tomar solo los primeros chunks para contexto (limitar para evitar errores de OpenAI)
                const relevantChunks = extractData.chunks?.slice(0, 2) || []
                context += `\n\n--- Documento: ${result.title} ---\n`
                context += relevantChunks.map((chunk: any) => chunk.text).join('\n')
              }
            }
          } catch (e) {
            console.error('Error parsing PDF:', e)
          }
        }
      }
      
      // Construye 'sources': 3 PDFs + 2 videos (máximo 5)
      const filteredPdfs = (pdfResults || []).filter((p: any) => p.score >= 5)
      const filteredVideos = (videoResults || []).filter((v: any) => v.score >= 5)
      
      // Siempre: 3 PDFs + 2 videos
      const topPdfs = filteredPdfs.slice(0, 3)
      const topVideos = filteredVideos.slice(0, 2)
      
      sources = [
        ...topVideos.map((result: any) => ({
          title: result.title || 'Video',
          url: result.url,
          type: 'video'
        })),
        ...topPdfs.map((result: any) => ({
          title: result.title || 'Documento HP',
          url: result.url,
          type: 'pdf'
        }))
      ]
    }

    // 3. Preparar contexto para OpenAI
    const systemPrompt = `Eres PrintBuddy, un asistente de soporte técnico especializado en impresoras HP. 

INSTRUCCIONES:
- Responde en ${locale.startsWith('es') ? 'español' : 'inglés'} según el locale del usuario
- Usa la documentación oficial de HP proporcionada como contexto
- Sé preciso, técnico pero accesible
- Si no tienes información suficiente, di que necesitas más detalles
- Mantén un tono profesional y útil

IMPORTANTE: NO incluyas enlaces en tu respuesta. Las fuentes se mostrarán automáticamente al usuario.

CONTEXTO DE DOCUMENTACIÓN:
${context}

CONVERSACIÓN ANTERIOR:
${(conversation || []).slice(-3).map(msg => `${msg.type}: ${msg.content}`).join('\n')}`

    // 4. Llamar a OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API error')
    }

    const openaiData = await openaiResponse.json()
    const response = openaiData.choices[0]?.message?.content || 'Lo siento, no pude procesar tu consulta.'

    return NextResponse.json({
      response,
      sources: sources // Ya limitado a 5 en la lógica anterior
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'chat_failed', detail: String((error as any)?.message || error) },
      { status: 500 }
    )
  }
}
