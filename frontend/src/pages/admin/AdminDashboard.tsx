import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { getExams, deleteExam, searchExams } from "../../services/adminService"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/Navbar"
import ExamCard from "../../components/ExamCard"
import { Exam } from "../../../types"

export default function AdminDashboard() {
  const { user }                    = useAuth()
  const [exams, setExams]           = useState<Exam[]>([])
  const [query, setQuery]           = useState("")
  const [loading, setLoading]       = useState(true)

  const fetchExams = useCallback(async () => {
    const { data } = await getExams()
    setExams(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchExams() }, [fetchExams])

  useEffect(() => {
    if (!query.trim()) { fetchExams(); return }
    const t = setTimeout(async () => {
      const { data } = await searchExams(query)
      setExams(data)
    }, 300)
    return () => clearTimeout(t)
  }, [query, fetchExams])

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this exam?")) return
    await deleteExam(id); fetchExams()
  }

  const now     = new Date()
  const active  = exams.filter(e => now >= new Date(e.start_time) && now <= new Date(e.end_time) && e.is_active)
  const inactive = exams.filter(e => !active.includes(e))

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">Welcome back</p>
            <h1 className="text-4xl font-light uppercase tracking-[0.2em]">{user?.username}</h1>
          </div>
          <Link to="/admin/exams/create"
            className="bg-black text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-zinc-800 transition-all">
            + New Exam
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-px bg-zinc-100 mb-12">
          {([[exams.length,"Total Exams"],[active.length,"Live Now"],[inactive.length,"Inactive"]] as [number, string][]).map(([n, label]) => (
            <div key={label} className="bg-white p-8 text-center">
              <p className="text-4xl font-light mb-2">{n}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mb-12 max-w-lg">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search exams..."
            className="flex-1 border-b border-black bg-transparent py-2 text-sm focus:outline-none" />
          {query && (
            <button type="button" onClick={() => { setQuery(""); fetchExams() }}
              className="text-[10px] uppercase tracking-widest border-b border-zinc-300 px-4 py-2 hover:border-black transition-all">
              Clear
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Loading...</p>
        ) : exams.length === 0 ? (
          <div className="text-center py-24 border border-zinc-100">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-6">No exams yet</p>
            <Link to="/admin/exams/create"
              className="bg-black text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-zinc-800 transition-all">
              Create First Exam
            </Link>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div className="mb-12">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-6">Active Exams</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {active.map(exam => <ExamCard key={exam.id} exam={exam} role="admin" onDelete={handleDelete} />)}
                </div>
              </div>
            )}
            {inactive.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-6">Inactive / Upcoming</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inactive.map(exam => <ExamCard key={exam.id} exam={exam} role="admin" onDelete={handleDelete} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}