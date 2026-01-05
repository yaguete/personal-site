import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // URL del backend Flask según el entorno
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://127.0.0.1:5001/profile-analyzer'  // Para desarrollo local
      : 'https://thinkmaketest-61751b04667e.herokuapp.com/profile-analyzer';  // Para producción
    
    const formData = await request.formData()
    const pdfFile = formData.get('pdf_file') as File | null
    
    if (!pdfFile || pdfFile.size === 0) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionó ningún archivo PDF' },
        { status: 400 }
      )
    }
    
    if (!pdfFile.name.endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, error: 'El archivo debe ser un PDF' },
        { status: 400 }
      )
    }
    
    // Crear FormData para enviar al backend
    const backendFormData = new FormData()
    backendFormData.append('pdf_file', pdfFile)
    
    console.log('Enviando PDF para extraer nombre y URL al backend:', backendUrl)
    
    const response = await fetch(`${backendUrl}/extract-candidate-name`, {
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
        errorData = { success: false, error: errorText || `HTTP error! status: ${response.status}` }
      }
      console.error('Error del backend:', errorData)
      return NextResponse.json(errorData, { status: response.status })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error calling Flask API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al procesar la solicitud'
      },
      { status: 500 }
    )
  }
}

