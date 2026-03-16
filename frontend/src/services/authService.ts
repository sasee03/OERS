import api from '../utils/api'
export interface RegisterPayload {
  username: string
  email: string
  password: string
  role: "admin" | "student"
}
 
export interface LoginPayload {
  username: string
  password: string
}
 
export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}
export const register  = (data) => api.post('/api/auth/register', data)
export const loginUser = (data) => api.post('/api/auth/login',    data)
export const getMe     = ()     => api.get('/api/auth/me')
