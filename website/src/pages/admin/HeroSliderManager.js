import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HeroSliderManager.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const HeroSliderManager = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/admin/hero-slider`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMediaItems(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load media");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [token]); // optional: re-fetch if token changes

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("media", files[i]);
    }

    setUploading(true);
    try {
      await axios.post(`${API_BASE}/api/admin/hero-slider`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Media uploaded successfully!");
      // Refresh the list after upload
      const res = await axios.get(`${API_BASE}/api/admin/hero-slider`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMediaItems(res.data);
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this media?")) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/hero-slider/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh after deletion
      const res = await axios.get(`${API_BASE}/api/admin/hero-slider`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMediaItems(res.data);
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Hero Slider Media</h2>
        <p>Upload images or videos for the homepage slideshow. Videos will play automatically.</p>
      </div>

      <div className="upload-section">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
        />
        {uploading && <span>Uploading...</span>}
      </div>

      <div className="media-grid">
        {mediaItems.map((item) => (
          <div key={item.id} className="media-card">
            {item.mediaType === "video" ? (
              <video src={item.url} controls className="media-preview" />
            ) : (
              <img src={item.url} alt="hero" className="media-preview" />
            )}
            <button className="delete-btn" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        ))}
        {mediaItems.length === 0 && <p>No media uploaded yet.</p>}
      </div>
    </div>
  );
};

export default HeroSliderManager;