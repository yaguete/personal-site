'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

interface ExpertAnalysisProps {
  onGenerateAnalysis: (language: string) => void
  isGenerating: boolean
  analysis?: {
    success: boolean
    analysis?: string
    error?: string
  }
}

export default function ExpertAnalysis({ onGenerateAnalysis, isGenerating, analysis }: ExpertAnalysisProps) {
  const [copySuccess, setCopySuccess] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  // Reiniciar copySuccess cuando cambie el análisis
  useEffect(() => {
    setCopySuccess('')
  }, [analysis])

  const copyToClipboard = () => {
    if (!analysis?.analysis) return
    
    navigator.clipboard.writeText(analysis.analysis)
      .then(() => {
        setCopySuccess('Already in your clipboard!')
      })
      .catch(() => {
        setCopySuccess('Error copying. Please try again.')
      })
  }

  const handleGenerateAnalysis = () => {
    onGenerateAnalysis(selectedLanguage)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {!analysis ? (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={handleGenerateAnalysis}
              disabled={isGenerating}
              className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-all duration-200 hover:bg-zinc-950 hover:text-zinc-50 hover:translate-x-1 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <span>Analyzing...</span>
                  <div className="ml-1 h-3 w-3 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"></div>
                </>
              ) : (
                <>
                  <span>Generate expert analysis</span>
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
                </>
              )}
            </button>
            
            <div className="flex flex-row items-center gap-2 sm:gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={selectedLanguage === 'en'}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">In English</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="es"
                  checked={selectedLanguage === 'es'}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">In Spanish</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="ca"
                  checked={selectedLanguage === 'ca'}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">In Catalan</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  value="gl"
                  checked={selectedLanguage === 'gl'}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">In Galician</span>
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Expert Analysis
          </h2>
          
          {analysis.success ? (
            <div className="rounded-2xl bg-zinc-50/40 p-6 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown 
                  components={{
                    h1: ({children}) => <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">{children}</h1>,
                    h2: ({children}) => <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3 mt-6">{children}</h2>,
                    h3: ({children}) => <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2 mt-4">{children}</h3>,
                    p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
                    ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                    li: ({children}) => <li className="ml-4">{children}</li>,
                    strong: ({children}) => <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{children}</strong>,
                    em: ({children}) => <em className="italic">{children}</em>,
                    hr: () => <hr className="my-6 border-zinc-200 dark:border-zinc-700" />,
                    blockquote: ({children}) => <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic">{children}</blockquote>,
                  }}
                >
                  {analysis.analysis}
                </ReactMarkdown>
              </div>
              
              <div className="flex justify-start mt-6">
                <button
                  onClick={copyToClipboard}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline transition-colors cursor-pointer"
                >
                  {copySuccess ? "Copy again" : "Copy analysis"}
                </button>
              </div>
              
              {/* Success/error message when copying */}
              {copySuccess && (
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2">{copySuccess}</p>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm text-orange-700 dark:text-orange-400">
                  Could not generate expert analysis: {analysis.error}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
} 