import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getExam, startExam } from "../../services/studentService"
import Navbar from "../../components/Navbar"

export default function ExamNote() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [exam,    setExam]    = useState(null)
  const [error,   setError]   = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getExam(id).then(r => setExam(r.data)).catch(() => navigate("/student"))
  }, [id])

  const handleStart = async () => {
    setLoading(true); setError("")
    try {
      await startExam(id)
      navigate(`/student/exams/${id}/attempt`)
    } catch (err) {
      const d = err.response?.data?.detail
      setError(d || "Could not start exam")
      setLoading(false)
    }
  }

  if (!exam) return <div className="page"><Navbar /><div className="container loading">Loading...</div></div>

  const duration = Math.round(
    (new Date(exam.end_time) - new Date(exam.start_time)) / 60000
  )

  return (
    <div className="page">
      <Navbar minimal />
      <div className="container narrow">
        <div className="note-card">
          <div className="note-icon">📋</div>
          <h1>{exam.title}</h1>

          <div className="note-info-grid">
            <div className="note-info-item">
              <span>❓</span>
              <div><strong>{exam.total_questions}</strong><p>Questions</p></div>
            </div>
            <div className="note-info-item">
              <span>⏱</span>
              <div><strong>{duration} mins</strong><p>Duration</p></div>
            </div>
            <div className="note-info-item">
              <span>🔒</span>
              <div><strong>One Attempt</strong><p>Cannot retake</p></div>
            </div>
          </div>

          <div className="note-instructions">
            <h3>📌 Instructions</h3>
            <ul>
              <li>Read each question carefully before answering.</li>
              <li>Each question has only one correct answer (A, B, C, or D).</li>
              <li><strong>Do not reload the page</strong> — the exam will auto-submit if time runs out.</li>
              <li>You can navigate between questions using the question panel.</li>
              <li>Click <strong>Submit</strong> on the last question when done.</li>
              <li>Once submitted, you cannot change your answers.</li>
            </ul>
          </div>

          {error && <div className="error-box" style={{marginBottom:"1rem"}}>{error}</div>}

          <button onClick={handleStart} className="btn-primary btn-large" disabled={loading}>
            {loading ? "Starting..." : "Start Exam →"}
          </button>
        </div>
      </div>
    </div>
  )
}
