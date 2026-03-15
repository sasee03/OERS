import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getExam, updateExam, assignExam, getCandidates, getQuestions, updateCorrectAnswer } from "../../services/adminService"
import Navbar from "../../components/Navbar"

export default function ModifyExam() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [exam, setExam]             = useState(null)
  const [questions, setQuestions]   = useState([])
  const [candidates, setCandidates] = useState([])
  const [tab, setTab]               = useState("details")
  const [emails, setEmails]         = useState("")
  const [newEndTime, setNewEndTime] = useState("")
  const [answerEdit, setAnswerEdit] = useState({})
  const [msg, setMsg]               = useState("")
  const [error, setError]           = useState("")

  useEffect(() => {
    getExam(id).then(r => { setExam(r.data); setNewEndTime(r.data.end_time?.slice(0,16)) })
    getQuestions(id).then(r => setQuestions(r.data))
    getCandidates(id).then(r => setCandidates(r.data))
  }, [id])

  const handleExtendDate = async () => {
    setMsg(""); setError("")
    try {
      await updateExam(id, { end_time: new Date(newEndTime).toISOString() })
      setMsg("End time updated successfully!")
    } catch { setError("Failed to update end time") }
  }

  const handleAssign = async () => {
    setMsg(""); setError("")
    const emailList = emails.split(`/[,;\n]+/`).map(e => e.trim()).filter(Boolean)
    if (!emailList.length) { setError("Enter at least one email"); return }
    try {
      const { data } = await assignExam(id, { student_emails: emailList })
      setMsg(data.map(r => `${r.email}: ${r.status}`).join(" | "))
      setEmails("")
      getCandidates(id).then(r => setCandidates(r.data))
    } catch { setError("Failed to assign students") }
  }

  const handleUpdateAnswer = async (qId) => {
    setMsg(""); setError("")
    try {
      await updateCorrectAnswer(qId, { correct_answer: answerEdit[qId] })
      setMsg("Correct answer updated! Note: past scores are not affected.")
      getQuestions(id).then(r => setQuestions(r.data))
    } catch { setError("Failed to update answer") }
  }

  const handleToggleActive = async () => {
    await updateExam(id, { is_active: !exam.is_active })
    getExam(id).then(r => setExam(r.data))
  }

  if (!exam) return <div className="page"><Navbar /><div className="container loading">Loading...</div></div>

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="page-header flex-between">
          <div>
            <h1>{exam.title}</h1>
            <p>{exam.total_questions} questions • {exam.is_active ? "🟢 Active" : "🔴 Inactive"}</p>
          </div>
          <div style={{display:"flex",gap:"0.75rem"}}>
            <button onClick={handleToggleActive} className={exam.is_active ? "btn-outline" : "btn-primary"}>
              {exam.is_active ? "End Exam" : "Reactivate"}
            </button>
            <button onClick={() => navigate("/admin")} className="btn-outline">← Back</button>
          </div>
        </div>

        {msg   && <div className="success-box" style={{marginBottom:"1rem"}}>{msg}</div>}
        {error && <div className="error-box"   style={{marginBottom:"1rem"}}>{error}</div>}

        <div className="tabs">
          {["details","assign","questions","candidates"].map(t => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "details" && (
          <div className="form-card">
            <h3>Extend End Time</h3>
            <p className="muted" style={{marginBottom:"1rem"}}>Current end time: {new Date(exam.end_time).toLocaleString()}</p>
            <div className="form-row">
              <div className="form-group">
                <label>New End Time</label>
                <input type="datetime-local" value={newEndTime} onChange={e => setNewEndTime(e.target.value)} />
              </div>
              <div className="form-group" style={{justifyContent:"flex-end"}}>
                <button onClick={handleExtendDate} className="btn-primary">Update</button>
              </div>
            </div>
          </div>
        )}

        {tab === "assign" && (
          <div className="form-card">
            <h3>Assign Students (TO)</h3>
            <p className="muted" style={{marginBottom:"1rem"}}>Enter emails separated by comma or new line. Exam links will be sent to these students.</p>
            <div className="form-group">
              <label>Student Emails</label>
              <textarea value={emails} onChange={e => setEmails(e.target.value)}
                placeholder={`student1@email.com
student2@email.com`} rows={5} />
            </div>
            <button onClick={handleAssign} className="btn-primary">Assign Students</button>
          </div>
        )}

        {tab === "questions" && (
          <div className="questions-list">
            <p className="muted" style={{marginBottom:"1rem"}}>
              ⚠️ Changing the correct answer will only affect future submissions. Past scores are not recalculated.
            </p>
            {questions.map((q, i) => (
              <div key={q.id} className="question-item">
                <div className="question-header">
                  <span className="q-number">Q{i + 1}</span>
                  <p className="q-text">{q.question_text}</p>
                </div>
                <div className="options-display">
                  {["a","b","c","d"].map(opt => (
                    <span key={opt} className={`option-tag ${q.correct_answer === opt.toUpperCase() ? "correct" : ""}`}>
                      {opt.toUpperCase()}: {q[`option_${opt}`]}
                    </span>
                  ))}
                </div>
                <div className="answer-edit-row">
                  <span className="muted">Correct Answer:</span>
                  <select value={answerEdit[q.id] || q.correct_answer}
                    onChange={e => setAnswerEdit({...answerEdit, [q.id]: e.target.value})}>
                    {["A","B","C","D"].map(o => <option key={o}>{o}</option>)}
                  </select>
                  <button onClick={() => handleUpdateAnswer(q.id)} className="btn-sm btn-outline">Update</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "candidates" && (
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>#</th><th>Email</th><th>Student ID</th><th>Assigned At</th></tr></thead>
              <tbody>
                {candidates.length === 0 ? (
                  <tr><td colSpan={4} style={{textAlign:"center",padding:"2rem",color:"#6b7280"}}>No students assigned yet</td></tr>
                ) : candidates.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>{c.student_email}</td>
                    <td>{c.student_id || "—"}</td>
                    <td>{new Date(c.assigned_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
