import api from "../utils/api"
import { User } from "../../types"

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

export const register  = (data: RegisterPayload) => api.post<User>("/api/auth/register", data)
export const loginUser = (data: LoginPayload)    => api.post<LoginResponse>("/api/auth/login", data)
export const getMe     = ()                      => api.get<User>("/api/auth/me")