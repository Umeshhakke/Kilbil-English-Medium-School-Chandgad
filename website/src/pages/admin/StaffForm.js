// src/pages/admin/StaffForm.js
import React, { useState } from "react";
import axios from "axios";
import "./StaffForm.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const StaffForm = ({ staff, onClose, onSuccess, token }) => {
  const [formData, setFormData] = useState({
    name: staff?.name || "",
    designation: staff?.designation || "",
    education: staff?.education || "",
    section: staff?.section || "Group 1",
    isLeadership: staff?.isLeadership || false,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(staff?.image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
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
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("education", formData.education);
      data.append("section", formData.section);
      data.append("isLeadership", formData.isLeadership);
      if (image) {
        data.append("image", image);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      };

      if (staff?.id) {
        await axios.put(`${API_BASE_URL}/api/staff/${staff.id}`, data, config);
      } else {
        await axios.post(`${API_BASE_URL}/api/staff`, data, config);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{staff ? "Edit Staff Member" : "Add New Staff Member"}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Designation *</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Education</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Section</label>
              <select name="section" value={formData.section} onChange={handleChange}>
                <option value="Group 1">Group 1</option>
                <option value="Group 2">Group 2</option>
                <option value="Non-Teaching">Non-Teaching</option>
              </select>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isLeadership"
                checked={formData.isLeadership}
                onChange={handleChange}
              />
              Leadership Role (Principal/Vice-Principal)
            </label>
          </div>

          <div className="form-group">
            <label>Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Saving..." : (staff ? "Update" : "Add")}
            </button>
          </div>
          {/* Inside StaffForm.js, after other fields */}
          <div className="form-row">
            <div className="form-group">
              <label>Staff Code (for teacher login)</label>
              <input
                type="text"
                name="staffCode"
                value={formData.staffCode || ''}
                onChange={handleChange}
                placeholder="e.g., T001"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password || ''}
                onChange={handleChange}
                placeholder="Leave blank to keep unchanged"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;