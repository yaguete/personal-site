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
  showDetailsLink?: boolean
  // The chat always receives the role/company/dates. Additional fields need
  // explicit approval here; new roles default to those basic facts only.
  chat?: {
    summary?: string
    fields?: readonly (
      | 'description'
      | 'responsibilities'
      | 'achievements'
      | 'technologies'
    )[]
  }
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

type SideProject = {
  id: string
  name: string
  subtitle: string
  year: string
  detailUrl: string
  description: string
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

const PUBLIC_CAREER_FIELDS = [
  'description',
  'responsibilities',
  'achievements',
  'technologies',
] as const

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    id: 'work1',
    chat: {
      summary:
        'Leads multidisciplinary design and innovation in Large Format Printing: identifying opportunities, understanding user needs, prototyping concepts and testing their value with a business perspective.',
      fields: ['technologies'],
    },
    company: 'HP Inc.',
    title: 'Advanced Design Team Lead',
    start: '2024',
    end: 'Present',
    showDetailsLink: false, 
    link: 'https://www.hp.com/us-en/hp-information.html',
    logo: '/logos/LogoHP.png',
    logoDark: '/logos/LogoHP-White.png',
    description: 'I lead a multidisciplinary team focused on identifying weak signals, prototyping new use cases, and testing design-led solutions across HP’s large format printing ecosystem. We translate early-stage ideas into validated prototypes—combining user research, design strategy, and cross-team collaboration. \n\nOur goal: to shape what’s next in printing before the market demands it.',
    responsibilities: [
        'Leading cross-functional design and research initiatives', 
        'Scoping and validating new product concepts and opportunities',
        'Facilitating workshops and aligning stakeholders',
        'Managing team capacity and project roadmaps',
        'Building and testing AI-powered tools and early-stage prototypes',
        'Translating research insights into design opportunities',],
    achievements: [
        'Co-conceptualized and prototyped (with <a href="https://www.liquidlab.io/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">Liquid Lab</a>), an AI ToolBox for architects and contractors. Defined use cases, built a functional prototype, and validated product-market fit in UK, within 8 weeks',
        'Co-Created a live testing sandbox for validating conceptual features across HP services in near-real usage conditions',
        'Designed and deployed multiple real-world landing pages and MVPs using smoke tests and Wizard of Oz techniques to validate interest before development',      ],
    technologies: ['Cursor', 'Replit', 'Figma', 'React', 'TypeScript'],
      
  },
  {
    id: 'work2',
    chat: { fields: PUBLIC_CAREER_FIELDS },
    company: 'Banc Sabadell',
    title: 'Director of Operational Efficiency',
    start: '2022',
    end: '2024',
    showDetailsLink: false, 
    link: 'https://www.grupbancsabadell.com',
    logo: '/logos/LogoBancSabadell.png',
    logoDark: '/logos/LogoBancSabadell-White.png',
    description: 'Led the mapping, analysis, and redesign of critical banking processes and tools — from product onboarding to internal service flows — with the goal of increasing operational efficiency, ensuring regulatory compliance, and enhancing customer experience. Applied data analysis and systems thinking to identify friction points, unlock commercial time, and deliver measurable improvements in the time that salesforce spend on administrative tasks.',
    achievements: [
      'Led the implementation of a BPM system (Appian) and initiated automation projects to eliminate manual tasks and enable new commercial processes',
      'Led the end-to-end digitization of some regulatory procedures (e.g. address changes, ID updates), enabling mobile self-service and significantly reducing in-branch transactions',
      'Initiated the concept and early design of a credit request system via POS/TPV terminals — later completed and deployed by the business team',
      'Helped design and launch a virtual assistant that significantly reduced inbound calls to branches (estimated impact >30%)',
      'Implemented systemic changes that improved customer satisfaction in service journeys',
      'Piloted and validated new internal tools with real user feedback before scaling'],
    responsibilities: [
      'Mapping and redesigning core banking processes to improve efficiency and compliance',
      'Analyzing operational data to identify friction points and unlock salesforce capacity',
      'Defining and evolving internal tools to support commercial and back-office operations',
      'Leading cross-functional initiatives with IT, compliance, legal and business units',
      'Implementing systemic improvements to reduce administrative load and error rates',
      'Driving adoption of new tools and workflows across multiple departments'],
    technologies: ['Appian', 'Jira', 'Confluence', 'Excel', 'Power BI', 'Python'],
  },
  {
    id: 'work3',
    chat: { fields: PUBLIC_CAREER_FIELDS },
    company: "Innocells",
    title: 'Business Designer',
    start: '2019',
    end: '2022',
    link: 'https://www.sabadelldigital.com/',
    logo: '/logos/LogoInnocells.png',
    description: 'At Innocells (Banc Sabadell\'s venture builder) I led the design strategy for the bank’s mortgage business transformation, focusing on end-to-end customer journeys, operational efficiency, and service innovation. Defined and prototyped digital products, integrated on/offline touchpoints, and coordinated cross-functional teams to deliver scalable improvements across both customer experience and internal operations. Also contributed to new service propositions such as home insurance offerings in partnership with Zurich..',
    responsibilities: [
      'Designing and mapping end-to-end customer journeys across digital and physical channels',
      'Coordinating digital transformation efforts for mortgage processes and internal tools',
      'Leading ideation workshops with business, operations, legal and compliance teams',
      'Developing service blueprints and prototypes to align product, operations, and service vision',
      'Scoping new digital value propositions for strategic partnerships (e.g. Zurich)',
    ],
    achievements: [
      'Co-designed and prototyped a digital mortgage application that increased online transactions more than 100% (<a href="https://www.expansion.com/empresas/banca/2025/03/12/67d095d3e5fdead1638b459f.html" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">source</a>)',
      'Led the design of a new home insurance offering in partnership with Zurich, integrating digital and physical touchpoints',
      'Built and aligned a 3-year digital transformation roadmap for the Banc Sabadell\'s digital business, coordinating multiple workstreams and stakeholder teams',
      'Introduced and championed a new agile methodology for digital asset creation, accelerating delivery cycles and cross-team collaboration'
    ],
    technologies: ['Figma', 'Miro', 'Sketch', 'Excel', 'PowerPoint', 'Jira', 'Confluence'],
  },
  {
    id: 'work4',
    chat: { fields: PUBLIC_CAREER_FIELDS },
    company: 'The Cocktail',
    title: 'Service Designer / Project Lead',
    start: '2015',
    end: '2019',
    link: 'https://vml-thecocktail.com/',
    logo: '/logos/LogoTheCocktail.jpg',
    description: 'Worked as a strategic design consultant leading service design projects for major clients such as BBVA, Endesa, Repsol, and Mutua Madrileña. Led both qualitative and quantitative research with users and stakeholders, facilitated co-creation workshops, and translated insights into new services, value propositions, and business opportunities. Projects included the design of consumption-based energy tariffs, digital experiences for Guía Repsol, and new financial services aligned with PSD2 opportunities.',
    responsibilities: [
      'Conducting qualitative research with users and stakeholders',
      'Facilitating co-creation and ideation workshops',
      'Designing new services and digital touchpoints for large organizations',
      'Defining value propositions and service blueprints',
      'Translating strategic opportunities into actionable product concepts',
      'Managing client relationships and leading multidisciplinary teams'],
    achievements: [
      'Defined new digital experiences for Guía Repsol, blending content, mobility and tourism services',
      'Co-created flexible, consumption-based energy tariffs for Endesa to improve customer retention and transparency',
      'Explored PSD2-driven business opportunities and conceptualized new financial services for BBVA',
      'Helped Mutua Madrileña redesign their digital insurance experience, improving conversion and customer understanding'
    ],
    technologies: ['Figma', 'Sketch', 'Miro', 'InVision', 'Illustrator', 'Photoshop'],
  },
  {
    id: 'work5',
    chat: { fields: PUBLIC_CAREER_FIELDS },
    company: 'Rey Juan Carlos University',
    title: 'PDI - Associate Professor',
    start: '2014',
    end: '2015',
    link: 'https://www.urjc.es/',
    logo: '/logos/LogoURJC.svg',
    logoDark: '/logos/LogoURJC-White.png',
    description: 'Associate professor and researcher in the European project "Technopolitical practices and emerging notions of citizenship" (ciberdemocracia.es), focused on the transformation of digital social movements into political actors. Coordinated the Master’s program in Communication, Culture and Digital Citizenship, and taught in the Master’s in Communication and Sociocultural Problems. Responsibilities included conducting expert interviews, organizing focus groups with stakeholders, and publishing academic work on digital activism and technopolitics.',
    responsibilities: [
      'Conducting qualitative research on digital social movements and political transformation',
      'Managing fieldwork including expert interviews and stakeholder focus groups',
      'Coordinating the Master’s in Communication, Culture and Digital Citizenship',
      'Lecturing in postgraduate programs on digital culture, politics and media',
      'Organizing academic activities and program operations',
      'Publishing research findings in peer-reviewed journals'],
    achievements: [
      'Co-authored a peer-reviewed paper on digital activism and technopolitics: <a href="https://quadernsdepsicologia.cat/article/view/v15-n1-gordo-derivera-lopez" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">"Ciberdemocracia y nuevas formas de ciudadanía"</a>',
      'Successfully coordinated a postgraduate program with international faculty and students',
      'Contributed to the European research project ciberdemocracia.es, analyzing post-15M political dynamics in Spain'
    ],
    technologies: ['SPSS', 'Atlas.ti', 'Excel', 'Word', 'Moodle'],
  },
  {
    id: 'work6',
    chat: { fields: PUBLIC_CAREER_FIELDS },
    company: 'Análisis e Investigación',
    title: 'Sr. Research Executive',
    start: '2012',
    end: '2014',
    link: 'https://www.analisiseinvestigacion.com/',
    logo: '/logos/LogoAEI.png',
    logoDark: '/logos/LogoAEI-White.png',
    description: 'Senior Research Executive specialized in both qualitative and quantitative methodologies. Led end-to-end research projects for clients such as Renfe, Repsol, Vodafone, the Spanish Medical Association, and the Spanish eSports Observatory. Work included in-depth interviews, focus groups, online community management, survey design, statistical analysis (SPSS), eye-tracking studies, and delivering strategic insights through final reports and presentations.',
    responsibilities: ['Designing and moderating in-depth interviews and focus groups',
      'Managing online user communities (recruitment, moderation, analysis)',
      'Creating and analyzing surveys using descriptive and multivariate techniques',
      'Running UX tests with eye-tracking tools and synthesizing behavioral insights',
      'Building and presenting research reports to clients across telecom, health, and entertainment sectors',
      'Coordinating fieldwork and research logistics across qualitative and quantitative studies'
    ],
    achievements: [
      'Conducted national study on Spanish doctors’ working conditions for the Spanish Medical Association',
      'Designed and managed user research communities for Vodafone, including tariff testing and product feedback loops',
      'Co-created Spain’s first eSports Observatory — delivering key insights into a fast-growing digital ecosystem (<a href="https://es.slideshare.net/slideshow/esports-report-68173354/68173354" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">view report</a>)',
      'Conducted eye-tracking research and delivered UX improvement recommendations for Domino’s app and website'
    ],
    technologies: ['SPSS', 'Excel', 'PowerPoint', 'EyeTracker']
  },

]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'How to Get Paid for Work Your Client Can Already Do',
    description: 'What will consulting firms sell when their clients can do the work themselves?',
    link: '/blog/how-to-get-paid-for-work/eng',
    uid: 'blog-3',
  },
  {
    title: 'Dead Internet and Hyperreality',
    description: 'The Dead Internet Theory started as a minor conspiracy. Today, the data confirm it',
    link: '/blog/dead-internet-theory/eng',
    uid: 'blog-1',
  },
  {
    title: 'The AI Jobpocalypse: What My Roomba Taught Me',
    description: 'Still nudging my Roomba while Silicon Valley declares the end of work',
    link: '/blog/ai-end-of-work',
    uid: 'blog-2',
  },
  
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'X / Twitter',
    link: 'https://x.com/y_losada',
  },
  {
    label: 'Medium',
    link: 'https://medium.com/@y_losada',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/yagolopezlosada',
  },
  {
    label: 'GitHub',
    link: 'https://github.com/yaguete',
  },
]

