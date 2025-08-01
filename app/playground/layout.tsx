import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Playground - Yago López Losada',
  description: 'Proyectos experimentales y herramientas de desarrollo',
}

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-0 py-0">
        {children}
      </div>
    </div>
  )
} 