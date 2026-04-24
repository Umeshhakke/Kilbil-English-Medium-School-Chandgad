import React, { useState } from "react";
import axios from "axios";
import "./AdmissionForm.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const initialFormData = {
  studentId: "",
  // Student names
  fname: "",
  mname: "",
  lname: "",
  // Mother names
  motherFname: "",
  motherMname: "",
  motherLname: "",
  // Father names
  fatherFname: "",
  fatherMname: "",
  fatherLname: "",
  // Demographics
  nationality: "Indian",
  motherTongue: "",
  religion: "",
  caste: "",
  subCaste: "",
  // Place of birth
  placeOfBirth: "",
  taluka: "",
  district: "",
  city: "",
  state: "",
  // Date of birth
  dob: "",
  dobWords: "",
  // Previous school
  previousSchool: "",
  // Admission details
  admissionClass: "",
  dateOfAdmission: "",
  currentClass: "",
};

const Admissions = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Convert date to words (simple example – can be enhanced)
  const convertDateToWords = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-IN", options);
  };

  // Auto-fill dobWords when dob changes
  const handleDobChange = (e) => {
    const dob = e.target.value;
    setFormData((prev) => ({
      ...prev,
      dob,
      dobWords: convertDateToWords(dob),
    }));
  };

  // Combine name fields
  const combineNames = (f, m, l) => {
    return [f, m, l].filter(Boolean).join(" ").trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Prepare payload
    const payload = {
      studentId: formData.studentId,
      fullName: combineNames(formData.fname, formData.mname, formData.lname),
      motherName: combineNames(formData.motherFname, formData.motherMname, formData.motherLname),
      fatherName: combineNames(formData.fatherFname, formData.fatherMname, formData.fatherLname),
      nationality: formData.nationality,
      motherTongue: formData.motherTongue,
      religion: formData.religion,
      caste: formData.caste,
      subCaste: formData.subCaste,
      placeOfBirth: {
        place: formData.placeOfBirth,
        taluka: formData.taluka,
        district: formData.district,
        city: formData.city,
        state: formData.state,
      },
      dob: formData.dob,
      dobWords: formData.dobWords,
      previousSchool: formData.previousSchool || null,
      admissionClass: formData.admissionClass,
      dateOfAdmission: formData.dateOfAdmission,
      currentClass: formData.currentClass || formData.admissionClass,
    };

    try {
      // Placeholder API call – will be implemented in backend
      await axios.post(`${API_BASE}/api/clerk/admissions`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("clerkToken")}` },
      });
      console.log("Admission payload:", payload);
      setMessage({ type: "success", text: "Admission recorded successfully (console)." });
      setFormData(initialFormData);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Error submitting form." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>New Student Admission</h2>
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admission-form">
        {/* Student ID */}
        <div className="form-row">
          <div className="form-group">
            <label>Student ID (assigned by clerk) *</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              placeholder="e.g., STU-2025-001"
            />
          </div>
        </div>

        {/* Student Name */}
        <fieldset className="fieldset">
          <legend>Student Full Name</legend>
          <div className="form-row three-col">
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" name="fname" value={formData.fname} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Middle Name</label>
              <input type="text" name="mname" value={formData.mname} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" name="lname" value={formData.lname} onChange={handleChange} required />
            </div>
          </div>
        </fieldset>

        {/* Mother Name */}
        <fieldset className="fieldset">
          <legend>Mother's Full Name</legend>
          <div className="form-row three-col">
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" name="motherFname" value={formData.motherFname} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Middle Name</label>
              <input type="text" name="motherMname" value={formData.motherMname} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" name="motherLname" value={formData.motherLname} onChange={handleChange} required />
            </div>
          </div>
        </fieldset>

        {/* Father Name */}
        <fieldset className="fieldset">
          <legend>Father's Full Name</legend>
          <div className="form-row three-col">
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" name="fatherFname" value={formData.fatherFname} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Middle Name</label>
              <input type="text" name="fatherMname" value={formData.fatherMname} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" name="fatherLname" value={formData.fatherLname} onChange={handleChange} required />
            </div>
          </div>
        </fieldset>

        {/* Demographics */}
        <fieldset className="fieldset">
          <legend>Demographics</legend>
          <div className="form-row two-col">
            <div className="form-group">
              <label>Nationality</label>
              <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Mother Tongue *</label>
              <input type="text" name="motherTongue" value={formData.motherTongue} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Religion *</label>
              <input type="text" name="religion" value={formData.religion} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Caste</label>
              <input type="text" name="caste" value={formData.caste} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Sub‑Caste</label>
              <input type="text" name="subCaste" value={formData.subCaste} onChange={handleChange} />
            </div>
          </div>
        </fieldset>

        {/* Place of Birth */}
        <fieldset className="fieldset">
          <legend>Place of Birth</legend>
          <div className="form-row two-col">
            <div className="form-group">
              <label>Place/Village</label>
              <input type="text" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Taluka</label>
              <input type="text" name="taluka" value={formData.taluka} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} />
            </div>
          </div>
        </fieldset>

        {/* Date of Birth */}
        <div className="form-row two-col">
          <div className="form-group">
            <label>Date of Birth *</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleDobChange} required />
          </div>
          <div className="form-group">
            <label>DOB in Words</label>
            <input type="text" name="dobWords" value={formData.dobWords} readOnly />
          </div>
        </div>

        {/* Previous School */}
        <div className="form-group">
          <label>Previous School (if any)</label>
          <input type="text" name="previousSchool" value={formData.previousSchool} onChange={handleChange} />
        </div>

        {/* Admission Details */}
        <fieldset className="fieldset">
          <legend>Admission Details</legend>
          <div className="form-row two-col">
            <div className="form-group">
              <label>Class of Admission *</label>
              <select name="admissionClass" value={formData.admissionClass} onChange={handleChange} required>
                <option value="">Select Class</option>
                {["LKG","UKG",...Array.from({length:10},(_,i)=>`Class ${i+1}`)].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date of Admission *</label>
              <input type="date" name="dateOfAdmission" value={formData.dateOfAdmission} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Current Class (will be updated yearly)</label>
              <select name="currentClass" value={formData.currentClass} onChange={handleChange}>
                <option value="">Same as admission class</option>
                {["LKG","UKG",...Array.from({length:10},(_,i)=>`Class ${i+1}`)].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Admission"}
          </button>
          <button type="button" className="secondary-btn" onClick={() => setFormData(initialFormData)}>
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default Admissions;