// src/pages/admin/StaffManagement.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import StaffForm from "./StaffForm";
import "./StaffManagement.css";
import imagelogo from "../../images/p1.jpg";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  // 🔹 Fetch staff
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/staff`);
      setStaff(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load staff data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // 🔹 Delete staff (instant UI update)
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;

    try {
      console.log("Deleting:", id);

      await axios.delete(`${API_BASE_URL}/api/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ instant UI update (no flicker)
      setStaff(prev => prev.filter(member => member.id !== id));

    } catch (err) {
      alert("Failed to delete staff member");
      console.error(err);
    }
  };

  // 🔹 Edit
  const handleEdit = (member) => {
    setEditingStaff(member);
    setShowForm(true);
  };

  // 🔹 Add
  const handleAdd = () => {
    setEditingStaff(null);
    setShowForm(true);
  };

  // 🔹 Close form
  const handleFormClose = () => {
    setShowForm(false);
    setEditingStaff(null);
  };

  // 🔹 After add/edit
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingStaff(null);
    fetchStaff(); // refresh once
  };

  return (
    <div className="staff-management">

      {/* Header */}
      <div className="page-header">
        <h1>Staff Management</h1>
        <button className="add-btn" onClick={handleAdd}>
          + Add Staff Member
        </button>
      </div>

      {/* Error */}
      {error && <div className="error-banner">{error}</div>}

      {/* Loading (no flicker) */}
      {loading && <div className="loading">Loading...</div>}

      {/* Table */}
      <div className="staff-table-container">
        <table className="staff-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Education</th>
              <th>Section</th>
              <th>Leadership</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {staff.map((member) => (
              <tr key={member.id}>
                <td>
                  <img
                    src={member.image || imagelogo}
                    alt={member.name}
                    className="staff-thumb"
                    onError={(e) => (e.target.src = imagelogo)}
                  />
                </td>

                <td>{member.name}</td>
                <td>{member.designation}</td>
                <td>{member.education}</td>
                <td>{member.section}</td>
                <td>{member.isLeadership ? "Yes" : "No"}</td>

                <td className="actions">
                  <button
                    onClick={() => handleEdit(member)}
                    className="edit-btn"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(member.id, member.name)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <StaffForm
          staff={editingStaff}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          token={token}
        />
      )}
    </div>
  );
};

export default StaffManagement;