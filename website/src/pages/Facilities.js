// Facilities.jsx (Premium Version - Unified Layout)
import React from "react";
import "../styles/Facilities.css";
import Navbar from "../components/Navbar";
import Header from "../components/Header";

const facilitiesData = [
  {
    title: "Smart Classrooms",
    desc: "Technology-enabled classrooms with interactive panels and digital learning tools that enhance conceptual clarity and engagement.",
    img: "https://images.unsplash.com/photo-1588072432836-e10032774350",
  },
  {
    title: "Library",
    desc: "A calm and resource-rich library fostering reading habits and academic excellence with a wide collection of books.",
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  },
  {
    title: "Computer Lab",
    desc: "Advanced computer lab with modern systems and internet access to build strong technical and digital skills.",
    img: "https://images.unsplash.com/photo-1581092335397-9583eb92d232",
  },
  {
    title: "Science Laboratory",
    desc: "Fully equipped labs for practical learning in Physics, Chemistry, and Biology with safety-first infrastructure.",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },
  {
    title: "Sports & Playground",
    desc: "Expansive playground and sports facilities encouraging teamwork, fitness, and overall development.",
    img: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e",
  },
  {
    title: "Clean Water & Sanitation",
    desc: "Hygienic campus with RO drinking water and well-maintained sanitation facilities.",
    img: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
  },
  {
    title: "Safety & Security",
    desc: "24/7 CCTV surveillance and trained staff ensuring a safe and secure environment for every student.",
    img: "https://images.unsplash.com/photo-1581091215367-59ab6b3c2c3d",
  },
  {
    title: "Transport Facility",
    desc: "Safe and reliable transportation with GPS-enabled buses, trained drivers, and wide route coverage ensuring secure travel for students.",
    img: "https://images.unsplash.com/photo-1601582589903-1c3f3c9e7e9b",
  },
];

export default function Facilities() {
  return (
    <div className="facilities">
        <Header />
        <Navbar />
      <section className="hero adjust">
        <h1>Facilities</h1>
        <p>World-class infrastructure designed for holistic student development</p>
      </section>

      {facilitiesData.map((item, index) => (
        <section
          className={`facility ${index % 2 !== 0 ? "reverse" : ""}`}
          key={index}
        >
          <div className="facility-image">
            <img src={item.img} alt={item.title} />
          </div>

          <div className="facility-content">
            <span className="tag">Facility</span>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
