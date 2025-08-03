'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface FontInfo {
  name: string
  type: string
  is_embedded: boolean
  page_number?: number
}

interface FontsModalProps {
  isOpen: boolean
  onClose: () => void
  fonts: FontInfo[]
  category: 'embedded' | 'not_embedded'
  title: string
}

export default function FontsModal({ isOpen, onClose, fonts, category, title }: FontsModalProps) {
  const filteredFonts = fonts.filter(font => {
    if (category === 'embedded') {
      return font.is_embedded
    } else {
      return !font.is_embedded
    }
  })

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
            className="relative w-[600px] max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 border-0 md:border md:border-zinc-200 md:dark:border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {filteredFonts.length} {title}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                  {category === 'embedded' ? 'Fonts embedded in the PDF' : 'Fonts not embedded in the PDF'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]" data-modal-content>
              {filteredFonts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-zinc-500 dark:text-zinc-400 text-lg">No fonts in this category</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFonts.map((font, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                          {font.name}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          Type: {font.type}
                        </p>
                        {font.page_number && (
                          <p className="text-sm text-zinc-500 dark:text-zinc-500">
                            Page: {font.page_number}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        {font.is_embedded ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Embedded
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            Not embedded
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 