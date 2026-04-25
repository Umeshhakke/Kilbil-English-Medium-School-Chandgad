import React, { useState } from "react";
import axios from "axios";
import "../styles/Contact.css";
import phonelogo from "../assets/phone.png";
import locationlogo from "../assets/location.png";
import emaillogo from "../assets/email.png";
import officelogo from "../assets/office.png";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [status, setStatus] = useState("");

  // CHAT STATES (NEW)
  const [chatOpen, setChatOpen] = useState(false);
  const [selected, setSelected] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await axios.post(`${API_BASE_URL}/api/contact`, form);
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });

      setTimeout(() => setStatus(""), 3000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="contact-page">
      <Header /> 
      <Navbar />
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>Contact Our Institution</h1>
          <p>Admissions • Support • General Enquiries</p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="container">

        {/* LEFT */}
        <div className="card info-card">
          <h2>Contact Information</h2>

          <div className="info-item">
            <img src={locationlogo} alt="location" />
            <div>
              <h4>Address</h4>
              <p>Kilbil English Medium School, Maharashtra</p>
            </div>
          </div>

          <div className="info-item">
            <img src={phonelogo} alt="phone" />
            <div>
              <h4>Phone</h4>
              <p>+91 9876543210</p>
            </div>
          </div>

          <div className="info-item">
            <img src={emaillogo} alt="email" />
            <div>
              <h4>Email</h4>
              <p>school@email.com</p>
            </div>
          </div>

          <div className="info-item">
            <img src={officelogo} alt="time" />
            <div>
              <h4>Office Hours</h4>
              <p>Mon - Sat | 9:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="card form-card">
          <h2>Send Message</h2>

          <form onSubmit={handleSubmit}>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
            />

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows="5"
              required
            />

            <button type="submit">
              {status === "loading" ? "Sending..." : "Submit Enquiry"}
            </button>

            {status === "success" && (
              <p className="success">Your message has been submitted successfully.</p>
            )}

            {status === "error" && (
              <p className="error">Something went wrong. Please try again.</p>
            )}
          </form>
        </div>
      </section>

      {/* MAP */}
      <section className="map-section">
        <h2>Our Location</h2>
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4051.150573806135!2d74.17659561085885!3d15.942838242744969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc07f00388ef0b7%3A0x96edb5d9ed3f0ef4!2sABHINAV%20EDUCATION%20SOCIETY'S%20-%20KILBIL%20ENGLISH%20MEDIUM%20SCHOOL%20and%20RAJARSHI%20SHAHU%20VIDYA%20NIKETAN%20CHANDGAD!5e1!3m2!1sen!2sin!4v1775558435936!5m2!1sen!2sin"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="School Location"
          ></iframe>
      </section>

      {/* CTA (UPDATED WITH CHAT BUTTON) */}
      <section className="cta">
        <div className="cta-box">
          <h2>Need Immediate Assistance?</h2>
          <p>Get instant answers or connect with support team</p>

          <button className="btn" onClick={() => setChatOpen(true)}>
            Chat with AI Support
          </button>
        </div>
      </section>

      {/* FLOAT CHAT MODAL (NEW FEATURE) */}
      {chatOpen && (
        <div className="chat-overlay">
          <div className="chat-box">

            {/* HEADER */}
            <div className="chat-header">
              <div>
                <h3>AI Support Assistant</h3>
                <p>We usually reply instantly</p>
              </div>

              <button
                className="chat-close"
                onClick={() => {
                  setChatOpen(false);
                  setSelected("");
                }}
              >
                ✕
              </button>
            </div>

            {/* OPTIONS */}
            <div className="chat-options">
              <button onClick={() => setSelected("admission")}>
                Admission Enquiry
              </button>

              <button onClick={() => setSelected("fees")}>
                Fee Structure
              </button>

              <button onClick={() => setSelected("docs")}>
                Documents Required
              </button>

              <button onClick={() => setSelected("transport")}>
                Transport Details
              </button>

              <button onClick={() => setSelected("general")}>
                General Support
              </button>
            </div>

            {/* RESPONSE AREA (CHAT STYLE) */}
            <div className="chat-response-box">

              {!selected && (
                <div className="chat-bot">
                  👋 Hello! Select a topic to get instant help.
                </div>
              )}

              {selected && (
                <>
                  <div className="chat-user">
                    Selected: {selected}
                  </div>

                  <div className="chat-bot">
                    {selected === "admission" && "Admissions are open from April to June every year."}
                    {selected === "fees" && "Fee structure depends on class. Please contact office."}
                    {selected === "docs" && "Required: Birth certificate, photos, previous marksheet."}
                    {selected === "transport" && "Bus facility available within 15km radius."}
                    {selected === "general" && "Please contact administration office for help."}
                  </div>
                </>
              )}

            </div>

            {/* FOOTER ACTION */}
            <div className="chat-footer">
              <button
                className="chat-end-btn"
                onClick={() => {
                  setChatOpen(false);
                  setSelected("");
                }}
              >
                End Chat
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />

    </div>
  );
}