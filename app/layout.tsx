import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from './header'
import { Footer } from './footer'
import { ThemeProvider } from 'next-themes'

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
    default: 'Yago López Losada',
    template: '%s | Yago'
  },
  description:  'Design strategist & UX researcher. I turn complex data into clear, actionable digital products — at the intersection of tech, design & business.',
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
              "@type": "Person",
              "name": "Yago López Losada",
              "url": "https://thinkmaketest.ai",
              "description": "Design strategist & UX researcher specializing in AI-driven product design and transforming complex data into clear, actionable digital products. Expert in design thinking, user research, and product strategy at the intersection of technology, design, and business.",
              

              
              "knowsAbout": [
                "Design Thinking",
                "User Experience Design", 
                "Product Strategy",
                "User Research",
                "Data Visualization",
                "Digital Product Design",
                "Design Systems",
                "Product Management",
                "Design Engineering",
                "AI/ML Product Design",
                "Design Operations",
                "Team Leadership",
                "Agile Methodology",
                "Lean UX",
                "Strategic Design",
                "Operational Efficiency",
                "AI-Driven Product Design",
                "Figma",
                "Miro", 
                "Atlas.ti",
                "SPSS",
                "React",
                "JavaScript",
                "Python",
                "Java"
              ],
              
              "knowsLanguage": ["Spanish", "English"],
              
              "alumniOf": [
                {
                  "@type": "Organization", 
                  "name": "King Juan Carlos University"
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
              
              "workExample": [
                {
                  "@type": "CreativeWork",
                  "name": "LinkedIn Recommendation Generator",
                  "description": "AI-powered tool for generating personalized LinkedIn recommendations",
                  "url": "https://thinkmaketest.ai/playground/linkedin-recommendation"
                },
                {
                  "@type": "CreativeWork", 
                  "name": "Archimind",
                  "description": "AI platform for architects",
                  "url": "https://thinkmaketest.ai"
                },
                {
                  "@type": "CreativeWork",
                  "name": "DrawingHub", 
                  "description": "Sandbox platform for architects",
                  "url": "https://thinkmaketest.ai"
                },
                {
                  "@type": "CreativeWork",
                  "name": "Digital Mortgage Platform",
                  "description": "Banc Sabadell digital mortgage platform with 100% efficiency improvement",
                  "url": "https://thinkmaketest.ai"
                }
              ],
              
              "hasOccupation": {
                "@type": "Occupation",
                "name": "Advanced Design Team Lead",
                "occupationLocation": {
                  "@type": "Place", 
                  "name": "HP Inc."
                }
              },
              
              "jobTitle": [
                "Advanced Design Team Lead",
                "Director of Operational Efficiency", 
                "Strategic Designer",
                "Senior Executive Research"
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
                  "url": "https://innocells.com"
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
                    "description": "Expert consultation in design thinking, UX research, and product strategy"
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
                "Advanced Design Team Lead at HP Inc.",
                "Design Engineering Expertise", 
                "Product Strategy Leadership",
                "Degree Completion Award",
                "100% Efficiency Improvement in Digital Mortgage Platform"
              ],
              
              "sameAs": [
                "https://x.com/y_losada",
                "https://www.linkedin.com/in/yagolopezlosada"
              ]
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
          <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
            <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20 flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