export const SIDE_PROJECTS: SideProject[] = [
  {
    id: 'proj-3',
    name: 'Profile Analyzer',
    subtitle: 'Multi-source candidate evaluation, stripped of noise',
    year: '2025',
    detailUrl: '/playground/profile-analyzer',
    description: `Structured AI system that consolidates fragmented candidate data into a single, auditable evaluation.
	
  1.	Ingest multiple sources: CV, LinkedIn, portfolio, interview notes, and public professional material.
	2.	Analyze each source independently, with strict evidence rules and zero invention.
	3.	Contrast sources to surface confirmations, contradictions, gaps, and real execution signals.

Outputs a standardized candidate card: synthesis, competency assessment, green/red flags, cognitive profile, team fit, and critical open questions.
Designed to penalize vague discourse, reward demonstrated impact, and preserve traceability back to original sources.`,
  },
  {
    id: 'proj-2',
    name: 'Preprint Audit',
    subtitle: 'Smart PDF auditing before print, any page size',
    year: '2024',
    detailUrl: '/playground/preprint-audit',
    description: 'Automated system for analyzing PDF documents to verify their professional readiness for printing. The tool examines key aspects such as image resolution and color mode, margin and bleed settings, and font quality. It generates a detailed report with specific recommendations to optimize each file before sending it to print, helping prevent costly errors and ensuring high-quality results in any format.',
  },
  {
    id: 'proj-1',
    name: 'LinkedIn Recommendation Generator (for me)',
    subtitle: 'AI-powered LinkedIn Recommendation Generator',
    year: '2024',
    detailUrl: '/playground/linkedin-recommendation',
    description: `Bite-sized, AI-powered recommendation generator that ends the classic “I don’t know what to write.

1. Choose how we worked together (boss, client, teammate, etc.).
2. Pick the vibe—from glowing praise to a cheeky roast.
3. Hit Generate and get a ready-to-post text in seconds, plus space to tweak.

No writer’s block, no sweat—just fresh kudos filling my profile. 🚀`,
  },
  /*{
    id: 'proj-3',
    name: 'PrintBuddy',
    subtitle: 'HP Support search & PDF extraction tool',
    detailUrl: '/playground/printbuddy',
    description: 'Intelligent search tool for HP Support knowledge base with advanced PDF processing capabilities. Search across multiple locales, extract text from PDFs, and perform semantic searches within documents. Perfect for technical support teams and users looking for specific HP documentation and solutions.'
  },*/
]

