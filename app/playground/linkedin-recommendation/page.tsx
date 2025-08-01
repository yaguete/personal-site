'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Magnetic } from '@/components/ui/magnetic'
import { Spotlight } from '@/components/ui/spotlight'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/linkedin-recommendation/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ relacion, aspectos_destacados, idioma, tono }),
      })
      
      const data = await response.json()
      
      if (data.recommendation) {
        setRecommendation(data.recommendation)
        setContadorRecomendaciones(prev => prev + 1)
      } else {
        console.error('Error:', data.error)
      }
    } catch (error) {
      console.error('Error:', error)
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
            LinkedIn Recommendation Generator
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Genera recomendaciones personalizadas de LinkedIn en segundos utilizando IA. 
            Diseñada para ahorrar tiempo y mejorar tu perfil profesional.
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
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Generar Recomendación
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center">
                    <input 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      type="radio" 
                      name="idioma" 
                      id="flexRadioDefault1" 
                      value="es" 
                      checked={idioma === 'es'} 
                      onChange={() => setIdioma('es')}
                    />
                    <label className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="flexRadioDefault1">
                      En español
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      type="radio" 
                      name="idioma" 
                      id="flexRadioDefault2" 
                      value="en" 
                      checked={idioma === 'en'} 
                      onChange={() => setIdioma('en')}
                    />
                    <label className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="flexRadioDefault2">
                      En inglés
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="relacion" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  ¿Qué relación has tenido con Yago?
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={relacion} 
                  onChange={(e) => setRelacion(e.target.value)} 
                  required
                >
                  <option value="">Selecciona una relación</option>
                  <option value="cargo superior a Yago, pero que no supervisaba directamente">Ocupabas un cargo superior pero no lo supervisabas directamente</option>
                  <option value="cargo inferior al de Yago, pero que no supervisaba directamente">Yago ocupaba un cargo superior pero no te supervisaba</option>
                  <option value="jefe/a de Yago">Supervisabas directamente a Yago</option>
                  <option value="persona que era supervisada por Yago (Yago era su jefe)">Yago te supervisaba</option>
                  <option value="persona que trabajó en el mismo equipo que Yago, al mismo nivel">Trabajabas en el mismo equipo que Yago</option>
                  <option value="cliente/a de Yago">Eras cliente/a de Yago</option>
                  <option value="proveedor/a de Yago">Yago era tu cliente/a</option>
                </select>
              </div>
              
              <div>
                <textarea 
                  value={aspectos_destacados}
                  onChange={(e) => setAspectos_destacados(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="¿Hay alguna cualidad o logro que quieras destacar? (opcional)"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                  ¿Cómo te gustaría recomendar?
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
                      {tono === 'flores' ? '🌹 Quiero echarle flores' : 'Quiero echarle flores'}
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
                      {tono === 'medio' ? '🤌 Ñéh, que no se lo crea tanto' : 'Ñéh, que no se lo crea tanto'}
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
                      {tono === 'chili' ? '🔪 Ni siquiera me cae bien' : 'Ni siquiera me cae bien'}
                    </label>
                  </div>
                </div>
              </div>

              <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-4 py-2 text-base text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? 'Generando...' : (contadorRecomendaciones === 0 ? "Generar propuesta de recomendación" : "Generar otra recomendación")}
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

              {/* Mostrar aviso a partir del sexto clic */}
              {contadorRecomendaciones >= 6 && (
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 text-sm">
                  Me alegro de que te guste, ¡solo ten en cuenta que cada recomendación me cuesta pasta! 🥺 💶
                </div>
              )}
            </form>
          </div>

          {/* Resultado */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Recomendación Generada
            </h2>
            
            {recommendation ? (
              <div className="relative overflow-hidden rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                <Spotlight
                  className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
                  size={64}
                />
                <div className="relative p-6 bg-white dark:bg-zinc-950 rounded-xl">
                  <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                    {recommendation}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <Magnetic>
                      <button
                        onClick={() => navigator.clipboard.writeText(recommendation)}
                        className="inline-flex items-center space-x-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                      >
                        <span>Copiar al portapapeles</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </Magnetic>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                <div className="relative p-6 bg-white dark:bg-zinc-950 rounded-xl">
                  <p className="text-zinc-500 dark:text-zinc-400 text-center">
                    Completa el formulario y genera tu recomendación personalizada
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </motion.main>
  )
} 