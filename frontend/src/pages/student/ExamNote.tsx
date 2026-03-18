import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getExam, startExam } from "../../services/studentService"
import Navbar from "../../components/Navbar"
import { Exam } from "../../../types"

export default function ExamNote() {
  const { id }   = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [exam,    setExam]    = useState<Exam | null>(null)
  const [error,   setError]   = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getExam(id!).then(r => setExam(r.data)).catch(() => navigate("/student"))
  }, [id])

  const handleStart = async () => {
    setLoading(true); setError("")
    try {
      await startExam(id!)
      navigate(`/student/exams/${id}/attempt`)
    } catch (err: unknown) {
      const d = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
      setError(d || "Could not start exam")
      setLoading(false)
    }
  }

  if (!exam) return (
    <div className="min-h-screen bg-white">
      <Navbar minimal />
      <p className="text-center pt-24 text-[10px] uppercase tracking-[0.2em] text-zinc-400">Loading...</p>
    </div>
  )

  const duration = exam.duration_minutes
  const instructions = [
    "Read each question carefully before answering",
    "Each question has only one correct answer",
    "Do not reload the page — exam will auto-submit",
    "Navigate between questions using the question panel",
    "Click Submit on the last question when done",
    "Once submitted, you cannot change your answers",
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar minimal />
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="max-w-xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2 text-center">You are about to start</p>
          <h1 className="text-4xl font-light uppercase tracking-[0.2em] text-center mb-12">{exam.title}</h1>

          <div className="grid grid-cols-3 gap-px bg-zinc-100 mb-12">
            {([[exam.total_questions, "Questions"],[`${duration} min`, "Duration"],["1 Only", "Attempt"]] as [string|number, string][]).map(([val, label]) => (
              <div key={label} className="bg-white p-6 text-center">
                <p className="text-2xl font-light mb-1">{val}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="border border-zinc-100 p-6 mb-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">Instructions</p>
            <ul className="flex flex-col gap-2">
              {instructions.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-600">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-300 mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {error && <p className="text-[10px] uppercase tracking-[0.2em] text-red-500 mb-6 text-center">{error}</p>}

          <button onClick={handleStart} disabled={loading}
            className="w-full bg-black text-white text-[10px] uppercase tracking-widest py-4 hover:bg-zinc-800 transition-all disabled:opacity-50">
            {loading ? "Starting..." : "Start Exam →"}
          </button>
        </div>
      </div>
    </div>
  )
}