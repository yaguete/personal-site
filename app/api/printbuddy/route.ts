import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // URL del backend según el entorno
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://127.0.0.1:5001/printbuddy'  // Para desarrollo local
      : 'https://thinkmaketest-61751b04667e.herokuapp.com/';  // Para producción
    
    console.log('Enviando consulta PrintBuddy al backend:', backendUrl)
    
    const response = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    if (!response.ok) {
      console.error('Backend response not ok:', response.status, response.statusText)
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Backend PrintBuddy response successful')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error calling Flask API for PrintBuddy:', error)
    return NextResponse.json(
      { error: 'Error al procesar la consulta: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
