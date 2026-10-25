import type { AtsAnalysis } from './types'

const STOP_WORDS = new Set([
  'about', 'above', 'after', 'again', 'also', 'among', 'an', 'and', 'are', 'around',
  'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'can',
  'candidate', 'could', 'during', 'each', 'from', 'have', 'into', 'its', 'more',
  'most', 'must', 'only', 'other', 'our', 'over', 'should', 'some', 'such', 'than',
  'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'those', 'through',
  'under', 'upon', 'using', 'very', 'what', 'when', 'where', 'which', 'while', 'with',
  'within', 'will', 'work', 'you', 'your', 'years', 'year', 'role', 'team', 'ability',
  'required', 'preferred', 'responsibilities', 'requirements', 'including', 'job',
  'title', 'position', 'description', 'need', 'needs', 'looking', 'ideal', 'build',
])

const SYNONYMS: Record<string, string[]> = {
  javascript: ['js', 'ecmascript'],
  typescript: ['ts'],
  'machine learning': ['ml'],
  'artificial intelligence': ['ai'],
  'user interface': ['ui'],
  'user experience': ['ux'],
  'amazon web services': ['aws'],
  'continuous integration': ['ci'],
  'continuous deployment': ['cd'],
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ').replace(/\s+/g, ' ').trim()
}

export function extractKeywords(jobDescription: string) {
  const normalized = normalize(jobDescription)
  const phrases = Object.keys(SYNONYMS).filter((phrase) => normalized.includes(phrase))
  const terms = normalized.match(/[a-z][a-z0-9+#.-]{1,}/g) ?? []
  const ranked = new Map<string, number>()
  for (const term of terms) {
    const clean = term.replace(/[.-]+$/, '')
    if (clean.length > 2 && !STOP_WORDS.has(clean)) ranked.set(clean, (ranked.get(clean) ?? 0) + 1)
  }
  const frequent = [...ranked.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 22)
    .map(([term]) => term)
  return [...new Set([...phrases, ...frequent])]
}

function hasKeyword(resume: string, keyword: string) {
  const haystack = normalize(resume)
  const options = [keyword, ...(SYNONYMS[keyword] ?? [])]
  return options.some((option) => {
    const escaped = option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`(^|[^a-z0-9+#])${escaped}([^a-z0-9+#]|$)`, 'i').test(haystack)
  })
}

export function analyzeResume(resumeText: string, jobDescription: string, fileName: string): AtsAnalysis {
  const keywords = extractKeywords(jobDescription)
  const matchedKeywords = keywords.filter((keyword) => hasKeyword(resumeText, keyword))
  const missingKeywords = keywords.filter((keyword) => !matchedKeywords.includes(keyword))
  const text = normalize(resumeText)
  const sections = [
    { name: 'Education', found: /\b(education|bachelor|degree|university|college)\b/.test(text) },
    { name: 'Skills', found: /\b(skills|technologies|technical)\b/.test(text) },
    { name: 'Projects', found: /\b(project|developed|built)\b/.test(text) },
    { name: 'Experience', found: /\b(experience|internship|employment|work history)\b/.test(text) },
  ]
  const keywordScore = keywords.length ? matchedKeywords.length / keywords.length * 70 : 0
  const sectionScore = sections.filter((section) => section.found).length / sections.length * 20
  const detailScore = Math.min(resumeText.trim().length / 1200, 1) * 10
  const score = Math.round(Math.min(100, keywordScore + sectionScore + detailScore))
  const recommendations: string[] = []
  if (missingKeywords.length) recommendations.push(`Where accurate, include relevant job terms such as ${missingKeywords.slice(0, 5).join(', ')} in your skills or experience.`)
  const missingSections = sections.filter((section) => !section.found).map((section) => section.name.toLowerCase())
  if (missingSections.length) recommendations.push(`Add clearly labeled ${missingSections.join(' and ')} section${missingSections.length > 1 ? 's' : ''} if applicable.`)
  if (resumeText.trim().length < 1200) recommendations.push('Add concise, specific detail about your projects, contributions, and outcomes to give the checker more evidence.')
  if (!recommendations.length) recommendations.push('Your resume includes the checked sections and job terms. Tailor each bullet with specific, verifiable outcomes.')

  const role = jobDescription.match(/(?:job title|position|role)\s*[:\-]\s*([^\n,.]+)/i)?.[1]?.trim() ?? 'Target role'
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    fileName,
    role,
    score,
    matchedKeywords,
    missingKeywords,
    sections,
    recommendations,
  }
}
