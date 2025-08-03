'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import SizeSelector from './SizeSelector'
import ImageGridModal from './ImageGridModal'
import FontsModal from './FontsModal'
import { calculateProjectedDPI, getDpiCategory } from '../lib/dpi'

interface ResultsProps {
  data: any
  onSizeChange?: (size: Size | null) => void
}

interface Size {
  id: string
  label: string
  width: number
  height: number
}



const getPaperSizeFromDimensions = (width: number, height: number) => {
  // Tolerancia para comparar dimensiones (en mm)
  const tolerance = 5
  
  // Definir tamaños de papel estándar (ancho x alto en mm)
  const paperSizes = [
    { name: 'A0', width: 841, height: 1189 },
    { name: 'A1', width: 594, height: 841 },
    { name: 'A2', width: 420, height: 594 },
    { name: 'A3', width: 297, height: 420 },
    { name: 'A4', width: 210, height: 297 },
    { name: 'A5', width: 148, height: 210 },
    { name: 'A6', width: 105, height: 148 },
    { name: 'B0', width: 1000, height: 1414 },
    { name: 'B1', width: 707, height: 1000 },
    { name: 'B2', width: 500, height: 707 },
    { name: 'B3', width: 353, height: 500 },
    { name: 'B4', width: 250, height: 353 },
    { name: 'B5', width: 176, height: 250 },
  ]
  
  // Buscar el tamaño más cercano
  for (const size of paperSizes) {
    if (Math.abs(width - size.width) <= tolerance && Math.abs(height - size.height) <= tolerance) {
      return size.name
    }
    // También verificar en orientación vertical
    if (Math.abs(width - size.height) <= tolerance && Math.abs(height - size.width) <= tolerance) {
      return size.name
    }
  }
  
  return null
}

const getStats = (data: any, selectedSize: Size | null) => {
  const dpiStats = {
    very_low: 0,      // < 70 DPI
    low: 0,           // < 150 DPI
    medium: 0,        // 150-300 DPI
    high: 0           // > 300 DPI
  }

  const projectedDpiStats = {
    very_low: 0,
    low: 0,
    medium: 0,
    high: 0
  }

  const colorStats = {
    RGB: 0,
    CMYK: 0,
    Gray: 0,
    ICC: 0,
    Spot: 0,
    DeviceN: 0,
    Unknown: 0
  }

  const fontStats = {
    embedded: data.summary.embedded_fonts,
    not_embedded: data.summary.total_fonts - data.summary.embedded_fonts,
    types: {} as Record<string, number>
  }

      // Recorrer todas las páginas
    data.pages.forEach((page: any) => {
      // Recorrer todas las imágenes de cada página
      page.images.forEach((image: any) => {
        // Verificar si dpi_info existe y es un array
        const dpiArray = Array.isArray(image.dpi_info) ? image.dpi_info : []
        const originalDpi = dpiArray.length > 0 ? dpiArray[0]?.dpi_avg || 0 : 0
      
        // Contar DPIs originales
      if (originalDpi < 70) dpiStats.very_low++
      else if (originalDpi <= 150) dpiStats.low++
      else if (originalDpi <= 300) dpiStats.medium++
      else dpiStats.high++

      // Calcular DPI proyectado si hay un tamaño seleccionado
      if (selectedSize && selectedSize.width > 0 && selectedSize.height > 0) {
        const projectedDpi = calculateProjectedDPI(
          originalDpi,
          page.dimensions?.width || 0,
          page.dimensions?.height || 0,
          selectedSize.width,
          selectedSize.height
        )

        if (projectedDpi < 70) projectedDpiStats.very_low++
        else if (projectedDpi <= 150) projectedDpiStats.low++
        else if (projectedDpi <= 300) projectedDpiStats.medium++
        else projectedDpiStats.high++
      }

      const colorMode = image.color_mode?.replace('/', '') || 'Unknown'
      if (colorStats.hasOwnProperty(colorMode)) {
        colorStats[colorMode as keyof typeof colorStats]++
      } else {
        colorStats.Unknown++
      }
    })
  })

  // Contar tipos de fuentes
  data.summary.fonts.forEach((font: any) => {
    const type = font.type?.replace('/', '') || 'Unknown'
    fontStats.types[type] = (fontStats.types[type] || 0) + 1
  })

  return { dpiStats, projectedDpiStats, colorStats, fontStats }
}

