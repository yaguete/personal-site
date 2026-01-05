import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // URL del backend Flask según el entorno
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://127.0.0.1:5001/profile-analyzer'  // Para desarrollo local
      : 'https://thinkmaketest-61751b04667e.herokuapp.com/profile-analyzer';  // Para producción
    
    const formData = await request.formData()
    const rolePdf = formData.get('role_pdf') as File | null
    
    if (!rolePdf || rolePdf.size === 0) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo PDF' },
        { status: 400 }
      )
    }
    
    if (!rolePdf.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'El archivo debe ser un PDF' },
        { status: 400 }
      )
    }
    
    // Crear FormData para enviar al backend
    const backendFormData = new FormData()
    backendFormData.append('role_pdf', rolePdf)
    
    console.log('Enviando PDF del rol al backend:', backendUrl)
    
    const response = await fetch(`${backendUrl}/extract-role-categories`, {
      method: 'POST',
      body: backendFormData,
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: errorText || `HTTP error! status: ${response.status}` }
      }
      console.error('Error del backend:', errorData)
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error calling Flask API:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    return NextResponse.json(
      { 
        error: 'Error al extraer categorías del PDF: ' + errorMessage,
        details: errorMessage
      },
      { status: 500 }
    )
  }
}



