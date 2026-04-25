import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./FeeStructure.css";

const API_BASE = process.env.REACT_APP_API_URL ;

const defaultFees = {
  "LKG": 20000, "UKG": 20000,
  "Class 1": 25000, "Class 2": 25000, "Class 3": 25000,
  "Class 4": 25000, "Class 5": 25000,
  "Class 6": 30000, "Class 7": 30000, "Class 8": 30000,
  "Class 9": 30000, "Class 10": 30000
};

const FeeStructure = () => {
  const [fees, setFees] = useState(defaultFees);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("adminToken");

  const fetchFeeStructure = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/fee-structure`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.fees) {
        setFees(res.data.fees);
      }
    } catch (err) {
      console.error("Failed to load fee structure", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchFeeStructure();
  }, [fetchFeeStructure]);

  const handleChange = (cls, value) => {
    setFees(prev => ({ ...prev, [cls]: parseInt(value) || 0 }));
  };

  const saveFeeStructure = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_BASE}/api/admin/fee-structure`, { fees }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Fee structure updated successfully!");
    } catch (err) {
      alert("Failed to save: " + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="fee-structure-container">
      <h2>Fee Structure Management</h2>
      <p className="subtitle">Set annual fees for each class</p>
      <div className="fee-grid">
        {Object.entries(fees).map(([cls, amount]) => (
          <div key={cls} className="fee-item">
            <label>{cls}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleChange(cls, e.target.value)}
              min="0"
              step="1000"
            />
          </div>
        ))}
      </div>
      <button className="primary-btn" onClick={saveFeeStructure} disabled={saving}>
        {saving ? "Saving..." : "Save Fee Structure"}
      </button>
    </div>
  );
};

export default FeeStructure;