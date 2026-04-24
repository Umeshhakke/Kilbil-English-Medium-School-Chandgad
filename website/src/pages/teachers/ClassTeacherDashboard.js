import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaUsers, FaChartBar, FaCalendarAlt } from 'react-icons/fa';
import './ClassTeacherDashboard.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ClassTeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [classTeacherClasses, setClassTeacherClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceList, setAttendanceList] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');
  const navigate = useNavigate();

  // Add Student modal state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNo: '',
    parentName: '',
    parentPhone: '',
    email: '',
    password: ''
  });
  const [addStudentError, setAddStudentError] = useState('');

  // Edit Student modal state
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    rollNo: '',
    parentName: '',
    parentPhone: '',
    email: '',
    password: ''
  });
  const [editStudentError, setEditStudentError] = useState('');

  const fetchClassTeacherClasses = useCallback(async () => {
    try {
      const token = localStorage.getItem('teacherToken');
      const res = await axios.get(`${API_BASE_URL}/api/teacher-assignments/my-assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ctClasses = res.data.filter(a => a.isClassTeacher === true).map(a => a.class);
      setClassTeacherClasses([...new Set(ctClasses)]);
      if (ctClasses.length > 0) {
        setSelectedClass(ctClasses[0]);
        fetchStudents(ctClasses[0]);
      } else {
        setError('You are not assigned as a class teacher for any class.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // No external dependencies

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem('teacherData') || '{}');
    setTeacher(teacherData);
    fetchClassTeacherClasses();
  }, [fetchClassTeacherClasses]);

  const fetchStudents = async (className) => {
    try {
      const token = localStorage.getItem('teacherToken');
      const res = await axios.get(`${API_BASE_URL}/api/students/class/${className}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClassChange = (e) => {
    const cls = e.target.value;
    setSelectedClass(cls);
    fetchStudents(cls);
  };

  const prepareAttendance = () => {
    const initial = students.map(s => ({ studentId: s.id, status: 'present' }));
    setAttendanceList(initial);
    setShowAttendanceModal(true);
  };

  const handleSubmitAttendance = async () => {
    try {
      const token = localStorage.getItem('teacherToken');
      const payload = {
        date: attendanceDate,
        records: attendanceList
      };
      await axios.post(`${API_BASE_URL}/api/attendance`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Attendance saved successfully!');
      setShowAttendanceModal(false);
    } catch (err) {
      alert('Error saving attendance');
    }
  };

  // Edit student handler
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name || '',
      rollNo: student.rollNo || '',
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      email: student.email || '',
      password: '' // don't pre‑fill password
    });
    setEditStudentError('');
    setShowEditStudentModal(true);
  };

  const handleUpdateStudent = async () => {
    setEditStudentError('');
    try {
      const token = localStorage.getItem('teacherToken');
      const payload = { ...editForm };
      if (!payload.password) delete payload.password;

      await axios.put(
        `${API_BASE_URL}/api/students/class-teacher/${editingStudent.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Student updated successfully!');
      setShowEditStudentModal(false);
      fetchStudents(selectedClass);
    } catch (err) {
      setEditStudentError(err.response?.data?.error || 'Failed to update student');
    }
  };

  // Delete student
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const token = localStorage.getItem('teacherToken');
        await axios.delete(`${API_BASE_URL}/api/students/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Student deleted');
        fetchStudents(selectedClass);
      } catch (err) {
        alert('Error deleting student');
      }
    }
  };

  const handleAddStudent = async () => {
    setAddStudentError('');
    try {
      const token = localStorage.getItem('teacherToken');
      const payload = { ...newStudent };
      if (!payload.password) payload.password = 'student123';
      await axios.post(`${API_BASE_URL}/api/students/class-teacher`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Student added successfully!');
      setShowAddStudentModal(false);
      setNewStudent({ name: '', rollNo: '', parentName: '', parentPhone: '', email: '', password: '' });
      fetchStudents(selectedClass);
    } catch (err) {
      setAddStudentError(err.response?.data?.error || 'Failed to add student');
    }
  };

  if (loading) {
    return <div className="ct-loading">Loading Class Teacher Dashboard...</div>;
  }

  if (error) {
    return (
      <div className="ct-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/teacher/dashboard')}>Back to Teacher Dashboard</button>
      </div>
    );
  }

  if (classTeacherClasses.length === 0) {
    return (
      <div className="ct-no-access">
        <h2>Access Denied</h2>
        <p>You are not assigned as a class teacher for any class.</p>
        <button onClick={() => navigate('/teacher/dashboard')}>Back to Teacher Dashboard</button>
      </div>
    );
  }

  return (
    <div className="class-teacher-dashboard">
      <header className="ct-header">
        <button className="back-btn" onClick={() => navigate('/teacher/dashboard')}>
          <FaArrowLeft /> Back to Teacher Dashboard
        </button>
        <h1>Class Teacher Dashboard</h1>
        <p>{teacher?.name}</p>
      </header>

      <div className="ct-class-selector">
        <label>Select Class: </label>
        <select value={selectedClass} onChange={handleClassChange}>
          {classTeacherClasses.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      <div className="ct-nav-tabs">
        <button className={activeSection === 'overview' ? 'active' : ''} onClick={() => setActiveSection('overview')}>Overview</button>
        <button className={activeSection === 'attendance' ? 'active' : ''} onClick={() => setActiveSection('attendance')}><FaCalendarAlt /> Attendance</button>
        <button className={activeSection === 'students' ? 'active' : ''} onClick={() => setActiveSection('students')}><FaUsers /> Manage Students</button>
        <button className={activeSection === 'reports' ? 'active' : ''} onClick={() => setActiveSection('reports')}><FaChartBar /> Reports</button>
      </div>

      <div className="ct-content">
        {activeSection === 'overview' && (
          <div className="ct-overview">
            <div className="ct-stats">
              <div className="stat-card"><h3>{students.length}</h3><p>Total Students</p></div>
              <div className="stat-card"><h3>{classTeacherClasses.length}</h3><p>Classes as Class Teacher</p></div>
            </div>
            <div className="quick-actions">
              <button className="primary-btn" onClick={prepareAttendance}><FaCheckCircle /> Take Attendance</button>
              <button className="primary-btn" onClick={() => setActiveSection('students')}><FaUsers /> Manage Students</button>
            </div>
          </div>
        )}

        {activeSection === 'attendance' && (
          <div className="ct-attendance">
            <button className="primary-btn" onClick={prepareAttendance}>Take Attendance for Today</button>
            <p>Click the button above to mark attendance for {selectedClass}.</p>
          </div>
        )}

        {activeSection === 'students' && (
          <div className="ct-students">
            <button className="primary-btn" onClick={() => setShowAddStudentModal(true)}>+ Add New Student</button>
            {students.length > 0 ? (
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Parent Name</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>{s.rollNo}</td>
                      <td>{s.name}</td>
                      <td>{s.parentName}</td>
                      <td>{s.parentPhone}</td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEditStudent(s)}>✏️ Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteStudent(s.id)}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No students found for this class.</p>
            )}
          </div>
        )}

        {activeSection === 'reports' && (
          <div className="ct-reports">
            <p>📊 Attendance reports, performance analytics, and more coming soon.</p>
            <button className="primary-btn" onClick={() => alert('Generate report for ' + selectedClass)}>Generate Monthly Report</button>
          </div>
        )}
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="modal-overlay">
          <div className="modal-content attendance-modal">
            <div className="modal-header">
              <h2>Take Attendance - {selectedClass}</h2>
              <button className="close-btn" onClick={() => setShowAttendanceModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} />
            </div>
            <table className="attendance-table">
              <thead><tr><th>Student Name</th><th>Status</th></tr></thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>
                      <select
                        value={attendanceList[idx]?.status || 'present'}
                        onChange={e => {
                          const newList = [...attendanceList];
                          newList[idx] = { studentId: student.id, status: e.target.value };
                          setAttendanceList(newList);
                        }}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="modal-actions">
              <button onClick={() => setShowAttendanceModal(false)}>Cancel</button>
              <button onClick={handleSubmitAttendance}>Save Attendance</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Student to {selectedClass}</h2>
              <button className="close-btn" onClick={() => setShowAddStudentModal(false)}>×</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleAddStudent(); }}>
              <div className="form-group"><label>Full Name *</label><input type="text" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Roll Number *</label><input type="text" value={newStudent.rollNo} onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})} required /></div>
                <div className="form-group"><label>Parent Name</label><input type="text" value={newStudent.parentName} onChange={(e) => setNewStudent({...newStudent, parentName: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Parent Phone</label><input type="text" value={newStudent.parentPhone} onChange={(e) => setNewStudent({...newStudent, parentPhone: e.target.value})} /></div>
                <div className="form-group"><label>Email</label><input type="email" value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Password (default: student123)</label><input type="text" value={newStudent.password} onChange={(e) => setNewStudent({...newStudent, password: e.target.value})} placeholder="Leave empty for default" /></div>
              {addStudentError && <div className="error-message">{addStudentError}</div>}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddStudentModal(false)}>Cancel</button>
                <button type="submit">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditStudentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Student</h2>
              <button className="close-btn" onClick={() => setShowEditStudentModal(false)}>×</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateStudent(); }}>
              <div className="form-group"><label>Full Name *</label><input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Roll Number *</label><input type="text" value={editForm.rollNo} onChange={(e) => setEditForm({...editForm, rollNo: e.target.value})} required /></div>
                <div className="form-group"><label>Parent Name</label><input type="text" value={editForm.parentName} onChange={(e) => setEditForm({...editForm, parentName: e.target.value})} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Parent Phone</label><input type="text" value={editForm.parentPhone} onChange={(e) => setEditForm({...editForm, parentPhone: e.target.value})} /></div>
                <div className="form-group"><label>Email</label><input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>New Password (leave blank to keep current)</label><input type="text" value={editForm.password} onChange={(e) => setEditForm({...editForm, password: e.target.value})} placeholder="New password" /></div>
              {editStudentError && <div className="error-message">{editStudentError}</div>}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditStudentModal(false)}>Cancel</button>
                <button type="submit">Update Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassTeacherDashboard;