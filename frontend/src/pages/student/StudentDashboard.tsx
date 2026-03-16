import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { getActiveExams, getScheduledExams, getMyResults, searchExams } from "../../services/studentService"
import Navbar from "../../components/Navbar"
import ExamCard from "../../components/ExamCard"
import { Exam, Submission } from "../../types"

export default function StudentDashboard() {
  const { user }                        = useAuth()
  const [active,    setActive]          = useState<Exam[]>([])
  const [scheduled, setScheduled]       = useState<Exam[]>([])
  const [results,   setResults]         = useState<Submission[]>([])
  const [query,     setQuery]           = useState("")
  const [searched,  setSearched]        = useState<Exam[] | null>(null)
  const [loading,   setLoading]         = useState(true)

  useEffect(() => {
    Promise.all([getActiveExams(), getScheduledExams(), getMyResults()])
      .then(([a, s, r]) => {
        setActive(a.data); setScheduled(s.data); setResults(r.data); setLoading(false)
      })
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) { setSearched(null); return }
    const { data } = await searchExams(query); setSearched(data)
  }

  const submittedIds = new Set(results.filter(r => r.is_completed).map(r => r.exam_id))
  const examsToShow  = searched ?? active

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-12">

        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">Hello</p>
          <h1 className="text-4xl font-light uppercase tracking-[0.2em]">{user?.username}</h1>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 mb-12 max-w-lg">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search exams..."
            className="flex-1 border-b border-black bg-transparent py-2 text-sm focus:outline-none" />
          <button type="submit"
            className="bg-black text-white text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-zinc-800 transition-all">
            Search
          </button>
          {searched && (
            <button type="button" onClick={() => { setSearched(null); setQuery("") }}
              className="text-[10px] uppercase tracking-widest border-b border-zinc-300 px-4 py-2 hover:border-black transition-all">
              Clear
            </button>
          )}
        </form>

        {loading ? (
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Loading...</p>
        ) : (
          <>
            <div className="mb-12">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-6">
                {searched ? "Search Results" : "Exams Open Now"}
              </p>
              {examsToShow.length === 0 ? (
                <div className="border border-zinc-100 py-16 text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                    {searched ? "No exams match your search" : "No active exams right now"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {examsToShow.map(exam => (
                    <ExamCard key={exam.id} exam={exam} role="student" isAttempted={submittedIds.has(exam.id)} />
                  ))}
                </div>
              )}
            </div>

            {!searched && scheduled.length > 0 && (
              <div className="mb-12">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-6">Scheduled Exams</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduled.map(exam => (
                    <ExamCard key={exam.id} exam={exam} role="student" isAttempted={submittedIds.has(exam.id)} />
                  ))}
                </div>
              </div>
            )}

            {results.filter(r => r.is_completed).length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-6">My Results</p>
                <div className="border border-zinc-100">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-100">
                        {["Exam","Score","%","Date"].map(h => (
                          <th key={h} className="text-left text-[10px] uppercase tracking-[0.2em] text-zinc-400 px-6 py-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.filter(r => r.is_completed).map(r => {
                        const row = r as unknown as {
                          exam_id: number; exam_title: string;
                          score: number; total_marks: number; percentage: number; submitted_at: string
                        }
                        return (
                          <tr key={row.exam_id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                            <td className="px-6 py-4 text-sm">{row.exam_title}</td>
                            <td className="px-6 py-4 text-sm">{row.score}/{row.total_marks}</td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] uppercase tracking-[0.2em] ${row.percentage >= 60 ? "text-black" : "text-zinc-400"}`}>
                                {row.percentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                              {new Date(row.submitted_at).toLocaleDateString()}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}