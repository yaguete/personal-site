'use client'
import { TextEffect } from '@/app/components/ui/text-effect'
import { HOME_UI } from '@/app/i18n/home'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  const isSpanishHome = pathname === '/es'
  const isHome = pathname === '/' || isSpanishHome

  return (
    <header className="sticky top-0 z-40 -mx-4 mb-2 flex items-center justify-between bg-white/70 px-4 pt-4 pb-4 backdrop-blur-md [-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent)] [mask-image:linear-gradient(to_bottom,black_80%,transparent)] dark:bg-zinc-950/70">
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
          AI Product Builder · 0→1
        </TextEffect>
      </div>
      {isHome ? (
        <Link
          href={isSpanishHome ? '/' : '/es'}
          className="self-end text-zinc-600 hover:underline dark:text-zinc-500"
        >
          {isSpanishHome
            ? HOME_UI.es.readInEnglish
            : HOME_UI.en.readInSpanish}
        </Link>
      ) : (
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
