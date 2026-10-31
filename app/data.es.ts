import {
  BLOG_POSTS,
  EDUCATION,
  PROJECTS,
  SIDE_PROJECTS,
  SITE_BIO,
  WORK_EXPERIENCE,
} from '@/app/data'
import { HOME_UI, type HomeLocale } from '@/app/i18n/home'

const BIO_ES = `Trabajo en la intersección de la IA, la estrategia y la ejecución.
Más de 12 años convirtiendo problemas complejos en soluciones simples y útiles a base de prototipar, validar con usuarios e iterar rápido.`

const PROJECTS_ES: Record<string, { description: string }> = {
  project1: {
    description:
      'Transforma los consejos y recomendaciones de tus blogueros/as e instagramers en los que confías en tu plan de viaje, día a día.',
  },
  project2: {
    description:
      'Plataforma de IA para AEC: conecta planos, equipos y flujos de trabajo para hacer avanzar los proyectos, sin cambiar de herramienta.',
  },
  project3: {
    description:
      'Generación de presupuestos, clientes y pedidos asistida por IA: de una petición desordenada a una propuesta clara y con precio.',
  },
}

const WORK_ES: Record<
  string,
  {
    title: string
    description: string
    responsibilities: string[]
    achievements?: string[]
  }
> = {
  work1: {
    title: 'Lead del equipo de Advanced Design',
    description:
      'Lidero un equipo multidisciplinar centrado en detectar señales débiles, prototipar nuevos casos de uso y probar soluciones lideradas por el diseño en el ecosistema de impresión de gran formato de HP. Convertimos ideas tempranas en prototipos validados, combinando investigación con usuarios, estrategia de diseño y colaboración entre equipos.\n\nEl objetivo: dar forma a lo que viene en impresión antes de que el mercado lo pida.',
    responsibilities: [
      'Liderar iniciativas de diseño e investigación transversales',
      'Acotar y validar nuevos conceptos y oportunidades de producto',
      'Facilitar talleres y alinear a los stakeholders',
      'Gestionar la capacidad del equipo y las hojas de ruta',
      'Construir y probar herramientas de IA y prototipos tempranos',
      'Traducir hallazgos de investigación en oportunidades de diseño',
    ],
    achievements: [
      'Co-conceptualicé y prototipé (con <a href="https://www.liquidlab.io/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">Liquid Lab</a>) una caja de herramientas de IA para arquitectos y contratistas. Definimos casos de uso, construimos un prototipo funcional y validamos el encaje con el mercado en el Reino Unido en 8 semanas',
      'Co-creé un sandbox de pruebas en vivo para validar funcionalidades conceptuales de servicios de HP en condiciones de uso casi reales',
      'Diseñé y desplegué varias landings y MVPs reales con smoke tests y técnicas de Mago de Oz para validar el interés antes de desarrollar',
    ],
  },
  work2: {
    title: 'Director de eficiencia operativa',
    description:
      'Lideré el mapeo, el análisis y el rediseño de procesos y herramientas bancarias críticas —desde el alta de productos hasta los flujos internos de servicio— para ganar eficiencia operativa, cumplir la regulación y mejorar la experiencia de cliente. Apliqué análisis de datos y pensamiento sistémico para localizar fricciones, liberar tiempo comercial y conseguir mejoras medibles en el tiempo que la fuerza de ventas dedica a tareas administrativas.',
    responsibilities: [
      'Mapear y rediseñar procesos bancarios clave para mejorar la eficiencia y el cumplimiento',
      'Analizar datos operativos para detectar fricciones y liberar capacidad comercial',
      'Definir y hacer evolucionar herramientas internas de apoyo a operaciones comerciales y de back-office',
      'Liderar iniciativas transversales con IT, cumplimiento, legal y negocio',
      'Implantar mejoras sistémicas para reducir la carga administrativa y los errores',
      'Impulsar la adopción de nuevas herramientas y flujos en varios departamentos',
    ],
    achievements: [
      'Lideré la implantación de un sistema BPM (Appian) e inicié proyectos de automatización para eliminar tareas manuales y habilitar nuevos procesos comerciales',
      'Lideré la digitalización de extremo a extremo de algunos trámites regulatorios (cambios de domicilio, actualización del DNI), permitiendo el autoservicio móvil y reduciendo de forma notable las gestiones en oficina',
      'Inicié el concepto y el diseño temprano de un sistema de solicitud de crédito vía TPV, que después completó y desplegó el equipo de negocio',
      'Ayudé a diseñar y lanzar un asistente virtual que redujo de forma notable las llamadas entrantes a las oficinas (impacto estimado superior al 30%)',
      'Implanté cambios sistémicos que mejoraron la satisfacción del cliente en los recorridos de servicio',
      'Piloté y validé nuevas herramientas internas con feedback real de usuarios antes de escalarlas',
    ],
  },
  work3: {
    title: 'Business Designer',
    description:
      'En Innocells (la venture builder de Banc Sabadell) lideré la estrategia de diseño de la transformación del negocio hipotecario del banco, con foco en los recorridos de cliente de extremo a extremo, la eficiencia operativa y la innovación de servicio. Definí y prototipé productos digitales, integré puntos de contacto online y offline, y coordiné equipos transversales para entregar mejoras escalables tanto en la experiencia de cliente como en las operaciones internas. También contribuí a nuevas propuestas de servicio, como el seguro de hogar en alianza con Zurich.',
    responsibilities: [
      'Diseñar y mapear recorridos de cliente de extremo a extremo en canales digitales y físicos',
      'Coordinar la transformación digital de los procesos hipotecarios y las herramientas internas',
      'Liderar talleres de ideación con negocio, operaciones, legal y cumplimiento',
      'Desarrollar service blueprints y prototipos para alinear producto, operaciones y visión de servicio',
      'Acotar nuevas propuestas de valor digitales para alianzas estratégicas (p. ej. Zurich)',
    ],
    achievements: [
      'Co-diseñé y prototipé una solicitud de hipoteca digital que aumentó las transacciones online más de un 100% (<a href="https://www.expansion.com/empresas/banca/2025/03/12/67d095d3e5fdead1638b459f.html" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">fuente</a>)',
      'Lideré el diseño de una nueva oferta de seguro de hogar en alianza con Zurich, integrando puntos de contacto digitales y físicos',
      'Construí y alineé una hoja de ruta de transformación digital a 3 años para el negocio digital de Banc Sabadell, coordinando varios frentes y equipos de stakeholders',
      'Introduje y defendí una nueva metodología ágil para la creación de activos digitales, acelerando los ciclos de entrega y la colaboración entre equipos',
    ],
  },
  work4: {
    title: 'Service Designer / Responsable de proyecto',
    description:
      'Trabajé como consultor de diseño estratégico liderando proyectos de service design para grandes clientes como BBVA, Endesa, Repsol y Mutua Madrileña. Dirigí investigación cualitativa y cuantitativa con usuarios y stakeholders, facilité talleres de co-creación y traduje los hallazgos en nuevos servicios, propuestas de valor y oportunidades de negocio. Entre los proyectos: el diseño de tarifas energéticas basadas en el consumo, experiencias digitales para Guía Repsol y nuevos servicios financieros alineados con las oportunidades de PSD2.',
    responsibilities: [
      'Hacer investigación cualitativa con usuarios y stakeholders',
      'Facilitar talleres de co-creación e ideación',
      'Diseñar nuevos servicios y puntos de contacto digitales para grandes organizaciones',
      'Definir propuestas de valor y service blueprints',
      'Traducir oportunidades estratégicas en conceptos de producto accionables',
      'Gestionar la relación con el cliente y liderar equipos multidisciplinares',
    ],
    achievements: [
      'Definí nuevas experiencias digitales para Guía Repsol, combinando contenido, movilidad y servicios turísticos',
      'Co-creé tarifas energéticas flexibles, basadas en el consumo, para Endesa, con el fin de mejorar la retención y la transparencia',
      'Exploré oportunidades de negocio derivadas de PSD2 y conceptualicé nuevos servicios financieros para BBVA',
      'Ayudé a Mutua Madrileña a rediseñar su experiencia digital de seguros, mejorando la conversión y la comprensión del cliente',
    ],
  },
  work5: {
    title: 'PDI — Profesor asociado',
    description:
      'Profesor asociado e investigador en el proyecto europeo «Prácticas tecnopolíticas y nociones emergentes de ciudadanía» (ciberdemocracia.es), centrado en la transformación de los movimientos sociales digitales en actores políticos. Coordiné el máster en Comunicación, Cultura y Ciudadanía Digital, e impartí clase en el máster en Comunicación y Problemas Socioculturales. El trabajo incluyó entrevistas a expertos, grupos de discusión con stakeholders y publicación académica sobre activismo digital y tecnopolítica.',
    responsibilities: [
      'Investigación cualitativa sobre movimientos sociales digitales y transformación política',
      'Gestión del trabajo de campo: entrevistas a expertos y grupos de discusión',
      'Coordinación del máster en Comunicación, Cultura y Ciudadanía Digital',
      'Docencia de posgrado en cultura digital, política y medios',
      'Organización de actividades académicas y del funcionamiento del programa',
      'Publicación de resultados en revistas con revisión por pares',
    ],
    achievements: [
      'Coautor de un artículo con revisión por pares sobre activismo digital y tecnopolítica: <a href="https://quadernsdepsicologia.cat/article/view/v15-n1-gordo-derivera-lopez" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">«Ciberdemocracia y nuevas formas de ciudadanía»</a>',
      'Coordiné un programa de posgrado con profesorado y estudiantes internacionales',
      'Contribuí al proyecto europeo ciberdemocracia.es, analizando las dinámicas políticas posteriores al 15M en España',
    ],
  },
  work6: {
    title: 'Investigador senior',
    description:
      'Investigador senior especializado en metodologías cualitativas y cuantitativas. Lideré proyectos de investigación de extremo a extremo para clientes como Renfe, Repsol, Vodafone, la Organización Médica Colegial y el Observatorio Español de eSports. El trabajo incluía entrevistas en profundidad, grupos de discusión, gestión de comunidades online, diseño de encuestas, análisis estadístico (SPSS), estudios de eye-tracking y la entrega de conclusiones estratégicas en informes y presentaciones.',
    responsibilities: [
      'Diseñar y moderar entrevistas en profundidad y grupos de discusión',
      'Gestionar comunidades de usuarios online (reclutamiento, moderación, análisis)',
      'Crear y analizar encuestas con técnicas descriptivas y multivariantes',
      'Hacer tests de UX con eye-tracking y sintetizar hallazgos de comportamiento',
      'Elaborar y presentar informes de investigación a clientes de telecom, salud y entretenimiento',
      'Coordinar el trabajo de campo y la logística de estudios cualitativos y cuantitativos',
    ],
    achievements: [
      'Realicé un estudio nacional sobre las condiciones de trabajo de los médicos españoles para la Organización Médica Colegial',
      'Diseñé y gestioné comunidades de investigación de usuarios para Vodafone, incluyendo pruebas de tarifas y ciclos de feedback de producto',
      'Co-creé el primer Observatorio de eSports de España, con hallazgos clave sobre un ecosistema digital en pleno crecimiento (<a href="https://es.slideshare.net/slideshow/esports-report-68173354/68173354" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">ver informe</a>)',
      'Hice investigación con eye-tracking y entregué recomendaciones de mejora de UX para la app y la web de Domino’s',
    ],
  },
}

