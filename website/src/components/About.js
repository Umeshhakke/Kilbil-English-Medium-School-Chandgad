import "./About.css";
import aboutImg from "../assets/about.png";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="about">

      <div className="about-container">

        {/* LEFT IMAGE */}
        <div className="about-image">
          <img src={aboutImg} alt="Students" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="about-content">

          <h2>About Our School</h2>

          <p>
            Kilbil English Medium School & Rajarshi Shahu Vidyaniketan, Chandgad
            has been committed to providing quality education since 2006.
            We focus on academic excellence along with discipline, values,
            and overall development of students.
          </p>

          <p>
            Our school provides a safe and engaging learning environment with
            experienced teachers, modern facilities, and strong academic support
            to help every student achieve success.
          </p>

          {/* BUTTON */}
          <Link to="/about" className="about-btn">
            Read More →
          </Link>

        </div>

      </div>

    </section>
  );
}