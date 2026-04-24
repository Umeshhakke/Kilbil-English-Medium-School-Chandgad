import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Enrollment.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const initialState = {
  studentId: "",
  name: "",
  motherName: "",
  fatherName: "",
  nationality: "Indian",
  motherTongue: "",
  religion: "",
  caste: "",
  subCaste: "",
  placeOfBirth: { place: "", taluka: "", district: "", city: "", state: "" },
  dob: "",
  previousSchool: "",
  admissionClass: "",
  dateOfAdmission: "",
  currentClass: "",
  rollNo: "",
  parentName: "",
  parentPhone: "",
  email: "",
  password: "",
};

const Enrollment = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState("all");
  const [searchName, setSearchName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState(initialState);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    parental: false,
    demographics: false,
    admission: false,
    account: false,
  });

  const token = localStorage.getItem("clerkToken");

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/clerk/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId || "",
      name: student.name || "",
      motherName: student.motherName || "",
      fatherName: student.fatherName || "",
      nationality: student.nationality || "Indian",
      motherTongue: student.motherTongue || "",
      religion: student.religion || "",
      caste: student.caste || "",
      subCaste: student.subCaste || "",
      placeOfBirth: student.placeOfBirth || { place: "", taluka: "", district: "", city: "", state: "" },
      dob: student.dob || "",
      previousSchool: student.previousSchool || "",
      admissionClass: student.admissionClass || "",
      dateOfAdmission: student.dateOfAdmission || "",
      currentClass: student.currentClass || student.class || "",
      rollNo: student.rollNo || "",
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
      email: student.email || "",
      password: "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await axios.delete(`${API_BASE}/api/clerk/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
    } catch (err) {
      alert("Failed to delete student");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      // Remove password if empty (keep existing)
      if (!payload.password) delete payload.password;
      // Remove placeOfBirth if all fields are empty
      const pob = payload.placeOfBirth;
      if (!pob.place && !pob.taluka && !pob.district && !pob.city && !pob.state) {
        delete payload.placeOfBirth;
      }

      await axios.put(`${API_BASE}/api/clerk/students/${editingStudent.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || "Operation failed");
    }
  };

  const handleNestedChange = (e, field, subfield) => {
    if (subfield) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [subfield]: e.target.value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredStudents = students.filter((s) => {
    const matchClass = classFilter === "all" || s.class === classFilter;
    const matchName = searchName === "" || s.name?.toLowerCase().includes(searchName.toLowerCase());
    return matchClass && matchName;
  });

  const classes = [...new Set(students.map((s) => s.class))].sort();

  if (loading) return <div className="loading">Loading students...</div>;

  return (
    <div className="page-container enrollment-container">
      <h2>Student Enrollment</h2>

      {/* Filters */}
      <div className="filter-bar">
        <div className="form-group">
          <label>Class Filter</label>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Search Name</label>
          <input placeholder="Search by name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Parent</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.id}>
                <td>{s.rollNo}</td>
                <td>{s.name}</td>
                <td>{s.class}</td>
                <td>{s.parentName}</td>
                <td>{s.parentPhone}</td>
                <td>{s.email}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(s)} className="edit-btn">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && <div className="empty-state">No students found.</div>}
      </div>

      {/* Full Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content wide-modal">
            <div className="modal-header">
              <h2>Edit Student</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="section-collapse">
                <div className="section-header" onClick={() => toggleSection("personal")}>
                  <h3>Personal Information</h3>
                  <span>{expandedSections.personal ? "▲" : "▼"}</span>
                </div>
                {expandedSections.personal && (
                  <div className="section-body">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Student ID</label>
                        <input value={formData.studentId} onChange={(e) => handleNestedChange(e, "studentId")} />
                      </div>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input value={formData.name} onChange={(e) => handleNestedChange(e, "name")} required />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" value={formData.dob} onChange={(e) => handleNestedChange(e, "dob")} />
                      </div>
                      <div className="form-group">
                        <label>Nationality</label>
                        <input value={formData.nationality} onChange={(e) => handleNestedChange(e, "nationality")} />
                      </div>
                      <div className="form-group">
                        <label>Mother Tongue</label>
                        <input value={formData.motherTongue} onChange={(e) => handleNestedChange(e, "motherTongue")} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Religion</label>
                        <input value={formData.religion} onChange={(e) => handleNestedChange(e, "religion")} />
                      </div>
                      <div className="form-group">
                        <label>Caste</label>
                        <input value={formData.caste} onChange={(e) => handleNestedChange(e, "caste")} />
                      </div>
                      <div className="form-group">
                        <label>Sub‑Caste</label>
                        <input value={formData.subCaste} onChange={(e) => handleNestedChange(e, "subCaste")} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Parental Information */}
              <div className="section-collapse">
                <div className="section-header" onClick={() => toggleSection("parental")}>
                  <h3>Parental Information</h3>
                  <span>{expandedSections.parental ? "▲" : "▼"}</span>
                </div>
                {expandedSections.parental && (
                  <div className="section-body">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Father's Name</label>
                        <input value={formData.fatherName} onChange={(e) => handleNestedChange(e, "fatherName")} />
                      </div>
                      <div className="form-group">
                        <label>Mother's Name</label>
                        <input value={formData.motherName} onChange={(e) => handleNestedChange(e, "motherName")} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Parent Name (contact)</label>
                        <input value={formData.parentName} onChange={(e) => handleNestedChange(e, "parentName")} />
                      </div>
                      <div className="form-group">
                        <label>Parent Phone</label>
                        <input value={formData.parentPhone} onChange={(e) => handleNestedChange(e, "parentPhone")} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Demographics / Birth Place */}
              <div className="section-collapse">
                <div className="section-header" onClick={() => toggleSection("demographics")}>
                  <h3>Place of Birth</h3>
                  <span>{expandedSections.demographics ? "▲" : "▼"}</span>
                </div>
                {expandedSections.demographics && (
                  <div className="section-body">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Place/Village</label>
                        <input
                          value={formData.placeOfBirth.place}
                          onChange={(e) => handleNestedChange(e, "placeOfBirth", "place")}
                        />
                      </div>
                      <div className="form-group">
                        <label>Taluka</label>
                        <input
                          value={formData.placeOfBirth.taluka}
                          onChange={(e) => handleNestedChange(e, "placeOfBirth", "taluka")}
                        />
                      </div>
                      <div className="form-group">
                        <label>District</label>
                        <input
                          value={formData.placeOfBirth.district}
                          onChange={(e) => handleNestedChange(e, "placeOfBirth", "district")}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          value={formData.placeOfBirth.city}
                          onChange={(e) => handleNestedChange(e, "placeOfBirth", "city")}
                        />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input
                          value={formData.placeOfBirth.state}
                          onChange={(e) => handleNestedChange(e, "placeOfBirth", "state")}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Admission Details */}
              <div className="section-collapse">
                <div className="section-header" onClick={() => toggleSection("admission")}>
                  <h3>Admission Details</h3>
                  <span>{expandedSections.admission ? "▲" : "▼"}</span>
                </div>
                {expandedSections.admission && (
                  <div className="section-body">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Admission Class</label>
                        <select value={formData.admissionClass} onChange={(e) => handleNestedChange(e, "admissionClass")}>
                          <option value="">Select</option>
                          {["LKG","UKG",...Array.from({length:10},(_,i)=>`Class ${i+1}`)].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Date of Admission</label>
                        <input type="date" value={formData.dateOfAdmission} onChange={(e) => handleNestedChange(e, "dateOfAdmission")} />
                      </div>
                      <div className="form-group">
                        <label>Previous School</label>
                        <input value={formData.previousSchool} onChange={(e) => handleNestedChange(e, "previousSchool")} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Current Class</label>
                        <select value={formData.currentClass} onChange={(e) => handleNestedChange(e, "currentClass")}>
                          <option value="">Select</option>
                          {["LKG","UKG",...Array.from({length:10},(_,i)=>`Class ${i+1}`)].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Roll No</label>
                        <input value={formData.rollNo} onChange={(e) => handleNestedChange(e, "rollNo")} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Account */}
              <div className="section-collapse">
                <div className="section-header" onClick={() => toggleSection("account")}>
                  <h3>Login Credentials</h3>
                  <span>{expandedSections.account ? "▲" : "▼"}</span>
                </div>
                {expandedSections.account && (
                  <div className="section-body">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={formData.email} onChange={(e) => handleNestedChange(e, "email")} />
                      </div>
                      <div className="form-group">
                        <label>New Password (leave blank to keep current)</label>
                        <input value={formData.password} onChange={(e) => handleNestedChange(e, "password")} placeholder="New password" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="secondary-btn">Cancel</button>
                <button type="submit" className="primary-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollment;