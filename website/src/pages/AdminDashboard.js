import React from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import "../styles/AdminDashboard.css";

// Import icons from react-icons
import { FaUsers, FaImages, FaSchool, FaCalendarAlt, FaEnvelope, FaChalkboardTeacher, FaMoneyBillWave } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Kilbil Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="staff" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <span className="nav-icon"><FaUsers /></span>
            <span>Staff Management</span>
          </NavLink>
          <NavLink to="gallery" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <span className="nav-icon"><FaImages /></span>
            <span>Gallery</span>
          </NavLink>
          <NavLink to="facilities" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <span className="nav-icon"><FaSchool /></span>
            <span>Facilities</span>
          </NavLink>
          <NavLink to="activities" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <span className="nav-icon"><FaCalendarAlt /></span>
            <span>Activities</span>
          </NavLink>
          <NavLink to="messages" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <span className="nav-icon"><FaEnvelope /></span>
            <span>Messages</span>
          </NavLink>
          <NavLink to="teachers" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <span className="nav-icon"><FaChalkboardTeacher /></span>
            <span>Teachers</span>
          </NavLink>
          <NavLink to="fee-structure" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <span className="nav-icon"><FaMoneyBillWave /></span>
            <span>Fee Structure</span>
          </NavLink>
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          <span><FaUsers style={{ marginRight: '8px' }} /></span> Logout
        </button>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;