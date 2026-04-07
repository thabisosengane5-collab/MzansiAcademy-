export interface Subject {
  id: string
  label: string
  icon: string
  color: string
}

export interface SubjectMeta {
  grades: number[]
  desc: string
}

export interface Concept {
  type: 'green' | 'teal' | 'gold' | 'red'
  title: string
  body: string
}

export interface KeyTerm {
  word: string
  definition: string
}

export interface Topic {
  title: string
  emoji?: string
  subtitle?: string
  intro?: string
  concepts?: Concept[]
  keyterms?: KeyTerm[]
  formula?: string
  callout?: { title: string; body: string }
  activity?: string
  examTip?: string
  illustration?: string | null
}

export interface Module {
  id: string
  title: string
  icon: string
  topics: Topic[]
}

export interface Course {
  id: string
  title: string
  icon: string
  color: string
  modules: Module[]
}

export interface QuizQuestion {
  q: string
  opts: string[]
  a: number
  em: string
  et: string
}
