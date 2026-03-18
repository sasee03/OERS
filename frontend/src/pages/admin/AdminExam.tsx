import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';               
import ExamCard from '../../components/ExamCard';
import { getExams, deleteExam } from '../../services/adminService';
 
const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await getExams();
        setExams(data);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);
 
  // Filter active/inactive exactly like dashboard
  const active = exams.filter(
    (e) =>
      new Date() >= new Date(e.start_time) &&
      new Date() <= new Date(e.end_time) &&
      e.is_active
  );
  const inactive = exams.filter((e) => !active.includes(e));
 
  const handleDelete = async (id) => {
    if (!confirm('Delete this exam?')) return;
    await deleteExam(id);
    // Refetch exams after deletion
    const { data } = await getExams();
    setExams(data);
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-8 py-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }
 
  if (exams.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="text-center py-24 border border-zinc-100">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-6">
              No exams yet
            </p>
            <Link
              to="/admin/exams/create"
              className="bg-black text-white text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-zinc-800 transition-all"
            >
              Create First Exam
            </Link>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* You could add a page title here if you like */}
        <h1 className="text-2xl font-light uppercase tracking-[0.2em] mb-8">
          All Exams
        </h1>
 
        {active.length > 0 && (
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-6">
              Active Exams
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  role="admin"
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
 
        {inactive.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-6">
              Inactive / Upcoming
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactive.map((exam) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  role="admin"
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default AdminExams;