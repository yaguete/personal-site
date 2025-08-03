'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Magnetic } from '@/components/ui/magnetic'
import AnalysisIndicator from './AnalysisIndicator'

interface Size {
  id: string
  label: string
  width: number
  height: number
}

interface SizeSelectorProps {
  onSizeSelect: (size: Size) => void
  data: any
  displaySize?: any
  shouldShowOriginal?: boolean
  selectedSize?: Size | null
  onCustomSizeApplied?: () => void
}

const PAPER_SIZES: Size[] = [
  { id: 'current', label: 'Original', width: 0, height: 0 },
  { id: 'a4', label: 'A4', width: 210, height: 297 },
  { id: 'a3', label: 'A3', width: 420, height: 297 },
  { id: 'a2', label: 'A2', width: 420, height: 594 },
  { id: 'a1', label: 'A1', width: 841, height: 594 },
  { id: 'a0', label: 'A0', width: 1190, height: 841 },
  { id: 'custom', label: 'Custom', width: 0, height: 0 },
]

const getSizes = (data: any) => {
  if (!data?.pages) return []

  const uniqueSizes: Array<{ width: number; height: number }> = []
  data.pages.forEach((page: any) => {
    if (page.dimensions) {
      const size = {
        width: page.dimensions.width,
        height: page.dimensions.height
      }
      // Verificar si el tamaño ya existe
      const exists = uniqueSizes.some(s => 
        s.width === size.width && s.height === size.height
      )
      if (!exists) {
        uniqueSizes.push(size)
      }
    }
  })
  return uniqueSizes
}

export default function SizeSelector({ onSizeSelect, data, displaySize, shouldShowOriginal, selectedSize: externalSelectedSize, onCustomSizeApplied }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState('current')
  const [customWidth, setCustomWidth] = useState('')
  const [customHeight, setCustomHeight] = useState('')
  const [uniqueSizes, setUniqueSizes] = useState<Array<{ width: number; height: number }>>([])
  const [selectedPageSize, setSelectedPageSize] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    const sizes = getSizes(data)
    setUniqueSizes(sizes)
    if (sizes.length > 0) {
      setSelectedPageSize(sizes[0])
    }
  }, [data])

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sizeId = event.target.value
    setSelectedSize(sizeId)
    const size = PAPER_SIZES.find(s => s.id === sizeId)
    if (size) {
      onSizeSelect(size)
      
      // Si se selecciona 'custom' y ya hay dimensiones introducidas, aplicar automáticamente
      if (sizeId === 'custom' && customWidth && customHeight) {
        onSizeSelect({
          id: 'custom',
          label: 'Custom',
          width: parseInt(customWidth),
          height: parseInt(customHeight)
        })
        onCustomSizeApplied?.()
      }
    }
  }

  const handleCustomSizeChange = () => {
    if (customWidth && customHeight) {
      onSizeSelect({
        id: 'custom',
                  label: 'Custom',
        width: parseInt(customWidth),
        height: parseInt(customHeight)
      })
      // Llamar a la función para indicar que se aplicó el tamaño personalizado
      onCustomSizeApplied?.()
    }
  }



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="space-y-4">
        {/* Primera fila: Label + (Dropdown + Indicador) */}
        <div className="flex flex-col gap-0">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Print size
            </label>
          </div>

          {/* Caja que contiene dropdown + indicador */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            {/* Dropdown */}
            <div className="w-auto">
                          <select
              value={selectedSize}
              onChange={handleSizeChange}
              className="w-full max-w-[150px] px-4 py-2 pr-8 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
                {PAPER_SIZES.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector específico para tamaños actuales */}
            {selectedSize === 'current' && uniqueSizes.length > 1 && (
              <div className="w-auto">
                <select
                  value={selectedPageSize ? JSON.stringify(selectedPageSize) : ''}
                  onChange={(e) => {
                    const size = JSON.parse(e.target.value)
                    setSelectedPageSize(size)
                    onSizeSelect({
                      id: 'current',
                      label: 'Current size',
                      width: size.width,
                      height: size.height
                    })
                  }}
                  className="w-full max-w-[150px] px-4 py-2 pr-8 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  {uniqueSizes.map((size, index) => (
                    <option key={index} value={JSON.stringify(size)}>
                      {size.width} x {size.height} mm
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Indicador de análisis */}
            {shouldShowOriginal && displaySize && displaySize.width > 0 && displaySize.height > 0 && (
              <AnalysisIndicator 
                type="original" 
                size={{ width: displaySize.width, height: displaySize.height }}
              />
            )}
            
            {/* Indicador de análisis proyectado */}
            {!shouldShowOriginal && externalSelectedSize && externalSelectedSize.id !== 'current' && (
              <AnalysisIndicator 
                type="projected" 
                size={{ 
                  width: externalSelectedSize.width, 
                  height: externalSelectedSize.height,
                  label: externalSelectedSize.label
                }}
              />
            )}
          </div>
        </div>

        {/* Segunda fila: Campos personalizados */}
        {selectedSize === 'custom' && (
          <div className="w-full">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Custom dimensions (mm)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  placeholder="Width"
                  className="flex-1 max-w-[150px] px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-zinc-500 dark:text-zinc-400">×</span>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  placeholder="Height"
                  className="flex-1 max-w-[150px] px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
                <button
                  onClick={handleCustomSizeChange}
                  className="group relative inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-base text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                >
                  <span>Apply</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                  >
                    <path
                      d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </Magnetic>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
} 