'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Magnetic } from '@/components/ui/magnetic'

export interface Category {
  id: string
  name: string
  tags: string[]
}

interface CategoryManagerProps {
  categories: Category[]
  onChange: (categories: Category[]) => void
}

export default function CategoryManager({ categories, onChange }: CategoryManagerProps) {
  const addCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: '',
      tags: []
    }
    onChange([...categories, newCategory])
  }

  const removeCategory = (categoryId: string) => {
    onChange(categories.filter(cat => cat.id !== categoryId))
  }

  const updateCategoryName = (categoryId: string, name: string) => {
    onChange(categories.map(cat => 
      cat.id === categoryId ? { ...cat, name } : cat
    ))
  }

  const addTag = (categoryId: string) => {
    onChange(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, tags: [...cat.tags, ''] }
        : cat
    ))
  }

  const removeTag = (categoryId: string, tagIndex: number) => {
    onChange(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, tags: cat.tags.filter((_, idx) => idx !== tagIndex) }
        : cat
    ))
  }

  const updateTag = (categoryId: string, tagIndex: number, value: string) => {
    onChange(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, tags: cat.tags.map((tag, idx) => idx === tagIndex ? value : tag) }
        : cat
    ))
  }

  return (
    <div className="space-y-4">
      {categories.map((category, catIndex) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/40 dark:bg-zinc-950/40"
        >
          <div className="flex items-center gap-3 mb-3">
            <input
              type="text"
              placeholder="Category or capability (e.g.: ideation, research, prototyping, ...)"
              value={category.name}
              onChange={(e) => updateCategoryName(category.id, e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {categories.length > 1 && (
              <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
                <button
                  onClick={() => removeCategory(category.id)}
                  className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </Magnetic>
            )}
          </div>
          
          <div className="space-y-2">
            {category.tags.map((tag, tagIndex) => (
              <div key={tagIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Aspect to evaluate (e.g.: Python, React, 5 years of experience, ...)"
                  value={tag}
                  onChange={(e) => updateTag(category.id, tagIndex, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
                  <button
                    onClick={() => removeTag(category.id, tagIndex)}
                    className="px-2 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Magnetic>
              </div>
            ))}
            <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
              <button
                onClick={() => addTag(category.id)}
                className="group relative inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
              >
                <span>+ Add aspect</span>
              </button>
            </Magnetic>
          </div>
        </motion.div>
      ))}
      
      <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
        <button
          onClick={addCategory}
          className="group relative inline-flex shrink-0 items-center gap-2 rounded-full bg-transparent px-4 py-2 text-base text-black transition-all duration-200 hover:bg-zinc-950 hover:text-zinc-50 hover:translate-x-1 hover:scale-105 dark:text-zinc-100 dark:hover:bg-zinc-700 cursor-pointer mb-4"
        >
          <span>+ Add category or capability</span>
        </button>
      </Magnetic>
    </div>
  )
}

