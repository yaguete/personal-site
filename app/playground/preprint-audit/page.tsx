'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Magnetic } from '@/app/components/ui/magnetic'
import { Spotlight } from '@/app/components/ui/spotlight'
import FileUploader from './components/FileUploader'
import Results from './components/Results'
import ExpertAnalysis from './components/AIAnalysis'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const TRANSITION_SECTION = {
  type: 'spring',
  bounce: 0,
  duration: 0.6,
}

// Añadir un tipo para los resultados
interface PreprintResults {
  llm_analysis?: any;
  [key: string]: any;
}

export default function PreprintAuditPage() {
  const [results, setResults] = useState<PreprintResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [expertAnalyses, setExpertAnalyses] = useState<{[key: string]: any}>({})
  const [isGeneratingExpertAnalysis, setIsGeneratingExpertAnalysis] = useState(false)
  const [currentSize, setCurrentSize] = useState<any>(null)

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    setError('')
    setResults(null)
    setExpertAnalyses({})
    setCurrentSize(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/preprint-audit', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Backend error:', errorData)
        throw new Error(errorData.error || 'Error analyzing the PDF')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError('Error processing the file. Please try again.')
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileDelete = () => {
    setResults(null)
    setError('')
    setExpertAnalyses({})
    setCurrentSize(null)
  }

  const handleSizeChange = (size: any) => {
    setCurrentSize(size)
  }

  const handleGenerateExpertAnalysis = async (language: string = 'en') => {
    if (!results) return
    
    setIsGeneratingExpertAnalysis(true)

    // Usar el tamaño actual o el original por defecto
    const targetSize = currentSize || { label: 'Original', width: null, height: null }

    try {
      const response = await fetch('/api/preprint-audit/expert-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisData: results,
          selectedSize: results.selectedSize || null,
          currentSize: targetSize,
          language: language
        }),
      })

      console.log('Expert analysis response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Expert analysis error:', errorData)
        throw new Error(errorData.error || 'Error generating expert analysis')
      }

      const data = await response.json()
      console.log('Expert analysis response data:', data)
      
      // Guardar el análisis para el tamaño actual
      const sizeKey = targetSize.label || 'original'
      setExpertAnalyses(prev => ({
        ...prev,
        [sizeKey]: data
      }))
    } catch (err) {
      const sizeKey = targetSize.label || 'original'
      setExpertAnalyses(prev => ({
        ...prev,
        [sizeKey]: {
          success: false,
          error: 'Error generating expert analysis. Please try again.'
        }
      }))
      console.error('Error:', err)
    } finally {
      setIsGeneratingExpertAnalysis(false)
    }
  }

  // Obtener el análisis para el tamaño actual
  const getCurrentAnalysis = () => {
    const targetSize = currentSize || { label: 'Original', width: null, height: null }
    const sizeKey = targetSize.label || 'original'
    return expertAnalyses[sizeKey] || null
  }

  return (
    <motion.main
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >


      {/* Header Section */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="text-left">
          <h1 className="text-xl font-medium text-black dark:text-white">
            Preprint Audit
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Analyze your PDFs for printing in different formats. Avoid pixelated or blurry images, font issues, margins and more.
          </p>
        </div>
      </motion.section>

      {/* File Upload Section */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <FileUploader 
          onFileUpload={handleFileUpload}
          onFileDelete={handleFileDelete}
          isLoading={isLoading}
          error={error}
        />
      </motion.section>

      {/* Results Section */}
      {results && (
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
          initial="hidden"
          animate="visible"
        >
          <Results data={results} onSizeChange={handleSizeChange} />
        </motion.section>
      )}

      {/* Expert Analysis Section */}
      {results && (
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
          initial="hidden"
          animate="visible"
        >
          <ExpertAnalysis 
            onGenerateAnalysis={handleGenerateExpertAnalysis}
            isGenerating={isGeneratingExpertAnalysis}
            analysis={getCurrentAnalysis()}
          />
        </motion.section>
      )}
    </motion.main>
  )
} 