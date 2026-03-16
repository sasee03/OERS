import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { register } from "../services/authService"

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ username: "", email: "", password: "", role: "student" as "admin" | "student" })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("")
    try {
      await register(form)
      navigate("/login", { state: { message: "Account created! Please log in." } })
    } catch (err: unknown) {
      const d = (err as { response?: { data?: { detail?: unknown } } }).response?.data?.detail
      setError(Array.isArray(d) ? (d[0] as { msg: string }).msg : (d as string) || "Registration failed")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-8">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-4">ExamPortal</p>
          <h1 className="text-4xl font-light uppercase tracking-[0.2em]">Create Account</h1>
        </div>

        {error && <p className="text-[10px] uppercase tracking-[0.2em] text-center text-red-500 mb-6">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {([["username","Username","text"],["email","Email","email"],["password","Password","password"]] as const).map(([name, label, type]) => (
            <div key={name} className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{label}</label>
              <input name={name} type={type} value={form[name]} onChange={handleChange} required
                className="border-b border-black bg-transparent py-2 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Role</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="border-b border-black bg-transparent py-2 text-sm focus:outline-none appearance-none">
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="bg-black text-white text-[10px] uppercase tracking-widest py-3 hover:bg-zinc-800 transition-all disabled:opacity-50 mt-4">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-8 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          Have an account?{" "}
          <Link to="/login" className="text-black border-b border-black">Sign In</Link>
        </p>
      </div>
    </div>
  )
}