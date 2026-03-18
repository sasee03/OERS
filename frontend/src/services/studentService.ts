import api from "../utils/api"
import { Exam, Question, Submission, LeaderboardEntry } from "../../types"

export interface SubmitPayload {
  answers: Record<number, string>
}

export const getActiveExams    = ()                       => api.get<Exam[]>("/api/student/exams/active")
export const getScheduledExams = ()                       => api.get<Exam[]>("/api/student/exams/scheduled")
export const searchExams       = (q: string)             => api.get<Exam[]>(`/api/student/exams/search?q=${q}`)
export const getExam           = (id: number | string)   => api.get<Exam>(`/api/student/exams/${id}`)
export const getSubmission = (examId: number | string)   =>api.get<Submission>(`/api/student/exams/${examId}/submission`)
export const startExam    = (examId: number | string)                     => api.post<Submission>(`/api/student/exams/${examId}/start`)
export const getQuestions = (examId: number | string)                     => api.get<Question[]>(`/api/student/exams/${examId}/questions`)
export const submitExam   = (examId: number | string, data: SubmitPayload) => api.post<Submission>(`/api/student/exams/${examId}/submit`, data)

export const getMyScore     = (examId: number | string) => api.get<Submission>(`/api/student/exams/${examId}/score`)
export const getMyResults   = ()                        => api.get<Submission[]>("/api/student/results")
export const getLeaderboard = (examId: number | string) => api.get<LeaderboardEntry[]>(`/api/student/exams/${examId}/leaderboard`)