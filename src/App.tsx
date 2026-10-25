import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowDownToLine, ArrowRight, Award, BarChart3, BriefcaseBusiness, Check, CheckCircle2,
  ChevronDown, CircleHelp, FileCheck2, FileText, GraduationCap, LayoutDashboard,
  ListChecks, Menu, Plus, Printer, Quote, Sparkles, Target, Trash2, Upload, WandSparkles,
  X,
} from 'lucide-react'
import { analyzeResume, extractKeywords } from './analysis'
import { createSampleResume, deleteResume, getAnalyses, getResumes, saveAnalysis, saveResume } from './storage'
import type { AtsAnalysis, EducationEntry, ExperienceEntry, Resume, ResumeTemplate } from './types'

const navItems = [
  { label: 'Home', to: '/', icon: LayoutDashboard },
  { label: 'Features', to: '/#features', icon: Sparkles },
  { label: 'Resume Builder', to: '/builder', icon: FileText },
  { label: 'ATS Checker', to: '/ats-checker', icon: Target },
  { label: 'About', to: '/#about', icon: CircleHelp },
]

function Brand({ light = false }: { light?: boolean }) {
  return <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="ResumeAI home">
    <span className="brand-mark"><FileCheck2 size={19} strokeWidth={2.5} /></span>
    <span>Resume<span className="brand-ai">AI</span></span>
  </Link>
}

