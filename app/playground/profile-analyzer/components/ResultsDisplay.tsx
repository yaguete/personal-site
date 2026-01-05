'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Spotlight } from '@/components/ui/spotlight'
import ReactMarkdown from 'react-markdown'
import { Magnetic } from '@/components/ui/magnetic'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import { remark } from 'remark'

interface ResultsDisplayProps {
  result: string // Markdown content
  candidateName?: string
  evaluatedRole?: string
  targetTeam?: string
  interviewDate?: string
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.6,
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: '2 solid #1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  metadata: {
    marginTop: 15,
    fontSize: 10,
    color: '#666',
  },
  metadataRow: {
    marginBottom: 5,
    flexDirection: 'row',
  },
  metadataLabel: {
    fontWeight: 'bold',
    width: 120,
  },
  metadataValue: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    marginBottom: 15,
  },
  h1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#1a1a1a',
  },
  h2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#1a1a1a',
  },
  h3: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#1a1a1a',
  },
  paragraph: {
    marginBottom: 8,
    textAlign: 'justify',
  },
  list: {
    marginLeft: 20,
    marginBottom: 8,
  },
  listItem: {
    marginBottom: 4,
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  hr: {
    borderBottom: '1 solid #ccc',
    marginTop: 15,
    marginBottom: 15,
  },
  blockquote: {
    marginLeft: 20,
    marginRight: 0,
    marginTop: 8,
    marginBottom: 8,
    paddingLeft: 15,
    borderLeft: '3 solid #ccc',
    fontStyle: 'italic',
    color: '#555',
  },
})

