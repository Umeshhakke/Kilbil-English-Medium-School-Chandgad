import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ImageUploader = ({ eventId, token, onUploadComplete }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/gallery/events/${eventId}/images`);
      setImages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [eventId]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('images', file));
    setUploading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/gallery/events/${eventId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedFiles([]);
      setPreviewUrls([]);
      fetchImages();
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/gallery/images/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchImages();
    } catch (err) {
      alert('Failed to delete image');
    }
  };

  return (
    <div className="image-uploader">
      <div className="upload-section">
        <input
          type="file"
          id="gallery-image-upload"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
        />
        <label htmlFor="gallery-image-upload" className="file-label">
          <span>📁</span> Choose Images
        </label>
        <button onClick={handleUpload} disabled={uploading || selectedFiles.length === 0}>
          {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} file(s)`}
        </button>
        {selectedFiles.length > 0 && (
          <span className="file-count">{selectedFiles.length} selected</span>
        )}
      </div>
      {previewUrls.length > 0 && (
        <div className="preview-grid">
          {previewUrls.map((url, idx) => (
            <img key={idx} src={url} alt="Preview" />
          ))}
        </div>
      )}
      <h4>Existing Images</h4>
      <div className="images-grid">
        {images.map(img => (
          <div key={img.id} className="image-card">
            <img src={img.url} alt="" />
            <button className="delete-img-btn" onClick={() => handleDeleteImage(img.id)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;