import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { addQuestions, getExam } from "../../services/adminService"
import Navbar from "../../components/Navbar"

const emptyQuestion = () => ({
  question_text: "", option_a: "", option_b: "",
  option_c: "", option_d: "", correct_answer: "A"
})

export default function AddQuestions() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [exam, setExam]           = useState(null)
  const [current, setCurrent]     = useState(0)
  const [questions, setQuestions] = useState([emptyQuestion()])
  const [error, setError]         = useState("")
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    getExam(id).then(r => {
      setExam(r.data)
      setQuestions(Array.from({ length: r.data.total_questions }, emptyQuestion))
    }).catch(() => navigate("/admin"))
  }, [id])

  const handleChange = (field, value) => {
    const updated = [...questions]
    updated[current] = { ...updated[current], [field]: value }
    setQuestions(updated)
  }

  const canGoNext = () => {
    const q = questions[current]
    return q.question_text && q.option_a && q.option_b && q.option_c && q.option_d
  }

  const handleSubmit = async () => {
    setLoading(true); setError("")
    try {
      const payload = questions.map((q, i) => ({ ...q, order_number: i + 1 }))
      await addQuestions(id, { questions: payload })
      navigate(`/admin/exams/${id}/modify`)
    } catch (err) {
      const d = err.response?.data?.detail
      setError(Array.isArray(d) ? d[0].msg : d || "Failed to save questions")
    } finally { setLoading(false) }
  }

  if (!exam) return <div className="page"><Navbar /><div className="container loading">Loading...</div></div>

  const q       = questions[current]
  const total   = exam.total_questions
  const isLast  = current === total - 1
  const allDone = questions.every(q => q.question_text && q.option_a && q.option_b && q.option_c && q.option_d)

  return (
    <div className="page">
      <Navbar />
      <div className="container narrow">
        <div className="page-header">
          <h1>{exam.title}</h1>
          <p>Step 2 of 2 — Add Questions</p>
        </div>

        <div className="q-progress">
          <div className="q-progress-bar" style={{ width: `${((current + 1) / total) * 100}%` }} />
        </div>
        <p className="q-counter">Question {current + 1} of {total}</p>

        {error && <div className="error-box">{error}</div>}

        <div className="form-card">
          <div className="form-group">
            <label>Question *</label>
            <textarea value={q.question_text} onChange={e => handleChange("question_text", e.target.value)}
              placeholder="Enter your question here..." rows={3} />
          </div>

          <div className="options-grid">
            {["a","b","c","d"].map(opt => (
              <div key={opt} className="form-group">
                <label>Option {opt.toUpperCase()} *</label>
                <input value={q[`option_${opt}`]}
                  onChange={e => handleChange(`option_${opt}`, e.target.value)}
                  placeholder={`Option ${opt.toUpperCase()}`} />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Correct Answer *</label>
            <div className="answer-selector">
              {["A","B","C","D"].map(opt => (
                <button key={opt} type="button"
                  className={`answer-btn ${q.correct_answer === opt ? "selected" : ""}`}
                  onClick={() => handleChange("correct_answer", opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="q-nav-buttons">
          <button onClick={() => setCurrent(c => c - 1)} disabled={current === 0} className="btn-outline">
            ← Previous
          </button>

          <div className="q-dots">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`q-dot ${i === current ? "active" : ""} ${questions[i].question_text ? "filled" : ""}`}>
                {i + 1}
              </button>
            ))}
          </div>

          {!isLast ? (
            <button onClick={() => setCurrent(c => c + 1)} disabled={!canGoNext()} className="btn-primary">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!allDone || loading} className="btn-success">
              {loading ? "Saving..." : "Finish ✓"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
