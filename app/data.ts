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
  description: string
  detailUrl: string
  detailedDescription: string
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
    id: 'work1',
    company: 'HP Inc.',
    title: 'Advanced Desing Team Lead',
    start: '2024',
    end: 'Present',
    showDetailsLink: false, link: 'https://',
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
        'Co-conceptualized and prototyped <a href="https://thearchimind.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">The Archimind</a> (with <a href="https://www.liquidlab.io/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">Liquid Lab</a>), an assistant for architects. Defined use cases, built a functional prototype, and validated product-market fit in one country (UK) within 8 weeks',
        'Created <a href="https://thedrawinghub.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">The Drawing Hub</a> — a live testing sandbox for validating conceptual features across HP services in near-real usage conditions',
        'Designed and deployed multiple real-world landing pages and MVPs using smoke tests and Wizard of Oz techniques to validate interest before development',      ],
    technologies: ['Cursor', 'Replit', 'Figma', 'React', 'TypeScript'],
      
  },
  {
    id: 'work2',
    company: 'Banc Sabadell',
    title: 'Director of Operational Efficiency',
    start: '2022',
    end: '2024',
    showDetailsLink: false, link: 'https://',
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
    company: "Innocells",
    title: 'Business Designer',
    start: '2019',
    end: '2022',
    link: 'https://ibelick.com',
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
    company: 'The Cocktail',
    title: 'Service Designer / Project Lead',
    start: '2015',
    end: '2019',
    link: 'https://ibelick.com',
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
    company: 'Rey Juan Carlos University',
    title: 'PDI - Associate Professor',
    start: '2014',
    end: '2015',
    link: 'https://ibelick.com',
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
    company: 'Análisis e Investigación',
    title: 'Sr. Research Executive',
    start: '2012',
    end: '2014',
    link: 'https://ibelick.com',
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

export const SIDE_PROJECTS: SideProject[] = [
  {
    id: 'proj-1',
    name: 'Generador de recomendaciones LinkedIn',
    subtitle: 'AI-powered LinkedIn Endorsement Generator',
    description: 'Herramienta para generar recomendaciones personalizadas de LinkedIn en segundos utilizando IA. Diseñada para ahorrar tiempo y mejorar tu perfil profesional, permitiendo crear textos de alta calidad con tan solo unos clics. Permite edición y exportación sencilla.',
    detailUrl: '/playground/linkedin-recommendation',
    detailedDescription: 'Esta herramienta utiliza inteligencia artificial para analizar el perfil profesional de LinkedIn y generar recomendaciones personalizadas y relevantes. El sistema procesa la información del perfil, incluyendo experiencia laboral, habilidades y logros, para crear textos de alta calidad que destacan las fortalezas profesionales de manera auténtica y persuasiva. La herramienta permite edición manual de las recomendaciones generadas y exportación en múltiples formatos para facilitar su uso en diferentes contextos profesionales.'
  },
  {
    id: 'proj-2',
    name: 'Order Intake',
    subtitle: 'Análisis de PDF',
    description: 'Herramienta para analizar si los PDF están listos para imprimir',
    detailUrl: '/playground/order-intake',
    detailedDescription: 'Sistema automatizado de análisis de documentos PDF para verificar su preparación para impresión. La herramienta examina múltiples aspectos del documento incluyendo resolución de imágenes, configuración de color, márgenes, sangrado y calidad de fuentes. Proporciona un reporte detallado con recomendaciones específicas para optimizar cada documento antes de su envío a impresión, ayudando a prevenir errores costosos y asegurar la calidad del resultado final.'
  },
]

export const EMAIL = 'your@email.com'