export default function Results({ data, onSizeChange }: ResultsProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [customSizeApplied, setCustomSizeApplied] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [fontsModalOpen, setFontsModalOpen] = useState(false)
  const [selectedFontCategory, setSelectedFontCategory] = useState<'embedded' | 'not_embedded'>('embedded')

  // Obtener las dimensiones originales del PDF
  const getOriginalDimensions = () => {
    if (!data?.pages || data.pages.length === 0) return { width: 0, height: 0 }
    
    // Usar las dimensiones de la primera página como referencia
    const firstPage = data.pages[0]
    return {
      width: firstPage.dimensions?.width || 0,
      height: firstPage.dimensions?.height || 0
    }
  }

  // Establecer el tamaño original por defecto si no hay ninguno seleccionado
  const originalDimensions = getOriginalDimensions()
  const shouldShowOriginal = !selectedSize || selectedSize.id === 'current'
  const displaySize = shouldShowOriginal 
    ? { id: 'current', label: 'Original', width: originalDimensions.width, height: originalDimensions.height }
    : selectedSize

  // Lógica para mostrar/ocultar secciones cuando se selecciona personalizado
  const shouldShowSections = !selectedSize || selectedSize.id !== 'custom' || customSizeApplied

  const { dpiStats, projectedDpiStats, colorStats, fontStats } = getStats(data, selectedSize)
  const categoriesToShow = (!selectedSize || selectedSize.id === 'current') ? dpiStats : projectedDpiStats

  // Función para manejar la selección de tamaño
  const handleSizeSelect = (size: Size) => {
    setSelectedSize(size)
    // Notificar al componente padre sobre el cambio de tamaño
    onSizeChange?.(size)
    // Cerrar el modal cuando cambia el tamaño para evitar "fantasmas"
    setModalOpen(false)
    // Si se selecciona un tamaño diferente a 'custom', resetear el estado
    if (size.id !== 'custom') {
      setCustomSizeApplied(false)
    }
    // Si se selecciona 'custom' y ya hay dimensiones válidas, considerar como aplicado
    if (size.id === 'custom' && size.width > 0 && size.height > 0) {
      setCustomSizeApplied(true)
    }
  }

  // Función para manejar cuando se aplica un tamaño personalizado
  const handleCustomSizeApplied = () => {
    setCustomSizeApplied(true)
  }

  // Función para abrir el modal de imágenes
  const handleOpenImageModal = (category: string) => {
    console.log('Opening modal for category:', category)
    console.log('All images:', getAllImages())
    setSelectedCategory(category)
    setModalOpen(true)
  }

  // Función para abrir el modal de fuentes
  const handleOpenFontsModal = (category: 'embedded' | 'not_embedded') => {
    setSelectedFontCategory(category)
    setFontsModalOpen(true)
  }

  // Obtener todas las imágenes del PDF
  const getAllImages = () => {
    const allImages: any[] = []
    console.log('Data pages:', data.pages)
    data.pages.forEach((page: any, pageIndex: number) => {
      console.log('Page images:', page.images)
      page.images.forEach((image: any) => {
        console.log('Individual image:', image)
        allImages.push({
          ...image,
          page_number: pageIndex + 1
        })
      })
    })
    console.log('All images array:', allImages)
    return allImages
  }

  const getAllFonts = () => {
    const allFonts: any[] = []
    data.pages.forEach((page: any, pageIndex: number) => {
      if (page.fonts) {
        page.fonts.forEach((font: any) => {
          allFonts.push({
            ...font,
            page_number: pageIndex + 1
          })
        })
      }
    })
    return allFonts
  }

  const dpiCategories = []
  const statsToUse = categoriesToShow === dpiStats ? dpiStats : projectedDpiStats
  const isProjected = categoriesToShow === projectedDpiStats
  
  if (statsToUse.very_low > 0) {
    dpiCategories.push({ 
      label: isProjected ? 'in very low quality' : 'in very low quality', 
      count: statsToUse.very_low, 
      dpi: '< 70',
      color: 'text-red-600 dark:text-red-400',
      category: 'very_low'
    })
  }
  if (statsToUse.low > 0) {
    dpiCategories.push({ 
      label: isProjected ? 'in low quality' : 'in low quality', 
      count: statsToUse.low, 
      dpi: '< 150',
      color: 'text-orange-600 dark:text-orange-400',
      category: 'low'
    })
  }
  if (statsToUse.medium > 0) {
    dpiCategories.push({ 
      label: isProjected ? 'in acceptable quality' : 'in acceptable quality', 
      count: statsToUse.medium, 
      dpi: '150-300',
      color: 'text-green-600 dark:text-green-400',
      category: 'medium'
    })
  }
  if (statsToUse.high > 0) {
    dpiCategories.push({ 
      label: isProjected ? 'in high quality' : 'in high quality', 
      count: statsToUse.high, 
      dpi: '> 300',
      color: 'text-green-600 dark:text-green-400',
      category: 'high'
    })
  }

  const colorModes = []
  if (colorStats.RGB > 0) colorModes.push({ label: 'RGB', count: colorStats.RGB })
  if (colorStats.CMYK > 0) colorModes.push({ label: 'CMYK', count: colorStats.CMYK })
  if (colorStats.Gray > 0) colorModes.push({ label: 'Grayscale', count: colorStats.Gray })
  if (colorStats.ICC > 0) colorModes.push({ label: 'ICC', count: colorStats.ICC })
  if (colorStats.Spot > 0) colorModes.push({ label: 'Spot', count: colorStats.Spot })
  if (colorStats.DeviceN > 0) colorModes.push({ label: 'DeviceN', count: colorStats.DeviceN })
  if (colorStats.Unknown > 0) colorModes.push({ label: 'Unknown', count: colorStats.Unknown })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Technical Analysis
        </h2>
        
        {/* Size Selector con indicador integrado */}
        <SizeSelector 
          onSizeSelect={handleSizeSelect}
          data={data}
          displaySize={displaySize}
          shouldShowOriginal={shouldShowOriginal}
          selectedSize={selectedSize}
          onCustomSizeApplied={handleCustomSizeApplied}
        />
        

        
        {shouldShowSections && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Margins and Configuration
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {data.summary.total_pages} total pages
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {data.summary.pages_without_trim_marks === 0 ? (
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {data.summary.pages_without_trim_marks === 0 
                    ? 'All pages have trim marks'
                    : `${data.summary.pages_without_trim_marks} pages without trim marks`
                  }
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {data.summary.pages_without_bleed === 0 ? (
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {data.summary.pages_without_bleed === 0 
                    ? 'All pages have bleed'
                    : `${data.summary.pages_without_bleed} pages without bleed`
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Images ({data.summary.total_images})
            </h3>
            <div className="space-y-0">
              {dpiCategories.map((category, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-lg transition-colors duration-200"
                  onClick={() => handleOpenImageModal(category.category)}
                >
                  <span className={`text-sm font-medium ${category.color}`}>
                    {category.count}
                  </span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {category.label} ({category.dpi} DPI)
                  </span>
                  <svg className="h-4 w-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Color Profiles
            </h3>
            <div className="space-y-2">
              {colorModes.map((colorMode, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {colorMode.label}
                  </span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    ({colorMode.count})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fuentes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Fonts ({data.summary.total_fonts})
            </h3>
            <div className="space-y-0">
              {fontStats.embedded > 0 && (
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-lg transition-colors duration-200"
                  onClick={() => handleOpenFontsModal('embedded')}
                >
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {fontStats.embedded} embedded fonts
                  </span>
                  <svg className="h-4 w-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
              {fontStats.not_embedded > 0 && (
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-lg transition-colors duration-200"
                  onClick={() => handleOpenFontsModal('not_embedded')}
                >
                  <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {fontStats.not_embedded} non-embedded fonts
                  </span>
                  <svg className="h-4 w-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Modal de imágenes */}
      <ImageGridModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        images={getAllImages()}
        category={selectedCategory}
        paperSize={displaySize?.label || 'Original'}
        targetSize={selectedSize}
        pageDimensions={getOriginalDimensions()}
      />

      {/* Modal de fuentes */}
      <FontsModal
        isOpen={fontsModalOpen}
        onClose={() => setFontsModalOpen(false)}
        fonts={getAllFonts()}
        category={selectedFontCategory}
        title={selectedFontCategory === 'embedded' ? 'embedded fonts' : 'non-embedded fonts'}
      />
    </motion.div>
  )
} 