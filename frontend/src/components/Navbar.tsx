import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

interface Props {
  minimal?: boolean
}

const adminLinks = [
  ["Dashboard", "/admin"],
  ["Exams", "/admin/exams"],
  ["Results", "/admin/results"],
]

export default function Navbar({ minimal = false }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate("/login") }

  return (
    <nav className="border-b border-zinc-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
        <Link
          to={user?.role === "admin" ? "/admin" : "/student"}
          className="text-[10px] uppercase tracking-[0.3em] font-semibold text-black"
        >
          ExamPortal
        </Link>

        {!minimal && user?.role === "admin" && (
          <div className="flex gap-6">
            {adminLinks.map(([label, path]) => (
              <Link key={path} to={path}
                className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors">
                {label}
              </Link>
            ))}
          </div>
        )}

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{user.username}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] border border-zinc-200 px-2 py-0.5">{user.role}</span>
            <button onClick={handleLogout}
              className="text-[10px] uppercase tracking-widest bg-black text-white px-3 py-1.5 hover:bg-zinc-800 transition-all">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}