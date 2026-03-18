import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createExam } from "../../services/adminService"
import Navbar from "../../components/Navbar"

interface FormState {
  title: string
  total_questions: string
  start_time: string
  end_time: string
  duration_minutes: string
}

export default function CreateExam() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    title: "",
    total_questions: "",
    start_time: "",
    end_time: "",
    duration_minutes: ""
  })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("")
    try {
      const payload = {
        title:            form.title,
        total_questions:  parseInt(form.total_questions),
        start_time:       new Date(form.start_time).toISOString(),
        end_time:         new Date(form.end_time).toISOString(),
        duration_minutes: parseInt(form.duration_minutes),
      }
      const { data } = await createExam(payload)
      navigate(`/admin/exams/${data.id}/questions`)
    } catch (err: unknown) {
      const d = (err as { response?: { data?: { detail?: unknown } } }).response?.data?.detail
      setError(Array.isArray(d) ? (d[0] as { msg: string }).msg : (d as string) || "Failed to create exam")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="max-w-lg">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">Step 1 of 2</p>
          <h1 className="text-4xl font-light uppercase tracking-[0.2em] mb-12">Create Exam</h1>

          {error && <p className="text-[10px] uppercase tracking-[0.2em] text-red-500 mb-6">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Exam Title</label>
              <input name="title" value={form.title} onChange={handleChange} required
                placeholder="e.g. Python Programming Basics"
                className="border-b border-black bg-transparent py-2 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Number of Questions</label>
              <input name="total_questions" type="number" min="1" value={form.total_questions}
                onChange={handleChange} required placeholder="e.g. 10"
                className="border-b border-black bg-transparent py-2 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Window Opens</label>
                <input name="start_time" type="datetime-local" value={form.start_time}
                  onChange={handleChange} required
                  className="border-b border-black bg-transparent py-2 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Window Closes</label>
                <input name="end_time" type="datetime-local" value={form.end_time}
                  onChange={handleChange} required
                  className="border-b border-black bg-transparent py-2 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Exam Duration (minutes)
              </label>
              <input name="duration_minutes" type="number" min="1" value={form.duration_minutes}
                onChange={handleChange} required placeholder="e.g. 60"
                className="border-b border-black bg-transparent py-2 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
              {form.duration_minutes && form.end_time && (
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mt-1">
                  Students get {form.duration_minutes} min from when they start.
                  Window closes {new Date(form.end_time).toLocaleString()}.
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={() => navigate("/admin")}
                className="text-[10px] uppercase tracking-widest border border-zinc-200 px-6 py-3 hover:border-black transition-all">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="bg-black text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-zinc-800 transition-all disabled:opacity-50">
                {loading ? "Creating..." : "Create & Add Questions →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}