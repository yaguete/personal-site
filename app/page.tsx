'use client'
import { motion, AnimatePresence } from 'motion/react'
import { XIcon, Award, Construction, Info } from 'lucide-react'
import { Spotlight } from '@/app/components/ui/spotlight'
import { Magnetic } from '@/app/components/ui/magnetic'
import useClickOutside from '@/app/hooks/useClickOutside'

import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/app/components/ui/morphing-dialog'
import Link from 'next/link'
import { AnimatedBackground } from '@/app/components/ui/animated-background'
import { useState, useEffect, useRef } from 'react'
import { Modal } from './components/ui/modal'
import {
  PROJECTS,
  WORK_EXPERIENCE,
  SIDE_PROJECTS,
  BLOG_POSTS,
  EDUCATION,
  EMAIL,
  SOCIAL_LINKS,
  SITE_BIO,
} from './data'
import { TextEffect } from '@/app/components/ui/text-effect'
import { MAINTENANCE_MODE, SHOW_SELECTED_PROJECTS } from './config'

// Componente de página en construcción
function MaintenancePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 items-center justify-center"
    >
      <div className="text-center mt-8">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100"
        >
          🚧 Página en construcción 🚧
        </motion.h1>
        <motion.p 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-zinc-600 dark:text-zinc-400"
        >
          Estoy ajustando cosillas. Vuelve pronto.
        </motion.p>
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <img 
            src="/images/mapache.jpg" 
            alt="Mapache trabajando" 
            className="mx-auto rounded-lg shadow-lg max-w-xs"
          />
        </motion.div>
      </div>
    </motion.main>
  )
}

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

// Config ahora en app/config.ts → SHOW_SELECTED_PROJECTS

type ProjectVideoProps = {
  src: string
}

function ProjectVideo({ src }: ProjectVideoProps) {
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }}
    >
      <MorphingDialogTrigger>
        <video
          src={src}
          autoPlay
          loop
          muted
          className="aspect-video w-full cursor-zoom-in rounded-xl"
        />
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative aspect-video rounded-2xl bg-zinc-50 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50">
          <video
            src={src}
            autoPlay
            loop
            muted
            className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh]"
          />
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

type WorkExperienceCardProps = {
  job: typeof WORK_EXPERIENCE[0]
}

