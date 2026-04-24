// src/pages/admin/EnquiryManagement.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './EnquiryManagement.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EnquiryManagement = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  const fetchEnquiries = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/enquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/enquiries/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEnquiries();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/enquiries/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEnquiries();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="loading">Loading enquiries...</div>;

  return (
    <div className="enquiry-management">
      <h1>Admission Enquiries</h1>
      <div className="enquiries-table-container">
        <table className="enquiries-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Student</th>
              <th>Parent</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Class</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map(enq => (
              <tr key={enq.id}>
                <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
                <td>{enq.studentName}</td>
                <td>{enq.parentName}</td>
                <td>{enq.phone}</td>
                <td>{enq.email || '-'}</td>
                <td>{enq.class}</td>
                <td className="message-cell">{enq.message || '-'}</td>
                <td>
                  <select 
                    value={enq.status} 
                    onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                    className={`status-select status-${enq.status}`}
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDelete(enq.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnquiryManagement;