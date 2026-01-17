'use client'
import { TextEffect } from '@/app/components/ui/text-effect'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link href="/" className="text-xl font-semibold text-black dark:text-white">
          Yago López Losada
        </Link>
        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="text-zinc-600 dark:text-zinc-500"
          delay={0.5}
        >
          Design Thinker & Product Maker
        </TextEffect>
      </div>
      {!isHome && (
        <Link 
          href="/" 
          className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:underline transition-colors"
        >
          ← Go Back
        </Link>
      )}
    </header>
  )
}
