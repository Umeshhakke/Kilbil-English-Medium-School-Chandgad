import "./Highlights.css";
import Busimage from "../assets/bus.png";

export default function Highlights() {

  const highlights = [
    {
      img: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b",
      title: "Excellent Results",
      desc: "Consistent academic performance with strong student outcomes."
    },
    {
      img: Busimage,
      title: "Transport Facility",
      desc: "Safe and reliable school bus transport for students."
    },
    {
      img: "https://images.unsplash.com/photo-1581090700227-4c4d1a9a0c05",
      title: "CCTV Campus",
      desc: "Fully secured campus with 24/7 surveillance for safety."
    },
    {
      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
      title: "Experienced Staff",
      desc: "Qualified teachers dedicated to student success."
    },
    {
      img: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
      title: "Holistic Development",
      desc: "Focus on academics, sports, and extracurricular growth."
    },

    // 🔥 NEW 3 HIGHLIGHTS

    {
      img: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0",
      title: "Smart Classes",
      desc: "Digital classrooms with modern teaching technology."
    },
    {
      img: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e",
      title: "Sports & Activities",
      desc: "Encouraging physical fitness and team spirit through sports."
    },
    {
      img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
      title: "Library Facility",
      desc: "Well-stocked library to enhance reading and learning habits."
    }
  ];

  return (
    <section className="highlights">

      <h2 className="section-title">Why Choose Our School</h2>

      <div className="highlight-container">
        {highlights.map((item, index) => (
          <div className="highlight-card" key={index}>

            <div className="image-box">
              <img src={item.img} alt={item.title} />
            </div>

            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}