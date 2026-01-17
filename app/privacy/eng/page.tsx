import type { Metadata } from 'next'
import PrivacyContent from './PrivacyContent'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  alternates: {
    canonical: '/privacy',
    languages: { en: '/privacy', es: '/privacy/es' },
  },
}

export default function PrivacyPage() {
  return <PrivacyContent />
}


