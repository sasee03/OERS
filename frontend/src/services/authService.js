import api from '../utils/api'

export const register  = (data) => api.post('/api/auth/register', data)
export const loginUser = (data) => api.post('/api/auth/login',    data)
export const getMe     = ()     => api.get('/api/auth/me')
