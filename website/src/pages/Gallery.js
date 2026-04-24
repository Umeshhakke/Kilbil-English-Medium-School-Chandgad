import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Gallery.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Header from '../components/Header';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Gallery = () => {
  const [scrolled, setScrolled] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/gallery/events`);
        setEvents(res.data);
        if (res.data.length > 0) {
          setSelectedEvent(res.data[0]); // auto-select first
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/gallery/events/${selectedEvent.id}/images`);
        setImages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchImages();
  }, [selectedEvent]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(-1);
    document.body.style.overflow = 'auto';
  };

  // Group events by year for display
  const eventsByYear = events.reduce((acc, event) => {
    if (!acc[event.year]) acc[event.year] = [];
    acc[event.year].push(event);
    return acc;
  }, {});

  const years = Object.keys(eventsByYear).sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="gallery-page">
        <Header /><Navbar scrolled={scrolled} />
        <div className="loading-container">Loading gallery...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <Header />
      <Navbar scrolled={scrolled} />

      <div className="gallery-hero">
        <div className="hero-inner">
          <span className="hero-tag">Our Moments</span>
          <h1>School <span>Gallery</span></h1>
          <p>Glimpses of life at Kilbil</p>
        </div>
      </div>

      <main className="gallery-container">
        {years.length === 0 ? (
          <div className="no-images">No gallery events yet.</div>
        ) : (
          <div className="gallery-with-sidebar">
            {/* Sidebar: Years and Events */}
            <div className="gallery-sidebar">
              {years.map(year => (
                <div key={year} className="year-group">
                  <h3 className="year-title">{year}</h3>
                  <ul className="event-list">
                    {eventsByYear[year].map(event => (
                      <li
                        key={event.id}
                        className={selectedEvent?.id === event.id ? 'active' : ''}
                        onClick={() => setSelectedEvent(event)}
                      >
                        {event.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Main Image Grid */}
            <div className="gallery-main">
              {selectedEvent && (
                <>
                  <h2 className="event-heading">{selectedEvent.name} ({selectedEvent.year})</h2>
                  {selectedEvent.description && <p className="event-desc">{selectedEvent.description}</p>}
                  <div className="gallery-grid">
                    {images.map((img, idx) => (
                      <div key={img.id} className="gallery-item" onClick={() => openLightbox(idx)}>
                        <img src={img.url} alt="" loading="lazy" />
                      </div>
                    ))}
                  </div>
                  {images.length === 0 && <p className="no-images-msg">No images in this event yet.</p>}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Lightbox */}
      {lightboxIndex !== -1 && (
        <div className="lightbox" onClick={closeLightbox}>
          <span className="close-btn">&times;</span>
          <img src={images[lightboxIndex]?.url} alt="" />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;