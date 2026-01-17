'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Magnetic } from '@/app/components/ui/magnetic'
import CategoryManager, { Category } from './components/CategoryManager'
import DynamicSources, { Source } from './components/DynamicSources'
import ResultsDisplay from './components/ResultsDisplay'
import CollapsibleSection from './components/CollapsibleSection'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
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

// Interface removida - ahora usamos string (markdown) directamente

interface Candidate {
  id: string
  name: string
  sources: Source[]
  result: string | null
  isLoading: boolean
  error: string
}

export default function ProfileAnalyzerPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Technical skills', tags: [''] },
  ])
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: '1', name: '', sources: [], result: null, isLoading: false, error: '' }
  ])
  const [evaluatedRole, setEvaluatedRole] = useState('')
  const [targetTeam, setTargetTeam] = useState('')
  const [isExtractingCategories, setIsExtractingCategories] = useState(false)
  const [activeTabs, setActiveTabs] = useState<Record<string, 'sources' | 'analysis'>>({})
  
  // Get current candidate (the last one or the one being edited)
  const currentCandidate = candidates[candidates.length - 1]
  const hasAnalyzedCandidates = candidates.some(c => c.result !== null)
  
  // Initialize tabs with 'sources' as default
  const getActiveTab = (candidateId: string): 'sources' | 'analysis' => {
    return activeTabs[candidateId] || 'sources'
  }
  
  const setActiveTab = (candidateId: string, tab: 'sources' | 'analysis') => {
    setActiveTabs(prev => ({ ...prev, [candidateId]: tab }))
  }

  const handleExtractCategoriesFromPDF = async (file: File) => {
    setIsExtractingCategories(true)
    
    try {
      const formData = new FormData()
      formData.append('role_pdf', file)
      
      const response = await fetch('/api/profile-analyzer/extract-role-categories', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText || `HTTP error! status: ${response.status}` }
        }
        console.error('Error extracting categories:', errorData.error || errorData)
        return
      }
      
      const data = await response.json()
      
      if (data.success && data.categories) {
        // Convert categories from backend to frontend format
        const extractedCategories: Category[] = data.categories.map((cat: any, index: number) => ({
          id: Date.now().toString() + index,
          name: cat.name,
          tags: cat.tags || []
        }))
        
        // Merge with existing categories (add new ones, don't replace)
        // If there are empty default categories, replace them
        const hasEmptyDefault = categories.length === 1 && 
                                categories[0].name === 'Technical skills' && 
                                categories[0].tags.length === 1 && 
                                categories[0].tags[0] === ''
        
        if (hasEmptyDefault) {
          setCategories(extractedCategories)
        } else {
          // Add new categories at the end
          setCategories([...categories, ...extractedCategories])
        }
        
        // If evaluated role is empty, try to extract it from file name
        if (!evaluatedRole.trim() && file.name) {
          const roleName = file.name.replace('.pdf', '').replace(/_/g, ' ').trim()
          if (roleName) {
            setEvaluatedRole(roleName)
          }
        }
      } else {
        // General error - not associated with a specific candidate
        console.error(data.error || 'Error extracting categories from PDF')
      }
    } catch (err) {
      console.error('Error extracting categories:', err)
    } finally {
      setIsExtractingCategories(false)
    }
  }

  const addNewCandidate = () => {
    const newCandidate: Candidate = {
      id: Date.now().toString(),
      name: '',
      sources: [],
      result: null,
      isLoading: false,
      error: ''
    }
    setCandidates([...candidates, newCandidate])
  }

  const updateCandidate = (candidateId: string, updates: Partial<Candidate>) => {
    setCandidates(prev => prev.map(c => 
      c.id === candidateId ? { ...c, ...updates } : c
    ))
  }

  const resetCandidate = (candidateId: string) => {
    updateCandidate(candidateId, {
      name: '',
      sources: [],
      result: null,
      error: '',
      isLoading: false
    })
    // Reset tab to 'sources'
    setActiveTab(candidateId, 'sources')
  }

  const removeCandidate = (candidateId: string) => {
    // Only allow deletion if there's more than one candidate
    if (candidates.length > 1) {
      setCandidates(candidates.filter(c => c.id !== candidateId))
      // Clear active tab for this candidate
      setActiveTabs(prev => {
        const newTabs = { ...prev }
        delete newTabs[candidateId]
        return newTabs
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent, candidateId: string) => {
    e.preventDefault()
    const candidate = candidates.find(c => c.id === candidateId)
    if (!candidate) return
    
    updateCandidate(candidateId, { isLoading: true, error: '', result: null })

    // Validate that there's at least one category with name
    const validCategories = categories.filter(cat => cat.name.trim() && cat.tags.some(tag => tag.trim()))
    if (validCategories.length === 0) {
      updateCandidate(candidateId, { isLoading: false, error: 'You must define at least one category with a name and at least one tag' })
      return
    }

    // Validate that there's at least one source
    if (candidate.sources.length === 0) {
      updateCandidate(candidateId, { isLoading: false, error: 'You must provide at least one candidate information source' })
      return
    }

    // Validate that LinkedIn has PDF (mandatory)
    const linkedinSource = candidate.sources.find(s => s.type === 'linkedin')
    if (linkedinSource && !linkedinSource.linkedinPdf) {
      updateCandidate(candidateId, { isLoading: false, error: 'LinkedIn PDF is mandatory' })
      return
    }

    // Extract name and LinkedIn URL from PDF if necessary
    let candidateName = candidate.name.trim()
    let linkedInUrl = linkedinSource?.linkedinUrl?.trim()
    
    if (linkedinSource?.linkedinPdf instanceof File) {
      try {
        const formData = new FormData()
        formData.append('pdf_file', linkedinSource.linkedinPdf)
        
        const extractResponse = await fetch('/api/profile-analyzer/extract-candidate-name', {
          method: 'POST',
          body: formData,
        })
        
        if (extractResponse.ok) {
          const extractData = await extractResponse.json()
          if (extractData.success) {
            // Extract name only if it's empty
            if (!candidateName && extractData.name) {
              candidateName = extractData.name.trim()
              // Preserve isLoading: true during update
              updateCandidate(candidateId, { name: candidateName, isLoading: true })
            }
            
            // Extract LinkedIn URL always (will be updated in state)
            if (extractData.linkedin_url) {
              linkedInUrl = extractData.linkedin_url.trim()
              // Update LinkedIn URL in state, preserving isLoading: true
              const updatedSources = candidate.sources.map(s => 
                s.id === linkedinSource.id 
                  ? { ...s, linkedinUrl: linkedInUrl }
                  : s
              )
              updateCandidate(candidateId, { sources: updatedSources, isLoading: true })
            }
          }
        }
      } catch (error) {
        console.error('Error extracting information from PDF:', error)
        // Continue with analysis even if extraction fails
      }
    }

    try {
      const profileData = {
        categories: validCategories.map(cat => ({
          name: cat.name.trim(),
          tags: cat.tags.filter(tag => tag.trim()).map(tag => tag.trim())
        }))
      }

      // Process dynamic sources
      const sourcesData: any = {
        candidate_name: candidateName || undefined,
        evaluated_role: evaluatedRole.trim() || undefined,
        target_team: targetTeam.trim() || undefined,
      }

      // Separate sources by type (linkedinSource already defined above)
      const portfolioSource = candidate.sources.find(s => s.type === 'portfolio')
      const interviewSource = candidate.sources.find(s => s.type === 'interview')
      const cvSource = candidate.sources.find(s => s.type === 'cv')
      const otherSources = candidate.sources.filter(s => s.type === 'other')

      if (linkedinSource) {
        // URL (extracted during analysis) - use updated variable
        if (linkedInUrl) {
          sourcesData.linkedin_url = linkedInUrl
        }
        // PDF (mandatory) - sent as file
        if (linkedinSource.linkedinPdf instanceof File) {
          sourcesData.linkedin_file_name = linkedinSource.linkedinPdf.name
        }
      }
      if (portfolioSource && typeof portfolioSource.value === 'string') {
        sourcesData.portfolio_url = portfolioSource.value.trim() || undefined
      }
      if (interviewSource && typeof interviewSource.value === 'string') {
        sourcesData.interview_notes = interviewSource.value.trim() || undefined
        sourcesData.interview_date = interviewSource.interviewDate?.trim() || undefined
      }

      // Process other documents
      if (otherSources.length > 0) {
        sourcesData.other_documents = otherSources.map(s => ({
          name: s.name || 'Document',
          url: s.isUrl && typeof s.value === 'string' ? s.value : undefined,
          file_name: s.value instanceof File ? s.value.name : undefined
        }))
      }

      // Determine if there are files to send
      const hasFiles = cvSource?.value instanceof File || 
                      (linkedinSource?.linkedinPdf instanceof File) ||
                      otherSources.some(s => s.value instanceof File)

      let response
      if (hasFiles) {
        // If there are files, use FormData
        const formData = new FormData()
        
        if (cvSource?.value instanceof File) {
          formData.append('cv_file', cvSource.value)
        }
        
        // Add LinkedIn PDF if it's a file
        if (linkedinSource?.linkedinPdf instanceof File) {
          formData.append('linkedin_file', linkedinSource.linkedinPdf)
        }
        
        // Add other documents that are files
        otherSources.forEach((s, index) => {
          if (s.value instanceof File) {
            formData.append(`other_file_${index}`, s.value)
            formData.append(`other_file_${index}_name`, s.name || 'Document')
          }
        })
        
        formData.append('profile', JSON.stringify(profileData))
        formData.append('sources', JSON.stringify(sourcesData))

        response = await fetch('/api/profile-analyzer', {
          method: 'POST',
          body: formData,
        })
      } else {
        // No files, use JSON
        response = await fetch('/api/profile-analyzer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profile: profileData,
            sources: sourcesData,
          }),
        })
      }

      // Check Content-Type before parsing JSON
      const contentType = response.headers.get('content-type') || ''
      let data
      
      if (contentType.includes('application/json')) {
        try {
          data = await response.json()
        } catch (jsonError) {
          const text = await response.text()
          console.error('Error parsing JSON:', jsonError)
          console.error('Server response:', text)
          updateCandidate(candidateId, { isLoading: false, error: 'Server returned an invalid response. Check console for details.' })
          return
        }
      } else {
        // If not JSON, read as text
        const text = await response.text()
        console.error('Response is not JSON. Content-Type:', contentType)
        console.error('Server response:', text.substring(0, 500))
        updateCandidate(candidateId, { isLoading: false, error: 'Server returned an unexpected response. Check console for details.' })
        return
      }

      if (response.ok && data.success) {
        updateCandidate(candidateId, { result: data.markdown, isLoading: false, error: '' })
        // Automatically switch to "Analysis" tab to show result
        setActiveTab(candidateId, 'analysis')
      } else {
        updateCandidate(candidateId, { isLoading: false, error: data.error || 'Error analyzing profile' })
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err)
      const errorMessage = err instanceof Error ? err.message : String(err)
      updateCandidate(candidateId, { isLoading: false, error: 'Error connecting to server: ' + errorMessage })
    }
  }

  return (
    <motion.main
      className="space-y-10"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="text-left">
          <h1 className="text-xl font-medium text-black dark:text-white">
            Profile Analyzer
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Analyze the fit between a sought profile and a candidate using multiple information sources (LinkedIn, CV, portfolio, interview notes). Get a score and detailed analysis with AI.
          </p>
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="max-w-4xl mx-auto"
      >
        <div className="space-y-4">
          {/* Section 1: Evaluated Role (Sought Profile) */}
          <CollapsibleSection
            title={evaluatedRole.trim() || "Evaluated Role"}
            subtitle="Expand to see role characteristics and sought competencies"
            summary={evaluatedRole.trim() 
              ? `${evaluatedRole} - ${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'}`
              : categories.length > 0 && categories[0].name 
              ? `${categories.length} categor${categories.length > 1 ? 'ies' : 'y'}: ${categories.map(c => c.name).join(', ')}`
              : undefined
            }
            defaultOpen={true}
          >
            <div className="space-y-4">
              
              {/* Upload role PDF to extract categories automatically */}
              <div>
                <div className="relative">
                  <input
                    type="file"
                    id="role-pdf-input"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleExtractCategoriesFromPDF(file)
                      }
                    }}
                    disabled={isExtractingCategories}
                    className="hidden"
                  />
                  <label
                    htmlFor="role-pdf-input"
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
                      isExtractingCategories
                        ? 'border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 opacity-50 cursor-not-allowed'
                        : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                    }`}
                  >
                    {isExtractingCategories ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"></div>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Extracting categories...</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">Upload Job Description (PDF)</span>
                      </>
                    )}
                  </label>
                </div>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  The system will automatically extract the sought characteristics and skills. You can edit them afterwards.
                </p>
              </div>
              {/* Input for target team */}
              <div>
                <label htmlFor="target-team" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Target Team
                </label>
                <textarea
                  id="target-team"
                  value={targetTeam}
                  onChange={(e) => setTargetTeam(e.target.value)}
                  placeholder="Briefly explain which team the sought person will join. E.g.: Advanced innovation team (exploration, rapid prototyping, near-market validation, business alignment)"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Input for evaluated role */}
              <div>
               
                <input
                  type="text"
                  id="evaluated-role"
                  value={evaluatedRole}
                  onChange={(e) => setEvaluatedRole(e.target.value)}
                  placeholder="Role name or designation (E.g.: Service Designer, Product Manager, ...)"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <CategoryManager categories={categories} onChange={setCategories} />
            </div>
          </CollapsibleSection>

          {/* Section 2: Candidates */}
          {candidates.map((candidate, index) => {
            const isLastCandidate = index === candidates.length - 1
            const isOnlyCandidate = candidates.length === 1
            const activeTab = getActiveTab(candidate.id)
            
            return (
              <div key={candidate.id} className="space-y-4">
          <CollapsibleSection
                  title={candidate.name.trim() || `Candidate ${index + 1}`}
            subtitle="Candidate sources and analysis"
            summary={
                    candidate.result
                      ? "Analysis completed"
                      : candidate.sources.length > 0
                      ? `${candidate.sources.length} source${candidate.sources.length > 1 ? 's' : ''}`
                : undefined
            }
                  defaultOpen={index === candidates.length - 1}
                  headerActions={(isOpen) => {
                    // If closed: show delete button (except if there's only 1 candidate)
                    if (!isOpen) {
                      // If there's only 1 candidate, don't show button when closed
                      if (isOnlyCandidate) {
                        return null
                      }
                      // Show delete button
                      return (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeCandidate(candidate.id)
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                          title="Delete candidate"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )
                    }
                    // If open: show reset button (always, even if there's only 1)
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          resetCandidate(candidate.id)
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                        title="Reset candidate"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )
                  }}
                >
                  <div className="space-y-4">
                    {/* Tabs */}
                    <div className="flex gap-6 mb-4">
                      <button
                        onClick={() => setActiveTab(candidate.id, 'sources')}
                        className={`pb-2 transition-colors ${
                          activeTab === 'sources'
                            ? 'text-base font-medium text-blue-600 dark:text-blue-400'
                            : 'text-zinc-500 dark:text-zinc-400 font-normal cursor-pointer hover:text-blue-500 dark:hover:text-blue-400'
                        }`}
                      >
                        Sources
                      </button>
                      <button
                        onClick={() => setActiveTab(candidate.id, 'analysis')}
                        className={`pb-2 transition-colors ${
                          activeTab === 'analysis'
                            ? 'text-base font-medium text-blue-600 dark:text-blue-400'
                            : 'text-zinc-500 dark:text-zinc-400 font-normal cursor-pointer hover:text-blue-500 dark:hover:text-blue-400'
                        }`}
                      >
                        Analysis
                      </button>
                    </div>

                    {/* Content based on active tab */}
                    {activeTab === 'sources' ? (
            <div className="space-y-4">
              {/* Input for candidate name */}
              <div>
                <input
                  type="text"
                            id={`candidate-name-${candidate.id}`}
                            value={candidate.name}
                            onChange={(e) => updateCandidate(candidate.id, { name: e.target.value })}
                  placeholder="Candidate name"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
                        <DynamicSources 
                          sources={candidate.sources} 
                          onSourcesChange={(newSources) => updateCandidate(candidate.id, { sources: newSources })} 
                        />

                        {/* Candidate error */}
                        {candidate.error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                              <span className="text-sm text-red-700 dark:text-red-400">{candidate.error}</span>
              </div>
            </motion.div>
          )}

                        {/* Analysis buttons */}
                        <div className="flex gap-3 pt-3 pb-[20px] px-2.5" style={{ boxSizing: 'content-box', paddingTop: '16px', paddingBottom: '16px' }}>
                          {!candidate.result ? (
          <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, candidate.id)}
                                disabled={candidate.isLoading}
              className="group relative inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-base text-black transition-all duration-200 hover:bg-zinc-950 hover:text-zinc-50 hover:translate-x-1 hover:scale-105 shadow-xl border-[0.5px] border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                                {candidate.isLoading ? (
                <>
                  <span>Analyzing...</span>
                  <div className="ml-1 h-3 w-3 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"></div>
                </>
              ) : (
                <>
                  <span>Analyze profile</span>
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
                </>
              )}
            </button>
          </Magnetic>
                          ) : (
                            <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
                              <button
                                type="button"
                                onClick={(e) => handleSubmit(e, candidate.id)}
                                disabled={candidate.isLoading}
                                className="group relative inline-flex shrink-0 items-center gap-2 rounded-full bg-zinc-200 px-4 py-2 text-sm text-zinc-700 transition-all duration-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              >
                                {candidate.isLoading ? (
                                  <>
                                    <span>Analyzing...</span>
                                    <div className="ml-1 h-3 w-3 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"></div>
                                  </>
                                ) : (
                                  <>
                                    <span>Analyze again</span>
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
                                  </>
                                )}
                              </button>
                            </Magnetic>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {candidate.result ? (
                          <ResultsDisplay 
                            result={candidate.result}
                            candidateName={candidate.name}
                            evaluatedRole={evaluatedRole}
                            targetTeam={targetTeam}
                            interviewDate={candidate.sources.find(s => s.type === 'interview')?.interviewDate}
                          />
                        ) : (
                          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
                            <p className="text-sm">No analysis available yet.</p>
                            <p className="text-xs mt-1">Go to the "Sources" tab to analyze this candidate.</p>
                          </div>
                        )}
          </div>
        )}
                  </div>
                </CollapsibleSection>
              </div>
            )
          })}

          {/* Button to add another candidate */}
          {hasAnalyzedCandidates && (
            <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
              <button
                type="button"
                onClick={addNewCandidate}
                className="group relative inline-flex shrink-0 items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-base text-blue-700 transition-all duration-200 hover:bg-blue-200 hover:translate-x-1 hover:scale-105 shadow-xl border-[0.5px] border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:border-blue-700 cursor-pointer"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                >
                  <path
                    d="M7.5 2.5V12.5M2.5 7.5H12.5"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
                <span>Add another candidate</span>
              </button>
            </Magnetic>
          )}
        </div>
      </motion.section>
    </motion.main>
  )
}

