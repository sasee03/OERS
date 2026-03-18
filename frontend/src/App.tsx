import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

import Login    from "./pages/Login"
import Register from "./pages/Register"

import AdminDashboard   from "./pages/admin/AdminDashboard"
import CreateExam       from "./pages/admin/CreateExam"
import AddQuestions     from "./pages/admin/AddQuestions"
import ModifyExam       from "./pages/admin/ModifyExam"
import AdminLeaderboard from "./pages/admin/AdminLeaderboard"
import Results          from "./pages/admin/Results"
import Students         from "./pages/admin/Students"


import StudentDashboard from "./pages/student/StudentDashboard"
import ExamNote         from "./pages/student/ExamNote"
import AttemptExam      from "./pages/student/AttemptExam"
import ScoreLeaderboard from "./pages/student/ScoreLeaderboard"
import AdminExams from "./pages/admin/AdminExam"

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<Navigate to="/login" replace />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin"                          element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/exams"                    element={<ProtectedRoute role="admin"><AdminExams /></ProtectedRoute>} />
          <Route path="/admin/exams/create"             element={<ProtectedRoute role="admin"><CreateExam /></ProtectedRoute>} />
          <Route path="/admin/exams/:id/questions"      element={<ProtectedRoute role="admin"><AddQuestions /></ProtectedRoute>} />
          <Route path="/admin/exams/:id/modify"         element={<ProtectedRoute role="admin"><ModifyExam /></ProtectedRoute>} />
          <Route path="/admin/exams/:id/leaderboard"    element={<ProtectedRoute role="admin"><AdminLeaderboard /></ProtectedRoute>} />
          <Route path="/admin/results"                  element={<ProtectedRoute role="admin"><Results /></ProtectedRoute>} />
          <Route path="/admin/students"                 element={<ProtectedRoute role="admin"><Students /></ProtectedRoute>} />

          <Route path="/student"                        element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/exams/:id/note"         element={<ProtectedRoute role="student"><ExamNote /></ProtectedRoute>} />
          <Route path="/student/exams/:id/attempt"      element={<ProtectedRoute role="student"><AttemptExam /></ProtectedRoute>} />
          <Route path="/student/exams/:id/score"        element={<ProtectedRoute role="student"><ScoreLeaderboard initialTab="score"/></ProtectedRoute>} />
          <Route path="/student/exams/:id/leaderboard"  element={<ProtectedRoute role="student"><ScoreLeaderboard initialTab="board"/></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
