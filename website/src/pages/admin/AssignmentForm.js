import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AssignmentForm = ({ assignment, teachers, onClose, onSuccess, token }) => {
  const [formData, setFormData] = useState({
    teacherId: assignment?.teacherId || '',
    class: assignment?.class || '',
    subject: assignment?.subject || '',
    isClassTeacher: assignment?.isClassTeacher || false
  });
  const [loading, setLoading] = useState(false);

  const classes = ['LKG', 'UKG', ...Array.from({ length: 10 }, (_, i) => `Class ${i + 1}`)];
  const subjects = [
    'English', 'Hindi', 'Marathi', 'Mathematics', 'Science', 'Social Studies',
    'Computer', 'Art', 'Physical Education', 'Music', 'Sanskrit'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedTeacher = teachers.find(t => t.id === formData.teacherId);
      // Subject can be empty string – we'll send null if empty
      const payload = {
        teacherId: formData.teacherId,
        class: formData.class,
        subject: formData.subject ? formData.subject : null,
        isClassTeacher: formData.isClassTeacher,
        teacherName: selectedTeacher?.name || ''
      };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (assignment?.id) {
        await axios.put(`${API_BASE_URL}/api/teacher-assignments/${assignment.id}`, payload, config);
      } else {
        await axios.post(`${API_BASE_URL}/api/teacher-assignments`, payload, config);
      }
      onSuccess();
    } catch (err) {
      alert('Operation failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{assignment ? 'Edit Assignment' : 'New Assignment'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Teacher *</label>
            <select name="teacherId" value={formData.teacherId} onChange={handleChange} required>
              <option value="">Select Teacher</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.designation})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Class *</label>
            <select name="class" value={formData.class} onChange={handleChange} required>
              <option value="">Select Class</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Subject dropdown – now optional */}
          <div className="form-group">
            <label>Subject (optional)</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="">-- No Subject (e.g., for Class Teacher only) --</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Select a subject if the teacher teaches one in this class.
            </small>
          </div>

          {/* Class Teacher Checkbox */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isClassTeacher"
                checked={formData.isClassTeacher}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    isClassTeacher: e.target.checked
                  });
                }}
              />
              <span className="checkmark"></span>
              Assign as Class Teacher for this class
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;