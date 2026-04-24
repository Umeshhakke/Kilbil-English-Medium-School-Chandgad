import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaFileAlt,
  FaIdCard,
  FaUserGraduate,
  FaFileInvoice,
  FaMoneyBill,
  FaHandHoldingHeart,
  FaSignOutAlt
} from "react-icons/fa";
import "../styles/ClerkDashboard.css";

const ClerkDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("clerkToken");
    localStorage.removeItem("clerkData");
    navigate("/clerk/login");
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Clerk Portal</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="admissions" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <FaUserPlus /> <span>Admissions</span>
          </NavLink>
          <NavLink to="bonafide" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <FaFileAlt /> <span>Bonafide Certificate</span>
          </NavLink>
          <NavLink to="idcard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <FaIdCard /> <span>ID Card</span>
          </NavLink>
          <NavLink to="enrollment" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <FaUserGraduate /> <span>Student Enrollment</span>
          </NavLink>
          <NavLink to="lc" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <FaFileInvoice /> <span>Leaving Certificate</span>
          </NavLink>
          <NavLink to="fees" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <FaMoneyBill /> <span>Fee Collection</span>
          </NavLink>
          <NavLink to="donations" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <FaHandHoldingHeart /> <span>Donations</span>
          </NavLink>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>
      <main className="admin-content">
        <Outlet />   {/* index route renders ClerkHome here */}
      </main>
    </div>
  );
};

export default ClerkDashboard;