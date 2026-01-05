'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Linkedin, FileText, Globe, MessageSquare, Paperclip, Info } from 'lucide-react'
import { Magnetic } from '@/components/ui/magnetic'

export type SourceType = 'linkedin' | 'cv' | 'portfolio' | 'interview' | 'other'

export interface Source {
  id: string
  type: SourceType
  name?: string // Para "other"
  value: string | File | null // URL, texto o archivo
  isUrl?: boolean // Para "other": true si es URL, false si es archivo
  linkedinUrl?: string // Para LinkedIn: URL (opcional)
  linkedinPdf?: File | null // Para LinkedIn: PDF (obligatorio)
  interviewDate?: string // Para entrevista: fecha de la entrevista
}

interface DynamicSourcesProps {
  sources: Source[]
  onSourcesChange: (sources: Source[]) => void
}

const MAX_FILE_SIZE = 6 * 1024 * 1024 // 6MB

export default function DynamicSources({ sources, onSourcesChange }: DynamicSourcesProps) {
  const [fileError, setFileError] = useState<{ [key: string]: string }>({})
  const [isDragActive, setDragActive] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      return false
    }
    if (file.size > MAX_FILE_SIZE) {
      return false
    }
    return true
  }

  const addSource = (type: SourceType) => {
    const newSource: Source = {
      id: Date.now().toString(),
      type,
      value: type === 'interview' ? '' : (type === 'linkedin' ? null : null),
      name: type === 'other' ? '' : undefined,
      isUrl: type === 'other' ? true : undefined,
      linkedinUrl: type === 'linkedin' ? '' : undefined,
      linkedinPdf: type === 'linkedin' ? null : undefined,
      interviewDate: type === 'interview' ? '' : undefined
    }
    onSourcesChange([...sources, newSource])
  }

  const removeSource = (id: string) => {
    onSourcesChange(sources.filter(s => s.id !== id))
    setFileError(prev => {
      const newErrors = { ...prev }
      delete newErrors[id]
      return newErrors
    })
  }

  const updateSource = useCallback((id: string, updates: Partial<Source>) => {
    onSourcesChange(sources.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ))
  }, [sources, onSourcesChange])

  const handleFileSelect = useCallback((sourceId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      if (!validateFile(file)) {
        setFileError(prev => ({
          ...prev,
          [sourceId]: file.type !== 'application/pdf' 
            ? 'Only PDF files are allowed'
            : `File is too large. Maximum 6MB (your file: ${formatFileSize(file.size)})`
        }))
        return
      }
      setFileError(prev => {
        const newErrors = { ...prev }
        delete newErrors[sourceId]
        return newErrors
      })
      updateSource(sourceId, { value: file })
    }
    // Resetear el input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = ''
  }, [updateSource])

  const handleDrop = useCallback((sourceId: string, e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      if (!validateFile(file)) {
        setFileError(prev => ({
          ...prev,
          [sourceId]: file.type !== 'application/pdf' 
            ? 'Only PDF files are allowed'
            : `File is too large. Maximum 6MB (your file: ${formatFileSize(file.size)})`
        }))
        return
      }
      setFileError(prev => {
        const newErrors = { ...prev }
        delete newErrors[sourceId]
        return newErrors
      })
      updateSource(sourceId, { value: file })
    }
  }, [updateSource])

  const availableSources: { type: SourceType, label: string, icon: string | React.ReactNode }[] = [
    { type: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
    { type: 'cv', label: 'CV', icon: <FileText className="w-4 h-4" /> },
    { type: 'portfolio', label: 'Portfolio', icon: <Globe className="w-4 h-4" /> },
    { type: 'interview', label: 'Interview', icon: <MessageSquare className="w-4 h-4" /> },
    { type: 'other', label: 'Other', icon: <Paperclip className="w-4 h-4" /> }
  ]

  const getSourceLabel = (type: SourceType) => {
    const labels: { [key in SourceType]: string } = {
      linkedin: 'LinkedIn',
      cv: 'CV',
      portfolio: 'Portfolio URL',
      interview: 'Interview notes',
      other: 'Other document'
    }
    return labels[type]
  }

  const hasSource = (type: SourceType) => sources.some(s => s.type === type)

  // Componente de tooltip para LinkedIn
  function LinkedInTooltip() {
    const [isHovered, setIsHovered] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const iconRef = useRef<HTMLDivElement>(null)

    const updatePosition = useCallback(() => {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect()
        setPosition({
          top: rect.bottom + 8,
          left: rect.left + rect.width / 2
        })
      }
    }, [])

    useEffect(() => {
      if (isHovered) {
        updatePosition()
        const handleScroll = () => updatePosition()
        const handleResize = () => updatePosition()
        window.addEventListener('scroll', handleScroll, true)
        window.addEventListener('resize', handleResize)
        return () => {
          window.removeEventListener('scroll', handleScroll, true)
          window.removeEventListener('resize', handleResize)
        }
      }
    }, [isHovered, updatePosition])

    const tooltipContent = isHovered && typeof window !== 'undefined' ? createPortal(
      <div 
        className="fixed px-4 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded-lg shadow-lg pointer-events-none whitespace-normal text-left z-[9999] transition-opacity duration-200"
        style={{ 
          width: '200px',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)',
          opacity: isHovered ? 1 : 0
        }}
      >
        LinkedIn does not allow web scraping, so you must download the PDF from the candidate's profile
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-zinc-900 dark:border-b-zinc-100"></div>
      </div>,
      document.body
    ) : null

    return (
      <>
        <div 
          ref={iconRef}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Info className="w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-colors" />
        </div>
        {tooltipContent}
      </>
    )
  }

  return (
    <div className="space-y-4">
      {/* Added sources */}
      <AnimatePresence>
        {sources.map((source) => (
          <motion.div
            key={source.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/40 dark:bg-zinc-950/40"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {source.type === 'other' && source.name ? source.name : getSourceLabel(source.type)}
                </h4>
                {source.type === 'linkedin' && (
                  <LinkedInTooltip />
                )}
              </div>
              <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
                <button
                  onClick={() => removeSource(source.id)}
                  className="px-2 py-1 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Magnetic>
            </div>

            {/* Input based on type */}
            {source.type === 'linkedin' && (
              <div className="space-y-4">
                {/* URL field (optional) */}
                <div style={{ display: 'none' }}>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    LinkedIn <span className="text-zinc-400 dark:text-zinc-500 text-xs">(optional - only for link in results)</span>
                  </label>
                  <input
                    type="url"
                    value={source.linkedinUrl || ''}
                    onChange={(e) => {
                      updateSource(source.id, { 
                        linkedinUrl: e.target.value
                      })
                    }}
                    placeholder="Will be automatically extracted from PDF during analysis"
                    disabled={true}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent opacity-60 cursor-not-allowed"
                  />
                </div>
                
                {/* PDF field (mandatory) */}
                <div>
                  {source.linkedinPdf instanceof File ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                        <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {source.linkedinPdf.name}
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {formatFileSize(source.linkedinPdf.size)}
                        </p>
                      </div>
                      <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
                        <button
                          onClick={() => {
                            updateSource(source.id, { 
                              linkedinPdf: null
                            })
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-colors cursor-pointer text-sm"
                        >
                          Change
                        </button>
                      </Magnetic>
                    </motion.div>
                  ) : (
                    <div
                      className={`relative rounded-lg border-2 border-dashed p-6 transition-all duration-200 cursor-pointer ${
                        isDragActive === source.id
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragActive(source.id)
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault()
                        setDragActive(null)
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setDragActive(null)
                        
                        const files = Array.from(e.dataTransfer.files)
                        if (files.length > 0) {
                          const file = files[0]
                          if (validateFile(file)) {
                            setFileError(prev => {
                              const newErrors = { ...prev }
                              delete newErrors[source.id]
                              return newErrors
                            })
                            updateSource(source.id, { linkedinPdf: file })
                          } else {
                            setFileError(prev => ({
                              ...prev,
                              [source.id]: file.type !== 'application/pdf' 
                                ? 'Solo se permiten archivos PDF'
                                : `El archivo es demasiado grande. Máximo 6MB (tu archivo: ${formatFileSize(file.size)})`
                            }))
                          }
                        }
                      }}
                      onClick={() => {
                        const input = document.getElementById(`file-input-linkedin-${source.id}`) as HTMLInputElement
                        if (input) {
                          input.click()
                        }
                      }}
                    >
                      <input
                        id={`file-input-linkedin-${source.id}`}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const files = e.target.files
                          if (files && files.length > 0) {
                            const file = files[0]
                            if (validateFile(file)) {
                              setFileError(prev => {
                                const newErrors = { ...prev }
                                delete newErrors[source.id]
                                return newErrors
                              })
                              updateSource(source.id, { linkedinPdf: file })
                            } else {
                              setFileError(prev => ({
                                ...prev,
                                [source.id]: file.type !== 'application/pdf' 
                                  ? 'Solo se permiten archivos PDF'
                                  : `El archivo es demasiado grande. Máximo 6MB (tu archivo: ${formatFileSize(file.size)})`
                              }))
                            }
                          }
                          // Resetear el input para permitir seleccionar el mismo archivo de nuevo
                          e.target.value = ''
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <svg className="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <h3 className="mb-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {isDragActive === source.id ? 'Drop PDF file here' : 'Upload LinkedIn PDF'}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Maximum 6MB
                        </p>
                      </div>
                    </div>
                  )}
                  {fileError[source.id] && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fileError[source.id]}</p>
                  )}
                </div>
              </div>
            )}

            {source.type === 'portfolio' && (
              <input
                type="url"
                value={typeof source.value === 'string' ? source.value : ''}
                onChange={(e) => updateSource(source.id, { value: e.target.value })}
                placeholder="https://portfolio.com"
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {source.type === 'interview' && (
              <div className="space-y-4">
                {/* Date field */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Interview date
                  </label>
                  <input
                    type="date"
                    value={source.interviewDate || ''}
                    onChange={(e) => updateSource(source.id, { interviewDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Notes field */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Interview notes
                  </label>
                  <textarea
                    value={typeof source.value === 'string' ? source.value : ''}
                    onChange={(e) => updateSource(source.id, { value: e.target.value })}
                    placeholder="Write any notes or observations from the interview here..."
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            {source.type === 'cv' && (
              <div>
                {source.value instanceof File ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {source.value.name}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {formatFileSize(source.value.size)}
                      </p>
                    </div>
                    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
                      <button
                        onClick={() => updateSource(source.id, { value: null })}
                        className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-colors cursor-pointer text-sm"
                      >
                        Cambiar
                      </button>
                    </Magnetic>
                  </motion.div>
                ) : (
                  <div
                    className={`relative rounded-lg border-2 border-dashed p-6 transition-all duration-200 cursor-pointer ${
                      isDragActive === source.id
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragActive(source.id)
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      setDragActive(null)
                    }}
                    onDrop={(e) => handleDrop(source.id, e)}
                    onClick={() => {
                      const input = document.getElementById(`file-input-${source.id}`) as HTMLInputElement
                      if (input) {
                        input.click()
                      }
                    }}
                  >
                    <input
                      id={`file-input-${source.id}`}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileSelect(source.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <svg className="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <h3 className="mb-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {isDragActive === source.id ? 'Drop PDF file here' : 'Upload CV as PDF'}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Maximum 6MB
                      </p>
                    </div>
                  </div>
                )}
                {fileError[source.id] && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fileError[source.id]}</p>
                )}
              </div>
            )}

            {source.type === 'other' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={source.name || ''}
                  onChange={(e) => updateSource(source.id, { name: e.target.value })}
                  placeholder="Document name (e.g.: Personal portfolio, Certifications)"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateSource(source.id, { isUrl: true, value: '' })}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                      source.isUrl
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => updateSource(source.id, { isUrl: false, value: null })}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                      !source.isUrl
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    PDF
                  </button>
                </div>
                {source.isUrl ? (
                  <input
                    type="url"
                    value={typeof source.value === 'string' ? source.value : ''}
                    onChange={(e) => updateSource(source.id, { value: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div>
                    {source.value instanceof File ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                          <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {source.value.name}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {formatFileSize(source.value.size)}
                          </p>
                        </div>
                        <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
                          <button
                            onClick={() => updateSource(source.id, { value: null })}
                            className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400 transition-colors cursor-pointer text-sm"
                          >
                            Cambiar
                          </button>
                        </Magnetic>
                      </motion.div>
                    ) : (
                      <div
                        className={`relative rounded-lg border-2 border-dashed p-6 transition-all duration-200 cursor-pointer ${
                          isDragActive === source.id
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                            : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setDragActive(source.id)
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault()
                          setDragActive(null)
                        }}
                        onDrop={(e) => handleDrop(source.id, e)}
                        onClick={() => {
                          const input = document.getElementById(`file-input-other-${source.id}`) as HTMLInputElement
                          if (input) {
                            input.click()
                          }
                        }}
                      >
                        <input
                          id={`file-input-other-${source.id}`}
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileSelect(source.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center text-center">
                          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                            <svg className="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <h3 className="mb-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {isDragActive === source.id ? 'Drop PDF file here' : 'Upload document as PDF'}
                          </h3>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Maximum 6MB
                          </p>
                        </div>
                      </div>
                    )}
                    {fileError[source.id] && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{fileError[source.id]}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Buttons to add sources */}
      <div className="flex flex-wrap gap-2">
        {availableSources.map(({ type, label, icon }) => (
          !hasSource(type) && (
            <Magnetic key={type} springOptions={{ bounce: 0 }} intensity={0.3}>
              <button
                type="button"
                onClick={() => addSource(type)}
                className="group relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
              >
                {typeof icon === 'string' ? <span>{icon}</span> : icon}
                <span>{label}</span>
              </button>
            </Magnetic>
          )
        ))}
      </div>
    </div>
  )
}

