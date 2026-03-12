import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/shared/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentDashboard from './pages/student/StudentDashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path='/'         element={<Navigate to='/login' replace />} />
          <Route path='/login'    element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* Protected — Admin only */}
          <Route
            path='/admin'
            element={
              <ProtectedRoute role='admin'>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected — Student only */}
          <Route
            path='/student'
            element={
              <ProtectedRoute role='student'>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}