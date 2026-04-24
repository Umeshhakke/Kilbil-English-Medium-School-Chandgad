import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ActivityForm from './ActivityForm';
import './ActivityManagement.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ActivityManagement = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const token = localStorage.getItem('adminToken');

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/activities`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchActivities();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      await axios.put(`${API_BASE_URL}/api/activities/${id}`, 
        { active: !currentActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchActivities();
    } catch (err) {
      alert('Failed to update');
    }
  };

  if (loading) return <div className="loading">Loading activities...</div>;

  return (
    <div className="activity-management">
      <div className="page-header">
        <h1>Activities & Announcements</h1>
        <button className="add-btn" onClick={() => { setEditingActivity(null); setShowForm(true); }}>
          + New Activity
        </button>
      </div>

      <div className="activities-table-container">
        <table className="activities-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Type</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(act => (
              <tr key={act.id}>
                <td>
                  {act.image && (
                    <img 
                      src={act.image.startsWith('http') ? act.image : `${API_BASE_URL}/${act.image}`} 
                      alt={act.title}
                      className="activity-thumb"
                    />
                  )}
                </td>
                <td>{act.title}</td>
                <td>{act.type}</td>
                <td>
                  <button 
                    className={`toggle-btn ${act.active ? 'active' : ''}`}
                    onClick={() => handleToggleActive(act.id, act.active)}
                  >
                    {act.active ? 'ON' : 'OFF'}
                  </button>
                </td>
                <td className="actions">
                  <button onClick={() => { setEditingActivity(act); setShowForm(true); }}>Edit</button>
                  <button onClick={() => handleDelete(act.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ActivityForm
          activity={editingActivity}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchActivities(); }}
          token={token}
        />
      )}
    </div>
  );
};

export default ActivityManagement;