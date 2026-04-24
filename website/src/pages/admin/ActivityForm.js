import React, { useState } from 'react';
import axios from 'axios';
import './ActivityForm.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ActivityForm = ({ activity, onClose, onSuccess, token }) => {
  const [formData, setFormData] = useState({
    title: activity?.title || '',
    description: activity?.description || '',
    type: activity?.type || 'popup',
    active: activity?.active ?? true,
    link: activity?.link || ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(activity?.image || '');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (image) data.append('image', image);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      if (activity?.id) {
        await axios.put(`${API_BASE_URL}/api/activities/${activity.id}`, data, config);
      } else {
        await axios.post(`${API_BASE_URL}/api/activities`, data, config);
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
          <h2>{activity ? 'Edit Activity' : 'New Activity'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="popup">Popup</option>
              <option value="announcement">Announcement Bar</option>
            </select>
          </div>
          <div className="form-group">
            <label>Link (optional)</label>
            <input name="link" value={formData.link} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
              Active (visible on site)
            </label>
          </div>
          <div className="form-group">
            <label>Image (for popup)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && <img src={preview} alt="Preview" className="image-preview" />}
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

export default ActivityForm;