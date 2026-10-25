import type { AtsAnalysis, Resume } from './types'

let storageScope: string | null = null

export function setStorageScope(userId: string | null) {
  storageScope = userId
}

function storageKey(kind: 'resumes' | 'analyses') {
  return `resumeai.${storageScope ?? 'anonymous'}.${kind}`
}

function readArray<T>(key: string): T[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? value as T[] : []
  } catch {
    return []
  }
}

export const getResumes = () => readArray<Resume>(storageKey('resumes'))
export const getAnalyses = () => readArray<AtsAnalysis>(storageKey('analyses'))

export function saveResume(resume: Resume) {
  const resumes = getResumes()
  const index = resumes.findIndex((item) => item.id === resume.id)
  const next = { ...resume, updatedAt: new Date().toISOString() }
  if (index === -1) resumes.unshift(next)
  else resumes[index] = next
  localStorage.setItem(storageKey('resumes'), JSON.stringify(resumes))
}

export function deleteResume(id: string) {
  localStorage.setItem(storageKey('resumes'), JSON.stringify(getResumes().filter((resume) => resume.id !== id)))
}

export function saveAnalysis(analysis: AtsAnalysis) {
  const analyses = [analysis, ...getAnalyses()].slice(0, 30)
  localStorage.setItem(storageKey('analyses'), JSON.stringify(analyses))
}

export function createSampleResume(): Resume {
  return {
    id: crypto.randomUUID(),
    name: 'My fresher resume',
    updatedAt: new Date().toISOString(),
    isExample: true,
    template: 'classic',
    personal: {
      fullName: 'Your Name',
      role: 'Computer Applications Graduate',
      email: 'you@example.com',
      phone: '',
      location: 'City, Country',
      linkedin: '',
      github: '',
      portfolio: '',
    },
    summary: 'Recent computer science graduate with a foundation in web development and a passion for building practical, user-focused applications. Seeking an entry-level opportunity to contribute, learn, and grow with a collaborative team.',
    education: [{ degree: 'Bachelor of Computer Applications', institution: 'City College', dates: '2022 – 2025', details: 'Relevant coursework: Data Structures, DBMS, Web Development' }],
    technicalSkills: ['JavaScript', 'React', 'TypeScript', 'HTML & CSS', 'Git', 'SQL'],
    softSkills: ['Communication', 'Teamwork', 'Problem solving'],
    projects: [
      { role: 'Student Task Manager', organization: 'Personal project', dates: '2025', details: 'Built a responsive task management app with React and local storage. Designed reusable components and added task filtering.' },
    ],
    experience: [],
    certifications: ['Responsive Web Design — freeCodeCamp'],
    achievements: [],
  }
}
