import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createExam } from "../../services/adminService"
import Navbar from "../../components/Navbar"

export default function CreateExam() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ title: "", total_questions: "", start_time: "", end_time: "" })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const payload = {
        ...form,
        total_questions: parseInt(form.total_questions),
        start_time: new Date(form.start_time).toISOString(),
        end_time:   new Date(form.end_time).toISOString(),
      }
      const { data } = await createExam(payload)
      navigate(`/admin/exams/${data.id}/questions`)
    } catch (err) {
      const d = err.response?.data?.detail
      setError(Array.isArray(d) ? d[0].msg : d || "Failed to create exam")
    } finally { setLoading(false) }
  }

  return (
    <div className="page">
      <Navbar />
      <div className="container narrow">
        <div className="page-header">
          <h1>Create New Exam</h1>
          <p>Step 1 of 2 — Set up exam details</p>
        </div>
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-box">{error}</div>}
            <div className="form-group">
              <label>Exam Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Python Programming Basics" required />
            </div>
            <div className="form-group">
              <label>Number of Questions *</label>
              <input name="total_questions" type="number" min="1" value={form.total_questions} onChange={handleChange} placeholder="e.g. 10" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Time *</label>
                <input name="start_time" type="datetime-local" value={form.start_time} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>End Time *</label>
                <input name="end_time" type="datetime-local" value={form.end_time} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" onClick={() => navigate("/admin")} className="btn-outline">Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Create & Add Questions →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
