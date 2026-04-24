import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import AssignmentForm from './AssignmentForm';
import './TeacherAssignment.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TeacherAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const token = localStorage.getItem('adminToken');

  const fetchData = useCallback(async () => {
    try {
      const [assignRes, staffRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/teacher-assignments`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/staff`)
      ]);
      setAssignments(assignRes.data);
      
      // 🔍 DEBUG: Log all staff designations
      
      // Filter staff whose designation includes "teacher" (case-insensitive)
      const teachingStaff = staffRes.data.filter(s => {
        const isTeacher = s.designation && s.designation.toLowerCase().includes('teacher');
        return isTeacher;
      });
      
      setTeachers(teachingStaff);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/teacher-assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="teacher-assignment">
      <div className="page-header">
        <h1>Teacher Subject Assignments</h1>
        <button className="add-btn" onClick={() => { setEditingAssignment(null); setShowForm(true); }}>
          + New Assignment
        </button>
      </div>

      <div className="assignments-table-container">
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id}>
                <td>{a.teacherName}</td>
                <td>{a.class}</td>
                <td>{a.subject}</td>
                <td className="actions">
                  <button onClick={() => { setEditingAssignment(a); setShowForm(true); }}>Edit</button>
                  <button onClick={() => handleDelete(a.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <AssignmentForm
          assignment={editingAssignment}
          teachers={teachers}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchData(); }}
          token={token}
        />
      )}
    </div>
  );
};

export default TeacherAssignment;