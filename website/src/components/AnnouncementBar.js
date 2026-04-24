import React from 'react';
import './AnnouncementBar.css';

const AnnouncementBar = ({ announcements }) => {
  if (!announcements || announcements.length === 0) {
    return null;
  }

  // Combine all announcements into one scrolling message
  const combinedText = announcements
    .map(ann => `${ann.title}${ann.description ? ': ' + ann.description : ''}`)
    .join(' • ');

  return (
    <div className="announcement-bar">
      <span className="announcement-icon">📢</span>
      <div className="announcement-scroll">
        <div className="announcement-text">
          {combinedText}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;