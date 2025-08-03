'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Magnetic } from '@/components/ui/magnetic'
import { Spotlight } from '@/components/ui/spotlight'
import Spinner from './components/Spinner'

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

export default function LinkedInRecommendationPage() {
  const [relacion, setRelacion] = useState('')
  const [aspectos_destacados, setAspectos_destacados] = useState('')
  const [idioma, setIdioma] = useState('es')
  const [tono, setTono] = useState('flores')
  const [recommendation, setRecommendation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [contadorRecomendaciones, setContadorRecomendaciones] = useState(0)
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState('')



  // Function to get dynamic message based on counter
  const getDynamicMessage = () => {
    if (contadorRecomendaciones === 1) {
      return 'Here goes a proposal 😎'
    } else if (contadorRecomendaciones === 2) {
      return 'Aha, let\'s see if this one fits better 🥸'
    } else if (contadorRecomendaciones === 3) {
      return 'Hmm, let\'s try another one 🧐'
    } else if (contadorRecomendaciones > 3) {
      return 'Let\'s see if this one is better 😟'
    } else {
      return 'Generating recommendation...'
    }
  }

  // Function to copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(recommendation)
      .then(() => {
        setCopySuccess('Copied to clipboard! Paste it on LinkedIn and finish editing it with your style')
      })
      .catch(() => {
        setCopySuccess('Error copying. Try again.')
      })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setCopySuccess('')
    
    try {
      const response = await fetch('/api/linkedin-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ relacion, aspectos_destacados, idioma, tono }),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setRecommendation(result.recommendation)
        setContadorRecomendaciones(prevContador => prevContador + 1)
      } else {
        setError('Error generating recommendation. Try again...')
      }
    } catch (err) {
      setError('Backend error. Try again...')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.main
      className="space-y-10"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="text-left">
          <h1 className="text-xl font-medium text-black dark:text-white">
            Recommend Yago on LinkedIn
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          A bite-sized, AI-powered recommendation generator that ends the classic “I have no idea what to write.” No more excuses—recommend me on LinkedIn!
          </p>
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 gap-8">
          {/* Formulario */}
          <div className="space-y-6">
           
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center cursor-pointer">
                    <input 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                      type="radio" 
                      name="idioma" 
                      id="flexRadioDefault1" 
                      value="es" 
                      checked={idioma === 'es'} 
                      onChange={() => setIdioma('es')}
                    />
                    <label className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer" htmlFor="flexRadioDefault1">
                      In Spanish
                    </label>
                  </div>
                  <div className="flex items-center cursor-pointer">
                    <input 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                      type="radio" 
                      name="idioma" 
                      id="flexRadioDefault2" 
                      value="en" 
                      checked={idioma === 'en'} 
                      onChange={() => setIdioma('en')}
                    />
                    <label className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer" htmlFor="flexRadioDefault2">
                      In English
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="relacion" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  What relationship did you have with Yago?
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  value={relacion} 
                  onChange={(e) => setRelacion(e.target.value)} 
                  required
                >
                  <option value="">Select a relationship</option>
                  <option value="cargo superior a Yago, pero que no supervisaba directamente">You held a higher position but didn't directly supervise him</option>
                  <option value="cargo inferior al de Yago, pero que no supervisaba directamente">Yago held a higher position but didn't supervise you</option>
                  <option value="jefe/a de Yago">You directly supervised Yago</option>
                  <option value="persona que era supervisada por Yago (Yago era su jefe)">Yago supervised you</option>
                  <option value="persona que trabajó en el mismo equipo que Yago, al mismo nivel">You worked on the same team as Yago</option>
                  <option value="cliente/a de Yago">You were Yago's client</option>
                  <option value="proveedor/a de Yago">Yago was your client</option>
                </select>
              </div>
              
              <div>
                <textarea 
                  value={aspectos_destacados}
                  onChange={(e) => setAspectos_destacados(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Is there any quality or achievement you'd like to highlight?\n(optional- you can write in any language)`}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  How would you like to recommend?
                </label>
                <div className="flex flex-col md:flex-col gap-6 md:gap-3">
                  <div className="w-full md:w-auto md:inline-block">
                    <input 
                      className="sr-only"
                      type="radio"  
                      id="btn-check-1"
                      value="flores"
                      checked={tono === 'flores'}  
                      onChange={() => setTono('flores')}
                    />
                    <label 
                      className={`w-full min-w-[250px] md:w-auto md:inline-block md:min-w-[250px] px-4 py-1 rounded-lg transition-colors ${
                        tono === 'flores' 
                          ? 'bg-transparent text-black dark:text-white font-bold cursor-default' 
                          : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                      }`}
                      htmlFor="btn-check-1"
                    >
                      {tono === 'flores' ? '🌹 I want to praise him' : 'I want to praise him'}
                    </label>
                  </div>
                  <div className="w-full md:w-auto md:inline-block">
                    <input 
                      className="sr-only"
                      type="radio"  
                      id="btn-check-2"
                      value="medio"
                      checked={tono === 'medio'}  
                      onChange={() => setTono('medio')}
                    />
                    <label 
                      className={`w-full min-w-[250px] md:w-auto md:inline-block md:min-w-[250px] px-4 py-1 rounded-lg transition-colors ${
                        tono === 'medio' 
                          ? 'bg-transparent text-black dark:text-white font-bold cursor-default' 
                          : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                      }`}
                      htmlFor="btn-check-2"
                    >
                      {tono === 'medio' ? '🤌 Meh, don\'t let him get too confident' : 'Meh, don\'t let him get too confident'}
                    </label>
                  </div>
                  <div className="w-full md:w-auto md:inline-block">
                    <input 
                      className="sr-only"
                      type="radio"  
                      id="btn-check-3"
                      value="chili"
                      checked={tono === 'chili'}  
                      onChange={() => setTono('chili')}
                    />
                    <label 
                      className={`w-full min-w-[250px] md:w-auto md:inline-block md:min-w-[250px] px-4 py-1 rounded-lg transition-colors ${
                        tono === 'chili' 
                          ? 'bg-transparent text-black dark:text-white font-bold cursor-default' 
                          : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                      }`}
                      htmlFor="btn-check-3"
                    >
                      {tono === 'chili' ? '🔪 I don\'t even like him' : 'I don\'t even like him'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Loading and Error */}
              {isLoading && (
                <div className="flex items-center mt-3">
                  <span className="text-zinc-600 dark:text-zinc-400">🤔 Generating recommendation, one second...</span>
                </div>
              )}
              
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-all duration-200 hover:bg-zinc-950 hover:text-zinc-50 hover:translate-x-1 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span>Generating...</span>
                      <div className="ml-1 h-3 w-3 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"></div>
                    </>
                  ) : (
                    <>
                      <span>{contadorRecomendaciones === 0 ? "Generate recommendation proposal" : "Generate another recommendation"}</span>
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
              </Magnetic>

              {/* Show warning from the sixth click */}
              {contadorRecomendaciones >= 6 && (
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 text-sm">
                  I'm glad you like it, just keep in mind that each recommendation costs me money! 💸 🤑
                </div>
              )}
            </form>
          </div>

          {/* Result - Only show when there's a recommendation */}
          {recommendation && (
            <div className="space-y-6">
              
              <div className="relative overflow-hidden rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                <Spotlight
                  className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
                  size={64}
                />
                <div className="relative p-6 bg-white dark:bg-zinc-950 rounded-xl">
                  <h4 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-4">
                    {getDynamicMessage()}
                  </h4>
                  
                  <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed mb-4">
                    {recommendation}
                  </p>
                  
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm italic mb-6">
                    ⚠️ This is an AI-generated recommendation based on other received recommendations. Please note that I am not responsible for the generated content.
                  </p>
                  
                  {/* Success/error message when copying */}
                  {copySuccess && (
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">{copySuccess}</p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <button
                      onClick={copyToClipboard}
                      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline transition-colors cursor-pointer"
                    >
                      Copy recommendation
                    </button>
                    
                    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
                      <button
                        onClick={() => {
                          const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
                          const mobileUrl = 'https://www.linkedin.com/in/yagolopezlosada/details/recommendations/'
                          const desktopUrl = 'https://www.linkedin.com/in/yagolopezlosada/recommendation-add-edit/WRITE_RECOMMENDATION?profileFormEntryPoint=PROFILE_SECTION&trackingId=7dx8SNfiTI68ZTH2kSthvw%3D%3D&desktopBackground=MAIN_PROFILE&recipientProfileId=ACoAAAcb2xABTclxgdeCd8YyrJDYeAQ4uayN6pU'
                          const url = isMobile ? mobileUrl : desktopUrl
                          
                          window.open(url, '_blank', 'noopener,noreferrer')
                        }}
                        className="group relative inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-base text-black transition-colors duration-200 hover:bg-blue-600 hover:text-white dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-blue-600 dark:hover:text-white cursor-pointer"
                      >
                        <span>Go to LinkedIn</span>
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
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </motion.main>
  )
} 