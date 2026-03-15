import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar({ minimal = false }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate("/login") }

  return (
    <nav className="navbar">
      <Link to={user?.role === "admin" ? "/admin" : "/student"} className="nav-brand">
        📝 ExamPortal
      </Link>

      {!minimal && user?.role === "admin" && (
        <div className="nav-links">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/exams">Exams</Link>
          <Link to="/admin/results">Results</Link>
          <Link to="/admin/students">Students</Link>
        </div>
      )}

      {!minimal && user?.role === "student" && (
        <div className="nav-links">
          <Link to="/student">My Exams</Link>
        </div>
      )}

      {user && (
        <div className="nav-user">
          <span className="nav-username">{user.username}</span>
          <span className={`role-badge ${user.role}`}>{user.role}</span>
          <button onClick={handleLogout} className="btn-nav-logout">Logout</button>
        </div>
      )}
    </nav>
  )
}
