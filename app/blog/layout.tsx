'use client'
import { TextMorph } from '@/app/components/ui/text-morph'
import { ScrollProgress } from '@/app/components/ui/scroll-progress'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ContactSection } from '@/app/components/ContactSection'
import FloatingAskChatGPT from '@/app/components/AskChatGPT'

function CopyButton() {
  const [text, setText] = useState('Copy')
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    setTimeout(() => {
      setText('Copy')
    }, 2000)
  }, [text])

  return (
    <button
      onClick={() => {
        setText('Copied')
        navigator.clipboard.writeText(currentUrl)
      }}
      className="font-base flex items-center gap-1 text-center text-sm text-zinc-500 transition-colors dark:text-zinc-400 cursor-pointer"
      type="button"
    >
      <TextMorph>{text}</TextMorph>
      <span>URL</span>
    </button>
  )
}

function LanguageToggle() {
  const pathname = usePathname()
  const router = useRouter()
  const isEnglish = pathname?.includes('/eng')
  const isSpanish = pathname?.includes('/es')
  
  // Solo mostrar en artículos que tienen versión en ambos idiomas
  const hasBothLanguages = pathname?.includes('ai-end-of-work') || pathname?.includes('dead-internet-theory')
  if (!hasBothLanguages) {
    return null
  }

  const locale: 'en' | 'es' = isEnglish ? 'en' : 'es'
  const placeholder = locale === 'en' ? 'Ask ChatGPT' : 'Pregunta a ChatGPT'

  // Determinar las rutas según el artículo
  const isAiEndOfWork = pathname?.includes('ai-end-of-work')
  const isDeadInternet = pathname?.includes('dead-internet-theory')

  if (isEnglish && isAiEndOfWork) {
    return (
      <button
        onClick={() => router.push('/blog/ai-end-of-work/es')}
        className="font-base flex items-center gap-1 text-center text-sm text-zinc-500 transition-colors dark:text-zinc-400 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300 p-0"
        type="button"
      >
        Leer en Español 
      </button>
    )
  }

  if (isSpanish && isAiEndOfWork) {
    return (
      <button
        onClick={() => router.push('/blog/ai-end-of-work/eng')}
        className="font-base flex items-center gap-1 text-center text-sm text-zinc-500 transition-colors dark:text-zinc-400 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300 p-0"
        type="button"
      >
        Read in English
      </button>
    )
  }

  if (isEnglish && isDeadInternet) {
    return (
      <button
        onClick={() => router.push('/blog/dead-internet-theory/es')}
        className="font-base flex items-center gap-1 text-center text-sm text-zinc-500 transition-colors dark:text-zinc-400 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300 p-0"
        type="button"
      >
        Leer en Español 
      </button>
    )
  }

  if (isSpanish && isDeadInternet) {
    return (
      <button
        onClick={() => router.push('/blog/dead-internet-theory/eng')}
        className="font-base flex items-center gap-1 text-center text-sm text-zinc-500 transition-colors dark:text-zinc-400 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-300 p-0"
        type="button"
      >
        Read in English
      </button>
    )
  }

  return null
}

export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isEnglish = pathname?.includes('/eng')
  const locale: 'en' | 'es' = isEnglish ? 'en' : 'es'
  const placeholder = locale === 'en' ? 'Ask ChatGPT' : 'Pregunta a ChatGPT'
  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 z-10 h-12 w-full bg-gray-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-zinc-950" />
      <ScrollProgress
        className="fixed top-0 z-20 h-0.5 bg-gray-300 dark:bg-zinc-600"
        springOptions={{
          bounce: 0,
        }}
      />

      <div className="flex mt-15 mb-1 pr-1 justify-end items-center">
        <LanguageToggle />
        <div className="w-px h-4 bg-zinc-300 dark:bg-zinc-600 mx-3"></div>
        <CopyButton />
      </div>
      <main className="prose prose-gray pb-10 prose-h4:prose-base dark:prose-invert prose-h1:text-xl prose-h1:font-medium prose-h2:mt-12 prose-h2:scroll-m-20 prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-medium [&>p]:text-justify [&>ul]:text-left [&>ol]:text-left">
        {children}
      </main>
      <ContactSection />
      <FloatingAskChatGPT position="bottom-center" placeholder={placeholder} locale={locale} />
    </>
  )
}
