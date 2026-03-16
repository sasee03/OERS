import { useState, useEffect } from "react"
import { getAllResults } from "../../services/adminService"
import Navbar from "../../components/Navbar"
import { Submission } from "../../types"

export default function Results() {
  const [results, setResults] = useState<Submission[]>([])
  const [filter,  setFilter]  = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllResults().then(r => { setResults(r.data); setLoading(false) })
  }, [])

  const filtered = results.filter(r =>
    (r as unknown as { username: string }).username?.toLowerCase().includes(filter.toLowerCase()) ||
    (r as unknown as { exam_title: string }).exam_title?.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-2">{results.length} submissions</p>
            <h1 className="text-4xl font-light uppercase tracking-[0.2em]">All Results</h1>
          </div>
        </div>

        <div className="max-w-sm mb-8">
          <input value={filter} onChange={e => setFilter(e.target.value)}
            placeholder="Search by student or exam..."
            className="w-full border-b border-black bg-transparent py-2 text-sm focus:outline-none" />
        </div>

        {loading ? (
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Loading...</p>
        ) : (
          <div className="border border-zinc-100">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100">
                  {["#","Student","Exam","Score","%","Submitted"].map(h => (
                    <th key={h} className="text-left text-[10px] uppercase tracking-[0.2em] text-zinc-400 px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                      No results found
                    </td>
                  </tr>
                ) : filtered.map((r, i) => {
                  const row = r as unknown as {
                    submission_id: number; username: string; exam_title: string;
                    score: number; total_marks: number; percentage: number; submitted_at: string
                  }
                  return (
                    <tr key={row.submission_id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 text-[10px] text-zinc-400">{i + 1}</td>
                      <td className="px-6 py-4 text-sm">{row.username}</td>
                      <td className="px-6 py-4 text-sm">{row.exam_title}</td>
                      <td className="px-6 py-4 text-sm">{row.score}/{row.total_marks}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] uppercase tracking-[0.2em] ${row.percentage >= 60 ? "text-black" : "text-zinc-400"}`}>
                          {row.percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                        {new Date(row.submitted_at).toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}