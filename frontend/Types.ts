export interface User {
  id: number
  username: string
  email: string
  role: "admin" | "student"
}

export interface Exam {
  id: number
  title: string
  total_questions: number
  start_time: string
  end_time: string
  created_by: number
  is_active: boolean
  created_at: string
}

export interface Question {
  id: number
  exam_id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer?: string
  order_number?: number
}

export interface QuestionDraft {
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  order_number?: number
}

export interface Submission {
  id: number
  exam_id: number
  student_id: number
  score: number
  total_marks: number
  percentage: number
  is_completed: boolean
  started_at: string
  submitted_at: string | null
  exam_title?: string
}

export interface LeaderboardEntry {
  rank: number
  student_id: number
  username: string
  score: number
  total_marks: number
  percentage: number
  time_taken: string
}

export interface Assignment {
  id: number
  exam_id: number
  student_id: number | null
  student_email: string
  assigned_at: string
  status: string
}

export interface AssignResult {
  email: string
  status: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: boolean
}