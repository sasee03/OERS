import { useState, useEffect } from "react"
import { getAllResults } from "../../services/adminService"
import Navbar from "../../components/Navbar"

export default function Results() {
  const [results, setResults] = useState([])
  const [filter,  setFilter]  = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => { getAllResults().then(r => { setResults(r.data); setLoading(false) }) }, [])

  const filtered = results.filter(r =>
    r.username.toLowerCase().includes(filter.toLowerCase()) ||
    r.exam_title.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>All Results</h1>
          <p>{results.length} total submissions</p>
        </div>
        <div className="search-bar">
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search by student or exam..." />
        </div>
        {loading ? <div className="loading">Loading...</div> : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr><th>#</th><th>Student</th><th>Exam</th><th>Score</th><th>%</th><th>Submitted</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{textAlign:"center",padding:"2rem",color:"#6b7280"}}>No results found</td></tr>
                ) : filtered.map((r, i) => (
                  <tr key={r.submission_id}>
                    <td>{i + 1}</td>
                    <td>{r.username}</td>
                    <td>{r.exam_title}</td>
                    <td>{r.score}/{r.total_marks}</td>
                    <td><span className={`badge ${r.percentage >= 60 ? "badge-success" : "badge-danger"}`}>{r.percentage}%</span></td>
                    <td>{new Date(r.submitted_at).toLocaleString()}</td>
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