const EDUCATION_ES: Record<string, { title: string; institution: string }> = {
  'edu-1': {
    title: 'Comunicación digital y estudios culturales',
    institution: 'Universidad Rey Juan Carlos',
  },
  'edu-2': {
    title: 'Sociología',
    institution: 'Universidad de La Laguna',
  },
  'edu-3': {
    title: 'Desarrollo backend — Java y Spring Framework',
    institution: 'Tokio School',
  },
  'edu-4': {
    title: 'Python para IA y machine learning',
    institution: 'Tokio School',
  },
  'edu-5': {
    title: 'Desarrollo front-end — React y TypeScript',
    institution: 'Tokio School',
  },
  'edu-6': {
    title: 'Máster en gestión de producto digital',
    institution: 'Nuclio School',
  },
  'edu-7': {
    title: 'Gestión y promoción de proyectos de I+D+i',
    institution: 'Universidad de La Laguna',
  },
}

const SIDE_PROJECTS_ES: Record<string, { subtitle: string; description: string }> =
  {
    'proj-3': {
      subtitle: 'Evaluación de candidatos multifuente, sin ruido',
      description: `Sistema de IA estructurado que consolida datos fragmentados de un candidato en una evaluación única y auditable.

  1.	Ingesta varias fuentes: CV, LinkedIn, portfolio, notas de entrevista y material profesional público.
	2.	Analiza cada fuente por separado, con reglas estrictas de evidencia y cero invención.
	3.	Contrasta las fuentes para sacar a la luz confirmaciones, contradicciones, huecos y señales reales de ejecución.

Devuelve una ficha de candidato estandarizada: síntesis, evaluación de competencias, banderas verdes y rojas, perfil cognitivo, encaje con el equipo y preguntas abiertas críticas.
Diseñado para penalizar el discurso vago, premiar el impacto demostrado y conservar la trazabilidad hasta las fuentes originales.`,
    },
    'proj-2': {
      subtitle: 'Auditoría inteligente de PDF antes de imprimir, en cualquier tamaño',
      description:
        'Sistema automatizado que analiza documentos PDF para comprobar si están listos para una impresión profesional. Examina aspectos clave como la resolución y el modo de color de las imágenes, los márgenes y el sangrado, y la calidad de las fuentes. Genera un informe detallado con recomendaciones concretas para optimizar cada archivo antes de enviarlo a imprimir, evitando errores caros y asegurando un buen resultado en cualquier formato.',
    },
    'proj-1': {
      subtitle: 'Generador de recomendaciones de LinkedIn con IA',
      description: `Generador de recomendaciones con IA, en miniatura, que acaba con el clásico «no sé qué escribir».

1. Elige cómo trabajamos juntos (jefe, cliente, compañero, etc.).
2. Elige el tono: del elogio entusiasta a la pulla con gracia.
3. Pulsa Generar y obtén un texto listo para publicar en segundos, con espacio para retocarlo.

Sin bloqueo del escritor y sin sudar: solo elogios frescos llenando mi perfil. 🚀`,
    },
  }

