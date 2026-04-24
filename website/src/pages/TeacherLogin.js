import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/TeacherLogin.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TeacherLogin = () => {
  const [staffCode, setStaffCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/teacher/auth/login`, { staffCode, password });
      localStorage.setItem('teacherToken', res.data.token);
      localStorage.setItem('teacherData', JSON.stringify(res.data.teacher));
      navigate('/teacher/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-login-page">
      <div className="login-container">
        <h1>Teacher Portal</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Staff Code (e.g., T001)"
            value={staffCode}
            onChange={(e) => setStaffCode(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;