import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // URL del backend Flask según el entorno
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://127.0.0.1:5001/profile-analyzer'  // Para desarrollo local
      : 'https://thinkmaketest-61751b04667e.herokuapp.com/profile-analyzer';  // Para producción
    
    // Leer el cuerpo de la petición
    const contentType = request.headers.get('content-type') || ''
    
    // Detectar FormData: el navegador siempre envía 'multipart/form-data' con boundary
    const isFormData = contentType.includes('multipart/form-data')
    
    if (isFormData) {
      // Si viene como FormData (con archivo)
      const formData = await request.formData()
      const cvFile = formData.get('cv_file') as File | null
      const profileData = formData.get('profile') as string
      const sourcesData = formData.get('sources') as string
      
      const backendFormData = new FormData()
      if (cvFile && cvFile.size > 0) {
        backendFormData.append('cv_file', cvFile)
      }
      
      // Procesar archivo de LinkedIn si existe
      const linkedinFile = formData.get('linkedin_file') as File | null
      if (linkedinFile && linkedinFile.size > 0) {
        backendFormData.append('linkedin_file', linkedinFile)
      }
      
      // Procesar otros archivos
      const otherFiles: { file: File, name: string }[] = []
      let index = 0
      while (true) {
        const file = formData.get(`other_file_${index}`) as File | null
        const fileName = formData.get(`other_file_${index}_name`) as string | null
        if (!file || file.size === 0) break
        otherFiles.push({ file, name: fileName || `Documento ${index + 1}` })
        index++
      }
      
      // Añadir otros archivos al FormData
      otherFiles.forEach(({ file, name }, idx) => {
        backendFormData.append(`other_file_${idx}`, file)
        backendFormData.append(`other_file_${idx}_name`, name)
      })
      
      backendFormData.append('profile', profileData || '{}')
      backendFormData.append('sources', sourcesData || '{}')
      
      console.log('Enviando FormData al backend:', backendUrl)
      console.log('CV file:', cvFile?.name, 'LinkedIn file:', linkedinFile?.name, 'Other files:', otherFiles.length)
      
      const response = await fetch(`${backendUrl}/analyze`, {
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
    } else {
      // Si viene como JSON (sin archivo)
      let body
      try {
        body = await request.json()
      } catch (parseError) {
        console.error('Error al parsear JSON del request:', parseError)
        return NextResponse.json(
          { error: 'Error al parsear el cuerpo de la petición. Asegúrate de que sea JSON válido.' },
          { status: 400 }
        )
      }
      
      console.log('Enviando JSON al backend:', backendUrl)
      
      const response = await fetch(`${backendUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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
    }
  } catch (error) {
    console.error('Error calling Flask API:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Detectar si es un error de conexión
    if (errorMessage.includes('fetch failed') || 
        errorMessage.includes('ECONNREFUSED') || 
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError')) {
      return NextResponse.json(
        { 
          error: 'No se pudo conectar con el servidor backend. Asegúrate de que el servidor Flask esté corriendo en el puerto 5001.',
          details: errorMessage
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Error al analizar el perfil: ' + errorMessage,
        details: errorMessage
      },
      { status: 500 }
    )
  }
}
