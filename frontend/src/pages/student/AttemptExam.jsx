import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getExam, getQuestions, submitExam } from "../../services/studentService"
import Navbar from "../../components/Navbar"

export default function AttemptExam() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [exam,       setExam]       = useState(null)
  const [questions,  setQuestions]  = useState([])
  const [answers,    setAnswers]    = useState({})   // { questionId: "A" }
  const [current,    setCurrent]    = useState(0)
  const [timeLeft,   setTimeLeft]   = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState("")

  const timerRef = useRef(null)

  // Auto-submit when time runs out
  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting) return
    if (!auto && !confirm(`Submit exam? You answered ${Object.keys(answers).length}/${questions.length} questions.`)) return
    setSubmitting(true)
    clearInterval(timerRef.current)
    try {
      const payload = {}
      questions.forEach(q => { if (answers[q.id]) payload[q.id] = answers[q.id] })
      await submitExam(id, { answers: payload })
      navigate(`/student/exams/${id}/score`)
    } catch (err) {
      setError(err.response?.data?.detail || "Submission failed")
      setSubmitting(false)
    }
  }, [submitting, answers, questions, id, navigate])

  useEffect(() => {
    Promise.all([getExam(id), getQuestions(id)])
      .then(([e, q]) => {
        setExam(e.data)
        setQuestions(q.data)
        // Timer = time until exam ends
        const secsLeft = Math.max(0, Math.floor((new Date(e.data.end_time) - new Date()) / 1000))
        setTimeLeft(secsLeft)
      })
      .catch(() => navigate("/student"))
    return () => clearInterval(timerRef.current)
  }, [id])

  useEffect(() => {
    if (timeLeft === null) return
    if (timeLeft <= 0) { handleSubmit(true); return }
    timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [timeLeft])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0")
    const s = (secs % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  if (!exam || questions.length === 0)
    return <div className="page"><Navbar minimal /><div className="container loading">Loading exam...</div></div>

  const q          = questions[current]
  const isLast     = current === questions.length - 1
  const answered   = Object.keys(answers).length

  return (
    <div className="page">
      <Navbar minimal />
      <div className="attempt-layout">

        {/* Main area */}
        <div className="attempt-main">
          <div className="attempt-header">
            <h2>{exam.title}</h2>
            <div className={`timer ${timeLeft < 300 ? "timer-warn" : ""}`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="question-card">
            <div className="question-meta">
              <span>Question {current + 1} of {questions.length}</span>
              <span>{answered} answered</span>
            </div>

            <p className="question-text">{q.question_text}</p>

            <div className="answer-options">
              {["A","B","C","D"].map(opt => (
                <label key={opt} className={`option-label ${answers[q.id] === opt ? "selected" : ""}`}>
                  <input type="radio" name={`q-${q.id}`} value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => setAnswers({ ...answers, [q.id]: opt })} />
                  <span className="option-key">{opt}</span>
                  <span>{q[`option_${opt.toLowerCase()}`]}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="attempt-nav">
            <button onClick={() => setCurrent(c => c - 1)} disabled={current === 0} className="btn-outline">
              ← Previous
            </button>
            {!isLast ? (
              <button onClick={() => setCurrent(c => c + 1)} className="btn-primary">
                Next →
              </button>
            ) : (
              <button onClick={() => handleSubmit(false)} disabled={submitting}
                className="btn-submit">
                {submitting ? "Submitting..." : "Submit Exam"}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="attempt-sidebar">
          <h4>Questions</h4>
          <div className="q-grid">
            {questions.map((qu, i) => (
              <button key={qu.id} onClick={() => setCurrent(i)}
                className={`q-dot ${i === current ? "active" : ""} ${answers[qu.id] ? "answered" : ""}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="legend">
            <span><span className="dot answered"></span> Answered ({answered})</span>
            <span><span className="dot"></span> Pending ({questions.length - answered})</span>
          </div>
          <button onClick={() => handleSubmit(false)} disabled={submitting}
            className="btn-submit btn-block" style={{marginTop:"1rem"}}>
            {submitting ? "Submitting..." : "Submit Exam"}
          </button>
        </div>

      </div>
    </div>
  )
}
