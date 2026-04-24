// import { useState } from "react";
// import "../styles/Admission.css";
// import Header from "../components/Header";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// export default function EnquiryForm() {

//   const [formData, setFormData] = useState({
//     studentName: "",
//     parentName: "",
//     phone: "",
//     email: "",
//     class: "",
//     message: ""
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.studentName || !formData.parentName || !formData.phone || !formData.class) {
//       alert("Please fill all required fields");
//       return;
//     }

//     console.log(formData);
//     alert("Your enquiry has been submitted successfully! 🎓");

//     setFormData({
//       studentName: "",
//       parentName: "",
//       phone: "",
//       email: "",
//       class: "",
//       message: ""
//     });
//   };

//   return (
//     <>
//       <Header />
//       <Navbar />

//       <div className="admission-page">

//         {/* 🔥 TITLE SECTION */}
//         <div className="admission-header">
//             <div className="admission-overlay">
//                 <h1>Admissions Open 2026–27</h1>
//                 <p>For Classes LKG to 10th</p>
//             </div>
//             </div>

//         {/* 🔥 FORM */}
//         <div className="enquiry-container">
//           <h2>Admission Enquiry Form</h2>

//           <form onSubmit={handleSubmit} className="enquiry-form">

//             <div className="form-group">
//               <label>Student Name *</label>
//               <input
//                 type="text"
//                 name="studentName"
//                 value={formData.studentName}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label>Parent / Guardian Name *</label>
//               <input
//                 type="text"
//                 name="parentName"
//                 value={formData.parentName}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label>Phone Number *</label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label>Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label>Class Applying For *</label>
//               <select
//                 name="class"
//                 value={formData.class}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Class</option>
//                 <option>LKG</option>
//                 <option>UKG</option>
//                 <option>Class 1</option>
//                 <option>Class 2</option>
//                 <option>Class 3</option>
//                 <option>Class 4</option>
//                 <option>Class 5</option>
//                 <option>Class 6</option>
//                 <option>Class 7</option>
//                 <option>Class 8</option>
//                 <option>Class 9</option>
//                 <option>Class 10</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Additional Message</label>
//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={handleChange}
//               />
//             </div>

//             <button type="submit" className="submit-btn">
//               Submit Enquiry 
//             </button>

//           </form>
//         </div>

//       </div>

//       <Footer />
//     </>
//   );
// }
import { useState } from "react";
import axios from "axios";
import "../styles/Admission.css";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { motion, AnimatePresence } from "framer-motion";
import {
  FaRunning,
  FaFileAlt,
  FaRupeeSign,
  FaWpforms,
  FaMusic,
  FaPaintBrush,
  FaTheaterMasks,
  FaLaptopCode,
  FaOm
} from "react-icons/fa";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AdmissionPage() {
  const [activeSection, setActiveSection] = useState("activities");

  // Form state for admission enquiry
  const [formData, setFormData] = useState({
    studentName: "",
    parentName: "",
    phone: "",
    email: "",
    class: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const animation = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.4 }
  };

  const activitiesData = [
    { 
        id: 1, 
        title: "Athletics & Sports", 
        icon: <FaRunning />, 
        img: "https://images.unsplash.com/photo-1517649763962-0c623066013b", 
        desc: "Fostering physical strength and competitive spirit through indoor and outdoor games." 
    },
    { 
        id: 2, 
        title: "Melody & Rhythm", 
        icon: <FaMusic />, 
        img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4", 
        desc: "Professional training in classical music, contemporary dance, and instrumental arts." 
    },
    { 
        id: 3, 
        title: "Visual Arts", 
        icon: <FaPaintBrush />, 
        img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f", 
        desc: "Encouraging creativity through pottery, oil painting, and modern craft techniques." 
    },
    { 
        id: 4, 
        title: "Theatre & Drama", 
        icon: <FaTheaterMasks />, 
        img: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf", 
        desc: "Building stage presence and public speaking confidence through annual productions." 
    },
    { 
        id: 5, 
        title: "STEM & Robotics", 
        icon: <FaLaptopCode />, 
        img: "https://images.unsplash.com/photo-1509062522246-3755977927d7", 
        desc: "Hands-on coding and robotics workshops to prepare students for a digital future." 
    },
    { 
        id: 6, 
        title: "Yoga & Wellness", 
        icon: <FaOm />, 
        img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b", 
        desc: "Promoting mental clarity and physical balance through ancient yoga and mindfulness." 
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
    
    try {
      await axios.post(`${API_BASE_URL}/api/enquiries`, formData);
      setSubmitSuccess(true);
      // Reset form after successful submission
      setFormData({
        studentName: "",
        parentName: "",
        phone: "",
        email: "",
        class: "",
        message: ""
      });
    } catch (err) {
      setSubmitError(err.response?.data?.error || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "activities":
        return (
          <motion.div {...animation} className="content-card">
            <div className="section-intro">
               <h2>Beyond the Classroom</h2>
               <p>Our holistic curriculum balances academic rigor with diverse extracurricular pursuits to nurture every child's unique talent.</p>
            </div>

            <div className="activities-grid">
              {activitiesData.map((item) => (
                <div key={item.id} className="activity-premium-card">
                  <div className="activity-image-wrapper">
                    <img src={item.img} alt={item.title} />
                    <div className="activity-icon-badge">{item.icon}</div>
                  </div>
                  <div className="activity-info">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <div className="decoration-line"></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case "documents":
        return (
          <motion.div {...animation} className="content-card">
            <h2>Required Documents</h2>
            <ul className="styled-list">
              <li><FaFileAlt /> Birth Certificate (Original + Copy)</li>
              <li><FaFileAlt /> Previous School Report Card</li>
              <li><FaFileAlt /> Student & Parent Aadhar Card</li>
              <li><FaFileAlt /> 4 Recent Passport Size Photos</li>
              <li><FaFileAlt /> Transfer Certificate (TC)</li>
            </ul>
          </motion.div>
        );

      case "fees":
        return (
          <motion.div {...animation} className="content-card">
            <h2>Fees Structure</h2>
            <div className="fee-box">
              <div className="fee-item">
                <span>LKG - UKG</span>
                <strong>₹20,000</strong>
              </div>
              <div className="fee-item">
                <span>Class 1-5</span>
                <strong>₹25,000</strong>
              </div>
              <div className="fee-item">
                <span>Class 6-10</span>
                <strong>₹30,000</strong>
              </div>
            </div>
          </motion.div>
        );

      case "enquiry":
        return (
          <motion.div {...animation} className="content-card">
            <h2>Admission Enquiry</h2>
            <form className="premium-form" onSubmit={handleSubmit}>
              {submitSuccess && (
                <div className="success-message">
                  ✅ Enquiry submitted successfully! We'll contact you soon.
                </div>
              )}
              {submitError && (
                <div className="error-message">
                  ❌ {submitError}
                </div>
              )}
              <div className="form-row">
                <input
                  name="studentName"
                  placeholder="Student Name *"
                  value={formData.studentName}
                  onChange={handleChange}
                  required
                />
                <input
                  name="parentName"
                  placeholder="Parent Name *"
                  value={formData.parentName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <input
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <select
                name="class"
                className="premium-select"
                value={formData.class}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Class for Admission
                </option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={`Class ${i + 1}`}>
                    Class {i + 1}
                  </option>
                ))}
              </select>
              <textarea
                name="message"
                placeholder="Tell us about your child's interests..."
                value={formData.message}
                onChange={handleChange}
              ></textarea>
              <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Enquiry"}
              </button>
            </form>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <Navbar />

      <div className="admission-page">
        <div className="admission-header">
          <div className="admission-overlay">
            <h1>Admissions Open 2026–27</h1>
            <p>Empowering Minds, Shaping Futures • LKG to 10th</p>
          </div>
        </div>

        <div className="premium-wrapper">
          <div className="circle-menu">
            <div
              className={`circle ${activeSection === "activities" ? "active" : ""}`}
              onClick={() => setActiveSection("activities")}
            >
              <FaRunning />
              <span>Activities</span>
            </div>
            <div
              className={`circle ${activeSection === "documents" ? "active" : ""}`}
              onClick={() => setActiveSection("documents")}
            >
              <FaFileAlt />
              <span>Documents</span>
            </div>
            <div
              className={`circle ${activeSection === "fees" ? "active" : ""}`}
              onClick={() => setActiveSection("fees")}
            >
              <FaRupeeSign />
              <span>Fees</span>
            </div>
            <div
              className={`circle ${activeSection === "enquiry" ? "active" : ""}`}
              onClick={() => setActiveSection("enquiry")}
            >
              <FaWpforms />
              <span>Enquiry</span>
            </div>
          </div>

          <div className="dynamic-section">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}