import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuth()

  // Not logged in → send to login page
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  // Logged in but wrong role → send to their own dashboard
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/student'} replace />
  }

  return children
}