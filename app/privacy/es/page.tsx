import type { Metadata } from 'next'
import PrivacyContentEs from '../PrivacyContentEs'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  alternates: {
    canonical: '/privacy/es',
    languages: { en: '/privacy', es: '/privacy/es' },
  },
}

export default function PrivacyPageEs() {
  return <PrivacyContentEs />
}


