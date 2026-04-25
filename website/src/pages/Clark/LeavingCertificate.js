import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./LeavingCertificate.css";

const API_BASE = process.env.REACT_APP_API_URL ;

const initialState = {
  studentId: "",
  dateOfLeaving: new Date().toISOString().slice(0, 10),
  reasonForLeaving: "",
  progressInStudy: "",
  conduct: "",
  standardStudying: "",
  sinceWhen: "",
  remark: "",
};

const LeavingCertificate = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [formData, setFormData] = useState(initialState);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);
  const token = localStorage.getItem("clerkToken");

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/clerk/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleStudentSelect = async (e) => {
    const sid = e.target.value;
    setSelectedStudentId(sid);
    if (!sid) {
      setStudentData(null);
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/api/clerk/students/${sid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentData(res.data);
    } catch (err) {
      alert("Failed to load student details");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generatePreview = () => {
    if (!studentData) {
      alert("Please select a student");
      return;
    }
    setShowPreview(true);
  };

  const printCertificate = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(previewRef.current.outerHTML);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="page-container lc-container">
      <h2>Generate Leaving Certificate</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Select Student *</label>
          <select value={selectedStudentId} onChange={handleStudentSelect}>
            <option value="">-- Choose Student --</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.class})
              </option>
            ))}
          </select>
        </div>
      </div>

      {studentData && (
        <div className="additional-fields">
          <h3>Academic Details (to be filled by clerk)</h3>
          <div className="form-row two-col">
            <div className="form-group">
              <label>Date of Leaving *</label>
              <input type="date" name="dateOfLeaving" value={formData.dateOfLeaving} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Reason for Leaving *</label>
              <input type="text" name="reasonForLeaving" value={formData.reasonForLeaving} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Progress in Study</label>
              <input type="text" name="progressInStudy" value={formData.progressInStudy} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Conduct</label>
              <input type="text" name="conduct" value={formData.conduct} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Standard Studying Now</label>
              <input type="text" name="standardStudying" value={formData.standardStudying} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Since When</label>
              <input type="text" name="sinceWhen" value={formData.sinceWhen} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Remark</label>
              <input type="text" name="remark" value={formData.remark} onChange={handleChange} />
            </div>
          </div>
          <button className="primary-btn" onClick={generatePreview}>
            Generate Preview
          </button>
        </div>
      )}

      {showPreview && studentData && (
        <div className="lc-preview-section">
          <button className="primary-btn" onClick={printCertificate}>
            Print Certificate
          </button>
          <div className="lc-certificate" ref={previewRef}>
            {/* Header */}
            <div className="lc-header">
              <h2>Kilbil English Medium School</h2>
              <p>Chandgad, Kolhapur</p>
              <p className="lc-subtitle">Form of Leaving Certificate</p>
            </div>

            <div className="lc-school-info">
              <div><strong>Name of Management:</strong> Abhinav Education Society</div>
              <div><strong>Name of School:</strong> Kilbil English Medium School</div>
              <div><strong>Address:</strong> Chandgad, Kolhapur, Maharashtra</div>
              <div><strong>Phone No.:</strong> ---</div>
              <div><strong>Taluka:</strong> Chandgad</div>
              <div><strong>District:</strong> Kolhapur</div>
              <div><strong>Email:</strong> kilbil.school@example.com</div>
              <div><strong>Medium:</strong> English</div>
            </div>

            <h3 className="lc-main-title">School Leaving Certificate</h3>
            <p className="lc-original">( Original )</p>

            <table className="lc-table">
              <tbody>
                <tr><td>Student ID</td><td>{studentData.studentId || "---"}</td></tr>
                <tr><td>Aadhar No.</td><td>{studentData.aadhar || "---"}</td></tr>
                <tr><td>Student Full Name</td><td>{studentData.name}</td></tr>
                <tr><td>Mother's Name</td><td>{studentData.motherName || "---"}</td></tr>
                <tr><td>Nationality</td><td>{studentData.nationality || "Indian"}</td></tr>
                <tr><td>Mother Tongue</td><td>{studentData.motherTongue || "---"}</td></tr>
                <tr><td>Religion</td><td>{studentData.religion || "---"}</td></tr>
                <tr><td>Caste</td><td>{studentData.caste || "---"}</td></tr>
                <tr><td>Sub-Caste</td><td>{studentData.subCaste || "---"}</td></tr>
                <tr><td>Place of Birth</td><td>{studentData.placeOfBirth?.place || "---"} {studentData.placeOfBirth?.taluka ? `, ${studentData.placeOfBirth.taluka}` : ""}</td></tr>
                <tr><td>Tq. / Dist.</td><td>{studentData.placeOfBirth?.taluka || "---"} / {studentData.placeOfBirth?.district || "---"}</td></tr>
                <tr><td>State</td><td>{studentData.placeOfBirth?.state || "---"}</td></tr>
                <tr><td>Date of Birth</td><td>{studentData.dob || "---"}</td></tr>
                <tr><td>Previous School</td><td>{studentData.previousSchool || "---"}</td></tr>
                <tr><td>Class of Admission</td><td>{studentData.admissionClass || "---"}</td></tr>
                <tr><td>Date of Admission</td><td>{studentData.dateOfAdmission || "---"}</td></tr>
                <tr><td>Class at Leaving</td><td>{studentData.currentClass || studentData.class}</td></tr>
                <tr><td>Progress in Study</td><td>{formData.progressInStudy}</td></tr>
                <tr><td>Conduct</td><td>{formData.conduct}</td></tr>
                <tr><td>Date of Leaving</td><td>{formData.dateOfLeaving}</td></tr>
                <tr><td>Standard Studying Now</td><td>{formData.standardStudying}</td></tr>
                <tr><td>Since When</td><td>{formData.sinceWhen}</td></tr>
                <tr><td>Reason for Leaving</td><td>{formData.reasonForLeaving}</td></tr>
                <tr><td>Remark</td><td>{formData.remark}</td></tr>
              </tbody>
            </table>

            <div className="lc-certification">
              <p>This is to certify that the above information is true according to the school general register No. 1.</p>
            </div>

            <div className="lc-signatures">
              <div>Date: {formData.dateOfLeaving}</div>
              <div className="signatories">
                <div>Class Teacher</div>
                <div>Clerk</div>
                <div>Principal</div>
              </div>
            </div>

            <div className="lc-note">
              Note: A legal action will be taken on the concerned if made unauthorised changes in Leaving Certificate.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavingCertificate;