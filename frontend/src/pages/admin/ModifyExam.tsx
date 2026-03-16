import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  getExam, updateExam, assignExam, getCandidates,
  getQuestions, updateCorrectAnswer
} from "../../services/adminService"
import Navbar from "../../components/Navbar"
import { Exam, Question, Assignment } from "../../types"

type Tab = "details" | "assign" | "questions" | "candidates"

export default function ModifyExam() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [exam,       setExam]       = useState<Exam | null>(null)
  const [questions,  setQuestions]  = useState<Question[]>([])
  const [candidates, setCandidates] = useState<Assignment[]>([])
  const [tab,        setTab]        = useState<Tab>("details")
  const [emails,     setEmails]     = useState("")
  const [newEndTime, setNewEndTime] = useState("")
  const [answerEdit, setAnswerEdit] = useState<Record<number, string>>({})
  const [msg,        setMsg]        = useState("")
  const [error,      setError]      = useState("")

  useEffect(() => {
    getExam(id!).then(r => { setExam(r.data); setNewEndTime(r.data.end_time?.slice(0, 16)) })
    getQuestions(id!).then(r => setQuestions(r.data))
    getCandidates(id!).then(r => setCandidates(r.data))
  }, [id])

  const handleExtendDate = async () => {
    setMsg(""); setError("")
    try { await updateExam(id!, { end_time: new Date(newEndTime).toISOString() }); setMsg("End time updated!") }
    catch { setError("Failed to update end time") }
  }

  const handleAssign = async () => {
    setMsg(""); setError("")
    const emailList = emails.split(/[,\n]/).map(e => e.trim()).filter(Boolean)
    if (!emailList.length) { setError("Enter at least one email"); return }
    try {
      const { data } = await assignExam(id!, { student_emails: emailList })
      setMsg(data.map(r => `${r.email}: ${r.status}`).join(" | "))
      setEmails("")
      getCandidates(id!).then(r => setCandidates(r.data))
    } catch { setError("Failed to assign students") }
  }

  const handleUpdateAnswer = async (qId: number) => {
    setMsg(""); setError("")
    try {
      await updateCorrectAnswer(qId, { correct_answer: answerEdit[qId] })
      setMsg("Answer updated. Past scores are not affected.")
      getQuestions(id!).then(r => setQuestions(r.data))
    } catch { setError("Failed to update answer") }
  }

  const handleToggleActive = async () => {
    if (!exam) return
    await updateExam(id!, { is_active: !exam.is_active })
    getExam(id!).then(r => setExam(r.data))
  }

  if (!exam) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <p className="text-center pt-24 text-[10px] uppercase tracking-[0.2em] text-zinc-400">Loading...</p>
    </div>
  )

  const tabs: Tab[] = ["details", "assign", "questions", "candidates"]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">
              {exam.total_questions} questions — {exam.is_active ? "Active" : "Inactive"}
            </p>
            <h1 className="text-4xl font-light uppercase tracking-[0.2em]">{exam.title}</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={handleToggleActive}
              className={`text-[10px] uppercase tracking-widest px-6 py-3 transition-all ${exam.is_active ? "border border-zinc-200 hover:border-black" : "bg-black text-white hover:bg-zinc-800"}`}>
              {exam.is_active ? "End Exam" : "Reactivate"}
            </button>
            <button onClick={() => navigate("/admin")}
              className="text-[10px] uppercase tracking-widest border border-zinc-200 px-6 py-3 hover:border-black transition-all">
              ← Back
            </button>
          </div>
        </div>

        {msg   && <p className="text-[10px] uppercase tracking-[0.2em] text-black mb-6 border border-zinc-100 px-4 py-3">{msg}</p>}
        {error && <p className="text-[10px] uppercase tracking-[0.2em] text-red-500 mb-6">{error}</p>}

        <div className="flex gap-0 border-b border-zinc-100 mb-8">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-[10px] uppercase tracking-[0.2em] px-6 py-3 border-b-2 -mb-px transition-colors ${tab === t ? "border-black text-black" : "border-transparent text-zinc-400 hover:text-black"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="max-w-2xl">
          {tab === "details" && (
            <div className="flex flex-col gap-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Current end — {new Date(exam.end_time).toLocaleString()}
              </p>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">New End Time</label>
                <input type="datetime-local" value={newEndTime}
                  onChange={e => setNewEndTime(e.target.value)}
                  className="border-b border-black bg-transparent py-2 text-sm focus:outline-none" />
              </div>
              <button onClick={handleExtendDate}
                className="bg-black text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-zinc-800 transition-all w-fit">
                Update
              </button>
            </div>
          )}

          {tab === "assign" && (
            <div className="flex flex-col gap-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Enter emails separated by comma or new line
              </p>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Student Emails</label>
                <textarea value={emails} onChange={e => setEmails(e.target.value)} rows={5}
                  placeholder={"student1@email.com\nstudent2@email.com"}
                  className="border border-zinc-100 bg-transparent p-3 text-sm focus:outline-none focus:border-zinc-400 resize-none" />
              </div>
              <button onClick={handleAssign}
                className="bg-black text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-zinc-800 transition-all w-fit">
                Assign Students
              </button>
            </div>
          )}

          {tab === "questions" && (
            <div className="flex flex-col gap-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-2">
                Changing correct answer only affects future submissions
              </p>
              {questions.map((q, i) => (
                <div key={q.id} className="border border-zinc-100 p-6">
                  <div className="flex gap-4 mb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 w-6 shrink-0 mt-0.5">Q{i + 1}</span>
                    <p className="text-sm leading-relaxed">{q.question_text}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4 ml-10">
                    {(["a","b","c","d"] as const).map(opt => (
                      <span key={opt}
                        className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1 ${q.correct_answer === opt.toUpperCase() ? "bg-black text-white" : "border border-zinc-100 text-zinc-500"}`}>
                        {opt.toUpperCase()}: {q[`option_${opt}` as keyof Question] as string}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 ml-10">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Correct:</span>
                    <select value={answerEdit[q.id] || q.correct_answer || "A"}
                      onChange={e => setAnswerEdit({ ...answerEdit, [q.id]: e.target.value })}
                      className="border-b border-black bg-transparent text-sm py-1 focus:outline-none">
                      {["A","B","C","D"].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <button onClick={() => handleUpdateAnswer(q.id)}
                      className="text-[10px] uppercase tracking-widest border border-zinc-200 px-3 py-1.5 hover:border-black transition-all">
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "candidates" && (
            <div className="border border-zinc-100">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100">
                    {["#","Email","Student ID","Assigned At"].map(h => (
                      <th key={h} className="text-left text-[10px] uppercase tracking-[0.2em] text-zinc-400 px-6 py-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {candidates.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-16 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                        No students assigned yet
                      </td>
                    </tr>
                  ) : candidates.map((c, i) => (
                    <tr key={c.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 text-[10px] text-zinc-400">{i + 1}</td>
                      <td className="px-6 py-4 text-sm">{c.student_email}</td>
                      <td className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-zinc-400">{c.student_id ?? "—"}</td>
                      <td className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-zinc-400">{new Date(c.assigned_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}