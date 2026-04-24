import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./IdCard.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DEFAULT_TEMPLATE = `
<div style="text-align: center; padding: 20px;">
  <img src="{{logoUrl}}" style="width: 80px; border-radius: 50%;" />
  <h3 style="margin: 8px 0;">Kilbil English Medium School</h3>
  <div style="width: 80px; height: 3px; background: #333; margin: 8px auto;"></div>
  <div style="margin: 15px 0;">
    <img src="{{photoUrl}}" style="width: 100px; height: 100px; border-radius: 10px; object-fit: cover; border: 2px solid #ccc;" />
  </div>
  <p style="font-weight: bold; font-size: 18px;">{{studentName}}</p>
  <p style="font-size: 14px;">Class: {{class}} | Roll No: {{rollNo}}</p>
  <p style="font-size: 13px; margin-top: 10px;">Valid Upto: {{validUpto}}</p>
  <p style="margin-top: 25px; font-size: 12px;">Executive Director</p>
  <p style="font-size: 10px; color: #666;">{{academicYear}}</p>
</div>
`;

const IdCard = () => {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [saved, setSaved] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const quillRef = useRef(null);

  // Photo upload state (only preview URL needed)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");

  useEffect(() => {
    fetchTemplate();
    fetchStudents();
  }, []);

  const fetchTemplate = async () => {
    try {
      const token = localStorage.getItem("clerkToken");
      const res = await axios.get(`${API_BASE}/api/clerk/idcard/template`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        if (res.data.template) setTemplate(res.data.template);
        if (res.data.bgColor) setBgColor(res.data.bgColor);
        if (res.data.textColor) setTextColor(res.data.textColor);
      }
    } catch (err) {
      console.log("No saved ID card template found");
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
      console.error(err);
    }
  };

  const saveTemplate = async () => {
    try {
      const token = localStorage.getItem("clerkToken");
      await axios.post(
        `${API_BASE}/api/clerk/idcard/template`,
        { template, bgColor, textColor },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Failed to save template");
    }
  };

  const loadStudentData = async (studentId) => {
    if (!studentId) return;
    try {
      const token = localStorage.getItem("clerkToken");
      const res = await axios.get(`${API_BASE}/api/clerk/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentData(res.data);
    } catch (err) {
      alert("Failed to load student data");
    }
  };

  const handleStudentSelect = (e) => {
    const sid = e.target.value;
    setSelectedStudent(sid);
    if (sid) loadStudentData(sid);
    else setStudentData(null);
  };

  // Handle photo file selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke previous URL to avoid memory leaks
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
      setPhotoPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Clear the selected photo
  const clearPhoto = () => {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoPreviewUrl("");
  };

  const generatePreview = () => {
    if (!studentData) {
      alert("Select a student first");
      return;
    }
    let html = template;
    // Use uploaded photo if available, otherwise fall back to existing student image or placeholder
    const photoSrc = photoPreviewUrl || studentData.image || "/default-photo.png";
    const placeholders = {
      "{{studentName}}": studentData.name || "",
      "{{class}}": studentData.class || "",
      "{{rollNo}}": studentData.rollNo || "",
      "{{validUpto}}": "2025-2026",
      "{{academicYear}}": "2025-26",
      "{{logoUrl}}": "/logo.png",
      "{{photoUrl}}": photoSrc,
    };
    for (const [k, v] of Object.entries(placeholders)) {
      html = html.split(k).join(v);
    }
    setPreviewHtml(html);
  };

  const printIdCard = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>ID Card</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            .id-card { width: 350px; min-height: 500px; background: ${bgColor}; color: ${textColor}; border-radius: 20px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.2); }
            .id-card * { color: ${textColor} !important; }
          </style>
        </head>
        <body>
          <div class="id-card">${previewHtml}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div className="page-container id-card-container">
      <h2>ID Card Designer</h2>

      {/* Customization Panel */}
      <div className="customization-panel">
        <div className="color-picker-group">
          <label>Background Color</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        </div>
        <div className="color-picker-group">
          <label>Text Color</label>
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
        </div>
        <button className="primary-btn" onClick={saveTemplate}>
          {saved ? "Saved!" : "Save Template"}
        </button>
      </div>

      {/* Template Editor */}
      <div className="section">
        <h3>Edit Template</h3>
        <ReactQuill
          ref={quillRef}
          value={template}
          onChange={setTemplate}
          modules={modules}
          theme="snow"
          placeholder="Design your ID card layout..."
        />
      </div>

      {/* Student Selector & Photo Upload */}
      <div className="section preview-section">
        <h3>Generate ID Card</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Select Student</label>
            <select value={selectedStudent} onChange={handleStudentSelect}>
              <option value="">-- Choose Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.class})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Student Photo (optional)</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            {photoPreviewUrl && (
              <div className="photo-preview-wrapper">
                <img src={photoPreviewUrl} alt="Preview" className="photo-preview" />
                <button type="button" className="small-btn" onClick={clearPhoto}>
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button className="primary-btn" onClick={generatePreview}>
            Generate Preview
          </button>
        </div>

        {previewHtml && (
          <div className="id-card-preview-wrapper">
            <button className="primary-btn" onClick={printIdCard}>
              Print ID Card
            </button>
            <div
              className="id-card-preview"
              style={{ background: bgColor, color: textColor }}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default IdCard;