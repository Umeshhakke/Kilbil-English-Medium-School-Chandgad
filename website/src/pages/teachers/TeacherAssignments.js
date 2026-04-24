// src/pages/TeacherAssignments.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaBookOpen,
  FaUsers,
  FaBullhorn,
  FaClipboardList,
  FaSignOutAlt,
  FaPen,
  FaTrash,
  FaArrowLeft
} from 'react-icons/fa';
import './TeacherAssignments.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TeacherAssignments = () => {
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [groupedByClass, setGroupedByClass] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', class: '', subject: '', dueDate: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const teacherData = JSON.parse(localStorage.getItem('teacherData') || '{}');
    setTeacher(teacherData);
    fetchTeacherClasses();
    fetchAssignments();
  }, []);

  const fetchTeacherClasses = async () => {
    try {
      const token = localStorage.getItem('teacherToken');
      const res = await axios.get(`${API_BASE_URL}/api/teacher-assignments/my-assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Teacher assignments (for classes):', res.data);
      const classes = [...new Set(res.data.map(a => a.class))].sort();
      setTeacherClasses(classes);
      const grouped = res.data.reduce((acc, curr) => {
        if (!acc[curr.class]) acc[curr.class] = [];
        acc[curr.class].push(curr.subject);
        return acc;
      }, {});
      setGroupedByClass(grouped);
    } catch (err) {
      console.error('Failed to fetch teacher classes:', err);
      // Set empty state
      setTeacherClasses([]);
      setGroupedByClass({});
    }
  };

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('teacherToken');
      const res = await axios.get(`${API_BASE_URL}/api/assignments/my-assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Assignments list:', res.data);
      setAssignmentsList(res.data);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (teacherClasses.length === 0) {
      alert('You are not assigned to any classes. Please contact the administrator.');
      return;
    }
    setEditingAssignment(null);
    setFormData({ title: '', description: '', class: '', subject: '', dueDate: '' });
    setShowModal(true);
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description || '',
      class: assignment.class,
      subject: assignment.subject,
      dueDate: assignment.dueDate?.split('T')[0] || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      const token = localStorage.getItem('teacherToken');
      await axios.delete(`${API_BASE_URL}/api/assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAssignments();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('teacherToken');
      const payload = { ...formData };
      if (editingAssignment) {
        await axios.put(`${API_BASE_URL}/api/assignments/${editingAssignment.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/assignments`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      fetchAssignments();
    } catch (err) {
      alert('Failed to save assignment');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('teacherData');
    navigate('/teacher/login');
  };

  if (loading) {
    return (
      <div className="teacher-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="teacher-assignments-page">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Teacher Portal</h2>
          <p>{teacher?.name}</p>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-btn" onClick={() => navigate('/teacher/dashboard')}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <button className="nav-btn" onClick={() => navigate('/teacher/dashboard')}>
            <FaBookOpen /> My Classes
          </button>
          <button className="nav-btn" onClick={() => navigate('/teacher/dashboard')}>
            <FaUsers /> Student Roster
          </button>
          <button className="nav-btn" onClick={() => navigate('/teacher/dashboard')}>
            <FaBullhorn /> Notices
          </button>
          <button className="nav-btn active">
            <FaClipboardList /> Assignments
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="main-header">
          <h1>Assignments</h1>
          <button className="primary-btn" onClick={handleCreate}>
            + New Assignment
          </button>
        </header>

        {teacherClasses.length === 0 && (
          <div className="warning-message">
            ⚠️ You are not assigned to any classes. Please contact the administrator to assign you to classes and subjects.
          </div>
        )}

        <div className="assignments-list-container">
          {assignmentsList.length > 0 ? (
            <div className="assignments-list">
              {assignmentsList.map(a => (
                <div key={a.id} className="assignment-card">
                  <div className="assignment-header">
                    <h3>{a.title}</h3>
                    <span className="assignment-class">{a.class} • {a.subject}</span>
                  </div>
                  <p className="assignment-desc">{a.description}</p>
                  {a.dueDate && (
                    <p className="assignment-due">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                  )}
                  <div className="assignment-actions">
                    <button className="icon-btn" onClick={() => handleEdit(a)} title="Edit">
                      <FaPen />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(a.id)} title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No assignments yet. Create one to get started.</p>
          )}
        </div>
      </main>

      {/* Assignment Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingAssignment ? 'Edit Assignment' : 'New Assignment'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Class</label>
                  <select
                    value={formData.class}
                    onChange={(e) => {
                      setFormData({...formData, class: e.target.value, subject: ''});
                    }}
                    required
                  >
                    <option value="">Select Class</option>
                    {teacherClasses.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                    disabled={!formData.class}
                  >
                    <option value="">Select Subject</option>
                    {formData.class && groupedByClass[formData.class]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Due Date (optional)</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit">{editingAssignment ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignments;