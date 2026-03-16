import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getExam, getQuestions, submitExam } from "../../services/studentService"
import Navbar from "../../components/Navbar"
import { Exam, Question } from "../../types"

export default function AttemptExam() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [exam,       setExam]       = useState<Exam | null>(null)
  const [questions,  setQuestions]  = useState<Question[]>([])
  const [answers,    setAnswers]    = useState<Record<number, string>>({})
  const [current,    setCurrent]    = useState(0)
  const [timeLeft,   setTimeLeft]   = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState("")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting) return
    if (!auto && !confirm(`Submit exam? You answered ${Object.keys(answers).length}/${questions.length} questions.`)) return
    setSubmitting(true)
    if (timerRef.current) clearInterval(timerRef.current)
    try {
      const payload: Record<number, string> = {}
      questions.forEach(q => { if (answers[q.id]) payload[q.id] = answers[q.id] })
      await submitExam(id!, { answers: payload })
      navigate(`/student/exams/${id}/score`)
    } catch (err: unknown) {
      const d = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
      setError(d || "Submission failed")
      setSubmitting(false)
    }
  }, [submitting, answers, questions, id, navigate])

  useEffect(() => {
    Promise.all([getExam(id!), getQuestions(id!)])
      .then(([e, q]) => {
        setExam(e.data); setQuestions(q.data)
        setTimeLeft(Math.max(0, Math.floor((new Date(e.data.end_time).getTime() - Date.now()) / 1000)))
      })
      .catch(() => navigate("/student"))
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [id])

  useEffect(() => {
    if (timeLeft === null) return
    if (timeLeft <= 0) { handleSubmit(true); return }
    timerRef.current = setInterval(() => setTimeLeft(t => (t ?? 1) - 1), 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timeLeft])

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`

  if (!exam || questions.length === 0) return (
    <div className="min-h-screen bg-white">
      <Navbar minimal />
      <p className="text-center pt-24 text-[10px] uppercase tracking-[0.2em] text-zinc-400">Loading exam...</p>
    </div>
  )

  const q        = questions[current]
  const isLast   = current === questions.length - 1
  const answered = Object.keys(answers).length
  const warn     = (timeLeft ?? 999) < 300

  return (
    <div className="min-h-screen bg-white">
      <Navbar minimal />
      <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-[1fr_220px] gap-8">

        {/* Main */}
        <div>
          <div className="flex items-center justify-between border border-zinc-100 px-6 py-4 mb-6">
            <h2 className="text-sm font-medium">{exam.title}</h2>
            <span className={`text-lg font-mono font-bold ${warn ? "text-red-500" : "text-black"}`}>
              {formatTime(timeLeft ?? 0)}
            </span>
          </div>

          {error && <p className="text-[10px] uppercase tracking-[0.2em] text-red-500 mb-4">{error}</p>}

          <div className="border border-zinc-100 p-8 mb-6">
            <div className="flex justify-between mb-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Question {current + 1} of {questions.length}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{answered} answered</span>
            </div>
            <p className="text-base font-medium mb-8 leading-relaxed">{q.question_text}</p>
            <div className="flex flex-col gap-3">
              {(["A","B","C","D"] as const).map(opt => (
                <label key={opt}
                  className={`flex items-center gap-4 px-5 py-4 border cursor-pointer transition-all ${answers[q.id] === opt ? "border-black" : "border-zinc-100 hover:border-zinc-300"}`}>
                  <input type="radio" name={`q-${q.id}`} value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                    className="hidden" />
                  <span className={`w-7 h-7 flex items-center justify-center text-xs font-bold transition-all ${answers[q.id] === opt ? "bg-black text-white" : "border border-zinc-200 text-zinc-400"}`}>
                    {opt}
                  </span>
                  <span className="text-sm">{q[`option_${opt.toLowerCase()}` as keyof Question] as string}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setCurrent(c => c - 1)} disabled={current === 0}
              className="text-[10px] uppercase tracking-widest border border-zinc-200 px-6 py-3 hover:border-black transition-all disabled:opacity-30">
              ← Previous
            </button>
            {!isLast ? (
              <button onClick={() => setCurrent(c => c + 1)}
                className="bg-black text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-zinc-800 transition-all">
                Next →
              </button>
            ) : (
              <button onClick={() => handleSubmit(false)} disabled={submitting}
                className="bg-black text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-zinc-800 transition-all disabled:opacity-50">
                {submitting ? "Submitting..." : "Submit Exam"}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="border border-zinc-100 p-5 h-fit sticky top-20">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">Questions</p>
          <div className="grid grid-cols-5 gap-1 mb-4">
            {questions.map((qu, i) => (
              <button key={qu.id} onClick={() => setCurrent(i)}
                className={`h-7 text-[10px] font-medium transition-all ${i === current ? "bg-black text-white" : answers[qu.id] ? "bg-zinc-100 text-zinc-600" : "border border-zinc-100 text-zinc-300 hover:border-zinc-400"}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Answered: {answered}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Pending: {questions.length - answered}</span>
          </div>
          <button onClick={() => handleSubmit(false)} disabled={submitting}
            className="w-full bg-black text-white text-[10px] uppercase tracking-widest py-3 hover:bg-zinc-800 transition-all disabled:opacity-50">
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  )
}