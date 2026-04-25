import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ClerkHome.css";
import {
  FaUserGraduate,
  FaMoneyBill,
  FaHandHoldingHeart,
  FaCalendarCheck,
  FaArrowRight,
  FaFileAlt,
  FaIdCard,
} from "react-icons/fa";

const API_BASE = process.env.REACT_APP_API_URL ;

const ClerkHome = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFeesCollected: 0,
    pendingFees: 0,
    totalDonations: 0,
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("clerkToken");

  const fetchDashboardData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [studentsRes, donationsRes, paymentsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/students`, { headers }),
        axios.get(`${API_BASE}/api/clerk/donations`, { headers }),
        axios.get(`${API_BASE}/api/clerk/fees/recent`, { headers }) // optional – we'll create if missing, else empty
      ]);

      const students = studentsRes.data;
      const donations = donationsRes.data;
      const payments = paymentsRes?.data || [];

      // Calculate total fees collected (simplified – sum of all payments)
      const totalFees = payments.reduce((sum, p) => sum + p.amount, 0);

      // Total pending fees – you can enhance with a backend summary endpoint
      // For now, a rough estimate: assume 60% of students have pending fees
      const pendingFees = students.length * 5000; // placeholder – replace with real data

      setStats({
        totalStudents: students.length,
        totalFeesCollected: totalFees,
        pendingFees: pendingFees,
        totalDonations: donations.reduce((sum, d) => sum + d.amount, 0),
        recentPayments: payments.slice(0, 5)
      });
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, [token]); // token is dependency

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  if (loading) {
    return <div className="clerk-home-loading">Loading dashboard...</div>;
  }

  return (
    <div className="clerk-home">
      <div className="welcome-section">
        <h1>Welcome, Clerk</h1>
        <p>Here's a quick overview of school records today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate("enrollment")}>
          <div className="stat-icon student-icon"><FaUserGraduate /></div>
          <div className="stat-info">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("fees")}>
          <div className="stat-icon fees-icon"><FaMoneyBill /></div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.totalFeesCollected)}</h3>
            <p>Fees Collected</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon pending-icon"><FaCalendarCheck /></div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.pendingFees)}</h3>
            <p>Pending Fees (approx.)</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("donations")}>
          <div className="stat-icon donation-icon"><FaHandHoldingHeart /></div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.totalDonations)}</h3>
            <p>Donations Received</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <div className="quick-action" onClick={() => navigate("admissions")}>
            <FaUserGraduate />
            <span>New Admission</span>
            <FaArrowRight className="arrow" />
          </div>
          <div className="quick-action" onClick={() => navigate("bonafide")}>
            <FaFileAlt />
            <span>Generate Bonafide</span>
            <FaArrowRight className="arrow" />
          </div>
          <div className="quick-action" onClick={() => navigate("idcard")}>
            <FaIdCard />
            <span>Print ID Card</span>
            <FaArrowRight className="arrow" />
          </div>
          <div className="quick-action" onClick={() => navigate("fees")}>
            <FaMoneyBill />
            <span>Collect Fee</span>
            <FaArrowRight className="arrow" />
          </div>
        </div>
      </div>

      {/* Recent Payments (optional) */}
      {stats.recentPayments.length > 0 && (
        <div className="recent-section">
          <h2>Recent Fee Payments</h2>
          <div className="recent-list">
            {stats.recentPayments.map((pay, idx) => (
              <div key={idx} className="recent-item">
                <span>{pay.studentName}</span>
                <span>{pay.date}</span>
                <span>{formatCurrency(pay.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClerkHome;