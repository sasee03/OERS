import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getExams, deleteExam, searchExams } from "../../services/adminService"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/Navbar"
import ExamCard from "../../components/ExamCard"

export default function AdminDashboard() {
  const { user }                = useAuth()
  const navigate                = useNavigate()
  const [exams, setExams]       = useState([])
  const [query, setQuery]       = useState("")
  const [loading, setLoading]   = useState(true)

  const fetchExams = async () => {
    const { data } = await getExams()
    setExams(data); setLoading(false)
  }

  useEffect(() => { fetchExams() }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) { fetchExams(); return }
    const { data } = await searchExams(query)
    setExams(data)
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this exam? This cannot be undone.")) return
    await deleteExam(id)
    fetchExams()
  }

  const active    = exams.filter(e => new Date() >= new Date(e.start_time) && new Date() <= new Date(e.end_time) && e.is_active)
  const inactive  = exams.filter(e => !active.includes(e))

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="page-header flex-between">
          <div>
            <h1>Welcome, {user?.username} 👋</h1>
            <p>Manage your exams and track student performance</p>
          </div>
          <Link to="/admin/exams/create" className="btn-primary">+ New Exam</Link>
        </div>

        <div className="stats-row">
          <div className="stat-box"><h3>{exams.length}</h3><p>Total Exams</p></div>
          <div className="stat-box"><h3>{active.length}</h3><p>Live Now</p></div>
          <div className="stat-box"><h3>{inactive.length}</h3><p>Inactive</p></div>
        </div>

        <form onSubmit={handleSearch} className="search-bar">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search exams..." />
          <button type="submit" className="btn-primary">Search</button>
          {query && <button type="button" onClick={() => { setQuery(""); fetchExams() }} className="btn-outline">Clear</button>}
        </form>

        {loading ? (
          <div className="loading">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="empty-state">
            <span>📋</span>
            <h3>No exams yet</h3>
            <Link to="/admin/exams/create" className="btn-primary">Create your first exam</Link>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div className="section">
                <h2>🟢 Active Exams</h2>
                <div className="cards-grid">
                  {active.map(exam => (
                    <ExamCard key={exam.id} exam={exam} role="admin" onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            )}
            {inactive.length > 0 && (
              <div className="section">
                <h2>Inactive / Upcoming</h2>
                <div className="cards-grid">
                  {inactive.map(exam => (
                    <ExamCard key={exam.id} exam={exam} role="admin" onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