// Function to extract metadata from markdown (supports both English and Spanish patterns)
function extractMetadata(markdown: string) {
  const metadata: {
    interviewDate?: string
    recommendation?: string
    confidence?: string
    rationale?: string[]
  } = {}
  
  const lines = markdown.split('\n')
  
  // Find metadata block (from H1 to first ##)
  let metadataStartIndex = -1
  let metadataEndIndex = -1
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^#\s+/)) {
      metadataStartIndex = i + 1
      break
    }
  }
  
  if (metadataStartIndex === -1) return metadata
  
  // Find end of metadata block (first ##)
  for (let i = metadataStartIndex; i < lines.length; i++) {
    if (lines[i].match(/^##\s+/)) {
      metadataEndIndex = i
      break
    }
  }
  
  if (metadataEndIndex === -1) metadataEndIndex = lines.length
  
  // Process each line in metadata block
  for (let i = metadataStartIndex; i < metadataEndIndex; i++) {
    const line = lines[i].trim()
    
    // Interview date (English + Spanish)
    if (line.match(/^- (Interview date|Fecha entrevista):/i)) {
      const match = line.match(/^- (Interview date|Fecha entrevista):\s*(.+)/i)
      if (match && match[2]) {
        let date = match[2].trim()
        // Clean if contains other fields
        if (date.includes('Evaluated role') || date.includes('Rol evaluado')) {
          date = date.split(/Evaluated role|Rol evaluado/i)[0].trim()
        }
        // Validate it's not another field
        if (date && 
            date.length > 0 && 
            !date.match(/^(Evaluated role|Rol evaluado|Recommendation|Recomendación|Confidence|Confianza|Rationale|Racional|Advance|Avanzar|Backup|Discard|Descartar|Low|Baja|Medium|Media|High|Alta|Not specified)/i) &&
            !date.startsWith('-')) {
          metadata.interviewDate = date
        }
      }
    }
    
    // Recommendation (English + Spanish)
    if (line.match(/^- (Recommendation|Recomendación):/i)) {
      const match = line.match(/^- (Recommendation|Recomendación):\s*(.+)/i)
      if (match && match[2]) {
        const rec = match[2].trim()
        const cleanRec = rec.split('-')[0].trim()
        // Valid values in both languages
        const validValues = ['Advance', 'Avanzar', 'Backup', 'Discard', 'Descartar']
        if (cleanRec && validValues.some(v => cleanRec.toLowerCase() === v.toLowerCase())) {
          metadata.recommendation = cleanRec
        } else if (cleanRec && cleanRec.length > 0) {
          metadata.recommendation = cleanRec
        }
      }
    }
    
    // Confidence (English + Spanish)
    if (line.match(/^- (Confidence|Confianza):/i)) {
      const match = line.match(/^- (Confidence|Confianza):\s*(.+)/i)
      if (match && match[2]) {
        const conf = match[2].trim()
        const cleanConf = conf.split('-')[0].trim()
        // Valid values in both languages
        const validValues = ['Low', 'Baja', 'Medium', 'Media', 'High', 'Alta']
        if (cleanConf && validValues.some(v => cleanConf.toLowerCase() === v.toLowerCase())) {
          metadata.confidence = cleanConf
        } else if (cleanConf && cleanConf.length > 0) {
          metadata.confidence = cleanConf
        }
      }
    }
    
    // Short rationale (English + Spanish) - can be on multiple lines
    if (line.match(/^- (Short rationale|Racional corto):/i)) {
      const bullets: string[] = []
      // Look for indented bullets in following lines
      for (let j = i + 1; j < metadataEndIndex && j < lines.length; j++) {
        const bulletLine = lines[j]
        const trimmedLine = bulletLine.trim()
        
        // If we find another top-level item (starts with "- " without indentation), stop
        if (trimmedLine.match(/^- (?!Rationale|Racional)/) && !bulletLine.match(/^\s{2,}/)) {
          break
        }
        // If we find a new heading, stop
        if (trimmedLine.match(/^##/)) {
          break
        }
        // If we find an indented bullet (2+ spaces or tab)
        if (bulletLine.match(/^\s{2,}-/) || bulletLine.match(/^\t+-/)) {
          const bulletText = bulletLine.replace(/^\s{2,}-\s*/, '').replace(/^\t+-\s*/, '').trim()
          // Validate it's not a placeholder
          if (bulletText && 
              bulletText.length > 0 && 
              !bulletText.match(/^\(bullet \d+\)$/i) &&
              !bulletText.match(/^\(bullet/i)) {
            bullets.push(bulletText)
          }
        } else if (trimmedLine === '') {
          continue
        } else if (!trimmedLine.startsWith('-')) {
          break
        }
      }
      if (bullets.length > 0) {
        metadata.rationale = bullets
      }
    }
  }
  
  return metadata
}

// Función para convertir markdown a componentes React-PDF
function markdownToPDFComponents(markdown: string): React.ReactElement[] {
  const processor = remark()
  const tree = processor.parse(markdown)
  const components: React.ReactElement[] = []
  let key = 0
  let isInInterviewNotesSection = false

  const processNode = (node: any): React.ReactElement | React.ReactElement[] | null => {
    if (!node || !node.type) return null

    switch (node.type) {
      case 'heading':
        const headingStyle = node.depth === 1 ? styles.h1 : node.depth === 2 ? styles.h2 : styles.h3
        const headingText = node.children
          .map((child: any) => {
            if (child.type === 'text') return child.value
            if (child.type === 'strong') return child.children.map((c: any) => c.value).join('')
            if (child.type === 'emphasis') return child.children.map((c: any) => c.value).join('')
            return ''
          })
          .join('')
        
        // Detect if we're in the interview notes/summary section
        if (headingText.match(/2\.\s*(Interview Summary|Interview notes|Notas de entrevista)/i)) {
          isInInterviewNotesSection = true
        } else if (headingText.match(/3\.\s*(Independent|Analysis|Análisis)/i) || headingText.match(/##\s*3/i)) {
          isInInterviewNotesSection = false
        }
        
        return (
          <Text key={key++} style={headingStyle}>
            {headingText}
          </Text>
        )
      
      case 'paragraph':
        // Extraer texto plano del párrafo (simplificado para React-PDF)
        const paragraphText = node.children
          .map((child: any) => {
            if (child.type === 'text') return child.value
            if (child.type === 'strong') {
              return child.children.map((c: any) => c.value || '').join('')
            }
            if (child.type === 'emphasis') {
              return child.children.map((c: any) => c.value || '').join('')
            }
            return ''
          })
          .join('')
        return (
          <Text key={key++} style={styles.paragraph}>
            {paragraphText}
          </Text>
        )
      
      case 'list':
        const listItems: React.ReactElement[] = []
        node.children.forEach((item: any, index: number) => {
          const itemText = item.children
            .flatMap((p: any) => 
              p.children ? p.children.map((c: any) => {
                if (c.type === 'text') return c.value
                if (c.type === 'strong') return c.children.map((sc: any) => sc.value).join('')
                if (c.type === 'emphasis') return c.children.map((ec: any) => ec.value).join('')
                return ''
              }).join('') : ''
            )
            .join(' ')
          
          listItems.push(
            <View key={index} style={styles.listItem}>
              <Text>
                {node.ordered ? `${index + 1}. ` : '• '}
                {itemText}
              </Text>
            </View>
          )
        })
        return (
          <View key={key++} style={styles.list}>
            {listItems}
          </View>
        )
      
      case 'listItem':
        return null // Se maneja en el caso 'list'
      
      case 'text':
        return <Text key={key++}>{node.value}</Text>
      
      case 'strong':
        const strongText = node.children.map((c: any) => c.value || '').join('')
        return (
          <Text key={key++} style={styles.strong}>
            {strongText}
          </Text>
        )
      
      case 'emphasis':
        const emText = node.children.map((c: any) => c.value || '').join('')
        return (
          <Text key={key++} style={styles.em}>
            {emText}
          </Text>
        )
      
      case 'thematicBreak':
        return <View key={key++} style={styles.hr} />
      
      case 'blockquote':
        const extractTextFromNode = (n: any): string => {
          if (!n) return ''
          if (n.type === 'text') return n.value || ''
          if (n.type === 'strong' || n.type === 'emphasis') {
            return n.children ? n.children.map(extractTextFromNode).join('') : ''
          }
          if (n.type === 'paragraph') {
            return n.children ? n.children.map(extractTextFromNode).join('') : ''
          }
          if (n.children && Array.isArray(n.children)) {
            return n.children.map(extractTextFromNode).join('')
          }
          return ''
        }
        
        // Procesar todos los hijos del blockquote
        const blockquoteTexts: string[] = []
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach((child: any) => {
            const text = extractTextFromNode(child)
            if (text.trim()) {
              blockquoteTexts.push(text.trim())
            }
          })
        }
        
        if (blockquoteTexts.length > 0) {
          // Si es notas de entrevista, convertir a bullets
          if (isInInterviewNotesSection) {
            // Separar cada texto que pueda contener múltiples oraciones/puntos
            const allBullets: string[] = []
            blockquoteTexts.forEach(text => {
              // Separar por saltos de línea o por puntos seguidos de mayúscula (nuevo punto)
              const sentences = text
                .split(/\n/)
                .flatMap(line => {
                  // Si la línea tiene múltiples oraciones pegadas (punto seguido de mayúscula sin espacio)
                  // las separamos
                  return line.split(/\.(?=[A-ZÁÉÍÓÚÑ])/).map((s, i, arr) => 
                    i < arr.length - 1 ? s + '.' : s
                  )
                })
                .map(s => s.trim())
                .filter(s => s.length > 0)
              allBullets.push(...sentences)
            })
            
            return (
              <View key={key++} style={styles.list}>
                {allBullets.map((text, idx) => (
                  <Text key={idx} style={{ marginBottom: 6, marginLeft: 20 }}>
                    • {text}
                  </Text>
                ))}
              </View>
            )
          }
          // Si no, renderizar como blockquote normal
          return (
            <View key={key++} style={styles.blockquote}>
              <Text>{blockquoteTexts.join('\n')}</Text>
            </View>
          )
        }
        return null
      
      default:
        return null
    }
  }

  // Procesar solo los nodos de nivel raíz (no los hijos anidados)
  if (tree.children) {
    tree.children.forEach((node: any) => {
      const component = processNode(node)
      if (component) {
        if (Array.isArray(component)) {
          components.push(...component)
        } else {
          components.push(component)
        }
      }
    })
  }

  return components
}

// Función para remover el header del markdown (H1 y metadatos hasta el primer ##)
function removeHeaderFromMarkdown(markdown: string): string {
  // Buscar el primer H2 (que debería ser "## Síntesis:" o "## 1. Notas de entrevista")
  const firstH2Index = markdown.indexOf('\n##')
  if (firstH2Index !== -1) {
    // Mantener el ## pero eliminar todo lo anterior (H1 y metadatos)
    return markdown.substring(firstH2Index + 1) // +1 para incluir el \n
  }
  // Si no hay H2, buscar el primer H1 y removerlo junto con su contenido
  const h1Match = markdown.match(/^#\s+.+?\n\n/)
  if (h1Match) {
    return markdown.substring(h1Match[0].length)
  }
  return markdown
}

// Componente del documento PDF
function PDFDocument({ 
  candidateName, 
  evaluatedRole, 
  targetTeam, 
  markdownContent,
  interviewDate 
}: { 
  candidateName?: string
  evaluatedRole?: string
  targetTeam?: string
  markdownContent: string
  interviewDate?: string 
}) {
  // Extraer metadatos del markdown
  const metadata = extractMetadata(markdownContent)
  
  // Debug: log para ver qué se extrajo
  console.log('Extracted metadata:', metadata)
  console.log('First 500 chars of markdown:', markdownContent.substring(0, 500))
  
  // Remover el header del markdown para no duplicarlo en el contenido
  // El header es el H1 con el nombre y la lista de metadatos hasta el primer ##
  let contentMarkdown = markdownContent
  
  // Buscar el primer H2 (que debería ser "## Síntesis:" o "## 1. Notas de entrevista")
  const firstH2Match = markdownContent.match(/\n##\s+/)
  if (firstH2Match && firstH2Match.index !== undefined) {
    // Mantener el ## pero eliminar todo lo anterior (H1 y metadatos)
    contentMarkdown = markdownContent.substring(firstH2Match.index + 1) // +1 para incluir el \n
  } else {
    // Si no hay H2, buscar el primer H1 y removerlo junto con su contenido
    const h1Match = markdownContent.match(/^#\s+.+?\n\n/)
    if (h1Match) {
      contentMarkdown = markdownContent.substring(h1Match[0].length)
    }
  }
  
  const contentComponents = markdownToPDFComponents(contentMarkdown)
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{candidateName || 'Candidate Analysis'}</Text>
          
          {evaluatedRole && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Evaluated role:</Text>
              <Text style={styles.metadataValue}>{evaluatedRole}</Text>
            </View>
          )}
          
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>Analysis date:</Text>
            <Text style={styles.metadataValue}>{currentDate}</Text>
          </View>
          
          {(interviewDate || metadata.interviewDate) && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Interview date:</Text>
              <Text style={styles.metadataValue}>{interviewDate || metadata.interviewDate}</Text>
            </View>
          )}
          
          {metadata.recommendation && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Recommendation:</Text>
              <Text style={styles.metadataValue}>{metadata.recommendation}</Text>
            </View>
          )}
          
          {metadata.confidence && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Confidence:</Text>
              <Text style={styles.metadataValue}>{metadata.confidence}</Text>
            </View>
          )}
          
          {metadata.rationale && metadata.rationale.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.metadataLabel}>Short rationale:</Text>
              {metadata.rationale.map((bullet, idx) => (
                <Text key={idx} style={{ fontSize: 10, marginLeft: 120, marginBottom: 3 }}>
                  • {bullet}
                </Text>
              ))}
            </View>
          )}
          
          {targetTeam && (
            <View style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>Target team:</Text>
              <Text style={styles.metadataValue}>{targetTeam}</Text>
            </View>
          )}
        </View>

        {/* Analysis content */}
        <View style={styles.section}>
          {contentComponents}
        </View>
      </Page>
    </Document>
  )
}

