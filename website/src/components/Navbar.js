import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

import { FaHome, FaInfoCircle, FaUserGraduate } from "react-icons/fa";
import { MdSchool, MdPhotoLibrary, MdContactPhone } from "react-icons/md";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">

        {/* LEFT: LOGO (ONLY AFTER SCROLL) */}
        <div className="nav-left">
          {scrolled && (
            <div className="nav-brand">
              <img src={logo} alt="logo" />
              <span>Kilbil English Medium School</span>
            </div>
          )}
        </div>

        {/* HAMBURGER */}
        <button 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* CENTER LINKS */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/"><FaHome /> Home</Link></li>
          <li><Link to="/about"><FaInfoCircle /> About</Link></li>
          <li><Link to="/admission"><FaUserGraduate /> Admissions</Link></li>
          <li><Link to="/facilities"><MdSchool /> Facilities</Link></li>
          <li><Link to="/gallery"><MdPhotoLibrary /> Gallery</Link></li>
          <li><Link to="/Faculty"><MdContactPhone /> Faculty</Link></li>
          <li><Link to="/contact"><MdContactPhone /> Contact</Link></li>
          
        </ul>

        {/* RIGHT BUTTON */}
        <div className="nav-btn">
          <Link to="/admin/login">Apply Now</Link>
        </div>

      </div>
    </nav>
  );
}