import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";

import {
  FaHome,
  FaInfoCircle,
  FaUserGraduate,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { MdSchool, MdPhotoLibrary, MdContactPhone } from "react-icons/md";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

        {/* LEFT: Hamburger */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* CENTER: Logo (ONLY on scroll) */}
        <div className="nav-left">
          {scrolled && (
            <div className="nav-brand">
              <img src={logo} alt="logo" />
              <span>Kilbil English Medium School</span>
            </div>
          )}
        </div>

        {/* NAV LINKS */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" onClick={()=>setMenuOpen(false)}><FaHome /> Home</Link></li>
          <li><Link to="/about" onClick={()=>setMenuOpen(false)}><FaInfoCircle /> About</Link></li>
          <li><Link to="/admission" onClick={()=>setMenuOpen(false)}><FaUserGraduate /> Admissions</Link></li>
          <li><Link to="/facilities" onClick={()=>setMenuOpen(false)}><MdSchool /> Facilities</Link></li>
          <li><Link to="/gallery" onClick={()=>setMenuOpen(false)}><MdPhotoLibrary /> Gallery</Link></li>
          <li><Link to="/faculty" onClick={()=>setMenuOpen(false)}><MdContactPhone /> Faculty</Link></li>
          <li><Link to="/contact" onClick={()=>setMenuOpen(false)}><MdContactPhone /> Contact</Link></li>
        </ul>

        {/* RIGHT: Apply Button */}
        <div className="nav-btn">
          <Link to="/admission">Apply Now</Link>
        </div>

      </div>
    </nav>
  );
}