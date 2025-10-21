// Shared domain types for Enmamar

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Topic {
  topic_id: string
  title: string
  description: string | null
  difficulty: Difficulty
  categories?: Category[]
}

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'

export interface Progress {
  user_id: string
  topic_id: string
  status: ProgressStatus
  score: number | null
  updated_at: string
}

export interface QuizItem {
  question: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  answer: 'A' | 'B' | 'C' | 'D'
  explanation?: string
}

export interface Category {
  category_id: string
  slug: string
  name: string
  description: string | null
}

export interface Course {
  course_id: string
  slug: string
  title: string
  description: string | null
  level: Difficulty
  topics?: Topic[]
}
