'use client'

import { motion } from 'framer-motion'
import { MagneticSocialLink } from '@/app/components/ui/magnetic-social-link'
import { EMAIL, SOCIAL_LINKS } from '@/app/data'

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const TRANSITION_SECTION = {
  duration: 0.8,
  ease: [0.04, 0.62, 0.23, 0.98]
}

export function ContactSection() {
  return (
    <motion.section
      variants={VARIANTS_SECTION}
      transition={TRANSITION_SECTION}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="mb-5 flex items-center justify-start space-x-3">
        {SOCIAL_LINKS.map((link) => (
          <MagneticSocialLink key={link.label} link={link.link}>
            {link.label}
          </MagneticSocialLink>
        ))}
      </div>
      <p className="text-zinc-600 dark:text-zinc-400">
        {' '}
        <a className="underline dark:text-zinc-300" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
      </p>
    </motion.section>
  )
}
