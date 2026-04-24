// import React, { useEffect, useState } from "react";
// import "../styles/Faculty.css";
// import { staffData } from "../data/staffData";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import imagelogo from "../images/p1.jpg";
// import Header from "../components/Header"

// const Faculty = () => {
//   const [scrolled, setScrolled] = useState(false);

//   // Navbar scroll effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 40);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Reveal animation
//   useEffect(() => {
//     const reveals = document.querySelectorAll(".reveal");

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("active");
//           }
//         });
//       },
//       { threshold: 0.15 }
//     );

//     reveals.forEach((el) => observer.observe(el));
//     return () => observer.disconnect();
//   }, []);

//   // Filter data
//   const leadership = staffData.teaching.filter(m =>
//     m.designation.toLowerCase().includes("principal")
//   );

//   const teachingStaff = staffData.teaching.filter(m =>
//     !m.designation.toLowerCase().includes("principal")
//   );

//   const nonTeaching = staffData.nonTeaching;

//   return (
//     <div className="faculty-page">
//         <Header />
//       <Navbar scrolled={scrolled} />

//       {/* HERO */}
//       <div className="faculty-hero">
//         <div className="hero-inner">
//           <span className="hero-tag">Kilbil Excellence</span>
//           <h1>Our <span>Faculty</span></h1>
//           <p>Inspiring minds. Building futures.</p>
//         </div>
//       </div>

//       <main className="faculty-container">

//         {/* LEADERSHIP */}
//         <section className="faculty-section reveal">
//           <h2 className="section-title">Executive Leadership</h2>

//           <div className="leadership-grid">
//             {leadership.map((m, i) => (
//               <div key={i} className="leader-card">
//                 <div className="leader-img">
//                   <img src={imagelogo} alt={m.name} />
//                 </div>

//                 <div className="leader-info">
//                   <span>Administration</span>
//                   <h3>{m.name}</h3>
//                   <p className="role">{m.designation}</p>
//                   <p className="edu">{m.education}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* TEACHING */}
//         <section className="faculty-section reveal">
//           <h2 className="section-title">Academic Staff</h2>

//           <div className="faculty-grid">
//             {teachingStaff.map((m, i) => (
//               <div key={i} className="faculty-card">
//                 <div className="avatar">
//                   <img src={imagelogo} alt={m.name} />
//                 </div>

//                 <h4>{m.name}</h4>
//                 <p className="designation">{m.designation}</p>
//                 <span className="edu-tag">{m.education}</span>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* NON TEACHING */}
//         <section className="faculty-section reveal">
//           <h2 className="section-title">Support Staff</h2>

//           <div className="faculty-grid">
//             {nonTeaching.map((m, i) => (
//               <div key={i} className="faculty-card">
//                 <div className="avatar">
//                   <img src={imagelogo} alt={m.name} />
//                 </div>

//                 <h4>{m.name}</h4>
//                 <p className="designation">{m.designation}</p>
//                 <span className="edu-tag">{m.education}</span>
//               </div>
//             ))}
//           </div>
//         </section>

//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default Faculty;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Faculty.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import imagelogo from "../images/p1.jpg";
import Header from "../components/Header";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Faculty = () => {
  const [scrolled, setScrolled] = useState(false);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reveal animation (does not depend on staff data)
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [staff]); // re-run when staff changes to observe new elements

  // Fetch staff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/api/staff`);
        // Ensure we always get an array
        const data = Array.isArray(response.data) ? response.data : [];
        console.log("Staff data loaded:", data.length, "members");
        setStaff(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load faculty data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // Filter helpers
  const leadership = staff.filter((m) => m.isLeadership === true);
  const teachingStaff = staff.filter(
    (m) => m.section !== "Non-Teaching" && m.isLeadership === false
  );
  const nonTeaching = staff.filter((m) => m.section === "Non-Teaching");

  // Log counts for debugging
  useEffect(() => {
    if (staff.length > 0) {
      console.log("Leadership:", leadership.length);
      console.log("Teaching:", teachingStaff.length);
      console.log("Non-teaching:", nonTeaching.length);
    }
  }, [staff, leadership, teachingStaff, nonTeaching]);

  // Loading
  if (loading) {
    return (
      <div className="faculty-page">
        <Header />
        <Navbar scrolled={scrolled} />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading faculty...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="faculty-page">
        <Header />
        <Navbar scrolled={scrolled} />
        <div className="error-container">
          <h2>Oops!</h2>
          <p>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  // No data (but not loading/error)
  if (staff.length === 0) {
    return (
      <div className="faculty-page">
        <Header />
        <Navbar scrolled={scrolled} />
        <div className="no-data-container">
          <p>No faculty members found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="faculty-page">
      <Header />
      <Navbar scrolled={scrolled} />

      {/* HERO */}
      <div className="faculty-hero">
        <div className="hero-inner">
          <span className="hero-tag">Kilbil Excellence</span>
          <h1>
            Our <span>Faculty</span>
          </h1>
          <p>Inspiring minds. Building futures.</p>
        </div>
      </div>

      <main className="faculty-container">
        {/* LEADERSHIP */}
        {leadership.length > 0 && (
          <section className="faculty-section reveal">
            <h2 className="section-title">Executive Leadership</h2>
            <div className="leadership-grid">
              {leadership.map((member) => (
                <div key={member.id} className="leader-card">
                  <div className="leader-img">
                    <img
                      src={member.image || imagelogo}
                      alt={member.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = imagelogo;
                      }}
                    />
                  </div>
                  <div className="leader-info">
                    <span>Administration</span>
                    <h3>{member.name}</h3>
                    <p className="role">{member.designation}</p>
                    <p className="edu">{member.education}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TEACHING STAFF */}
        {teachingStaff.length > 0 && (
          <section className="faculty-section reveal">
            <h2 className="section-title">Academic Staff</h2>
            <div className="faculty-grid">
              {teachingStaff.map((member) => (
                <div key={member.id} className="faculty-card">
                  <div className="avatar">
                    <img
                      src={member.image || imagelogo}
                      alt={member.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = imagelogo;
                      }}
                    />
                  </div>
                  <h4>{member.name}</h4>
                  <p className="designation">{member.designation}</p>
                  <span className="edu-tag">{member.education}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* NON-TEACHING */}
        {nonTeaching.length > 0 && (
          <section className="faculty-section reveal">
            <h2 className="section-title">Support Staff</h2>
            <div className="faculty-grid">
              {nonTeaching.map((member) => (
                <div key={member.id} className="faculty-card">
                  <div className="avatar">
                    <img
                      src={member.image || imagelogo}
                      alt={member.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = imagelogo;
                      }}
                    />
                  </div>
                  <h4>{member.name}</h4>
                  <p className="designation">{member.designation}</p>
                  <span className="edu-tag">{member.education}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Faculty;