export const EMAIL = 'yago@thinkmaketest.ai'

export const SITE_BIO = `Working on the edge of AI, strategy, and execution.
Over 12 years turning messy problems into simple, useful solutions through prototyping, validation, and fast iteration.`

export const SITE_ORIGIN =
  'Nacido el 30 de junio de 1986 en Ourense (Galicia). Gallego. Creció en Canarias. La Universidad de La Laguna es donde estudió Sociología, no de dónde es.'

type Education = {
  id: string
  category: string
  title: string
  year: string
  institution: string
}

export const EDUCATION: Education[] = [
  {
    id: 'edu-1',
    category: 'Master',
    title: 'Digital Communication and Cultural Studies',
    year: '2013',
    institution: 'King Juan Carlos University',
  },
  {
    id: 'edu-2',
    category: 'Bachelor',
    title: 'Sociology',
    year: '2012',
    institution: 'La Laguna University',
  },
  {
    id: 'edu-3',
    category: 'Specialization',
    title: 'Backend Development — Java & Spring Framework',
    year: '2025',
    institution: 'Tokio School',
  },
  {
    id: 'edu-4',
    category: 'Specialization',
    title: 'Python for AI and Machine Learning',
    year: '2022',
    institution: 'Tokio School',
  },
  {
    id: 'edu-5',
    category: 'Specialization',
    title: 'Front-end Development — React & TypeScript',
    year: '2024',
    institution: 'Tokio School',
  },
  {
    id: 'edu-6',
    category: 'Specialization',
    title: 'Master in digital product management',
    year: '2023',
    institution: 'Nuclio School',
  },

  {
    id: 'edu-7',
    category: 'Specialization',
    title: 'Mgmt. & Promotion of R&D and Innovation Projects',
    year: '2010',
    institution: 'La Laguna University',
  },
]
