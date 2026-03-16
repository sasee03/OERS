import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { loginUser } from "../services/authService"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const [form, setForm]       = useState({ username: "", password: "" })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const successMsg = (location.state as { message?: string })?.message

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("")
    try {
      const { data } = await loginUser(form)
      login(data.user, data.access_token)
      navigate(data.user.role === "admin" ? "/admin" : "/student")
    } catch (err: unknown) {
      const d = (err as { response?: { data?: { detail?: unknown } } }).response?.data?.detail
      setError(Array.isArray(d) ? (d[0] as { msg: string }).msg : (d as string) || "Login failed")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-8">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-4">ExamPortal</p>
          <h1 className="text-4xl font-light uppercase tracking-[0.2em]">Sign In</h1>
        </div>

        {successMsg && <p className="text-[10px] uppercase tracking-[0.2em] text-center text-zinc-500 mb-6">{successMsg}</p>}
        {error      && <p className="text-[10px] uppercase tracking-[0.2em] text-center text-red-500 mb-6">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {(["username", "password"] as const).map((name) => (
            <div key={name} className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{name}</label>
              <input name={name} type={name === "password" ? "password" : "text"}
                value={form[name]} onChange={handleChange} required
                className="border-b border-black bg-transparent py-2 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="bg-black text-white text-[10px] uppercase tracking-widest py-3 hover:bg-zinc-800 transition-all disabled:opacity-50 mt-4">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-8 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          No account?{" "}
          <Link to="/register" className="text-black border-b border-black">Register</Link>
        </p>
      </div>
    </div>
  )
}