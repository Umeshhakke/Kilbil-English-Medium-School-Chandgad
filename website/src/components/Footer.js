import './Footer.css';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="main-footer">

      <div className="footer-content">

        {/* BRAND */}
        <div className="footer-brand">
          <h2>KILBIL</h2>
          <p>English Medium School</p>

          <div className="social-links">
            <a href="/facebook"><FaFacebookF /></a>
            <a href="/insta"><FaInstagram /></a>
            <a href="/youtube"><FaYoutube /></a>
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/academics">Academics</a></li>
            <li><a href="/admissions">Admissions</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-contact">
          <h4>Contact Us</h4>

          <p><FaMapMarkerAlt /> Kalbhairav Galli, Chandgad, Maharashtra</p>
          <p><FaPhoneAlt /> +91 00000 00000</p>
          <p><FaEnvelope /> info@kilbilschool.com</p>
        </div>

        {/* MAP */}
        <div className="footer-map">

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4051.150573806135!2d74.17659561085885!3d15.942838242744969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc07f00388ef0b7%3A0x96edb5d9ed3f0ef4!2sABHINAV%20EDUCATION%20SOCIETY'S%20-%20KILBIL%20ENGLISH%20MEDIUM%20SCHOOL%20and%20RAJARSHI%20SHAHU%20VIDYA%20NIKETAN%20CHANDGAD!5e1!3m2!1sen!2sin!4v1775558435936!5m2!1sen!2sin"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="School Location"
          ></iframe>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Kilbil English Medium School. All Rights Reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;