const POSTS_ES: Record<string, { title: string; description: string; link: string }> =
  {
    'blog-3': {
      title: 'Cómo cobrar por cosas que tu cliente ya sabe hacer',
      description:
        'Qué venderán las consultoras cuando sus clientes ya sepan hacerlo',
      link: '/blog/how-to-get-paid-for-work/es',
    },
    'blog-1': {
      title: 'Internet muerta e hiperrealidad',
      description:
        'La teoría de internet muerta empezó como una conspiración menor. Hoy, los datos la confirman',
      link: '/blog/dead-internet-theory/es',
    },
    'blog-2': {
      title: 'El apocalipsis laboral de la IA: lo que mi Roomba me enseñó',
      description:
        'Sigo empujando a mi Roomba mientras Silicon Valley anuncia el fin del trabajo',
      link: '/blog/ai-end-of-work/es',
    },
  }

export function getHomeContent(locale: HomeLocale) {
  if (locale === 'en') {
    return {
      bio: SITE_BIO,
      projects: PROJECTS,
      work: WORK_EXPERIENCE,
      education: EDUCATION,
      sideProjects: SIDE_PROJECTS,
      posts: BLOG_POSTS,
    }
  }

  const present = HOME_UI.es.present

  return {
    bio: BIO_ES,
    projects: PROJECTS.map((project) => ({
      ...project,
      description: PROJECTS_ES[project.id]?.description ?? project.description,
    })),
    work: WORK_EXPERIENCE.map((job) => {
      const translated = WORK_ES[job.id]
      return {
        ...job,
        title: translated?.title ?? job.title,
        description: translated?.description ?? job.description,
        responsibilities: translated?.responsibilities ?? job.responsibilities,
        achievements: translated?.achievements ?? job.achievements,
        end: job.end === 'Present' ? present : job.end,
      }
    }),
    education: EDUCATION.map((item) => ({
      ...item,
      title: EDUCATION_ES[item.id]?.title ?? item.title,
      institution: EDUCATION_ES[item.id]?.institution ?? item.institution,
    })),
    sideProjects: SIDE_PROJECTS.map((project) => ({
      ...project,
      subtitle: SIDE_PROJECTS_ES[project.id]?.subtitle ?? project.subtitle,
      description:
        SIDE_PROJECTS_ES[project.id]?.description ?? project.description,
    })),
    posts: BLOG_POSTS.map((post) => ({
      ...post,
      title: POSTS_ES[post.uid]?.title ?? post.title,
      description: POSTS_ES[post.uid]?.description ?? post.description,
      link: POSTS_ES[post.uid]?.link ?? post.link,
    })),
  }
}
