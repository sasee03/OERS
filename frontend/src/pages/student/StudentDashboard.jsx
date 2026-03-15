import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { getActiveExams, getScheduledExams, getMyResults, searchExams } from "../../services/studentService"
import Navbar from "../../components/Navbar"
import ExamCard from "../../components/ExamCard"

export default function StudentDashboard() {
  const { user } = useAuth()
  const [active,    setActive]    = useState([])
  const [scheduled, setScheduled] = useState([])
  const [results,   setResults]   = useState([])
  const [query,     setQuery]     = useState("")
  const [searched,  setSearched]  = useState(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([getActiveExams(), getScheduledExams(), getMyResults()])
      .then(([a, s, r]) => {
        setActive(a.data)
        setScheduled(s.data)
        setResults(r.data)
        setLoading(false)
      })
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) { setSearched(null); return }
    const { data } = await searchExams(query)
    setSearched(data)
  }

  // Check which exams student already submitted
  const submittedIds = new Set(results.filter(r => r.is_completed).map(r => r.exam_id))

  const examsToShow = searched ?? active

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Hello, {user?.username} 👋</h1>
          <p>View and attempt your assigned exams</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="search-bar">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search exams..." />
          <button type="submit" className="btn-primary">Search</button>
          {searched && <button type="button" onClick={() => { setSearched(null); setQuery("") }} className="btn-outline">Clear</button>}
        </form>

        {loading ? <div className="loading">Loading exams...</div> : (
          <>
            {/* Active / Search results */}
            <div className="section">
              <h2>{searched ? "Search Results" : "🟢 Exams Open Now"}</h2>
              {examsToShow.length === 0 ? (
                <div className="empty-state">
                  <span>📋</span>
                  <p>{searched ? "No exams match your search." : "No active exams right now."}</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {examsToShow.map(exam => (
                    <ExamCard key={exam.id} exam={exam} role="student"
                      isAttempted={submittedIds.has(exam.id)} />
                  ))}
                </div>
              )}
            </div>

            {/* Scheduled */}
            {!searched && scheduled.length > 0 && (
              <div className="section">
                <h2>🟡 Scheduled Exams</h2>
                <div className="cards-grid">
                  {scheduled.map(exam => (
                    <ExamCard key={exam.id} exam={exam} role="student"
                      isAttempted={submittedIds.has(exam.id)} />
                  ))}
                </div>
              </div>
            )}

            {/* My Results */}
            {results.length > 0 && (
              <div className="section">
                <h2>📊 My Results</h2>
                <div className="table-container">
                  <table className="data-table">
                    <thead><tr><th>Exam</th><th>Score</th><th>%</th><th>Date</th></tr></thead>
                    <tbody>
                      {results.filter(r => r.is_completed).map(r => (
                        <tr key={r.exam_id}>
                          <td>{r.exam_title}</td>
                          <td>{r.score}/{r.total_marks}</td>
                          <td><span className={`badge ${r.percentage >= 60 ? "badge-success" : "badge-danger"}`}>{r.percentage}%</span></td>
                          <td>{new Date(r.submitted_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
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
