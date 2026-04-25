import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./FeeCollection.css";

const API_BASE = process.env.REACT_APP_API_URL ;

const FeeCollection = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [feeInfo, setFeeInfo] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    mode: "cash",
  });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const receiptRef = useRef(null);
  const token = localStorage.getItem("clerkToken");

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/clerk/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleStudentSelect = async (e) => {
    const sid = e.target.value;
    setSelectedStudentId(sid);
    if (!sid) {
      setFeeInfo(null);
      setReceipt(null);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/clerk/fees/student/${sid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeeInfo(res.data);
      setReceipt(null);
    } catch (err) {
      alert("Failed to load fee details");
    } finally {
      setLoading(false);
    }
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.amount || parseFloat(paymentForm.amount) <= 0) {
      alert("Enter valid amount");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/api/clerk/fees/pay`,
        {
          studentId: selectedStudentId,
          amount: paymentForm.amount,
          date: paymentForm.date,
          mode: paymentForm.mode,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReceipt(res.data);
      // Refresh fee info
      handleStudentSelect({ target: { value: selectedStudentId } });
    } catch (err) {
      alert(err.response?.data?.error || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = () => {
    if (receiptRef.current) {
      const win = window.open("", "_blank");
      win.document.write(receiptRef.current.outerHTML);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="page-container fee-collection-container">
      <h2>Fee Collection</h2>

      <div className="form-group">
        <label>Select Student</label>
        <select value={selectedStudentId} onChange={handleStudentSelect}>
          <option value="">-- Choose Student --</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.class})
            </option>
          ))}
        </select>
      </div>

      {feeInfo && (
        <div className="fee-summary">
          <h3>
            {feeInfo.student.name} – {feeInfo.student.class}
          </h3>
          <div className="fee-stats">
            <div className="stat">
              <span>Annual Fee</span>
              <strong>₹{feeInfo.feeStructure.totalFee}</strong>
            </div>
            <div className="stat">
              <span>Paid</span>
              <strong>₹{feeInfo.feeStructure.paid}</strong>
            </div>
            <div className="stat">
              <span>Balance</span>
              <strong
                style={{
                  color: feeInfo.feeStructure.balance > 0 ? "#dc2626" : "#16a34a",
                }}
              >
                ₹{feeInfo.feeStructure.balance}
              </strong>
            </div>
            {feeInfo.feeStructure.nextInstallmentDate && (
              <div className="stat">
                <span>Next Installment</span>
                <strong>{feeInfo.feeStructure.nextInstallmentDate}</strong>
              </div>
            )}
          </div>

          <h4>Record Payment</h4>
          <form onSubmit={handlePaySubmit} className="payment-form">
            <div className="form-row">
              <div className="form-group">
                <label>Amount (₹) *</label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  min="1"
                  step="any"
                  required
                />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mode</label>
                <select
                  value={paymentForm.mode}
                  onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                >
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
            </div>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Processing..." : "Submit Payment"}
            </button>
          </form>
        </div>
      )}

      {receipt && (
        <div className="receipt-section">
          <button className="primary-btn" onClick={printReceipt}>
            Print Receipt
          </button>
          <div className="receipt" ref={receiptRef}>
            <div className="receipt-header">
              <h2>Kilbil English Medium School</h2>
              <p>Chandgad, Kolhapur</p>
              <h3>Fee Payment Receipt</h3>
            </div>
            <div className="receipt-details">
              <p>
                <strong>Receipt No:</strong> {receipt.receipt.receiptNo}
              </p>
              <p>
                <strong>Date:</strong> {receipt.receipt.date}
              </p>
              <p>
                <strong>Student:</strong> {receipt.student.name} ({receipt.student.class})
              </p>
              <p>
                <strong>Amount Paid:</strong> ₹{receipt.receipt.amount} ({receipt.receipt.amountWords})
              </p>
              <p>
                <strong>Payment Mode:</strong> {receipt.receipt.mode}
              </p>
              <p>
                <strong>Next Installment Due:</strong> {receipt.nextInstallmentDate}
              </p>
            </div>
            <div className="receipt-footer">
              <p>This is a computer-generated receipt.</p>
              <div className="sign-section">
                <span>Clerk Signature</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeCollection;