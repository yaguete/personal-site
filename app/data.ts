type Project = {
  name: string
  description: string
  link: string
  video: string
  id: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  logo?: string
  logoDark?: string
  id: string
  description: string
  responsibilities: string[]
  achievements?: string[]
  technologies?: string[]
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Motion Primitives Pro',
    description:
      'Advanced components and templates to craft beautiful websites.',
    link: 'https://pro.motion-primitives.com/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0',
    id: 'project1',
  },
  {
    name: 'Motion Primitives',
    description: 'UI kit to make beautiful, animated interfaces.',
    link: 'https://motion-primitives.com/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/XSfIvT7BUWbPRXhrbLed/ee6871c9-8400-49d2-8be9-e32675eabf7e.mp4?_a=DATAdtAAZAA0',
    id: 'project2',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'HP Inc.',
    title: 'Advanced Desing Team Lead',
    start: '2024',
    end: 'Present',
    link: 'https://ibelick.com',
    logo: '/logos/LogoHP.png',
    logoDark: '/logos/LogoHP-White.png',
    id: 'work1',
    description: 'I lead a multidisciplinary team focused on identifying weak signals, prototyping new use cases, and testing design-led solutions across HP’s large format printing ecosystem. We translate early-stage ideas into validated prototypes—combining user research, design strategy, and cross-team collaboration. \n\nOur goal: to shape what’s next in printing before the market demands it.',
          responsibilities: [
        'Leading cross-functional design and research initiatives', 
        'Scoping and validating early-stage product concepts',
        'Facilitating workshops and aligning stakeholders',
        'Managing team capacity and project roadmaps',
        'Building and testing AI-powered tools and early-stage prototypes',
        'Translating research insights into design opportunities',],
      achievements: [
        'Launched 3 AI-powered design tools that improved team efficiency by 40%',
        'Led the development of HP\'s first design system for large format printing',
        'Successfully validated 5 new product concepts through user research',
        'Reduced design iteration time by 60% through process optimization'
      ],
      technologies: ['Figma', 'React', 'TypeScript'],
  },
  {
    company: 'Banc Sabadell',
    title: 'Director of Operational Efficiency',
    start: '2022',
    end: '2024',
    link: 'https://ibelick.com',
    logo: '/logos/LogoBancSabadell.png',
    logoDark: '/logos/LogoBancSabadell-White.png',
    id: 'work2',
    description: 'Optimize processes and improve efficiency across the organization.',
    responsibilities: ['Process optimization', 'Team development', 'Technology adoption'],
    technologies: ['Jira', 'Confluence', 'Python'],
  },
  {
    company: "Innocells",
    title: 'Business Designer',
    start: '2019',
    end: '2022',
    link: 'https://ibelick.com',
    logo: '/logos/LogoInnocells.png',
    id: 'work3',
    description: 'Design and develop innovative solutions for clients across various industries.',
    responsibilities: ['User research', 'Design thinking', 'Prototyping'],
    technologies: ['Figma', 'Miro', 'Sketch'],
  },
  {
    company: 'The Cocktail',
    title: 'Service Designer / Project Lead',
    start: '2015',
    end: '2019',
    link: 'https://ibelick.com',
    logo: '/logos/LogoTheCocktail.jpg',
    id: 'work4',
    description: 'Lead cross-functional teams to deliver exceptional digital experiences.',
    responsibilities: ['Project management', 'Stakeholder communication', 'Team collaboration'],
    technologies: ['Figma', 'Sketch', 'Adobe XD'],
  },
  {
    company: 'Rey Juan Carlos University',
    title: 'PDI - Associate Professor',
    start: '2014',
    end: '2015',
    link: 'https://ibelick.com',
    logo: '/logos/LogoURJC.svg',
    logoDark: '/logos/LogoURJC-White.png',
    id: 'work5',
    description: 'Teach and mentor students in design thinking and user-centered design.',
    responsibilities: ['Teaching', 'Mentoring', 'Research'],
    technologies: ['Figma', 'Miro', 'Sketch'],
  },
  {
    company: 'Análisis e Investigación',
    title: 'Sr. Research Executive',
    start: '2012',
    end: '2014',
    link: 'https://ibelick.com',
    logo: '/logos/LogoAEI.png',
    id: 'work6',
    description: 'Conduct market research and analyze data to inform business strategies.',
    responsibilities: ['Research', 'Data analysis', 'Report writing'],
    technologies: ['Excel', 'Google Sheets', 'Jupyter Notebook'],
  },

]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Exploring the Intersection of Design, AI, and Design Engineering',
    description: 'How AI is changing the way we design',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    uid: 'blog-1',
  },
  {
    title: 'Why I left my job to start my own company',
    description:
      'A deep dive into my decision to leave my job and start my own company',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    uid: 'blog-2',
  },
  {
    title: 'What I learned from my first year of freelancing',
    description:
      'A look back at my first year of freelancing and what I learned',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    uid: 'blog-3',
  },
  {
    title: 'How to Export Metadata from MDX for Next.js SEO',
    description: 'A guide on exporting metadata from MDX files to leverage Next.js SEO features.',
    link: '/blog/example-mdx-metadata',
    uid: 'blog-4',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'X / Twitter',
    link: 'https://x.com/y_losada',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/yagolopezlosada',
  },
]

export const EMAIL = 'your@email.com'
