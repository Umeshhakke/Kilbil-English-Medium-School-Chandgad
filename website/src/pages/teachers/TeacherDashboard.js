import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaBookOpen,
  FaUsers,
  FaBullhorn,
  FaClipboardList,
  FaSignOutAlt,
  FaCheckCircle,
  FaPen,
  FaSchool,
  FaBook,
  FaChalkboardTeacher
} from 'react-icons/fa';
import './TeacherDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TeacherDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState('classes');
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [notices, setNotices] = useState([]);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', class: '' });
  
  // Only need to know if teacher is a class teacher for any class (to show nav link)
  const [isClassTeacher, setIsClassTeacher] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem('teacherData') || '{}');
    setTeacher(teacherData);
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('teacherToken');
      const res = await axios.get(`${API_BASE_URL}/api/teacher-assignments/my-assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(res.data);
      // Check if any assignment has isClassTeacher = true
      const hasClassTeacher = res.data.some(a => a.isClassTeacher === true);
      setIsClassTeacher(hasClassTeacher);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (className) => {
    try {
      const token = localStorage.getItem('teacherToken');
      const res = await axios.get(`${API_BASE_URL}/api/students/class/${className}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('teacherToken');
      const res = await axios.get(`${API_BASE_URL}/api/notices/my-notices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotices(res.data);
    } catch (err) {
      console.error('Failed to fetch notices:', err);
    }
  };

  const handleViewStudents = async (cls) => {
    setSelectedClass(cls);
    await fetchStudents(cls);
    setShowStudentModal(true);
  };

  const handleCreateNotice = () => {
    setNoticeForm({ title: '', content: '', class: '' });
    setShowNoticeModal(true);
  };

  const handleSubmitNotice = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('teacherToken');
      await axios.post(`${API_BASE_URL}/api/notices`, noticeForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowNoticeModal(false);
      if (activeTab === 'notices') fetchNotices();
    } catch (err) {
      console.error('Failed to create notice:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('teacherData');
    navigate('/teacher/login');
  };

  const groupedByClass = assignments.reduce((acc, curr) => {
    if (!acc[curr.class]) acc[curr.class] = [];
    acc[curr.class].push(curr);
    return acc;
  }, {});

  const classOrder = ['LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`)];
  const sortedClasses = Object.keys(groupedByClass).sort(
    (a, b) => classOrder.indexOf(a) - classOrder.indexOf(b)
  );

  if (loading) {
    return (
      <div className="teacher-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Teacher Portal</h2>
          <p>{teacher?.name}</p>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-btn ${activeTab === 'classes' ? 'active' : ''}`}
            onClick={() => setActiveTab('classes')}
          >
            <FaBookOpen /> My Classes
          </button>
          <button
            className={`nav-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <FaUsers /> Student Roster
          </button>
          <button
            className={`nav-btn ${activeTab === 'notices' ? 'active' : ''}`}
            onClick={() => { setActiveTab('notices'); fetchNotices(); }}
          >
            <FaBullhorn /> Notices
          </button>
          <button className="nav-btn" onClick={() => navigate('/teacher/assignments')}>
            <FaClipboardList /> Assignments
          </button>
          {/* Show Class Teacher Dashboard link only if teacher has class teacher role */}
          {isClassTeacher && (
            <button className="nav-btn class-teacher-nav" onClick={() => navigate('/teacher/class-teacher')}>
              <FaChalkboardTeacher /> Class Teacher Duties
            </button>
          )}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="main-header">
          <h1>
            {activeTab === 'classes' && 'My Classes & Subjects'}
            {activeTab === 'students' && 'Student Roster'}
            {activeTab === 'notices' && 'Class Notices'}
          </h1>
          {activeTab === 'notices' && (
            <button className="primary-btn" onClick={handleCreateNotice}>
              + New Notice
            </button>
          )}
        </header>

        <div className="content-area">
          {/* Classes Tab */}
          {activeTab === 'classes' && (
            <>
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="card-icon"><FaSchool /></div>
                  <div className="card-info"><h3>{sortedClasses.length}</h3><p>Classes</p></div>
                </div>
                <div className="summary-card">
                  <div className="card-icon"><FaBook /></div>
                  <div className="card-info"><h3>{assignments.length}</h3><p>Subjects</p></div>
                </div>
              </div>

              <div className="classes-grid">
                {sortedClasses.map(cls => (
                  <div key={cls} className="class-card">
                    <div className="class-header">
                      <h3>{cls}</h3>
                      <span className="subject-count">{groupedByClass[cls].length} subjects</span>
                    </div>
                    <ul className="subject-list">
                      {groupedByClass[cls].map((assign, idx) => (
                        <li key={idx} className="subject-item">
                          <span className="subject-name">{assign.subject}</span>
                          <div className="subject-actions">
                            <button className="icon-btn" title="Take Attendance"><FaCheckCircle /></button>
                            <button className="icon-btn" title="Enter Marks"><FaPen /></button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="class-footer">
                      <button className="secondary-btn" onClick={() => handleViewStudents(cls)}>
                        View Students
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="students-tab">
              <div className="class-selector">
                <label>Select Class:</label>
                <select onChange={(e) => fetchStudents(e.target.value)} defaultValue="">
                  <option value="" disabled>Choose a class</option>
                  {sortedClasses.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              {students.length > 0 ? (
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Parent Name</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id}>
                        <td>{s.rollNo}</td>
                        <td>{s.name}</td>
                        <td>{s.parentName}</td>
                        <td>{s.parentPhone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="empty-state">Select a class to view students.</p>
              )}
            </div>
          )}

          {/* Notices Tab */}
          {activeTab === 'notices' && (
            <div className="notices-tab">
              {notices.length > 0 ? (
                <div className="notices-list">
                  {notices.map(n => (
                    <div key={n.id} className="notice-card">
                      <h4>{n.title}</h4>
                      <p className="notice-meta">Class: {n.class} • {new Date(n.createdAt).toLocaleDateString()}</p>
                      <p>{n.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No notices yet. Create one with the button above.</p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Student Roster Modal */}
      {showStudentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedClass} - Student Roster</h2>
              <button className="close-btn" onClick={() => setShowStudentModal(false)}>×</button>
            </div>
            <table className="students-table">
              <thead>
                <tr><th>Roll No</th><th>Name</th><th>Parent</th><th>Contact</th></tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td>{s.rollNo}</td>
                    <td>{s.name}</td>
                    <td>{s.parentName}</td>
                    <td>{s.parentPhone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notice Creation Modal */}
      {showNoticeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create Notice</h2>
              <button className="close-btn" onClick={() => setShowNoticeModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmitNotice}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Class</label>
                <select value={noticeForm.class} onChange={(e) => setNoticeForm({ ...noticeForm, class: e.target.value })} required>
                  <option value="">Select Class</option>
                  {sortedClasses.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea value={noticeForm.content} onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })} rows="4" required />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowNoticeModal(false)}>Cancel</button>
                <button type="submit">Post Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;