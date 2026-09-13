import { BLOG_POSTS, SIDE_PROJECTS } from '@/app/data'

export type PageKind = 'home' | 'blog' | 'playground' | 'privacy' | 'other'

export type VisitorPage = {
  kind: PageKind
  path: string
  language: 'es' | 'en'
  title?: string
  description?: string
}

function normalizePath(pageUrl?: string, pathname?: string) {
  let path = pathname?.trim()
  if (!path && pageUrl) {
    try {
      path = new URL(pageUrl).pathname
    } catch {
      path = pageUrl
    }
  }
  if (!path) return '/'
  const clean = path.replace(/\/+$/, '')
  return clean === '' ? '/' : clean
}

function pageLanguage(path: string): 'es' | 'en' {
  if (path.includes('/es')) return 'es'
  if (path.includes('/eng')) return 'en'
  return 'en'
}

export function resolveVisitorPage(
  pageUrl?: string,
  pathname?: string,
): VisitorPage {
  const path = normalizePath(pageUrl, pathname)
  const language = pageLanguage(path)

  if (path === '/') {
    return { kind: 'home', path, language: 'en' }
  }

  if (path.startsWith('/blog/')) {
    const slug = path.split('/')[2] ?? ''
    const post = BLOG_POSTS.find((item) => item.link.includes(slug))
    return {
      kind: 'blog',
      path,
      language,
      title: post?.title,
      description: post?.description,
    }
  }

  if (path.startsWith('/playground/')) {
    const project = SIDE_PROJECTS.find((item) =>
      path.startsWith(item.detailUrl),
    )
    return {
      kind: 'playground',
      path,
      language: 'en',
      title: project?.name,
      description: project?.subtitle ?? project?.description,
    }
  }

  if (path.startsWith('/privacy')) {
    return { kind: 'privacy', path, language }
  }

  return { kind: 'other', path, language }
}

export function formatVisitorPage(page: VisitorPage) {
  if (page.kind === 'home') {
    return `## Where the visitor is right now
They are on the HOME / profile page (${page.path}).

Default assumption for this turn: a generic question about you — who you are, education, career, how you work, contact. Do not assume they are asking about a blog post unless they name one.`
  }

  if (page.kind === 'blog') {
    const title = page.title ?? page.path
    const angle = page.description ? `\n- What it is about: ${page.description}` : ''
    const lang = page.language === 'es' ? 'Spanish' : 'English'
    return `## Where the visitor is right now
They are READING this blog post, on this exact URL:
- Path: ${page.path}
- Title: ${title}${angle}
- Page language: ${lang}

Default assumption for this turn: the question is about THIS article — the thesis, an example, a disagreement, a paragraph they just read. Use the full post in the knowledge. Do not pivot to the CV or another topic unless they clearly ask for that.`
  }

  if (page.kind === 'playground') {
    const name = page.title ?? page.path
    const about = page.description ? `\n- What it is: ${page.description}` : ''
    return `## Where the visitor is right now
They are on this playground tool:
- Path: ${page.path}
- Name: ${name}${about}

Default assumption for this turn: the question is about THIS tool (what it does, how to use it, why you built it), unless they clearly change topic.`
  }

  if (page.kind === 'privacy') {
    return `## Where the visitor is right now
They are on the privacy page (${page.path}). Answer that page first; if they ask something else, switch.`
  }

  return `## Where the visitor is right now
They are on ${page.path}. Use that as the default context unless they clearly ask about something else.`
}
