import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import About from '../components/About';
import Highlights from '../components/Highlights';
import Toppers from '../components/Toppers';
import AnnouncementBar from '../components/AnnouncementBar';
import popupFallbackImg from '../assets/Admission.jpeg';
import '../styles/Home.css';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupActivity, setPopupActivity] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/activities/active`);
        const activities = res.data;
        const popup = activities.find(a => a.type === 'popup');
        const bars = activities.filter(a => a.type === 'announcement');
        
        setPopupActivity(popup);
        setAnnouncements(bars);
        if (popup) setShowPopup(true);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
        setShowPopup(true);
      }
    };
    fetchActivities();
  }, []);

  // Helper to build correct image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return popupFallbackImg;
    // If absolute URL, replace localhost with live domain
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath.replace('http://localhost:5000', API_BASE_URL);
    }
    // If relative, prepend API_BASE_URL
    if (imagePath.startsWith('/')) {
      return `${API_BASE_URL}${imagePath}`;
    }
    return `${API_BASE_URL}/${imagePath}`;
  };

  const popupImage = getFullImageUrl(popupActivity?.image);
  const popupTitle = popupActivity?.title;
  const popupDesc = popupActivity?.description;
  const popupLink = popupActivity?.link;

  return (
    <div className="home-page">
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button className="close-btn" onClick={() => setShowPopup(false)}>✖</button>
            {popupLink ? (
              <a href={popupLink} target="_blank" rel="noopener noreferrer">
                <img src={popupImage} alt={popupTitle || 'Popup'} />
              </a>
            ) : (
              <img src={popupImage} alt={popupTitle || 'Popup'} />
            )}
            {popupTitle && <h3 className="popup-title">{popupTitle}</h3>}
            {popupDesc && <p className="popup-description">{popupDesc}</p>}
          </div>
        </div>
      )}

      <Header />
      <Navbar />
      <AnnouncementBar announcements={announcements} />
      <Hero />
      <About />
      <Highlights />
      <Toppers />
      <Footer />
    </div>
  );
}