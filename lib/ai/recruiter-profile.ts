import {
  EDUCATION,
  EMAIL,
  SITE_BIO,
  SOCIAL_LINKS,
  WORK_EXPERIENCE,
} from '@/app/data'

function formatPublicText(value: string) {
  return value
    .replace(
      /<a\b[^>]*href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi,
      (_, _quote: string, href: string, label: string) => `[${label}](${href})`,
    )
    .replace(/<[^>]+>/g, '')
    .trim()
}

function formatCareer() {
  return WORK_EXPERIENCE.map((job) => {
    const fields = job.chat?.fields ?? []
    const list = (title: string, values?: string[]) =>
      values?.length
        ? `${title}:\n${values.map((value) => `- ${formatPublicText(value)}`).join('\n')}`
        : ''

    return [
      `### ${job.title} — ${job.company} (${job.start}–${job.end})`,
      job.chat?.summary ? formatPublicText(job.chat.summary) : '',
      fields.includes('description') ? formatPublicText(job.description) : '',
      fields.includes('responsibilities')
        ? list('Responsibilities', job.responsibilities)
        : '',
      fields.includes('achievements')
        ? list(
            'Published outcomes (retain shared contributions and estimates)',
            job.achievements,
          )
        : '',
      fields.includes('technologies') ? list('Tools', job.technologies) : '',
    ]
      .filter(Boolean)
      .join('\n\n')
  }).join('\n\n')
}

/**
 * Build the chat's view of the shared site data. Never copy whole job objects:
 * only the fields explicitly selected in each job's chat configuration enter.
 * The short editorial context below contains facts with no other site source.
 */
export function getRecruiterProfile() {
  const education = EDUCATION.map(
    (item) => `- ${item.title}, ${item.institution} (${item.year})`,
  ).join('\n')
  const social = SOCIAL_LINKS.map(
    (link) => `- ${link.label}: ${link.link}`,
  ).join('\n')

  return `# Professional profile

## Introduction
- Yago López Losada. From Ourense, Galicia, living in Barcelona since 2019.
- Languages: Spanish and Galician (native); English (professional).

${SITE_BIO}

## Professional contact
- Email: ${EMAIL}
${social}

## Education
${education}

## Career
${formatCareer()}

## Additional teaching and publications
- Has taught strategic design, design fiction and research methods at IED Madrid, KSchool and Universidad de Castilla-La Mancha.
- Early academic publications: "Comunidades Online: una ventana a la vida cotidiana" and "Sociogénesis de las nuevas enfermedades tecnológicas y los dispositivos de auto-cuantificación".

## Practice and technical scope
- Combines qualitative and quantitative research, service design, product thinking and enough engineering to build functional prototypes and independent experiments.
- Technical training and working prototypes demonstrate practical building ability; they are not evidence of a senior software engineering or ML research role.
- Professional interests include connecting strategy to execution, testing useful applications of AI, improving services and operations, and reducing the distance between an idea and evidence about whether it works.

## Independent work beyond this site's playground
- WanderPlanner, at a high level: an independently designed and built travel planner that turns long-form sources such as articles and blog posts into itineraries.`
}
