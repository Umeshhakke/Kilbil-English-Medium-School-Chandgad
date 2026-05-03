import "./Hero.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_BASE}/api/public/hero-slider`)
      .then(res => setSlides(res.data))
      .catch(err => console.error("Failed to fetch hero slides:", err));
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const currentSlide = slides[current];

    if (timerRef.current) clearTimeout(timerRef.current);

    if (currentSlide?.mediaType === "video") {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
        video.onended = () => setCurrent(prev => (prev + 1) % slides.length);
      }
    } else {
      timerRef.current = setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length);
      }, 3000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, slides]);

  const prevSlide = () => setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent(prev => (prev + 1) % slides.length);

  if (slides.length === 0) return null;

  return (
    <section className="hero">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === current ? "active" : ""}`}
        >
          {slide.mediaType === "video" ? (
            <video
              ref={index === current ? videoRef : null}
              src={slide.url}
              muted
              playsInline
              className="hero-video"
            />
          ) : (
            <img src={slide.url} alt="hero" className="hero-img" />
          )}
        </div>
      ))}
      <button className="slide-btn left" onClick={prevSlide}>❮</button>
      <button className="slide-btn right" onClick={nextSlide}>❯</button>
    </section>
  );
}