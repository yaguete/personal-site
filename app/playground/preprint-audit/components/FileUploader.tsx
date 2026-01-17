'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Magnetic } from '@/app/components/ui/magnetic'

interface FileUploaderProps {
  onFileUpload: (file: File) => void
  onFileDelete?: () => void
  isLoading: boolean
  error: string
}

const MAX_FILE_SIZE = 6 * 1024 * 1024 // 6MB en bytes

export default function FileUploader({ onFileUpload, onFileDelete, isLoading, error }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [fileError, setFileError] = useState('')

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File): boolean => {
    setFileError('')
    
    if (file.type !== 'application/pdf') {
      setFileError('Only PDF files are allowed')
      return false
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File is too large. Maximum 6MB (your file: ${formatFileSize(file.size)})`)
      return false
    }

    return true
  }

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (validateFile(file)) {
      setSelectedFile(file)
      onFileUpload(file)
    }
  }, [onFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleDropEvent = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleDrop(files)
    }
  }, [handleDrop])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleDrop(Array.from(files))
    }
  }, [handleDrop])

  const handleDelete = () => {
    setSelectedFile(null)
    setFileError('')
    onFileDelete?.()
  }

  return (
    <div className="space-y-4">
      {selectedFile ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl bg-zinc-50/40 p-4 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {selectedFile.name}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600"></div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Analyzing...</span>
              </div>
            ) : (
              <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
                <button
                  onClick={handleDelete}
                  className="group relative inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-black transition-colors duration-200 hover:bg-red-100 hover:text-red-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-red-900/20 dark:hover:text-red-400 cursor-pointer"
                >
                  <span>Change</span>
                  <svg className="h-3 w-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Magnetic>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative rounded-2xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer ${
            isDragActive
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
              : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDropEvent}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <svg className="h-8 w-8 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-zinc-900 dark:text-zinc-100">
              {isDragActive ? 'Drop your PDF file here' : 'Upload your PDF file'}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {isDragActive 
                ? 'Drop to analyze the PDF'
                : 'This is a test project: only 1 PDF at a time, maximum 6MB'
              }
            </p>
          </div>
        </motion.div>
      )}

      {(error || fileError) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20"
        >
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-700 dark:text-red-400">{error || fileError}</span>
          </div>
        </motion.div>
      )}
    </div>
  )
} 