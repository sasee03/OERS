import { useState, useEffect } from "react"
import { getStudents } from "../../services/adminService"
import Navbar from "../../components/Navbar"

export default function Students() {
  const [students, setStudents] = useState([])
  useEffect(() => { getStudents().then(r => setStudents(r.data)) }, [])

  return (
    <div className="page">
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Registered Students</h1>
          <p>{students.length} students enrolled</p>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>#</th><th>Username</th><th>Email</th><th>ID</th></tr></thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.id}>
                  <td>{i+1}</td><td>{s.username}</td><td>{s.email}</td>
                  <td><code>#{s.id}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
