import React, { useState } from "react";
import "./ContactSticky.css";
import { FaPhone, FaWhatsapp, FaEnvelope, FaTimes } from "react-icons/fa";

export default function ContactSticky() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fab-container">

      {/* Options */}
      <div className={`fab-options ${open ? "open" : ""}`}>
        
        <a href="tel:+91 9421209020" className="fab-icon phone" title="Call Us">
          <FaPhone />
        </a>

        <a
          href="https://wa.me/919421209020?text=Hello%20I%20want%20to%20know%20about%20admissions"
          target="_blank"
          rel="noopener noreferrer"
          className="fab-icon whatsapp"
          title="WhatsApp"
        >
          <FaWhatsapp />
        </a>

        <a href="mailto:school@email.com" className="fab-icon email" title="Email">
          <FaEnvelope />
        </a>
      </div>

      {/* Main Button */}
      <button
        className={`fab-main ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <>
            <FaTimes />
            <span>Close</span>
          </>
        ) : (
          <>
            <FaPhone />
            <span>Contact Us</span>
          </>
        )}
      </button>

    </div>
  );
}