function WorkExperienceCard({ job }: WorkExperienceCardProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(isDark)
    }

    checkTheme()
    
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Reset scroll to top when modal opens
    const resetScroll = () => {
      const modalContent = document.querySelector('[data-modal-content]')
      if (modalContent) {
        modalContent.scrollTop = 0
      }
    }

    // Check for modal opening by observing DOM changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              if (element.classList.contains('fixed') && element.classList.contains('inset-0')) {
                // Modal opened, reset scroll after a short delay
                setTimeout(resetScroll, 100)
              }
            }
          })
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [])

  const getLogo = () => {
    if (isDarkMode && job.logoDark) {
      return job.logoDark
    }
    return job.logo
  }
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }}
    >
      <MorphingDialogTrigger className="overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30">
        <Spotlight
          className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
          size={64}
        />
        <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
          <div className="relative flex w-full flex-row justify-between">
            <div>
              <h4 className="font-normal dark:text-zinc-100">
                {job.title}
              </h4>
              <div className="flex items-center space-x-2">
                {getLogo() && (
                  <img 
                    src={getLogo()} 
                    alt={`${job.company} logo`}
                    className="h-4 w-4 object-contain rounded-sm"
                  />
                )}
                <p className="text-zinc-500 dark:text-zinc-400">
                  {job.company}
                </p>
              </div>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              {job.start} - {job.end}
            </p>
          </div>
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative w-full h-full md:w-[700px] md:h-auto md:max-h-[90vh] overflow-hidden bg-white dark:bg-zinc-950 border-0 md:border md:border-zinc-200 md:dark:border-zinc-800 md:rounded-2xl flex flex-col">
          {/* Close button for mobile */}
          <div className="flex justify-end p-8 pb-2 md:hidden">
            <MorphingDialogClose className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-2 cursor-pointer">
              <XIcon className="h-4 w-4 text-zinc-500" />
            </MorphingDialogClose>
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 pt-6 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {job.title}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                {job.company} • {job.start} - {job.end}
              </p>
            </div>
            {getLogo() && (
              <img 
                src={getLogo()} 
                alt={`${job.company} logo`}
                className="h-10 w-10 object-contain rounded-lg"
              />
            )}
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 min-h-0" data-modal-content>
            <div className="space-y-6">
                             {/* Descripción */}
               <div>
                 <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                   {job.description}
                 </p>
               </div>

              {/* Responsabilidades */}
              <div>
                <h4 className="text-md font-medium text-zinc-900 dark:text-zinc-100 mb-3">
                  Main responsibilities
                </h4>
                <ul className="space-y-2">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-zinc-400 dark:text-zinc-500 mt-1">•</span>
                      <span className="text-zinc-600 dark:text-zinc-400">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Logros y proyectos destacados */}
              {job.achievements && job.achievements.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-zinc-900 dark:text-zinc-100 mb-3">
                    Achievements
                  </h4>
                  <ul className="space-y-2">
                    {job.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-zinc-400 dark:text-zinc-500 mt-1">•</span>
                        <span 
                          className="text-zinc-600 dark:text-zinc-400"
                          dangerouslySetInnerHTML={{ __html: achievement }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tecnologías */}
              {job.technologies && job.technologies.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-zinc-900 dark:text-zinc-100 mb-3">
                    Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map((tech, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Enlace externo */}
              {job.showDetailsLink && (
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    <span>Ver más detalles</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 p-2 cursor-pointer hidden md:block"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

function MagneticSocialLink({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </Magnetic>
  )
}

export default function Personal() {
  const [openProject, setOpenProject] = useState<typeof SIDE_PROJECTS[0] | null>(null)
  const [isEducationOpen, setIsEducationOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work')
  const modalRef = useRef<HTMLDivElement>(null!)

  // Bloquear scroll cuando hay una modal abierta
  useEffect(() => {
    if (openProject) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px' // Prevenir shift del contenido
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0px'
    }
  }, [openProject])

  // Función para ordenar las credenciales educativas
  const sortedEducation = EDUCATION.sort((a, b) => {
    // Primero ordenar por categoría (master > bachelor > resto)
    const categoryOrder = { 'Master': 1, 'Bachelor': 2 }
    const aOrder = categoryOrder[a.category as keyof typeof categoryOrder] || 3
    const bOrder = categoryOrder[b.category as keyof typeof categoryOrder] || 3
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder
    }
    
    // Si tienen la misma categoría, ordenar por año (más reciente primero)
    // Manejar "In progress" como el año más reciente
    const getYearValue = (year: string) => {
      if (year.toLowerCase().includes('progress')) return 9999 // Año futuro para "In progress"
      const parsed = parseInt(year)
      return isNaN(parsed) ? 0 : parsed
    }
    
    return getYearValue(b.year) - getYearValue(a.year)
  })

  useClickOutside(modalRef, () => {
    if (openProject) {
      setOpenProject(null)
    }
  })

  if (MAINTENANCE_MODE) {
    return <MaintenancePage />
  }

  return (
    <motion.main
      className="space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="flex-1">
          <p className="whitespace-pre-line text-zinc-600 dark:text-zinc-400">
            {SITE_BIO}
          </p>
        </div>
      </motion.section>

      {SHOW_SELECTED_PROJECTS && (
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <h3 className="mb-5 text-lg font-medium">Selected Projects</h3>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
            {PROJECTS.map((project) => (
              <div key={project.name} className="w-[85%] shrink-0 snap-start space-y-2 sm:w-auto sm:shrink">
                <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                  <ProjectVideo src={project.video} />
                </div>
                <div className="px-1">
                  <a
                    className="font-base group relative inline-block font-[450] text-zinc-900 dark:text-zinc-50"
                    href={project.link}
                    target="_blank"
                  >
                    {project.name}
                    <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 dark:bg-zinc-50 transition-all duration-200 group-hover:max-w-full"></span>
                  </a>
                  <p className="text-base text-zinc-600 dark:text-zinc-400">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-lg font-medium">Playground</h3>
          <div className="relative group mt-2">
            <button 
              className="p-1 -m-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                const tooltip = document.querySelector('.playground-tooltip') as HTMLElement;
                if (tooltip) {
                  tooltip.classList.toggle('opacity-100');
                  setTimeout(() => tooltip.classList.remove('opacity-100'), 3000);
                }
              }}
            >
              <Info className="h-4 w-4 text-zinc-400 cursor-help" />
            </button>
            <div className="playground-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-3 py-2 text-sm text-white bg-zinc-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              Tests and experiments
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-0">
          <AnimatedBackground
            enableHover
            className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.2,
            }}
          >
            {SIDE_PROJECTS.map((project) => (
              <div
                key={project.id}
                className="-mx-3 rounded-xl px-3 py-3 cursor-pointer"
                data-id={project.id}
                onClick={() => setOpenProject(project)}
              >
                <div className="flex flex-col space-y-1">
                  <h4 className="font-normal dark:text-zinc-100">
                    {project.name}
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    {project.year} · {project.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </AnimatedBackground>
        </div>
      </motion.section>

      {openProject && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 h-full w-full bg-white/40 backdrop-blur-sm dark:bg-black/40 z-45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenProject(null)}
            style={{ 
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
          />
          
                    {/* Modal */}
          <AnimatePresence initial={false} mode="sync">
            <div className="fixed inset-0 z-50 flex items-stretch md:items-center md:justify-center">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                className="relative w-full min-h-screen md:w-[700px] md:min-h-0 md:h-auto md:max-h-[90vh] overflow-hidden bg-white dark:bg-zinc-950 border-0 md:border md:border-zinc-200 md:dark:border-zinc-800 md:rounded-2xl flex flex-col"
              >
                {/* Close button for mobile */}
                <div className="flex justify-end p-6 pb-2 md:hidden">
                  <button
                    onClick={() => setOpenProject(null)}
                    className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-2 cursor-pointer"
                  >
                    <XIcon className="h-4 w-4 text-zinc-500" />
                  </button>
                </div>
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 pt-2 md:pt-6 border-b border-zinc-200 dark:border-zinc-800">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                      {openProject.name}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                      {openProject.year} · {openProject.subtitle}
                    </p>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 min-h-0" data-modal-content>
                  <div className="space-y-4">
                    {/* Descripción */}
                    <div>
                      <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                        {openProject.description}
                      </p>
                    </div>

                    {/* Botón Play */}
                    <div className="pt-4">
                                              <a
                          href={openProject.detailUrl}
                          rel="noopener noreferrer"
                          className="group relative inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-base text-black transition-all duration-200 hover:bg-zinc-950 hover:text-zinc-50 hover:translate-x-1 hover:scale-105 shadow-xl border-[0.5px] border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:border-zinc-600"
                        >
                        Play
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                        >
                          <path
                            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatePresence>
          
          {/* Close button */}
          <motion.button
            onClick={() => setOpenProject(null)}
            className="fixed top-6 right-6 h-fit w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 p-2 z-50 cursor-pointer hidden md:block"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
          >
            <XIcon className="h-5 w-5 text-zinc-500" />
          </motion.button>
        </>
      )}

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        {/* Tabs */}
        <div className="flex gap-6 mb-5">
          <button
            onClick={() => setActiveTab('work')}
            className={`transition-colors ${
              activeTab === 'work'
                ? 'text-lg font-medium text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-500 dark:text-zinc-400 font-normal cursor-pointer'
            }`}
          >
            Work Experience
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`transition-colors ${
              activeTab === 'education'
                ? 'text-lg font-medium text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-500 dark:text-zinc-400 font-normal cursor-pointer'
            }`}
          >
            Education
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'work' && (
            <motion.div
              key="work"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col space-y-2"
            >
              {WORK_EXPERIENCE.map((job) => (
                <WorkExperienceCard key={job.id} job={job} />
              ))}
            </motion.div>
          )}

          {activeTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-0"
            >
              {sortedEducation.map((education) => (
                <div
                  key={education.id}
                  className="p-4 border-b border-zinc-200 dark:border-zinc-800 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                          {education.title}
                        </h4>
                        {education.id === 'edu-2' && (
                          <div className="relative">
                            <button
                              onMouseEnter={() => setShowTooltip(true)}
                              onMouseLeave={() => setShowTooltip(false)}
                              onTouchStart={() => setShowTooltip(!showTooltip)}
                              className="focus:outline-none"
                            >
                              <Award className="h-4 w-4 text-amber-500 cursor-help" />
                            </button>
                            {(showTooltip || false) && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 rounded-lg transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                Award for Academic Excellence
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100"></div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {education.institution} · {education.year}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        education.category === 'Master' || education.category === 'Bachelor'
                          ? 'text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-800'
                          : 'text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600'
                      }`}>
                        {education.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-3 text-lg font-medium">Thoughts</h3>
        <div className="flex flex-col space-y-0">
          <AnimatedBackground
            enableHover
            className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.2,
            }}
          >
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.uid}
                className="-mx-3 rounded-xl px-3 py-3"
                href={post.link}
                data-id={post.uid}
              >
                <div className="flex flex-col space-y-1">
                  <h4 className="font-normal dark:text-zinc-100">
                    {post.title}
                  </h4>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </AnimatedBackground>
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Connect</h3>
        <p className="mb-5 text-zinc-600 dark:text-zinc-400">
          Feel free to contact me at{' '}
          <a className="underline dark:text-zinc-300" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </p>
        <div className="flex items-center justify-start space-x-3">
          {SOCIAL_LINKS.map((link) => (
            <MagneticSocialLink key={link.label} link={link.link}>
              {link.label}
            </MagneticSocialLink>
          ))}
        </div>
      </motion.section>


    </motion.main>
  )
}
