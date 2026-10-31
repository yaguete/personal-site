import type { Metadata } from 'next'
import { HomePage } from './components/home/HomePage'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      es: '/es',
    },
  },
}

export default function Page() {
  return <HomePage locale="en" />
}
