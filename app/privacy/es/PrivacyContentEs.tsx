'use client'

import { motion } from 'motion/react'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const TRANSITION_SECTION = {
  type: 'spring',
  bounce: 0,
  duration: 0.6,
}

export default function PrivacyContentEs() {
  return (
    <motion.main
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Header */}
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <div className="text-left">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-xl font-medium text-black dark:text-white">Política de Privacidad</h1>
            <a
              href="/privacy"
              className="text-sm text-zinc-500 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Read in English
            </a>
          </div>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mt-3">
            En cumplimiento del <strong>Reglamento (UE) 2016/679 (RGPD)</strong> y de la <strong>Ley Orgánica 3/2018 (LOPDGDD)</strong>, aquí encontrarás información sobre cómo trato tus datos de uso del sitio.
          </p>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mt-3">
            Spoiler: sin cookies de seguimiento; solo analítica web y métricas de rendimiento para mejorar la experiencia.
          </p>
        </div>
      </motion.section>

      {/* Content */}
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-sm text-zinc-500">Última actualización: 09/08/2025</p>

          <h3>Responsable</h3>
          <ul>
            <li>
              <strong>Titular</strong>: Yago López Losada
            </li>
            <li>
              <strong>Web</strong>: https://thinkmaketest.ai
            </li>
            <li>
              <strong>Contacto</strong>: <a href="mailto:yago@thinkmaketest.ai">yago@thinkmaketest.ai</a>
            </li>
          </ul>

          <h3>Finalidad del tratamiento</h3>
          <ul>
            <li>Medir uso del sitio y mejorar la experiencia (analítica web y métricas de rendimiento).</li>
            <li>Mantener la seguridad y calidad del servicio.</li>
          </ul>

          <h3>Base legal</h3>
          <p>
            <strong>Interés legítimo</strong> en comprender el uso del sitio y optimizar su funcionamiento técnico, sin impacto significativo en la privacidad de las personas usuarias.
          </p>

          <h3>Datos que se tratan</h3>
          <ul>
            <li>URL visitada, página de referencia, país/región aproximada, tipo de dispositivo/navegador, resolución de pantalla, idioma, fecha y hora.</li>
            <li>Métricas de rendimiento (Core Web Vitals: LCP, INP, CLS, FCP, TTFB).</li>
            <li>Direcciones IP tratadas de forma efímera y/o truncada, únicamente para agregar métricas sin identificar a personas.</li>
            <li>Posibles registros técnicos temporales en el servidor (logs) para diagnosticar errores o incidencias de seguridad.</li>
          </ul>

          <p>No se crean perfiles, no se realiza seguimiento entre sitios y no hay decisiones automatizadas.</p>

          <h3>Herramientas de medición</h3>
          <ul>
            <li>
              <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">Vercel Web Analytics</a> (cookieless).
            </li>
            <li>
              <a href="https://vercel.com/docs/speed-insights/privacy-policy" target="_blank" rel="noreferrer">Vercel Speed Insights</a> (cookieless, Core Web Vitals).
            </li>
          </ul>
          <p>
            Ambos servicios operan sin cookies de seguimiento y proporcionan datos agregados. Proveedor: <strong>Vercel Inc. (EE. UU.)</strong>, adherido al <strong>EU–US Data Privacy Framework</strong> y/o aplicando las <strong>Cláusulas Contractuales Tipo (SCCs)</strong> de la UE para transferencias internacionales.
          </p>

          <h3>Conservación de datos</h3>
          <ul>
            <li>Web Analytics (plan Hobby): hasta <strong>30 días</strong> de historial.</li>
            <li>Speed Insights: tiempos agregados sin identificación personal, conservados por Vercel según su política.</li>
            <li>Logs técnicos (si los hubiera): retenidos el tiempo estrictamente necesario para diagnóstico y seguridad.</li>
          </ul>

          <h3>Derechos de las personas</h3>
          <p>
            Puedes ejercitar tus derechos de acceso, rectificación, supresión, oposición y limitación escribiendo a
            <a href="mailto:yago@thinkmaketest.ai"> yago@thinkmaketest.ai</a>. También puedes reclamar ante la autoridad de control correspondiente (en España, la <a href="https://www.aepd.es/">AEPD</a>).
          </p>

          <h3>Cookies</h3>
          <p>
            Este sitio <strong>no utiliza cookies de seguimiento</strong>. Solo se almacena, en tu navegador, la preferencia de tema (claro/oscuro/sistema) para recordar tu elección.
          </p>

          <h3>Cambios en esta política</h3>
          <p>Podré actualizar esta página para reflejar mejoras o cambios legales. Te recomiendo revisarla periódicamente.</p>
        </div>
      </motion.section>
    </motion.main>
  )
}


