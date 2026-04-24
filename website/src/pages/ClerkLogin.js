import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ClerkLogin.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ClerkLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Debug logs (remove after issue resolved)
    console.log("Sending to:", `${API_BASE_URL}/api/clerk/auth/login`);
    console.log("Payload:", { email, password });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/clerk/auth/login`,
        { email, password }
      );

      console.log("Response:", res.data);

      if (res.data.role !== "clerk") {
        setError("Access denied. Only clerks can log in here.");
        return;
      }

      localStorage.setItem("clerkToken", res.data.token);
      localStorage.setItem("clerkData", JSON.stringify(res.data.user));
      navigate("/clerk/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.status, err.response?.data);
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clerk-login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Clerk Portal</h1>
          <p>Admissions, Fees, Certificates &amp; more</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="clerk@kilbil.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </form>
        <div className="login-footer">
          <span>© Kilbil English Medium School</span>
        </div>
      </div>
    </div>
  );
};

export default ClerkLogin;