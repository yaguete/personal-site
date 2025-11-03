'use client'

import { useState, useRef, useEffect } from 'react'

// Componente para renderizar videos con thumbnails
function VideoThumbnails({ videos }: { videos: Message['videos'] }) {
  if (!videos || videos.length === 0) return null

  return (
    <div className="mt-4 space-y-3">
      <h4 className="font-semibold text-gray-800 dark:text-gray-200">🎥 Related Videos</h4>
      <div className="flex flex-wrap gap-3">
        {videos.map((video, index) => (
          <a
            key={index}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group"
          >
            <div className="relative">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-32 h-20 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l8-5-8-5z"/>
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// Componente para renderizar contenido estructurado
function StructuredResponse({ response }: { response: Message['structuredResponse'] }) {
  if (!response) return null

  return (
    <div className="space-y-4">
      {/* Diagnóstico */}
      {response.diagnosis && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-400">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🔍 Diagnóstico</h4>
          <p className="text-blue-700 dark:text-blue-300">{response.diagnosis}</p>
        </div>
      )}

      {/* Pasos */}
      {response.steps && response.steps.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">📋 Pasos a seguir:</h4>
          {response.steps.map((step, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {step.number}
                </span>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-800 dark:text-gray-200">{step.title}</h5>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
                  {step.warning && (
                    <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                      <span className="text-yellow-800 dark:text-yellow-200 text-sm">⚠️ {step.warning}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notas de seguridad */}
      {response.safety_notes && response.safety_notes.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-l-4 border-red-400">
          <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">⚠️ Notas de seguridad</h4>
          <ul className="list-disc list-inside space-y-1">
            {response.safety_notes.map((note, index) => (
              <li key={index} className="text-red-700 dark:text-red-300">{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Prerrequisitos */}
      {response.prerequisites && response.prerequisites.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border-l-4 border-green-400">
          <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Prerrequisitos</h4>
          <ul className="list-disc list-inside space-y-1">
            {response.prerequisites.map((prereq, index) => (
              <li key={index} className="text-green-700 dark:text-green-300">{prereq}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Videos */}
      {response.videos && response.videos.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">🎥 Videos relacionados</h4>
          <div className="grid gap-3">
            {response.videos.map((video, index) => (
              <a
                key={index}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-18 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-800 dark:text-gray-200 truncate">{video.title}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{video.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                      {video.duration}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">YouTube</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: Array<{ title: string, url: string, type: 'pdf' | 'video' }>
  videos?: Array<{
    title: string
    url: string
    thumbnail_url: string
    channel: string
    duration: string
  }>
  structuredResponse?: {
    response: string
    diagnosis?: string
    steps?: Array<{
      number: number
      title: string
      description: string
      warning?: string
    }>
    safety_notes?: string[]
    prerequisites?: string[]
    videos?: Array<{
      title: string
      url: string
      thumbnail: string
      duration: string
      description: string
    }>
    sources?: Array<{
      title: string
      url: string
      type: string
      section?: string
      pages?: string
    }>
  }
  format?: 'structured' | 'text'
}

export default function PrintBuddyPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello! I\'m PrintBuddy, I'm here to help you. Tell me your problem or doubt and your printer model.`,
      timestamp: new Date()
    }
  ])
  
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [locale, setLocale] = useState('es-es')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }
    
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputMessage('')
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/printbuddy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          locale: locale,
          conversation: updatedMessages
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Chat failed')
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        sources: data.sources
      }
      
      const newMessages = [assistantMessage]
      
      // Agregar videos como mensajes separados
      if (data.videos && data.videos.length > 0) {
        const videoMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: '',
          timestamp: new Date(),
          videos: data.videos
        }
        newMessages.push(videoMessage)
      }
      
      
      setMessages(prev => [...prev, ...newMessages])
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Lo siento, ha ocurrido un error: ${err}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col overflow-hidden" style={{ minHeight: 'calc(100vh - 250px)' }}>
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="text-left mb-6">
          <h1 className="text-xl font-medium text-black dark:text-white">
            PrintBuddy
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            HP technical support assistant. Solve printing issues, configuration and maintenance of HP printers.
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 min-h-0 px-4 py-2 space-y-4 overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-1.5 rounded-lg shadow-sm ${
                  message.type === 'user'
                    ? 'bg-blue-100 text-blue-900 font-medium border border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700'
                    : 'bg-white border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700'
                }`}
              >
                {message.content && (
                  <div className="text-base whitespace-pre-wrap">
                    {message.content}
                  </div>
                )}
                {message.structuredResponse && (
                  <div className="mt-4">
                    <StructuredResponse response={message.structuredResponse} />
                  </div>
                )}
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-600">
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2 mt-2">📚 Sources:</p>
                    {message.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 truncate mb-1"
                      >
                        {source.title} ({source.type.toUpperCase()})
                      </a>
                    ))}
                  </div>
                )}
                {message.videos && message.videos.length > 0 && (
                  <div className="mt-4">
                    <VideoThumbnails videos={message.videos} />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 px-3 py-1.5 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-2 flex-shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <form className="group relative" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
            <label className="relative flex items-center bg-gray-200/80 backdrop-blur-md shadow-none rounded-[24px] px-4 py-1 w-full transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] group-focus-within:w-full overflow-hidden cursor-text hover:shadow-none hover:scale-105 hover:-translate-y-0.5 dark:bg-gray-800/80 min-w-[200px]">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputMessage.trim() && !isLoading) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Escribe tu pregunta sobre tu impresora HP..."
                className="flex-1 bg-transparent h-9 outline-none text-base sm:text-sm placeholder:text-gray-600 dark:placeholder:text-gray-400 pr-8 sm:pr-10 group-focus-within:pr-8 sm:group-focus-within:pr-10 truncate overflow-hidden"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-1.5 p-2 sm:p-2 rounded-full bg-gray-600/80 text-white hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 enabled:cursor-pointer"
                aria-label="Enviar mensaje"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="transition-transform duration-200 hover:-translate-y-0.5 sm:w-[20px] sm:h-[20px]"
                >
                  <path
                    d="M10 14L10 6M10 6L7 9M10 6L13 9"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </label>
          </form>
        </div>
      </div>
    </div>
  )
}
// Force rebuild
