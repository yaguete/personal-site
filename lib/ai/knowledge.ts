import 'server-only'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  BLOG_POSTS,
  EDUCATION,
  EMAIL,
  SIDE_PROJECTS,
  SITE_BIO,
  SITE_ORIGIN,
  SOCIAL_LINKS,
  WORK_EXPERIENCE,
} from '@/app/data'
import { RECRUITER_PROFILE } from '@/lib/ai/recruiter-profile'

const BLOG_ROOT = join(process.cwd(), 'app/blog')

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function stripExportBlock(source: string, marker: string) {
  const start = source.indexOf(marker)
  if (start === -1) return source
  const braceStart = source.indexOf('{', start)
  if (braceStart === -1) return source.slice(0, start)

  let depth = 0
  let end = braceStart
  for (; end < source.length; end++) {
    const char = source[end]
    if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        end += 1
        break
      }
    }
  }

  let cursor = end
  while (source[cursor] === ';' || source[cursor] === '\n') cursor += 1
  return source.slice(0, start) + source.slice(cursor)
}

function stripMdx(source: string) {
  let text = stripExportBlock(source, 'export const metadata')
  text = text.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*/g, '')
  text = text.replace(/<(Cover|AudioPlayer|StructuredData)[\s\S]*?\/>/g, '')
  text = text.replace(
    /<(Cover|AudioPlayer|StructuredData)[\s\S]*?<\/\1>/g,
    '',
  )
  return text.replace(/\n{3,}/g, '\n\n').trim()
}

function loadBlogPosts() {
  if (!existsSync(BLOG_ROOT)) return ''

  const sections: string[] = []
  const entries = readdirSync(BLOG_ROOT, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const postDir = join(BLOG_ROOT, entry.name)
    const locales = readdirSync(postDir, { withFileTypes: true })

    for (const locale of locales) {
      if (!locale.isDirectory()) continue
      const filePath = join(postDir, locale.name, 'page.mdx')
      if (!existsSync(filePath)) continue
      const raw = readFileSync(filePath, 'utf8')
      const body = stripMdx(raw)
      if (!body) continue
      sections.push(
        `### ${entry.name} (${locale.name})\nPath: /blog/${entry.name}/${locale.name}\n\n${body}`,
      )
    }
  }

  return sections.join('\n\n---\n\n')
}

function serializeSiteData() {
  const work = WORK_EXPERIENCE.map((job) => {
    const achievements = job.achievements?.map(stripHtml) ?? []
    return [
      `### ${job.title} — ${job.company} (${job.start}–${job.end})`,
      job.description,
      job.responsibilities.length
        ? `Responsibilities:\n${job.responsibilities.map((item) => `- ${item}`).join('\n')}`
        : '',
      achievements.length
        ? `Achievements:\n${achievements.map((item) => `- ${item}`).join('\n')}`
        : '',
      job.technologies?.length
        ? `Technologies: ${job.technologies.join(', ')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n\n')
  }).join('\n\n')

  const education = EDUCATION.map(
    (item) =>
      `- ${item.category}: ${item.title} (${item.year}, ${item.institution})`,
  ).join('\n')

  const playground = SIDE_PROJECTS.map(
    (project) =>
      `### ${project.name}\n${project.year} · ${project.subtitle}\nURL: ${project.detailUrl}\n\n${project.description}`,
  ).join('\n\n')

  const posts = BLOG_POSTS.map(
    (post) => `- ${post.title}: ${post.description} (${post.link})`,
  ).join('\n')

  const social = SOCIAL_LINKS.map(
    (link) => `- ${link.label}: ${link.link}`,
  ).join('\n')

  return [
    `# Bio\n${SITE_BIO}\n\nOrigin: ${SITE_ORIGIN}`,
    `# Contact\nEmail: ${EMAIL}\n${social}`,
    `# Work experience\n${work}`,
    `# Education\n${education}`,
    `# Playground / side projects\n${playground}`,
    `# Published posts (index)\n${posts}`,
  ].join('\n\n')
}

let cachedKnowledge: string | null = null

export function getSiteKnowledge() {
  if (cachedKnowledge) return cachedKnowledge

  const blog = loadBlogPosts()
  cachedKnowledge = [
    serializeSiteData(),
    RECRUITER_PROFILE,
    blog ? `# Full blog posts\n\n${blog}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  return cachedKnowledge
}
