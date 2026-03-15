import api from '../utils/api'

// Exams
export const createExam  = (data)        => api.post('/api/admin/exams', data)
export const getExams    = ()            => api.get('/api/admin/exams')
export const searchExams = (q)           => api.get(`/api/admin/exams/search?q=${q}`)
export const getExam     = (id)          => api.get(`/api/admin/exams/${id}`)
export const updateExam  = (id, data)    => api.put(`/api/admin/exams/${id}`, data)
export const deleteExam  = (id)          => api.delete(`/api/admin/exams/${id}`)

// Questions
export const addQuestions       = (examId, data) => api.post(`/api/admin/exams/${examId}/questions`, data)
export const getQuestions       = (examId)       => api.get(`/api/admin/exams/${examId}/questions`)
export const updateCorrectAnswer= (qId, data)    => api.patch(`/api/admin/questions/${qId}/answer`, data)

// Assign
export const assignExam     = (examId, data) => api.post(`/api/admin/exams/${examId}/assign`, data)
export const getCandidates  = (examId)       => api.get(`/api/admin/exams/${examId}/candidates`)

// Results
export const getAllResults   = ()       => api.get('/api/admin/results')
export const getLeaderboard = (examId) => api.get(`/api/admin/exams/${examId}/leaderboard`)
export const getStudents    = ()       => api.get('/api/admin/students')
