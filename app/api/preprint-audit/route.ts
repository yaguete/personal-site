import { NextRequest, NextResponse } from 'next/server'

const MAX_FILE_SIZE = 6 * 1024 * 1024 // 6MB en bytes

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se ha enviado ningún archivo' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Validar tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File is too large. Maximum 6MB (your file: ${(file.size / (1024 * 1024)).toFixed(2)}MB)` },
        { status: 400 }
      )
    }

    // URL del backend Flask según el entorno
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://127.0.0.1:5002'  // Para desarrollo local
      : 'https://thinkmaketest-61751b04667e.herokuapp.com/preprint-audit';  // Para producción
    
    // Crear un nuevo FormData para enviar al backend
    const backendFormData = new FormData()
    backendFormData.append('file', file)
    
    console.log('Enviando archivo al backend:', file.name, 'Tamaño:', file.size)
    
    const response = await fetch(`${backendUrl}/analyze-pdf`, {
      method: 'POST',
      body: backendFormData,
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error('Backend response not ok:', response.status, response.statusText)
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Backend response successful')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error calling Flask API:', error)
    return NextResponse.json(
      { error: 'Error al analizar el PDF: ' + (error as Error).message },
      { status: 500 }
    )
  }
} 