function Header({ app = false }: { app?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return <header className={`topbar ${app ? 'app-topbar' : ''}`}>
    <div className="topbar-inner">
      <Brand />
      <button className="mobile-menu icon-button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
        {navItems.map(({ label, to }) => to.includes('#')
          ? <a key={label} href={to} onClick={() => setMenuOpen(false)}>{label}</a>
          : <NavLink key={label} to={to} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}
      </nav>
      <Link className="button button-primary top-cta" to="/builder">Build my resume <ArrowRight size={16} /></Link>
    </div>
  </header>
}

function Sidebar() {
  return <aside className="sidebar">
    <p className="sidebar-label">WORKSPACE</p>
    <NavLink end to="/dashboard" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><LayoutDashboard size={18} /> Dashboard</NavLink>
    <NavLink to="/builder" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><FileText size={18} /> Resume builder</NavLink>
    <NavLink to="/ats-checker" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><Target size={18} /> ATS checker <span className="side-new">NEW</span></NavLink>
    <div className="sidebar-tip">
      <span className="tip-icon"><Sparkles size={16} /></span>
      <strong>A little progress goes a long way</strong>
      <p>Tailor your resume to each role for a stronger application.</p>
      <Link to="/ats-checker">Check your match <ArrowRight size={14} /></Link>
    </div>
    <div className="sidebar-bottom"><span className="avatar">R</span><span><strong>ResumeAI</strong><small>Free workspace</small></span><ChevronDown size={16} /></div>
  </aside>
}

function AppShell({ children }: { children: ReactNode }) {
  return <div className="app-shell"><Header app /><div className="app-layout"><Sidebar /><main className="app-content">{children}</main></div></div>
}

function LandingPage() {
  const faqs = [
    ['Is ResumeAI free to use?', 'Yes. The resume builder and rule-based ATS checker work locally in your browser with no paid service or account required.'],
    ['Does the ATS score guarantee an interview?', 'No. It is an estimate based on visible keyword overlap, section headings, and text length—not a real employer ATS or hiring prediction.'],
    ['Are my resume details uploaded anywhere?', 'No. Your drafts and ATS history are stored in this browser only. Files are read locally and are not sent to a server.'],
  ]
  return <div className="landing">
    <Header />
    <main>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT OPPORTUNITY STARTS HERE</div>
          <h1>Build a resume<br />that gets <span>noticed.</span></h1>
          <p className="hero-subtitle">A clearer story. A stronger first impression. Build a polished resume and see how it aligns with the job you want.</p>
          <div className="hero-actions">
            <Link className="button button-primary button-lg" to="/builder">Build my resume <ArrowRight size={18} /></Link>
            <Link className="button button-outline button-lg" to="/ats-checker"><Target size={17} /> Check ATS score</Link>
          </div>
          <div className="hero-trust"><div className="avatar-stack"><span>A</span><span>M</span><span>J</span></div><span>Made for your next big step</span><span className="trust-separator">·</span><span><Check size={14} /> Free to start</span></div>
        </div>
        <div className="hero-visual" aria-label="Resume preview illustration">
          <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
          <div className="resume-mockup">
            <div className="mock-header"><span className="mock-avatar">JL</span><div><b>Jordan Lee</b><small>PRODUCT DESIGNER</small></div><span className="mock-download"><ArrowDownToLine size={15} /></span></div>
            <div className="mock-contact">jordan.lee@example.com　·　New York, NY</div>
            <div className="mock-section"><b>PROFILE</b><div className="mock-line long" /><div className="mock-line" /><div className="mock-line medium" /></div>
            <div className="mock-section"><b>EXPERIENCE</b><div className="mock-role"><strong>Product Designer</strong><span>2023 — Present</span></div><div className="mock-line long" /><div className="mock-line medium" /></div>
            <div className="mock-section"><b>SELECTED WORK</b><div className="mock-role"><strong>Fintech mobile redesign</strong><span>2024</span></div><div className="mock-line long" /></div>
            <div className="mock-section mock-skills"><b>CORE SKILLS</b><span>Figma</span><span>Research</span><span>Prototyping</span><span>Design systems</span></div>
            <div className="score-float"><span className="score-ring">86</span><span><b>Good match</b><small>Estimated ATS score</small></span><CheckCircle2 size={17} /></div>
          </div>
          <div className="hero-caption"><span className="caption-spark"><Sparkles size={15} /></span> Your story, made job-ready.</div>
        </div>
      </section>
      <section id="features" className="section-wrap feature-section">
        <div className="section-heading"><div className="eyebrow centered">EVERYTHING YOU NEED TO GET STARTED</div><h2>Make your next move<br />with <span>confidence.</span></h2><p>From the first draft to the final check, get the tools to put your best foot forward.</p></div>
        <div className="feature-grid">
          <FeatureCard icon={<FileText />} number="01" title="Build with clarity" text="Create a well-structured resume with helpful prompts, flexible sections, and a live preview." href="/builder" link="Explore the builder" />
          <FeatureCard icon={<Target />} number="02" title="Check your match" text="Compare your resume with a job description. See matched terms, missing keywords, and next steps." href="/ats-checker" link="Try the ATS checker" />
          <FeatureCard icon={<WandSparkles />} number="03" title="Make every word count" text="Use practical writing prompts to strengthen your summary and bring more clarity to your bullets." href="/builder" link="Improve your writing" />
        </div>
      </section>
      <section className="workflow-section">
        <div className="section-wrap workflow-inner">
          <div className="workflow-copy"><div className="eyebrow">SIMPLE BY DESIGN</div><h2>Three steps to a<br /><span>stronger application.</span></h2><p>No complicated setup. Start with what you have and improve it one step at a time.</p><Link to="/dashboard" className="text-link">Go to your dashboard <ArrowRight size={16} /></Link></div>
          <div className="steps">
            <Step number="01" icon={<FileText />} title="Tell your story" text="Add your education, projects, skills, and experience to a clean, guided editor." />
            <Step number="02" icon={<ListChecks />} title="Choose your look" text="Pick a professional template and see your changes update instantly." />
            <Step number="03" icon={<Target />} title="Tailor with confidence" text="Check your resume against a job description and download a print-ready PDF." />
          </div>
        </div>
      </section>
      <section className="benefits section-wrap">
        <div className="benefit-art"><div className="benefit-paper"><span className="paper-check"><Check size={19} /></span><span className="paper-title">Your experience, clearly told.</span><span className="paper-row" /><span className="paper-row short" /><span className="paper-row" /><span className="paper-tag">Saved automatically</span></div><div className="benefit-orbit"><Sparkles size={20} /></div></div>
        <div className="benefit-copy"><div className="eyebrow">A BETTER WAY TO BEGIN</div><h2>Good resumes start<br />with <span>your real story.</span></h2><p>ResumeAI helps you organize and present your experience. Your details stay on your device, and every suggestion is yours to review.</p><ul className="benefit-list"><li><CheckCircle2 /> Your drafts save as you work</li><li><CheckCircle2 /> No account or API key needed</li><li><CheckCircle2 /> Helpful estimates—not hiring promises</li></ul><Link className="button button-primary" to="/builder">Start building <ArrowRight size={16} /></Link></div>
      </section>
      <section className="faq-section"><div className="section-wrap"><div className="section-heading"><div className="eyebrow centered">GOOD TO KNOW</div><h2>Questions, <span>answered.</span></h2><p>A few things you might be wondering before you get started.</p></div><div className="faq-list">{faqs.map(([question, answer]) => <details className="faq-item" key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></div></section>
      <section id="about" className="closing-cta section-wrap"><div className="cta-spark"><Sparkles /></div><div><h2>Your next chapter starts here.</h2><p>Build a resume that sounds like you—and shows what you can do.</p></div><Link className="button button-white" to="/builder">Create your resume <ArrowRight size={17} /></Link></section>
    </main>
    <footer className="footer"><div className="section-wrap footer-inner"><Brand /><span>Thoughtful tools for your next opportunity.</span><div><Link to="/builder">Resume Builder</Link><Link to="/ats-checker">ATS Checker</Link><Link to="/dashboard">Dashboard</Link></div><small>© 2025 ResumeAI. Your story stays yours.</small></div></footer>
  </div>
}

function FeatureCard({ icon, number, title, text, href, link }: { icon: ReactNode; number: string; title: string; text: string; href: string; link: string }) {
  return <article className="feature-card"><div className="feature-top"><span className="feature-icon">{icon}</span><span>{number}</span></div><h3>{title}</h3><p>{text}</p><Link to={href}>{link} <ArrowRight size={15} /></Link></article>
}

function Step({ number, icon, title, text }: { number: string; icon: ReactNode; title: string; text: string }) {
  return <div className="step"><span className="step-number">{number}</span><span className="step-icon">{icon}</span><div><h3>{title}</h3><p>{text}</p></div></div>
}

function Dashboard() {
  const [resumes, setResumes] = useState(getResumes)
  const [analyses] = useState(getAnalyses)
  const navigate = useNavigate()
  const refresh = () => setResumes(getResumes())
  const create = () => navigate('/builder?new=1')
  const download = async (resume: Resume) => {
    navigate(`/builder?id=${encodeURIComponent(resume.id)}&download=1`)
  }
  const deleteItem = (id: string) => {
    if (window.confirm('Delete this resume draft? This cannot be undone.')) {
      deleteResume(id)
      refresh()
    }
  }
  return <AppShell><div className="page-heading dashboard-heading"><div><div className="eyebrow">YOUR WORKSPACE</div><h1>Welcome to your dashboard</h1><p>Pick up where you left off or start a fresh draft.</p></div><button className="button button-primary" onClick={create}><Plus size={17} /> Create new resume</button></div>
    <div className="stat-grid">
      <StatCard icon={<FileText />} label="Resumes created" value={resumes.length.toString()} note="Saved in this browser" />
      <StatCard icon={<Target />} label="ATS checks" value={analyses.length.toString()} note="Analysis history" />
      <StatCard icon={<BarChart3 />} label="Latest match score" value={analyses[0] ? `${analyses[0].score}%` : '—'} note={analyses[0]?.role ?? 'Run your first check'} />
    </div>
    <div className="dashboard-grid">
      <section className="panel resume-list-panel"><div className="panel-heading"><div><h2>Recent resumes</h2><p>Your drafts are saved on this device.</p></div><Link to="/builder">Open builder <ArrowRight size={14} /></Link></div>
        {resumes.length === 0 ? <div className="empty-state"><span className="empty-icon"><FileText /></span><h3>Your first draft starts here</h3><p>Create a resume to see it here. Your progress saves automatically in this browser.</p><button className="button button-primary" onClick={create}><Plus size={16} /> Create a resume</button></div> :
          <div className="resume-list">{resumes.slice(0, 5).map((resume) => <div className="resume-row" key={resume.id}><span className="resume-row-icon"><FileText size={19} /></span><div className="resume-row-info"><strong>{resume.personal.fullName || resume.name || 'Untitled resume'}</strong><span>{resume.personal.role || 'Role not added'} · Edited {new Date(resume.updatedAt).toLocaleDateString()}</span></div>          <span className="template-pill">{templateLabel(resume.template)}</span>{resume.isExample && <span className="example-pill">EXAMPLE</span>}<Link className="small-action" to={`/builder?id=${encodeURIComponent(resume.id)}`} aria-label="Continue editing"><FileText size={16} /></Link><button className="small-action" onClick={() => void download(resume)} aria-label="Download resume"><ArrowDownToLine size={16} /></button><button className="small-action danger-action" onClick={() => deleteItem(resume.id)} aria-label="Delete resume"><Trash2 size={16} /></button></div>)}</div>}
      </section>
      <section className="panel dashboard-side-panel"><div className="panel-heading"><div><h2>Recent ATS checks</h2><p>Use your results to refine each draft.</p></div><Link to="/ats-checker">New check <ArrowRight size={14} /></Link></div>
        {analyses.length ? <div className="analysis-list">{analyses.slice(0, 4).map((analysis) => <div className="analysis-row" key={analysis.id}><div className="analysis-mini-score">{analysis.score}</div><div><strong>{analysis.role}</strong><span>{analysis.fileName} · {new Date(analysis.createdAt).toLocaleDateString()}</span></div></div>)}</div> : <div className="empty-mini"><span className="mini-target"><Target size={18} /></span><p>No ATS checks yet. Compare a resume with your target job.</p><Link to="/ats-checker" className="button button-outline">Check a resume</Link></div>}
      </section>
    </div>
    <section className="panel skills-panel"><div className="skills-panel-icon"><Sparkles /></div><div><h2>Small improvements add up</h2><p>Try matching your skills to the language in a job post, then add specific outcomes to relevant project bullets.</p></div><Link to="/ats-checker" className="button button-outline">Get suggestions <ArrowRight size={15} /></Link></section>
    <p className="privacy-note"><CheckCircle2 size={15} /> Your resume content is stored in your browser only. It is not uploaded to a server.</p>
  </AppShell>
}

function StatCard({ icon, label, value, note }: { icon: ReactNode; label: string; value: string; note: string }) {
  return <div className="stat-card"><span className="stat-icon">{icon}</span><span className="stat-label">{label}</span><strong>{value}</strong><small>{note}</small></div>
}

function templateLabel(template: ResumeTemplate) {
  return template === 'modern' ? 'Modern' : template === 'minimal' ? 'Minimal' : 'Classic'
}

function BuilderPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const resumeId = searchParams.get('id')
  const isNew = searchParams.get('new') === '1'
  const [resume, setResume] = useState<Resume>(() => {
    const saved = resumeId ? getResumes().find((item) => item.id === resumeId) : undefined
    return saved ?? createSampleResume()
  })
  const [savedMessage, setSavedMessage] = useState('Saved to this device')
  const [showAssistant, setShowAssistant] = useState(false)
  const [printError, setPrintError] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isNew || !getResumes().some((item) => item.id === resume.id)) saveResume(resume)
    if (!resumeId || resumeId !== resume.id || isNew) setSearchParams({ id: resume.id }, { replace: true })
  }, [isNew, resume, resumeId, setSearchParams])

  const update = (next: Resume, markPersonalized = true) => {
    const saved = { ...next, isExample: markPersonalized ? false : resume.isExample, updatedAt: new Date().toISOString() }
    saveResume(saved)
    setResume(saved)
    setSavedMessage('Saved to this device')
  }
  const patch = (field: 'summary' | 'name', value: string) => update({ ...resume, [field]: value })
  const patchPersonal = (field: keyof Resume['personal'], value: string) => update({ ...resume, personal: { ...resume.personal, [field]: value } })
  const patchStringList = (field: 'technicalSkills' | 'softSkills' | 'certifications' | 'achievements', value: string) => update({ ...resume, [field]: value.split(',').map((item) => item.trim()).filter(Boolean) })
  const patchEntry = <T extends ExperienceEntry | EducationEntry>(field: 'education' | 'projects' | 'experience', index: number, key: keyof T, value: string) => {
    const list = [...resume[field]] as T[]
    list[index] = { ...list[index], [key]: value }
    update({ ...resume, [field]: list } as Resume)
  }
  const addEntry = (field: 'education' | 'projects' | 'experience') => {
    const blank = field === 'education'
      ? { degree: '', institution: '', dates: '', details: '' }
      : { role: '', organization: '', dates: '', details: '' }
    update({ ...resume, [field]: [...resume[field], blank] } as Resume)
  }
  const removeEntry = (field: 'education' | 'projects' | 'experience', index: number) => update({ ...resume, [field]: resume[field].filter((_, i) => i !== index) })

  const downloadPdf = () => {
    setPrintError('')
    if (!previewRef.current) {
      setPrintError('The resume preview is not ready yet. Please try again.')
      return
    }
    window.print()
  }

  useEffect(() => {
    if (searchParams.get('download') === '1') {
      const timer = window.setTimeout(() => {
        downloadPdf()
        searchParams.delete('download')
        setSearchParams(searchParams, { replace: true })
      }, 800)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [searchParams, setSearchParams])

  return <AppShell><div className="builder-heading page-heading"><div><Link className="back-link" to="/dashboard">← Back to dashboard</Link><h1>Resume builder</h1><p>{resume.isExample ? 'Example content is prefilled; replace it with your details. Changes save automatically.' : 'Your changes save automatically on this device.'}</p></div><div className="builder-heading-actions"><span className="save-status"><CheckCircle2 size={15} /> {savedMessage}</span><button className="button button-primary" onClick={() => void downloadPdf()}><ArrowDownToLine size={17} /> Download PDF</button></div></div>
    <div className="builder-toolbar"><div className="resume-name-control"><FileText size={16} /><input aria-label="Resume draft name" value={resume.name} onChange={(event) => patch('name', event.target.value)} /></div><div className="template-control"><span>Template</span>{(['classic', 'modern', 'minimal'] as ResumeTemplate[]).map((template) => <button key={template} onClick={() => update({ ...resume, template }, false)} className={`template-choice ${resume.template === template ? 'selected' : ''}`} aria-pressed={resume.template === template}>{templateLabel(template)}</button>)}</div><button className="assistant-toggle" onClick={() => setShowAssistant(!showAssistant)}><Sparkles size={16} /> Writing assistant</button></div>
    {printError && <div className="inline-error" role="alert">{printError}</div>}
    <div className="builder-layout">
      <div className="editor-column">
        <SectionCard icon={<BriefcaseBusiness />} title="Personal details" hint="Start with the details a recruiter needs to reach you.">
          <div className="form-grid"><Field label="Full name" value={resume.personal.fullName} onChange={(v) => patchPersonal('fullName', v)} placeholder="Your full name" /><Field label="Professional title" value={resume.personal.role} onChange={(v) => patchPersonal('role', v)} placeholder="e.g. BCA Graduate" /><Field label="Email" value={resume.personal.email} onChange={(v) => patchPersonal('email', v)} placeholder="you@example.com" type="email" /><Field label="Phone" value={resume.personal.phone} onChange={(v) => patchPersonal('phone', v)} placeholder="+91 00000 00000" /><Field label="Location" value={resume.personal.location} onChange={(v) => patchPersonal('location', v)} placeholder="City, Country" /><Field label="LinkedIn URL" value={resume.personal.linkedin} onChange={(v) => patchPersonal('linkedin', v)} placeholder="linkedin.com/in/you" /><Field label="GitHub URL" value={resume.personal.github} onChange={(v) => patchPersonal('github', v)} placeholder="github.com/you" /><Field label="Portfolio URL" value={resume.personal.portfolio} onChange={(v) => patchPersonal('portfolio', v)} placeholder="yourportfolio.com" /></div>
        </SectionCard>
        <SectionCard icon={<Quote />} title="Professional summary" hint="A short, specific introduction to what you bring."><textarea className="form-textarea" aria-label="Professional summary" rows={5} value={resume.summary} onChange={(event) => patch('summary', event.target.value)} placeholder="Summarize your background, strengths, and what you’re looking for." /><div className="field-footer"><span>{resume.summary.trim().split(/\s+/).filter(Boolean).length} words · Aim for 40–80</span>{showAssistant && <button className="inline-tool" onClick={() => patch('summary', improveText(resume.summary))}><WandSparkles size={14} /> Improve clarity</button>}</div></SectionCard>
        <EntrySection<EducationEntry> icon={<GraduationCap />} title="Education" hint="Your degrees, college, and relevant details." field="education" entries={resume.education} onAdd={() => addEntry('education')} onRemove={(i) => removeEntry('education', i)} onChange={(i, key, value) => patchEntry<EducationEntry>('education', i, key, value)} fields={[{ key: 'degree', label: 'Degree / course', placeholder: 'Bachelor of Computer Applications' }, { key: 'institution', label: 'Institution', placeholder: 'College or university' }, { key: 'dates', label: 'Dates', placeholder: '2022 – 2025' }, { key: 'details', label: 'Details', placeholder: 'Relevant coursework, GPA, or honors', multiline: true }]} />
        <ListFieldSection icon={<Sparkles />} title="Skills" hint="Separate skills with commas." sections={[{ label: 'Technical skills', value: resume.technicalSkills, field: 'technicalSkills', placeholder: 'React, SQL, JavaScript, Git' }, { label: 'Soft skills', value: resume.softSkills, field: 'softSkills', placeholder: 'Communication, teamwork, problem solving' }]} onChange={patchStringList} />
        <EntrySection<ExperienceEntry> icon={<BriefcaseBusiness />} title="Projects" hint="Show what you built and the tools you used." field="projects" entries={resume.projects} onAdd={() => addEntry('projects')} onRemove={(i) => removeEntry('projects', i)} onChange={(i, key, value) => patchEntry<ExperienceEntry>('projects', i, key, value)} fields={[{ key: 'role', label: 'Project name', placeholder: 'Project title' }, { key: 'organization', label: 'Context', placeholder: 'Personal, college, or team project' }, { key: 'dates', label: 'Dates', placeholder: '2025' }, { key: 'details', label: 'What you did', placeholder: 'Describe your contribution, tools, and outcome.', multiline: true }]} />
        <EntrySection<ExperienceEntry> icon={<BriefcaseBusiness />} title="Internships & experience" hint="Include internships, part-time roles, and relevant work." field="experience" entries={resume.experience} onAdd={() => addEntry('experience')} onRemove={(i) => removeEntry('experience', i)} onChange={(i, key, value) => patchEntry<ExperienceEntry>('experience', i, key, value)} fields={[{ key: 'role', label: 'Role', placeholder: 'Intern / Job title' }, { key: 'organization', label: 'Organization', placeholder: 'Company name' }, { key: 'dates', label: 'Dates', placeholder: 'Jun 2024 – Aug 2024' }, { key: 'details', label: 'Responsibilities & outcomes', placeholder: 'Describe your work accurately, with specific outcomes.', multiline: true }]} />
        <ListFieldSection icon={<Award />} title="Certifications & achievements" hint="Include relevant certificates, awards, or accomplishments." sections={[{ label: 'Certifications', value: resume.certifications, field: 'certifications', placeholder: 'Certification title, Issuer' }, { label: 'Achievements', value: resume.achievements, field: 'achievements', placeholder: 'Award, result, or recognition' }]} onChange={patchStringList} />
        {showAssistant && <WritingAssistant resume={resume} onSummaryChange={(value) => patch('summary', value)} onBulletsChange={(section, index, value) => {
          if (section === 'projects') update({ ...resume, projects: resume.projects.map((item, itemIndex) => itemIndex === index ? { ...item, details: value } : item) })
          else update({ ...resume, experience: resume.experience.map((item, itemIndex) => itemIndex === index ? { ...item, details: value } : item) })
        }} />}
      </div>
      <div className="preview-column"><div className="preview-sticky"><div className="preview-label"><span><span className="live-dot" /> LIVE PREVIEW</span><span>A4 · One-page friendly</span></div><ResumePreview resume={resume} innerRef={previewRef} /><div className="preview-footnote"><Printer size={14} /> Tip: keep bullets concise for a clean one-page resume.</div></div></div>
    </div>
  </AppShell>
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <label className="field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>
}

function SectionCard({ icon, title, hint, children }: { icon: ReactNode; title: string; hint: string; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  return <section className="editor-card"><div className="editor-card-head"><span className="editor-icon">{icon}</span><div><h2>{title}</h2><p>{hint}</p></div><button className={`collapse-button ${collapsed ? 'is-collapsed' : ''}`} aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${title}`} aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}><ChevronDown size={16} /></button></div>{!collapsed && <div className="editor-card-body">{children}</div>}</section>
}

interface EntryField<T> { key: keyof T & string; label: string; placeholder: string; multiline?: boolean }

function EntrySection<T extends ExperienceEntry | EducationEntry>({ icon, title, hint, field, entries, onAdd, onRemove, onChange, fields }: {
  icon: ReactNode; title: string; hint: string; field: string; entries: T[]; onAdd: () => void; onRemove: (index: number) => void;
  onChange: (index: number, key: keyof T & string, value: string) => void; fields: EntryField<T>[]
}) {
  return <SectionCard icon={icon} title={title} hint={hint}><div className="entry-stack">{entries.map((entry, index) => <div className="entry-card" key={`${field}-${index}`}><div className="entry-card-top"><span>{title === 'Education' ? `Education ${index + 1}` : `${title.slice(0, -1)} ${index + 1}`}</span><button className="remove-entry" onClick={() => onRemove(index)} aria-label={`Remove ${title.toLowerCase()} entry`}><Trash2 size={14} /> Remove</button></div><div className="form-grid">{fields.map((item) => <label className={`field ${item.multiline ? 'field-full' : ''}`} key={item.key}><span>{item.label}</span>{item.multiline ? <textarea rows={3} value={String(entry[item.key] ?? '')} onChange={(event) => onChange(index, item.key, event.target.value)} placeholder={item.placeholder} /> : <input value={String(entry[item.key] ?? '')} onChange={(event) => onChange(index, item.key, event.target.value)} placeholder={item.placeholder} />}</label>)}</div></div>)}</div><button className="add-entry" onClick={onAdd}><Plus size={16} /> Add {title === 'Education' ? 'education' : title === 'Projects' ? 'project' : 'experience'}</button></SectionCard>
}

function ListFieldSection({ icon, title, hint, sections, onChange }: {
  icon: ReactNode; title: string; hint: string;
  sections: { label: string; value: string[]; field: 'technicalSkills' | 'softSkills' | 'certifications' | 'achievements'; placeholder: string }[];
  onChange: (field: 'technicalSkills' | 'softSkills' | 'certifications' | 'achievements', value: string) => void
}) {
  return <SectionCard icon={icon} title={title} hint={hint}><div className="form-grid">{sections.map((section) => <label className="field field-full" key={section.field}><span>{section.label}</span><input value={section.value.join(', ')} onChange={(event) => onChange(section.field, event.target.value)} placeholder={section.placeholder} /></label>)}</div></SectionCard>
}

function ResumePreview({ resume, innerRef }: { resume: Resume; innerRef: React.RefObject<HTMLDivElement> }) {
  const p = resume.personal
  const hasLinks = p.linkedin || p.github || p.portfolio
  return <article ref={innerRef} className={`resume-paper template-${resume.template}`}>
    <header className="paper-header"><h2>{p.fullName || 'Your Name'}</h2><p className="paper-role">{p.role || 'Your professional title'}</p><p className="paper-contact">{[p.email, p.phone, p.location].filter(Boolean).join('  |  ')}</p>{hasLinks && <p className="paper-contact">{[p.linkedin, p.github, p.portfolio].filter(Boolean).join('  |  ')}</p>}</header>
    {resume.summary && <ResumePart title="Professional Summary"><p className="paper-body">{resume.summary}</p></ResumePart>}
    {resume.technicalSkills.length + resume.softSkills.length > 0 && <ResumePart title="Skills"><p className="paper-body">{[...resume.technicalSkills, ...resume.softSkills].join('  ·  ')}</p></ResumePart>}
    {resume.education.length > 0 && <ResumePart title="Education">{resume.education.map((item, i) => <PaperEntry key={`edu-${i}`} title={item.degree} subtitle={item.institution} dates={item.dates} details={item.details} />)}</ResumePart>}
    {resume.experience.length > 0 && <ResumePart title="Experience">{resume.experience.map((item, i) => <PaperEntry key={`exp-${i}`} title={item.role} subtitle={item.organization} dates={item.dates} details={item.details} />)}</ResumePart>}
    {resume.projects.length > 0 && <ResumePart title="Projects">{resume.projects.map((item, i) => <PaperEntry key={`project-${i}`} title={item.role} subtitle={item.organization} dates={item.dates} details={item.details} />)}</ResumePart>}
    {resume.certifications.length > 0 && <ResumePart title="Certifications"><p className="paper-body">{resume.certifications.join(' · ')}</p></ResumePart>}
    {resume.achievements.length > 0 && <ResumePart title="Achievements"><p className="paper-body">{resume.achievements.join(' · ')}</p></ResumePart>}
  </article>
}

function ResumePart({ title, children }: { title: string; children: ReactNode }) {
  return <section className="paper-section"><h3>{title}</h3>{children}</section>
}

function PaperEntry({ title, subtitle, dates, details }: { title: string; subtitle: string; dates: string; details: string }) {
  return <div className="paper-entry"><div className="paper-entry-heading"><strong>{title}</strong><span>{dates}</span></div>{subtitle && <p className="paper-subtitle">{subtitle}</p>}{details && <p className="paper-body">{details}</p>}</div>
}

function improveText(input: string) {
  return input.trim().replace(/\s+/g, ' ').replace(/\b(i|i'm|i've)\b/g, (match) => match.toUpperCase())
    .replace(/\bworked on\b/gi, 'contributed to').replace(/\bresponsible for\b/gi, 'supported')
    .replace(/(^\w|[.!?]\s+\w)/g, (match) => match.toUpperCase())
    .replace(/([a-z])([.!?])?$/, (_match, letter: string, punctuation: string | undefined) => `${letter}${punctuation ?? '.'}`)
}

function WritingAssistant({ resume, onSummaryChange, onBulletsChange }: { resume: Resume; onSummaryChange: (value: string) => void; onBulletsChange: (section: 'projects' | 'experience', index: number, value: string) => void }) {
  const [jobDescription, setJobDescription] = useState('')
  const keywords = jobDescription.trim() ? extractKeywords(jobDescription).slice(0, 12) : []
  const projectIndex = resume.projects.findIndex((item) => item.details.trim())
  const experienceIndex = resume.experience.findIndex((item) => item.details.trim())
  const bulletSection = projectIndex >= 0 ? 'projects' : 'experience'
  const bulletIndex = projectIndex >= 0 ? projectIndex : experienceIndex
  const bulletText = bulletIndex >= 0 ? resume[bulletSection][bulletIndex].details : ''
  const role = jobDescription.match(/(?:job title|position|role)\s*[:\-]\s*([^\n,.]+)/i)?.[1]?.trim() || resume.personal.role || 'your target role'
  return <section className="assistant-card"><div className="assistant-title"><span><Sparkles size={17} /></span><div><h2>Writing assistant</h2><p>Practical prompts that keep your experience truthful.</p></div></div>
    <div className="assistant-tool"><h3>Polish your summary</h3><p>Clean up wording and grammar without adding new claims.</p><button className="inline-tool" disabled={!resume.summary.trim()} onClick={() => onSummaryChange(improveText(resume.summary))}><WandSparkles size={14} /> Improve summary</button></div>
    <div className="assistant-tool"><h3>Refine a project or experience bullet</h3><p>Preserves your facts while tightening the language.</p><button className="inline-tool" disabled={!bulletText} onClick={() => onBulletsChange(bulletSection, bulletIndex, improveText(bulletText))}><WandSparkles size={14} /> {bulletIndex < 0 ? 'Add a project or experience first' : `Refine first ${bulletSection === 'projects' ? 'project' : 'experience'}`}</button></div>
    <div className="assistant-tool"><label htmlFor="assistant-job"><h3>Find job keywords</h3></label><textarea id="assistant-job" className="form-textarea" rows={3} value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste a job description to identify relevant terms." />{keywords.length > 0 && <div className="keyword-tags">{keywords.map((keyword) => <span className={resume.technicalSkills.some((skill) => skill.toLowerCase() === keyword) ? 'matched' : ''} key={keyword}>{keyword}</span>)}</div>}</div>
    <div className="assistant-tool"><h3>Interview warm-up</h3><p>Think through these questions for <strong>{role}</strong>:</p><ol className="question-list"><li>{keywords[0] ? `How have you used ${keywords[0]} in a project, and what was the result?` : `Which project best shows your fit for ${role}?`}</li><li>{keywords[1] ? `How would you apply ${keywords[1]} to a challenge in this role?` : 'Which skills from the job description are you most confident applying?'}</li><li>What would you like to learn or contribute in this role?</li></ol></div>
  </section>
}

async function extractResumeText(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension === 'pdf') {
    const pdfjs = await import('pdfjs-dist')
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
    const pages: string[] = []
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      const content = await page.getTextContent()
      pages.push(content.items.map((item) => 'str' in item ? item.str : '').join(' '))
    }
    const text = pages.join('\n')
    if (!text.trim()) throw new Error('This PDF contains no selectable text. Try a text-based PDF or a DOCX file.')
    return text
  }
  if (extension === 'docx') {
    const { default: mammoth } = await import('mammoth')
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
    if (!result.value.trim()) throw new Error('No readable text was found in this DOCX file.')
    return result.value
  }
  throw new Error('Unsupported format. Choose a PDF or DOCX file.')
}

function AtsCheckerPage() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null)
  const [history, setHistory] = useState(getAnalyses)
  const [error, setError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    setError('')
    const selected = event.target.files?.[0]
    event.target.value = ''
    if (!selected) return
    const extension = selected.name.split('.').pop()?.toLowerCase()
    if (!['pdf', 'docx'].includes(extension ?? '')) {
      setError('Unsupported file. Please choose a PDF or DOCX resume.')
      return
    }
    if (selected.size > 8 * 1024 * 1024) {
      setError('This file is larger than 8 MB. Choose a smaller PDF or DOCX file.')
      return
    }
    setFile(selected)
    setResumeText('')
    setAnalysis(null)
  }

  const runAnalysis = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setAnalysis(null)
    if (!file) {
      setError('Upload a PDF or DOCX resume to continue.')
      return
    }
    if (!jobDescription.trim()) {
      setError('Paste a job description so we can compare the resume with it.')
      return
    }
    setIsAnalyzing(true)
    try {
      const text = await extractResumeText(file)
      setResumeText(text)
      const result = analyzeResume(text, jobDescription, file.name)
      setAnalysis(result)
      saveAnalysis(result)
      setHistory(getAnalyses())
    } catch (cause) {
      console.error('Resume extraction or analysis failed', cause)
      setError(cause instanceof Error ? cause.message : 'We could not read this file. Try another PDF or DOCX document.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const words = jobDescription.trim().split(/\s+/).filter(Boolean).length
  return <AppShell><div className="page-heading ats-heading"><div><div className="eyebrow">A SMARTER SECOND LOOK</div><h1>ATS resume checker</h1><p>See how your resume lines up with a specific job description.</p></div><div className="estimate-note"><span><Target size={17} /></span><div><strong>Always an estimate</strong><small>Not an employer ATS or hiring prediction</small></div></div></div>
    <div className="ats-layout"><form className="panel ats-form" onSubmit={(event) => void runAnalysis(event)} noValidate>
      <div className="panel-heading"><div><h2>Compare your resume</h2><p>Your files are processed locally in this browser.</p></div><span className="private-chip"><CheckCircle2 size={13} /> Private</span></div>
      <label className={`upload-zone ${file ? 'has-file' : ''}`} htmlFor="resume-file"><input id="resume-file" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFile} /><span className="upload-icon">{file ? <FileCheck2 /> : <Upload />}</span>{file ? <><strong>{file.name}</strong><span>{(file.size / 1024 / 1024).toFixed(2)} MB · Click to replace</span></> : <><strong>Choose your resume file</strong><span>PDF or DOCX · Maximum 8 MB</span><span className="upload-browse">Browse files</span></>}<Upload className="upload-corner" size={16} /></label>
      <label className="field job-description-field" htmlFor="job-description"><span>Job description</span><textarea id="job-description" className="form-textarea" rows={11} value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description here. We’ll compare its recurring terms with the text in your resume." /><small>{words} words · Add the full description for a more useful comparison.</small></label>
      {error && <div className="inline-error" role="alert">{error}</div>}
      <button type="submit" className="button button-primary analyze-button" disabled={isAnalyzing}>{isAnalyzing ? <><span className="spinner" /> Reading your file…</> : <><Sparkles size={17} /> Analyze resume</>}</button>
      <p className="scoring-note"><LockIcon /> Files are not uploaded. Scoring method: 70% keyword overlap, 20% section presence, 10% text detail.</p>
    </form>
    <div className="ats-results">{analysis ? <AnalysisResult analysis={analysis} resumeText={resumeText} /> : <div className="panel result-placeholder"><span className="result-placeholder-icon"><BarChart3 /></span><h2>Your results will appear here</h2><p>Upload a resume and paste a target job description to see an estimated match score, keywords, and practical suggestions.</p><div className="placeholder-points"><span><CheckCircle2 /> Keyword overlap</span><span><CheckCircle2 /> Key resume sections</span><span><CheckCircle2 /> Prioritized next steps</span></div></div>}
      {history.length > 0 && <section className="panel ats-history"><div className="panel-heading"><div><h2>Recent checks</h2><p>Saved in this browser.</p></div><span className="history-count">{history.length}</span></div>{history.slice(0, 3).map((item) => <div className="analysis-row" key={item.id}><div className="analysis-mini-score">{item.score}</div><div><strong>{item.role}</strong><span>{item.fileName} · {new Date(item.createdAt).toLocaleDateString()}</span></div></div>)}</section>}
    </div></div>
  </AppShell>
}

function LockIcon() { return <CheckCircle2 size={14} /> }

function AnalysisResult({ analysis, resumeText }: { analysis: AtsAnalysis; resumeText: string }) {
  const strength = analysis.matchedKeywords.length > 0
    ? `Your resume includes ${analysis.matchedKeywords.slice(0, 4).join(', ')}${analysis.matchedKeywords.length > 4 ? ` and ${analysis.matchedKeywords.length - 4} other matching terms` : ''}.`
    : 'This resume did not include any of the selected job description keywords. That may reflect wording differences rather than a lack of ability.'
  return <section className="panel analysis-result">
    <div className="analysis-result-head"><div><span className="result-overline">ESTIMATED COMPATIBILITY</span><h2>Resume match</h2></div><span className="estimate-badge">Estimate only</span></div>
    <div className="score-display"><span className={`score-circle ${analysis.score >= 70 ? 'score-high' : analysis.score >= 45 ? 'score-mid' : 'score-low'}`}><strong>{analysis.score}</strong><small>/100</small></span><div><strong>{analysis.score >= 70 ? 'Strong keyword alignment' : analysis.score >= 45 ? 'Room to improve' : 'Needs more tailoring'}</strong><p>Based on the provided resume text and job description.</p></div></div>
    <div className="progress-track" role="progressbar" aria-label="Estimated compatibility score" aria-valuenow={analysis.score} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${analysis.score}%` }} /></div>
    <div className="score-breakdown"><span><i className="dot-blue" /> Keyword overlap <strong>70% weight</strong></span><span><i className="dot-purple" /> Key sections <strong>20% weight</strong></span><span><i className="dot-gray" /> Text detail <strong>10% weight</strong></span></div>
    <div className="result-block"><div className="result-block-title"><h3>Keywords</h3><span>{analysis.matchedKeywords.length} matched · {analysis.missingKeywords.length} missing</span></div>
      {analysis.matchedKeywords.length > 0 && <div className="keyword-group"><small>MATCHED</small><div className="keyword-tags">{analysis.matchedKeywords.map((keyword) => <span className="matched" key={keyword}><Check size={12} /> {keyword}</span>)}</div></div>}
      {analysis.missingKeywords.length > 0 && <div className="keyword-group"><small>MAY BE WORTH ADDING</small><div className="keyword-tags">{analysis.missingKeywords.slice(0, 12).map((keyword) => <span className="missing" key={keyword}>{keyword}</span>)}</div><p className="keyword-caveat">Only include a term if it accurately describes your skills or experience.</p></div>}
      {analysis.matchedKeywords.length === 0 && analysis.missingKeywords.length === 0 && <p className="muted-copy">No recurring keywords could be identified. Try including the full job description.</p>}
    </div>
    <div className="result-block"><div className="result-block-title"><h3>Important sections</h3><span>{analysis.sections.filter((section) => section.found).length} of 4 detected</span></div><div className="section-checks">{analysis.sections.map((section) => <span className={section.found ? 'section-found' : 'section-missing'} key={section.name}>{section.found ? <CheckCircle2 size={15} /> : <X size={15} />}{section.name}</span>)}</div></div>
    <div className="strength-card"><span><Award size={17} /></span><div><strong>What’s working</strong><p>{strength}</p></div></div>
    <div className="result-block recommendations"><h3>Prioritized suggestions</h3><ol>{analysis.recommendations.map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol></div>
    <p className="result-disclaimer"><FileCheck2 size={14} /> Rule-based estimate only. Employers use different systems, and this score does not predict screening or hiring outcomes. Checked {resumeText.trim().split(/\s+/).filter(Boolean).length.toLocaleString()} resume words.</p>
  </section>
}

function AboutPage() {
  return <AppShell><div className="page-heading"><div><div className="eyebrow">ABOUT RESUMEAI</div><h1>Your story deserves a clear start.</h1><p>A beginner-friendly resume toolkit for students and early-career job seekers.</p></div></div><div className="panel about-panel"><h2>Built to help you get started</h2><p>ResumeAI brings together a guided resume editor, professional templates, browser-based PDF export, and a transparent keyword checker. It’s designed for a practical project demonstration: every core flow works without sign-up, paid services, or an AI API.</p><div className="about-cards"><div><FileCheck2 /><strong>Local-first by default</strong><span>Drafts and analysis history live in your browser’s local storage.</span></div><div><Target /><strong>Clear scoring rules</strong><span>ATS estimates use visible, explainable rules—not random predictions.</span></div><div><Sparkles /><strong>Honest writing help</strong><span>Rule-based refinements improve clarity without inventing qualifications.</span></div></div><Link className="button button-primary" to="/builder">Start building <ArrowRight size={16} /></Link></div></AppShell>
}

function NotFound() {
  return <AppShell><div className="panel empty-state"><h2>Page not found</h2><p>The page you’re looking for doesn’t exist.</p><Link className="button button-primary" to="/">Back home</Link></div></AppShell>
}

export default function App() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/builder" element={<BuilderPage />} />
    <Route path="/ats-checker" element={<AtsCheckerPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
}
