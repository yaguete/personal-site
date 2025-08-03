import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // URL del backend Flask según el entorno
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://127.0.0.1:5002'  // Para desarrollo local
      : 'https://thinkmaketest-61751b04667e.herokuapp.com';  // Para producción
    
    console.log('Calling backend at:', backendUrl)
    console.log('Request body:', JSON.stringify(body, null, 2))
    
    const response = await fetch(`${backendUrl}/expert-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backend error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('Backend response data:', data)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error calling Flask API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: `Error al generar el análisis experto: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    )
  }
} 