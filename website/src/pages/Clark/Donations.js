import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Donations.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    donorName: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    mode: "cash",
    purpose: "",
  });
  const token = localStorage.getItem("clerkToken");

  const fetchDonations = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/clerk/donations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/clerk/donations`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowForm(false);
      setFormData({
        donorName: "",
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        mode: "cash",
        purpose: "",
      });
      fetchDonations();
    } catch (err) {
      alert("Failed to record donation: " + (err.response?.data?.error || err.message));
    }
  };

  const printReceipt = (donation) => {
    const receiptHtml = `
      <div style="width:300px; font-family: 'Courier New', monospace; padding:20px; border:1px dashed #000;">
        <h2 style="text-align:center;">Kilbil English Medium School</h2>
        <p style="text-align:center;">Donation Receipt</p>
        <hr />
        <p><strong>Receipt No:</strong> ${donation.receiptNo}</p>
        <p><strong>Date:</strong> ${donation.date}</p>
        <p><strong>Donor:</strong> ${donation.donorName}</p>
        <p><strong>Amount:</strong> ₹${donation.amount}</p>
        <p><strong>Mode:</strong> ${donation.mode}</p>
        <p><strong>Purpose:</strong> ${donation.purpose || 'Not specified'}</p>
        <hr />
        <p style="text-align:right;">Authorised Signatory</p>
      </div>
    `;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) return <div className="loading">Loading donations...</div>;

  return (
    <div className="page-container donations-container">
      <div className="page-header">
        <h2>Donations</h2>
        <button className="primary-btn" onClick={() => setShowForm(true)}>
          + Record Donation
        </button>
      </div>

      {/* Donation Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Record Donation</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Donor Name *</label>
                <input
                  type="text"
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Mode</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  >
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="online">Online Transfer</option>
                    <option value="dd">Demand Draft</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Purpose (optional)</label>
                  <input
                    type="text"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="e.g., Infrastructure Fund"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowForm(false)} className="secondary-btn">Cancel</button>
                <button type="submit" className="primary-btn">Save Donation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Donations List */}
      <div className="table-container" style={{ marginTop: 24 }}>
        <table>
          <thead>
            <tr>
              <th>Receipt No</th>
              <th>Date</th>
              <th>Donor</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Purpose</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id}>
                <td>{d.receiptNo}</td>
                <td>{d.date}</td>
                <td>{d.donorName}</td>
                <td>₹{d.amount}</td>
                <td>{d.mode}</td>
                <td>{d.purpose || "—"}</td>
                <td>
                  <button className="icon-btn" onClick={() => printReceipt(d)} title="Print Receipt">
                    🖨️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {donations.length === 0 && (
          <div className="empty-state">No donations recorded yet.</div>
        )}
      </div>
    </div>
  );
};

export default Donations;