'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CollapsibleSectionProps {
  title: string
  subtitle?: string
  summary?: string // Resumen que se muestra cuando está plegado
  defaultOpen?: boolean
  children: React.ReactNode
  headerActions?: React.ReactNode | ((isOpen: boolean) => React.ReactNode) // Acciones adicionales en el header (ej: botón borrar)
}

export default function CollapsibleSection({
  title,
  subtitle,
  summary,
  defaultOpen = true,
  children,
  headerActions
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  // Actualizar el estado cuando cambie defaultOpen
  useEffect(() => {
    setIsOpen(defaultOpen)
  }, [defaultOpen])

  return (
    <div className="rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden mt-0 mb-4 pb-3" style={{ paddingBottom: '0px' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between flex-1 min-w-0 cursor-pointer"
        >
          <div className="flex flex-col items-start text-left flex-1 min-w-0">
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                {subtitle}
              </p>
            )}
            {!isOpen && summary && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 truncate w-full">
                {summary}
              </p>
            )}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 flex-shrink-0"
          >
            <svg
              className="w-5 h-5 text-zinc-400 dark:text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </button>
        {headerActions && (
          <div className="ml-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {typeof headerActions === 'function' ? headerActions(isOpen) : headerActions}
          </div>
        )}
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

