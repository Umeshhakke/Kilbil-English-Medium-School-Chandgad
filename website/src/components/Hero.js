import "./Hero.css";
import { useState, useEffect } from "react";

import img1 from "../assets/hero.jpg";
import img2 from "../assets/hero.jpg";
import img3 from "../assets/hero.jpg";
import img4 from "../assets/hero.jpg";
import img5 from "../assets/hero.jpg";

export default function Hero() {

  const images = [img1, img2, img3, img4, img5];
  const [current, setCurrent] = useState(0);
  

  // auto slide
const totalImages = images.length;

useEffect(() => {
  const interval = setInterval(() => {
    setCurrent((prev) => (prev + 1) % totalImages);
  }, 3000);

  return () => clearInterval(interval);
}, [totalImages]);

  // controls
  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent((current + 1) % images.length);
  };

  return (
    <section className="hero">

      {/* IMAGES */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="school"
          className={`hero-img ${index === current ? "active" : ""}`}
        />
      ))}

      {/* BUTTONS */}
      <button className="slide-btn left" onClick={prevSlide}>❮</button>
      <button className="slide-btn right" onClick={nextSlide}>❯</button>

    </section>
  );
}