export default function ResultsDisplay({ result, candidateName, evaluatedRole, targetTeam, interviewDate }: ResultsDisplayProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = async () => {
    try {
      const doc = (
        <PDFDocument
          candidateName={candidateName}
          evaluatedRole={evaluatedRole}
          targetTeam={targetTeam}
          markdownContent={result}
          interviewDate={interviewDate}
        />
      )
      
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `analysis_${candidateName || 'candidate'}_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50"
    >
      <Spotlight
        className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
        size={64}
      />
      <div className="relative p-6 bg-white dark:bg-zinc-950 rounded-xl">
        {/* PDF download button */}
        <div className="mb-6 flex justify-end">
          <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
            <button
              onClick={handleDownloadPDF}
              className="group relative inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm text-black transition-all duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Download PDF</span>
            </button>
          </Magnetic>
        </div>

        {/* Header with metadata */}
        <div className="mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            {candidateName || 'Candidate Analysis'}
          </h1>
          <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            {evaluatedRole && (
              <li>
                <span className="font-semibold">Evaluated role:</span> {evaluatedRole}
              </li>
            )}
            {interviewDate && (
              <li>
                <span className="font-semibold">Interview date:</span> {interviewDate}
              </li>
            )}
            {targetTeam && (
              <li>
                <span className="font-semibold">Target team:</span> {targetTeam}
              </li>
            )}
          </ul>
        </div>

        {/* Rendered markdown content (without header) */}
        <div
          ref={contentRef}
          className="print-content prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-ul:list-disc prose-ol:list-decimal prose-li:text-zinc-700 dark:prose-li:text-zinc-300"
        >
          <ReactMarkdown>{removeHeaderFromMarkdown(result)}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  )
}
