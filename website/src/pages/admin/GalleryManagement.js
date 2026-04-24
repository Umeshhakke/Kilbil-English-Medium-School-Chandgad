import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventForm from './EventForm';
import ImageUploader from './ImageUploader';
import './GalleryManagement.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const GalleryManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const token = localStorage.getItem('adminToken');

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/gallery/events`);
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event and all its images?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/gallery/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
      if (selectedEvent?.id === eventId) setSelectedEvent(null);
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="gallery-management">
      <div className="page-header">
        <h1>Gallery Management</h1>
        <button className="add-btn" onClick={() => setShowEventForm(true)}>
          + New Event
        </button>
      </div>

      <div className="gallery-layout">
        {/* Events List */}
        <div className="events-sidebar">
          <h3>Events</h3>
          <div className="events-list">
            {events.map(event => (
              <div
                key={event.id}
                className={`event-item ${selectedEvent?.id === event.id ? 'active' : ''}`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="event-info">
                  <span className="event-year">{event.year}</span>
                  <span className="event-name">{event.name}</span>
                </div>
                <button
                  className="delete-event-btn"
                  onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Event Details & Images */}
        <div className="event-detail">
          {selectedEvent ? (
            <>
              <h2>{selectedEvent.name} ({selectedEvent.year})</h2>
              {selectedEvent.description && <p>{selectedEvent.description}</p>}
              <ImageUploader
                eventId={selectedEvent.id}
                token={token}
                onUploadComplete={() => fetchEvents()} // refresh if needed
              />
            </>
          ) : (
            <div className="select-event-prompt">Select an event to manage images</div>
          )}
        </div>
      </div>

      {showEventForm && (
        <EventForm
          onClose={() => setShowEventForm(false)}
          onSuccess={() => { setShowEventForm(false); fetchEvents(); }}
          token={token}
        />
      )}
    </div>
  );
};

export default GalleryManagement;