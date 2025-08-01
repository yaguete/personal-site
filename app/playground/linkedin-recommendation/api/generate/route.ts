import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // URL de tu backend Flask (ajusta según tu configuración)
    const flaskUrl = process.env.FLASK_API_URL || 'http://localhost:5000'
    
    const response = await fetch(`${flaskUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error calling Flask API:', error)
    return NextResponse.json(
      { error: 'Error al generar la recomendación' },
      { status: 500 }
    )
  }
} 