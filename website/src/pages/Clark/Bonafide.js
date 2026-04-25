import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./Bonafide.css";

const API_BASE = process.env.REACT_APP_API_URL ;

// Default template with placeholders
const DEFAULT_TEMPLATE = `
<h2 style="text-align: center;">Bonafide Certificate</h2>
<p>This is to certify that <strong>{{studentName}}</strong>, 
son/daughter of <strong>{{fatherName}}</strong> &amp; <strong>{{motherName}}</strong>, 
is a bonafide student of our school studying in class <strong>{{class}}</strong> 
(Roll No: {{rollNo}}).</p>
<p>Date of Birth: {{dob}}</p>
<p>He/She bears a good moral character.</p>
<p style="text-align: right;">Principal</p>
`;

const Bonafide = () => {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [saved, setSaved] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const quillRef = useRef(null);

  // Load saved template from Firestore
  useEffect(() => {
    fetchTemplate();
    fetchStudents();
  }, []);

  const fetchTemplate = async () => {
    try {
      const token = localStorage.getItem("clerkToken");
      const res = await axios.get(`${API_BASE}/api/clerk/bonafide/template`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && res.data.template) {
        setTemplate(res.data.template);
      }
    } catch (err) {
      console.log("No saved template, using default.");
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("clerkToken");
      const res = await axios.get(`${API_BASE}/api/clerk/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  // Save template to Firestore
  const saveTemplate = async () => {
    try {
      const token = localStorage.getItem("clerkToken");
      await axios.post(
        `${API_BASE}/api/clerk/bonafide/template`,
        { template },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Failed to save template: " + (err.response?.data?.error || err.message));
    }
  };

  // Load full student data when selected
  // Load full student data when selected
const loadStudentData = async (studentId) => {
  if (!studentId) return;
  try {
    const token = localStorage.getItem("clerkToken");
    const res = await axios.get(`${API_BASE}/api/clerk/students/${studentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStudentData(res.data);
  } catch (err) {
    console.error("Failed to load student data:", err);
    alert("Could not load student details.");
  }
};

  // Handle student selection
  const handleStudentSelect = (e) => {
    const sid = e.target.value;
    setSelectedStudent(sid);
    if (sid) loadStudentData(sid);
    else setStudentData(null);
  };

  // Generate preview by replacing placeholders
  const generatePreview = () => {
    if (!studentData) {
      alert("Please select a student first.");
      return;
    }
    let html = template;
    const placeholders = {
      "{{studentName}}": studentData.name || "",
      "{{fatherName}}": studentData.fatherName || "",
      "{{motherName}}": studentData.motherName || "",
      "{{class}}": studentData.class || "",
      "{{rollNo}}": studentData.rollNo || "",
      "{{dob}}": studentData.dob || "",
    };
    for (const [key, value] of Object.entries(placeholders)) {
      html = html.split(key).join(value);
    }
    setPreviewHtml(html);
  };

  // Print the certificate
  const printCertificate = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>Bonafide Certificate</title></head>
        <body>${previewHtml}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Quill modules & formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="page-container bonafide-container">
      <h2>Bonafide Certificate Designer</h2>

      {/* Template Editor */}
      <div className="section">
        <h3>Edit Template</h3>
        <ReactQuill
          ref={quillRef}
          value={template}
          onChange={setTemplate}
          modules={modules}
          theme="snow"
          placeholder="Write your certificate template here..."
        />
        <button className="primary-btn" onClick={saveTemplate} style={{ marginTop: 12 }}>
          {saved ? "Saved!" : "Save Template"}
        </button>
      </div>

      {/* Student Selector & Preview */}
      <div className="section preview-section">
        <h3>Generate Certificate for Student</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Select Student</label>
            <select value={selectedStudent || ""} onChange={handleStudentSelect}>
              <option value="">-- Choose Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.class})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ alignSelf: "flex-end" }}>
            <button className="primary-btn" onClick={generatePreview}>
              Generate Preview
            </button>
          </div>
        </div>

        {previewHtml && (
          <div className="preview-box">
            <div className="preview-header">
              <button className="primary-btn" onClick={printCertificate}>
                Print Certificate
              </button>
            </div>
            <div className="cert-preview" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Bonafide;