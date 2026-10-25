export type ResumeTemplate = 'classic' | 'modern' | 'minimal' | 'professional' | 'creative'

export interface ExperienceEntry {
  role: string
  organization: string
  dates: string
  details: string
}

export interface EducationEntry {
  degree: string
  institution: string
  dates: string
  details: string
}

export interface Resume {
  id: string
  name: string
  updatedAt: string
  isExample: boolean
  template: ResumeTemplate
  personal: {
    fullName: string
    role: string
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
    portfolio: string
  }
  summary: string
  education: EducationEntry[]
  technicalSkills: string[]
  softSkills: string[]
  projects: ExperienceEntry[]
  experience: ExperienceEntry[]
  certifications: string[]
  achievements: string[]
}

export interface AtsAnalysis {
  id: string
  createdAt: string
  fileName: string
  role: string
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  sections: { name: string; found: boolean }[]
  recommendations: string[]
}
