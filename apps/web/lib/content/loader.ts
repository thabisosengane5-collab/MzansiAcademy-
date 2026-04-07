import type { Course, Subject, SubjectMeta, QuizQuestion } from './types'

export async function loadSubjects(): Promise<Subject[]> {
  const data = await import('@/content/subjects.json')
  return data.default as Subject[]
}

export async function loadSubjectMeta(): Promise<Record<string, SubjectMeta>> {
  const data = await import('@/content/subject-meta.json')
  return data.default as Record<string, SubjectMeta>
}

export async function loadCourse(subjectId: string): Promise<Course | null> {
  try {
    const res = await fetch(`/api/course/${subjectId}`)
    if (!res.ok) return null
    return await res.json()
  } catch { return null }
}

export async function loadQBank(subjectId: string): Promise<QuizQuestion[]> {
  try {
    const res = await fetch(`/api/qbank/${subjectId}`)
    if (!res.ok) return []
    return await res.json()
  } catch { return [] }
}
