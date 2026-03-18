import api from "../utils/api"
import { Exam, Question, QuestionDraft, Assignment, AssignResult, LeaderboardEntry, Submission, User } from "../../types"

export interface ExamPayload {
  title: string
  total_questions: number
  start_time: string
  end_time: string
  duration_minutes: number
}

export interface BulkQuestionsPayload {
  questions: QuestionDraft[]
}

export interface AssignPayload {
  student_emails: string[]
}

export interface CorrectAnswerPayload {
  correct_answer: string
}

// Exams
export const createExam   = (data: ExamPayload)                                          => api.post<Exam>("/api/admin/exams", data)
export const getExams     = ()                                                            => api.get<Exam[]>("/api/admin/exams")
export const searchExams  = (q: string)                                                  => api.get<Exam[]>(`/api/admin/exams/search?q=${q}`)
export const getExam      = (id: number | string)                                        => api.get<Exam>(`/api/admin/exams/${id}`)
export const updateExam   = (id: number | string, data: Partial<ExamPayload> & { is_active?: boolean }) => api.put<Exam>(`/api/admin/exams/${id}`, data)
export const deleteExam   = (id: number | string)                                        => api.delete(`/api/admin/exams/${id}`)

// Questions
export const addQuestions        = (examId: number | string, data: BulkQuestionsPayload) => api.post<Question[]>(`/api/admin/exams/${examId}/questions`, data)
export const getQuestions        = (examId: number | string)                             => api.get<Question[]>(`/api/admin/exams/${examId}/questions`)
export const updateCorrectAnswer = (qId: number | string, data: CorrectAnswerPayload)   => api.patch<Question>(`/api/admin/questions/${qId}/answer`, data)

// Assign
export const assignExam    = (examId: number | string, data: AssignPayload) => api.post<AssignResult[]>(`/api/admin/exams/${examId}/assign`, data)
export const getCandidates = (examId: number | string)                      => api.get<Assignment[]>(`/api/admin/exams/${examId}/candidates`)

// Results
export const getAllResults   = ()                         => api.get<Submission[]>("/api/admin/results")
export const getLeaderboard = (examId: number | string)  => api.get<LeaderboardEntry[]>(`/api/admin/exams/${examId}/leaderboard`)
export const getStudents    = ()                         => api.get<User[]>("/api/admin/students")