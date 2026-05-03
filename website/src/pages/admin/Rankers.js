import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Rankers.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Rankers = () => {
  const [toppers, setToppers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    rank: "1st",
    marks: "",
    class: "Class 9",
    year: new Date().getFullYear().toString(),
    image: null
  });
  const [preview, setPreview] = useState("");
  const token = localStorage.getItem("adminToken");

  const fetchToppers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/toppers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToppers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
     fetchToppers(); }, [fetchToppers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("rank", formData.rank);
    data.append("marks", formData.marks);
    data.append("class", formData.class);
    data.append("year", formData.year);
    if (formData.image) data.append("image", formData.image);

    try {
      if (editing) {
        await axios.put(`${API_BASE}/api/toppers/${editing.id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`${API_BASE}/api/toppers`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        });
      }
      setShowForm(false);
      setEditing(null);
      fetchToppers();
    } catch (err) {
      alert(err.response?.data?.error || "Operation failed");
    }
  };

  const handleEdit = (topper) => {
    setEditing(topper);
    setFormData({
      name: topper.name,
      rank: topper.rank,
      marks: topper.marks,
      class: topper.class,
      year: topper.year,
      image: null
    });
    setPreview(topper.image ? `${API_BASE}/${topper.image}` : "");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this topper?")) return;
    try {
      await axios.delete(`${API_BASE}/api/toppers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchToppers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="rankers-container page-container">
      <div className="page-header">
        <h2>Rankers Management</h2>
        <button className="primary-btn" onClick={() => { setEditing(null); setFormData({ name: "", rank: "1st", marks: "", class: "Class 9", year: new Date().getFullYear().toString(), image: null }); setPreview(""); setShowForm(true); }}>
          + Add Topper
        </button>
      </div>

      <div className="toppers-table-wrapper">
        <table className="toppers-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Class</th>
              <th>Rank</th>
              <th>Marks</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {toppers.map(t => (
              <tr key={t.id}>
                <td>
                  {t.image && <img src={`${API_BASE}/${t.image}`} alt={t.name} className="thumb" />}
                </td>
                <td>{t.name}</td>
                <td>{t.class}</td>
                <td>{t.rank}</td>
                <td>{t.marks}</td>
                <td>{t.year}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(t)}>Edit</button>
                  <button onClick={() => handleDelete(t.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editing ? "Edit Topper" : "Add Topper"}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Rank *</label>
                  <select name="rank" value={formData.rank} onChange={handleChange} required>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Class *</label>
                  <select name="class" value={formData.class} onChange={handleChange} required>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Marks (%) *</label>
                  <input name="marks" value={formData.marks} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <input name="year" value={formData.year} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Photo</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {preview && <img src={preview} alt="Preview" className="image-preview" />}
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit">{editing ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rankers;