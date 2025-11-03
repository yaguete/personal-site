import { PROJECTS, WORK_EXPERIENCE, BLOG_POSTS, SOCIAL_LINKS } from '../data'

type StructuredDataProps = {
  data?: unknown
}

export function StructuredData({ data }: StructuredDataProps) {
  if (data) {
    return (
      <script
        type="application/ld+json"
        // El contenido viene del MDX; asumimos objeto ya validado por el autor del post
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    )
  }

  // Fallback: datos de Persona del sitio
  const currentJob = WORK_EXPERIENCE.find(job => job.end === 'Present')
  const allTechnologies = WORK_EXPERIENCE
    .flatMap(job => job.technologies || [])
    .filter((tech, index, arr) => arr.indexOf(tech) === index)

  const workHistory = WORK_EXPERIENCE.map(job => ({
    "@type": "Organization",
    "name": job.company,
    "url": job.link !== 'https://' ? job.link : undefined
  }))

  const projectsData = PROJECTS.map(project => ({
    "@type": "CreativeWork",
    "name": project.name,
    "description": project.description,
    "url": project.link
  }))

  const blogPostsData = BLOG_POSTS.map(post => ({
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "url": `https://thinkmaketest.ai${post.link}`
  }))

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Yago López Losada",
    "url": "https://thinkmaketest.ai",
    "jobTitle": currentJob?.title || "Advanced Design Team Lead",
    "description": "Design strategist & UX researcher. I turn complex data into clear, actionable digital products — at the intersection of tech, design & business.",
    "image": "https://thinkmaketest.ai/images/mapache.jpg",
    "worksFor": {
      "@type": "Organization",
      "name": currentJob?.company || "HP Inc.",
      "url": currentJob?.link && currentJob.link !== 'https://' ? currentJob.link : "https://www.hp.com"
    },
    "alumniOf": workHistory,
    "hasOccupation": [
      { "@type": "Occupation", "name": "Design Strategist", "description": "Strategic design and user experience research" },
      { "@type": "Occupation", "name": "UX Researcher", "description": "User research and design strategy" },
      { "@type": "Occupation", "name": "Business Designer", "description": "Service design and business transformation" }
    ],
    "sameAs": [
      "https://x.com/y_losada",
      "https://www.linkedin.com/in/yagolopezlosada",
      "https://github.com/yaguete"
    ],
    "knowsLanguage": [
      { "@type": "Language", "name": "Spanish", "additionalProperty": { "@type": "PropertyValue", "name": "proficiency", "value": "Native" }},
      { "@type": "Language", "name": "English", "additionalProperty": { "@type": "PropertyValue", "name": "proficiency", "value": "Professional" }}
    ],
    "hasCredential": [
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "Bachelor's Degree", "name": "Grado en Sociología", "educationalLevel": "Tertiary", "description": "Licenciado en Sociología por la Universidad de La Laguna. Premio extraordinario de fin de carrera.", "recognizedBy": { "@type": "Organization", "name": "Universidad de La Laguna" } },
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "Master's Degree", "name": "Máster en Comunicación, Cultura y Ciudadanía Digital", "educationalLevel": "Postgraduate", "description": "Estudios de posgrado centrados en cultura digital y humanidades digitales.", "recognizedBy": { "@type": "Organization", "name": "Universidad Rey Juan Carlos" } }
    ],
    "workExample": projectsData,
    "author": blogPostsData,
    "knowsAbout": [
      "Design Strategy",
      "UX Research",
      "Service Design",
      "Business Design",
      "User Research",
      "Prototyping",
      "Design Systems",
      { "@type": "DefinedTerm", "name": "AI/ML Integration", "inDefinedTermSet": "https://en.wikipedia.org/wiki/Machine_learning" },
      "Digital Transformation",
      "Process Optimization",
      ...allTechnologies
    ],
    "birthPlace": { "@type": "Place", "address": { "@type": "PostalAddress", "addressRegion": "Galicia", "addressCountry": "ES" } },
    "homeLocation": { "@type": "Place", "address": { "@type": "PostalAddress", "addressRegion": "Catalonia", "addressLocality": "Barcelona", "addressCountry": "ES" } },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "industry", "value": "Technology & Design" },
      { "@type": "PropertyValue", "name": "specialization", "value": "Design Strategy & UX Research" }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 