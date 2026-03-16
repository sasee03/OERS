import { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface Props {
  children: ReactNode
  role: "admin" | "student"
}

export default function ProtectedRoute({ children, role }: Props) {
  const { token, user } = useAuth()

  if (!token) return <Navigate to="/login" replace />
  if (user?.role !== role) return <Navigate to="/login" replace />

  return <>{children}</>
}