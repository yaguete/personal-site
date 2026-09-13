import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { Header } from './header'
import { Footer } from './footer'
import { ThemeProvider } from 'next-themes'
import AskYago from './components/AskYago'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://thinkmaketest.ai/'),
  alternates: {
    canonical: '/'
  },
  title: {
    default: 'Think Make Test',
    template: '%s | Think Make Test'
  },
  description:  'Design strategist specializing in AI-driven product development. I turn complex data into clear, actionable digital products at the intersection of tech, design & business.',
};

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              "mainEntity": {
                "@id": "#yago",
                "@type": "Person",
                "name": "Yago López Losada",
                "alternateName": [
                  "y_losada",
                  "yaguete",
                  "Yago",
                  "Yago Lopez",
                  "Yago L. Losada"
                ],
                "identifier": "yago-lopez-losada",
                "url": "https://thinkmaketest.ai",
                "image": [
                  {
                    "@id": "#portrait1x1",
                    "@type": "ImageObject",
                    "url": "https://thinkmaketest.ai/images/yago_1x1.webp"
                  },
                  {
                    "@id": "#portrait4x3", 
                    "@type": "ImageObject",
                    "url": "https://thinkmaketest.ai/images/yago_4x3.webp"
                  },
                  {
                    "@id": "#portrait16x9",
                    "@type": "ImageObject", 
                    "url": "https://thinkmaketest.ai/images/yago_16x9.webp"
                  }
                ],
                "description": "Design strategist specializing in AI-driven product development. I turn complex data into clear, actionable digital products at the intersection of tech, design & business.",
                
                "knowsAbout": [
                  "Design Thinking",
                  "User Experience Design", 
                  "Product Strategy",
                  "User Research",
                  "AI-Driven Product Design",
                  "Design Engineering",
                  "Design Operations",
                  "Strategic Design"
                ],
                
                "knowsLanguage": ["Spanish", "English"],
                
                "nationality": {
                  "@type": "Country",
                  "name": "Spain"
                },
                
                "homeLocation": {
                  "@type": "Place",
                  "name": "Spain",
                  "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "ES"
                  }
                },
                
                "alumniOf": [
                  {
                    "@type": "Organization", 
                    "name": "King Juan Carlos University"
                  },
                  {
                    "@type": "Organization", 
                    "name": "Complutense University of Madrid"
                  },
                  {
                    "@type": "Organization",
                    "name": "La Laguna University"
                  }
                ],
                
                "hasCredential": [
                  {
                    "@type": "EducationalOccupationalCredential",
                    "credentialCategory": "Master",
                    "name": "Digital Communication and Cultural Studies",
                    "recognizedBy": {
                      "@type": "Organization",
                      "name": "King Juan Carlos University"
                    },
                    "validIn": {
                      "@type": "Country",
                      "name": "European Union"
                    },
                    "dateIssued": "2013"
                  },
                  {
                    "@type": "EducationalOccupationalCredential",
                    "credentialCategory": "Bachelor",
                    "name": "Sociology",
                    "recognizedBy": {
                      "@type": "Organization",
                      "name": "La Laguna University"
                    },
                    "validIn": {
                      "@type": "Country",
                      "name": "European Union"
                    },
                    "dateIssued": "2012",
                    "award": "Award for Academic Excellence"
                  },
                  {
                    "@type": "EducationalOccupationalCredential",
                    "credentialCategory": "Specialization",
                    "name": "Python Programming for AI",
                    "recognizedBy": {
                      "@type": "Organization",
                      "name": "Tokio School"
                    },
                    "dateIssued": "2022"
                  },
                  {
                    "@type": "EducationalOccupationalCredential",
                    "credentialCategory": "Specialization",
                    "name": "Front-end programming and web development",
                    "recognizedBy": {
                      "@type": "Organization",
                      "name": "Tokio School"
                    },
                    "dateIssued": "2024"
                  },
                  {
                    "@type": "EducationalOccupationalCredential",
                    "credentialCategory": "Specialization",
                    "name": "Master in digital product management",
                    "recognizedBy": {
                      "@type": "Organization",
                      "name": "Nuclio School"
                    },
                    "dateIssued": "2023"
                  }
                ],
                
                "hasOccupation": [
                  {
                    "@type": "Occupation",
                    "name": "Advanced Design Team Lead",
                    "description": "Leading design strategy and AI-driven product development at HP Inc.",
                    "occupationLocation": {
                      "@type": "Place",
                      "name": "HP Inc."
                    },
                    "employer": {
                      "@type": "Organization",
                      "name": "HP Inc.",
                      "url": "https://www.hp.com"
                    },
                    "startDate": "2024-11-11"
                  },
                  {
                    "@type": "Occupation",
                    "name": "Director of Operational Efficiency",
                    "description": "Led digital transformation and operational efficiency initiatives at Banc Sabadell.",
                    "occupationLocation": {
                      "@type": "Place",
                      "name": "Banc Sabadell"
                    },
                    "employer": {
                      "@type": "Organization",
                      "name": "Banc Sabadell",
                      "url": "https://www.bancsabadell.com"
                    },
                    "startDate": "2023-05-01",
                    "endDate": "2024-11-10"
                  },
                  {
                    "@type": "Occupation",
                    "name": "Strategic Designer",
                    "description": "Strategic design and product strategy consulting at Innocells.",
                    "occupationLocation": {
                      "@type": "Place",
                      "name": "Innocells"
                    },
                    "employer": {
                      "@type": "Organization",
                      "name": "Innocells",
                      "url": "https://www.sabadelldigital.com/"
                    },
                    "startDate": "2019-12-12",
                    "endDate": "2023-04-30"
                  },
                  {
                    "@type": "Occupation",
                    "name": "Senior Executive Research",
                    "description": "User research and design strategy at The Cocktail.",
                    "occupationLocation": {
                      "@type": "Place",
                      "name": "The Cocktail"
                    },
                    "employer": {
                      "@type": "Organization",
                      "name": "The Cocktail",
                      "url": "https://the-cocktail.com"
                    },
                    "startDate": "2015-04-01",
                    "endDate": "2019-12-10"
                  }
                ],
                

                
                "worksFor": [
                  {
                    "@type": "Organization",
                    "name": "HP Inc.",
                    "url": "https://www.hp.com"
                  },
                  {
                    "@type": "Organization", 
                    "name": "Banc Sabadell",
                    "url": "https://www.bancsabadell.com"
                  },
                  {
                    "@type": "Organization",
                    "name": "Innocells", 
                    "url": "https://www.sabadelldigital.com/"
                  },
                  {
                    "@type": "Organization",
                    "name": "The Cocktail",
                    "url": "https://the-cocktail.com"
                  }
                ],
                
                "makesOffer": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Design Strategy Consulting",
                      "description": "Expert consultation in design thinking, AI-driven product development, and product strategy"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Workshops and Talks",
                      "description": "Professional workshops and speaking engagements on design and AI"
                    }
                  }
                ],
                
                "award": [
                  "Award for Academic Excellence",
                  "100% Efficiency Improvement in Digital Mortgage Platform"
                ],
                
                "sameAs": [
                  "https://x.com/y_losada",
                  "https://www.linkedin.com/in/yagolopezlosada",
                  "https://github.com/yaguete",
                  "https://medium.com/@y_losada",
                  "https://bsky.app/profile/yaguete.bsky.social",
                  "https://www.threads.net/@yaguete.ll"
                ]
              },
              
              "creator": {
                "@id": "#yago"
              },
              
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://thinkmaketest.ai"
              },
              
              "dateModified": "2025-08-03T00:00:00Z"
            })
          }}
        />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <div className="flex w-full flex-col font-[family-name:var(--font-inter-tight)]">
            <div className="relative mx-auto w-full max-w-screen-sm px-4 pt-20 flex flex-col">
              <Header />
              <main className="flex-1" style={{ minHeight: 'calc(100vh - 250px)' }}>
                {children}
              </main>
              <Footer />
            </div>
          </div>
          <AskYago />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
