'use client'
import { AnimatedBackground } from '@/app/components/ui/animated-background'
import { TextLoop } from '@/app/components/ui/text-loop'
import { MonitorIcon, MoonIcon, SunIcon, SmartphoneIcon } from 'lucide-react'
import { HOME_UI } from '@/app/i18n/home'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const THEMES_OPTIONS = [
  {
    label: 'Light',
    id: 'light',
    icon: <SunIcon className="h-4 w-4" />,
  },
  {
    label: 'Dark',
    id: 'dark',
    icon: <MoonIcon className="h-4 w-4" />,
  },
  {
    label: 'System',
    id: 'system',
    icon: (
      <span className="inline-flex items-center">
        <SmartphoneIcon className="h-4 w-4 sm:hidden" />
        <MonitorIcon className="hidden h-4 w-4 sm:inline" />
      </span>
    ),
  },
]

function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AnimatedBackground
      className="pointer-events-none rounded-lg bg-zinc-100 dark:bg-zinc-800"
      defaultValue={theme}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.2,
      }}
      enableHover={false}
      onValueChange={(id) => {
        setTheme(id as string)
      }}
    >
      {THEMES_OPTIONS.map((theme) => {
        return (
          <button
            key={theme.id}
            className="inline-flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-zinc-950 dark:text-zinc-400 dark:data-[checked=true]:text-zinc-50 cursor-pointer"
            type="button"
            aria-label={`Switch to ${theme.label} theme`}
            data-id={theme.id}
          >
            {theme.icon}
          </button>
        )
      })}
    </AnimatedBackground>
  )
}

export function Footer() {
  const pathname = usePathname()
  const copy = pathname === '/es' ? HOME_UI.es : HOME_UI.en

  return (
    <footer className="mt-8 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <a
            href={copy.privacyHref}
            className="mb-1 text-xs text-zinc-500 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100 sm:hidden"
          >
            {copy.privacy}
          </a>
          <a href="https://thinkmaketest.ai/" target="_blank">
            <TextLoop className="text-xs text-zinc-500">
              <span>© {new Date().getFullYear()} yaguete.</span>
              <span>{copy.tagline}</span>
            </TextLoop>
          </a>
        </div>
        <div className="flex flex-col items-end gap-2 text-xs text-zinc-400 sm:flex-row sm:items-center sm:gap-3">
          <a
            href={copy.privacyHref}
            className="hidden hover:underline text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 sm:inline"
          >
            {copy.privacy}
          </a>
          <div className="inline-flex items-center gap-1 whitespace-nowrap">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </footer>
  )
}
