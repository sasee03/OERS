import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { addQuestions, getExam } from "../../services/adminService"
import Navbar from "../../components/Navbar"

const emptyQuestion = () => ({ question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_answer: "A" })

export default function AddQuestions() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [exam, setExam] = useState(null)
  const [current, setCurrent] = useState(0)
  const [questions, setQuestions] = useState([emptyQuestion()])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getExam(id).then(r => { setExam(r.data); setQuestions(Array.from({ length: r.data.total_questions }, emptyQuestion)) })
      .catch(() => navigate("/admin"))
  }, [id])

  const handleChange = (field, value) => {
    const updated = [...questions]; updated[current] = { ...updated[current], [field]: value }; setQuestions(updated)
  }

  const canGoNext = () => { const q = questions[current]; return q.question_text && q.option_a && q.option_b && q.option_c && q.option_d }

  const handleSubmit = async () => {
    setLoading(true); setError("")
    try {
      await addQuestions(id, { questions: questions.map((q, i) => ({ ...q, order_number: i + 1 })) })
      navigate(`/admin/exams/${id}/modify`)
    } catch (err) {
      const d = err.response?.data?.detail
      setError(Array.isArray(d) ? d[0].msg : d || "Failed to save questions")
    } finally { setLoading(false) }
  }

  if (!exam) return <div className="min-h-screen bg-white"><Navbar /><p className="text-center pt-24 text-[10px] uppercase tracking-[0.2em] text-zinc-400">Loading...</p></div>

  const q = questions[current]
  const total = exam.total_questions
  const isLast = current === total - 1
  const allDone = questions.every(q => q.question_text && q.option_a && q.option_b && q.option_c && q.option_d)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">Step 2 of 2 — {exam.title}</p>
          <h1 className="text-4xl font-light uppercase tracking-[0.2em] mb-8">Add Questions</h1>

          <div className="w-full h-px bg-zinc-100 mb-2">
            <div className="h-px bg-black transition-all" style={{ width: `${((current + 1) / total) * 100}%` }} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-8">Question {current + 1} of {total}</p>

          {error && <p className="text-[10px] uppercase tracking-[0.2em] text-red-500 mb-6">{error}</p>}

          <div className="border border-zinc-100 p-8 mb-6">
            <div className="flex flex-col gap-2 mb-8">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Question</label>
              <textarea value={q.question_text} onChange={e => handleChange("question_text", e.target.value)}
                placeholder="Enter your question here..." rows={3}
                className="border-b border-black bg-transparent py-2 text-sm focus:outline-none resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {["a","b","c","d"].map(opt => (
                <div key={opt} className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Option {opt.toUpperCase()}</label>
                  <input value={q[`option_${opt}`]} onChange={e => handleChange(`option_${opt}`, e.target.value)}
                    placeholder={`Option ${opt.toUpperCase()}`}
                    className="border-b border-black bg-transparent py-2 text-sm focus:outline-none" />
                </div>
              ))}
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 block mb-3">Correct Answer</label>
              <div className="flex gap-2">
                {["A","B","C","D"].map(opt => (
                  <button key={opt} type="button" onClick={() => handleChange("correct_answer", opt)}
                    className={`w-10 h-10 text-sm font-medium transition-all ${q.correct_answer === opt ? "bg-black text-white" : "border border-zinc-200 hover:border-black"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setCurrent(c => c - 1)} disabled={current === 0}
              className="text-[10px] uppercase tracking-widest border border-zinc-200 px-6 py-3 hover:border-black transition-all disabled:opacity-30">
              ← Previous
            </button>

            <div className="flex gap-1">
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`w-7 h-7 text-[10px] transition-all ${i === current ? "bg-black text-white" : questions[i].question_text ? "bg-zinc-100 text-zinc-600" : "border border-zinc-200 text-zinc-300"}`}>
                  {i + 1}
                </button>
              ))}
            </div>

            {!isLast ? (
              <button onClick={() => setCurrent(c => c + 1)} disabled={!canGoNext()}
                className="bg-black text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-zinc-800 transition-all disabled:opacity-30">
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!allDone || loading}
                className="bg-black text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-zinc-800 transition-all disabled:opacity-30">
                {loading ? "Saving..." : "Finish ✓"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}