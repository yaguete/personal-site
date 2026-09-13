import 'server-only'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { BLOG_POSTS, SIDE_PROJECTS } from '@/app/data'
import { getRecruiterProfile } from '@/lib/ai/recruiter-profile'

const BLOG_ROOT = join(process.cwd(), 'app/blog')

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
  text = text.replace(/<(Cover|AudioPlayer|StructuredData)[\s\S]*?<\/\1>/g, '')
  return text.replace(/\n{3,}/g, '\n\n').trim()
}

function loadBlogPosts() {
  if (!existsSync(BLOG_ROOT)) return ''

  const sections: string[] = []
  // A file in app/blog is not necessarily published. Only load indexed posts
  // and supported locales, never arbitrary drafts or adjacent directories.
  const slugs = new Set(BLOG_POSTS.map((post) => post.link.split('/')[2]))

  for (const slug of slugs) {
    for (const locale of ['es', 'eng']) {
      const filePath = join(BLOG_ROOT, slug, locale, 'page.mdx')
      if (!existsSync(filePath)) continue
      const raw = readFileSync(filePath, 'utf8')
      const body = stripMdx(raw)
      if (!body) continue
      sections.push(
        `### ${slug} (${locale})\nPath: /blog/${slug}/${locale}\n\n${body}`,
      )
    }
  }

  return sections.join('\n\n---\n\n')
}

function serializeSiteData() {
  const playground = SIDE_PROJECTS.map(
    (project) =>
      `### ${project.name}\n${project.year} · ${project.subtitle}\nURL: ${project.detailUrl}\n\n${project.description}`,
  ).join('\n\n')

  const posts = BLOG_POSTS.map(
    (post) => `- ${post.title}: ${post.description} (${post.link})`,
  ).join('\n')

  return [
    `# Playground / side projects\n${playground}`,
    `# Published posts (index)\n${posts}`,
  ].join('\n\n')
}

let cachedKnowledge: string | null = null

export function getSiteKnowledge() {
  if (cachedKnowledge) return cachedKnowledge

  const blog = loadBlogPosts()
  // Shared site data is projected through an explicit field allowlist. Private
  // notes and unselected employer details never enter the generated profile.
  cachedKnowledge = [
    getRecruiterProfile(),
    serializeSiteData(),
    blog ? `# Full blog posts\n\n${blog}` : '',
  ]
    .filter(Boolean)
    .join('\n\n')

  return cachedKnowledge
}
