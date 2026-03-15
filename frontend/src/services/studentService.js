import api from '../utils/api'

// Exam listing
export const getActiveExams    = ()    => api.get('/api/student/exams/active')
export const getScheduledExams = ()    => api.get('/api/student/exams/scheduled')
export const searchExams       = (q)   => api.get(`/api/student/exams/search?q=${q}`)
export const getExam           = (id)  => api.get(`/api/student/exams/${id}`)

// Attempt
export const startExam    = (examId)       => api.post(`/api/student/exams/${examId}/start`)
export const getQuestions = (examId)       => api.get(`/api/student/exams/${examId}/questions`)
export const submitExam   = (examId, data) => api.post(`/api/student/exams/${examId}/submit`, data)

// Results
export const getMyScore     = (examId) => api.get(`/api/student/exams/${examId}/score`)
export const getMyResults   = ()       => api.get('/api/student/results')
export const getLeaderboard = (examId) => api.get(`/api/student/exams/${examId}/leaderboard`)
