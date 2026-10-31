import type { Metadata } from 'next'
import { HomePage } from '../components/home/HomePage'

export const metadata: Metadata = {
  title: { absolute: 'Think Make Test' },
  description:
    'Estratega de diseño especializado en producto con IA. Convierto problemas complejos en productos digitales claros y útiles, en la intersección de tecnología, diseño y negocio.',
  alternates: {
    canonical: '/es',
    languages: {
      en: '/',
      es: '/es',
    },
  },
}

export default function PageEs() {
  return <HomePage locale="es" />
}
