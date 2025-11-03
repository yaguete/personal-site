'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { calculateProjectedDPI, getDpiCategory, getCategoryColor, getCategoryLabel } from '../lib/dpi'

interface ImageInfo {
  color_mode: string
  color_space: string
  height_px: number
  width_px: number
  dpi_info: Array<{
    dpi_x: number
    dpi_y: number
    dpi_avg: number
  }>
  spot_colors: any[]
  is_compressed: boolean
  compression_type: string
  image_data: string
  image_ext: string
  page_number?: number
}

interface ImageGridModalProps {
  isOpen: boolean
  onClose: () => void
  images: ImageInfo[]
  category: string
  paperSize: string
  targetSize?: {
    id: string
    label: string
    width: number
    height: number
  } | null
  pageDimensions: {
    width: number
    height: number
  }
}



export default function ImageGridModal({ isOpen, onClose, images, category, paperSize, targetSize, pageDimensions }: ImageGridModalProps) {
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null)

  const filteredImages = images.filter(image => {
    const dpiArray = Array.isArray(image.dpi_info) ? image.dpi_info : []
    const originalDpi = dpiArray.length > 0 ? dpiArray[0]?.dpi_avg || 0 : 0
    
    // Calcular DPI proyectado basado en el tamaño objetivo
    const projectedDpi = calculateProjectedDPI(
      originalDpi,
      pageDimensions.width,
      pageDimensions.height,
      targetSize?.width,
      targetSize?.height
    )
    
    return getDpiCategory(projectedDpi) === category
  })

  const handleImageClick = (image: ImageInfo) => {
    console.log('Imagen seleccionada:', image)
    console.log('DPI info:', image.dpi_info)
    console.log('Propiedades:', {
      width_px: image.width_px,
      height_px: image.height_px,
      color_mode: image.color_mode,
      color_space: image.color_space,
      compression_type: image.compression_type,
      is_compressed: image.is_compressed
    })
    setSelectedImage(image)
  }

  const closeImageDetail = () => {
    setSelectedImage(null)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="relative w-[800px] max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 border-0 md:border md:border-zinc-200 md:dark:border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {filteredImages.length} images in {getCategoryLabel(category)}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                  Paper size: {paperSize}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]" data-modal-content>
              {filteredImages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No images in this category</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                     {filteredImages.map((image, index) => {
                     const dpiArray = Array.isArray(image.dpi_info) ? image.dpi_info : []
                     const originalDpi = dpiArray.length > 0 ? dpiArray[0]?.dpi_avg || 0 : 0
                     
                     // Calcular DPI proyectado para mostrar en el badge
                     const projectedDpi = calculateProjectedDPI(
                       originalDpi,
                       pageDimensions.width,
                       pageDimensions.height,
                       targetSize?.width,
                       targetSize?.height
                     )
                     
                     const imageCategory = getDpiCategory(projectedDpi)
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group cursor-pointer"
                        onClick={() => handleImageClick(image)}
                      >
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-300 transition-all duration-200">
                          <img
                            src={`data:image/${image.image_ext};base64,${image.image_data}`}
                            alt={`Image ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                          
                          {/* DPI Badge */}
                                                     <div className="absolute top-2 right-2">
                             <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(imageCategory)}`}>
                               {projectedDpi.toFixed(0)} DPI
                             </span>
                           </div>
                          
                          {/* Image Info */}
                          <div className="p-3 bg-white">
                            <p className="text-xs text-gray-600">
                              {image.width_px} × {image.height_px} px
                            </p>
                            <p className="text-xs text-gray-500">
                              {image.compression_type.replace('/', '')}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Close button for main modal */}
          <motion.button
            onClick={onClose}
            className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1 z-50"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
          >
            <X className="h-5 w-5 text-zinc-500" />
          </motion.button>

          {/* Image Detail Modal */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-60 flex items-center justify-center backdrop-blur-sm"
                onClick={closeImageDetail}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                  className="relative w-[600px] max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 border-0 md:border md:border-zinc-200 md:dark:border-zinc-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        Image details
                      </h3>
                    </div>
                    <button
                      onClick={closeImageDetail}
                      className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]" data-modal-content>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Image */}
                      <div>
                        <img
                          src={`data:image/${selectedImage.image_ext};base64,${selectedImage.image_data}`}
                          alt="Imagen detallada"
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
                      </div>
                      
                      {/* Details */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Properties</h4>
                          <div className="space-y-2 text-sm">
                            {(() => {
                              console.log('Rendering properties for:', selectedImage)
                              const dpiValue = selectedImage.dpi_info && selectedImage.dpi_info.length > 0 ? selectedImage.dpi_info[0].dpi_avg : null
                              return (
                                <>
                                  <p className="text-zinc-700 dark:text-zinc-300"><span className="font-medium">Page:</span> {selectedImage.page_number || 'N/A'}</p>
                                  <p className="text-zinc-700 dark:text-zinc-300"><span className="font-medium">DPI:</span> {dpiValue ? dpiValue.toFixed(0) : 'N/A'}</p>
                                  <p className="text-zinc-700 dark:text-zinc-300"><span className="font-medium">Dimensions:</span> {selectedImage.width_px || 'N/A'} × {selectedImage.height_px || 'N/A'} px</p>
                                  <p className="text-zinc-700 dark:text-zinc-300"><span className="font-medium">Color profile:</span> {selectedImage.color_mode ? selectedImage.color_mode.replace('/', '') : 'N/A'}</p>
                                  <p className="text-zinc-700 dark:text-zinc-300"><span className="font-medium">Compression:</span> {selectedImage.compression_type ? selectedImage.compression_type.replace('/', '') : 'N/A'}</p>
                                </>
                              )
                            })()}
                          </div>
                        </div>
                        
                        {/* Download Button */}
                        <div className="pt-4">
                          <button
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = `data:image/${selectedImage.image_ext};base64,${selectedImage.image_data}`
                              link.download = `imagen_pagina_${selectedImage.page_number || 'unknown'}.${selectedImage.image_ext}`
                              link.click()
                            }}
                            className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-all duration-200 hover:bg-zinc-950 hover:text-zinc-50 hover:translate-x-1 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                          >
                            Download
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
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 