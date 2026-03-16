import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createExam } from "../../services/adminService"
import Navbar from "../../components/Navbar"

export default function CreateExam() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: "", total_questions: "", start_time: "", end_time: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("")
    try {
      const payload = { ...form, total_questions: parseInt(form.total_questions), start_time: new Date(form.start_time).toISOString(), end_time: new Date(form.end_time).toISOString() }
      const { data } = await createExam(payload)
      navigate(`/admin/exams/${data.id}/questions`)
    } catch (err) {
      const d = err.response?.data?.detail
      setError(Array.isArray(d) ? d[0].msg : d || "Failed to create exam")
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
              <input name="total_questions" type="number" min="1" value={form.total_questions} onChange={handleChange} required
                placeholder="e.g. 10"
                className="border-b border-black bg-transparent py-2 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Start Time</label>
                <input name="start_time" type="datetime-local" value={form.start_time} onChange={handleChange} required
                  className="border-b border-black bg-transparent py-2 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">End Time</label>
                <input name="end_time" type="datetime-local" value={form.end_time} onChange={handleChange} required
                  className="border-b border-black bg-transparent py-2 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
              </div>
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