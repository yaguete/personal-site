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

export default function PrivacyContent() {
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
            <h1 className="text-xl font-medium text-black dark:text-white">Privacy Policy</h1>
            <a
              href="/privacy/es"
              className="text-sm text-zinc-500 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Leer en español
            </a>
          </div>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mt-3">
            In accordance with <strong>Regulation (EU) 2016/679 (GDPR)</strong> and Spain’s <strong>Organic Law 3/2018 (LOPDGDD)</strong>, here you can find information about how I process your site usage data.
          </p>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mt-3">
            Spoiler: no tracking cookies; only web analytics and performance metrics to improve the experience.
          </p>
        </div>
      </motion.section>

      {/* Content */}
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-sm text-zinc-500">Last updated: 09/08/2025</p>

          <h3>Controller</h3>
          <ul>
            <li>
              <strong>Owner</strong>: Yago López Losada
            </li>
            <li>
              <strong>Website</strong>: https://thinkmaketest.ai
            </li>
            <li>
              <strong>Contact</strong>: <a href="mailto:yago@thinkmaketest.ai">yago@thinkmaketest.ai</a>
            </li>
          </ul>

          <h3>Purpose</h3>
          <ul>
            <li>Measure site usage and improve the experience (web analytics and performance metrics).</li>
            <li>Maintain the security and quality of the service.</li>
          </ul>

          <h3>Legal basis</h3>
          <p>
            <strong>Legitimate interest</strong> in understanding how the site is used and optimizing its technical performance, without significant impact on users’ privacy.
          </p>

          <h3>Data processed</h3>
          <ul>
            <li>Visited URL, referrer, approximate country/region, device/browser type, screen resolution, language, date and time.</li>
            <li>Performance metrics (Core Web Vitals: LCP, INP, CLS, FCP, TTFB).</li>
            <li>IP addresses processed ephemerally and/or truncated, solely to aggregate metrics without identifying individuals.</li>
            <li>Possible temporary server logs to diagnose errors or security issues.</li>
          </ul>

          <p>No profiling, no cross‑site tracking, and no automated decisions.</p>

          <h3>Measurement tools</h3>
          <ul>
            <li>
              <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noreferrer">
                Vercel Web Analytics
              </a>
              
              (cookieless).
            </li>
            <li>
              <a href="https://vercel.com/docs/speed-insights/privacy-policy" target="_blank" rel="noreferrer">
                Vercel Speed Insights
              </a>
              
              (cookieless, Core Web Vitals).
            </li>
          </ul>

          <p>
            Both services operate without tracking cookies and provide aggregated data. Provider: <strong>Vercel Inc. (USA)</strong>, participating in the <strong>EU–US Data Privacy Framework</strong> and/or applying the EU <strong>Standard Contractual Clauses (SCCs)</strong> for international transfers.
          </p>

          <h3>Data retention</h3>
          <ul>
            <li>Web Analytics (Hobby plan): up to <strong>30 days</strong> of history.</li>
            <li>Speed Insights: aggregated timings, retained by Vercel according to its policy.</li>
            <li>Technical logs (if any): kept only for the strictly necessary time for diagnostics and security.</li>
          </ul>

          <h3>Data subject rights</h3>
          <p>
            You can exercise your rights of access, rectification, erasure, objection and restriction by emailing
            <a href="mailto:yago@thinkmaketest.ai"> yago@thinkmaketest.ai</a>. You may also lodge a complaint with your competent supervisory authority (in Spain, the <a href="https://www.aepd.es/">AEPD</a>).
          </p>

          <h3>Cookies</h3>
          <p>
            This site <strong>does not use tracking cookies</strong>. Only your theme preference (light/dark/system) is stored locally in your browser so the site can remember your choice.
          </p>

          <h3>Changes to this policy</h3>
          <p>I may update this page to reflect improvements or legal changes. I recommend revisiting it periodically.</p>
        </div>
      </motion.section>
    </motion.main>
  )
}


