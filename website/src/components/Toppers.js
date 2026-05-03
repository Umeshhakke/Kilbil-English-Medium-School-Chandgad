import "./Toppers.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Toppers() {
  const [toppers, setToppers] = useState([]);
  const currentYear = new Date().getFullYear().toString();
  const API_BASE_URL = process.env.REACT_APP_API_URL ;


  useEffect(() => {
    axios.get(API_BASE_URL + "/api/toppers/public?year=" + currentYear)
      .then(res => setToppers(res.data))
      .catch(console.error);
  }, [currentYear]);

  // Group by class
  const grouped = toppers.reduce((acc, t) => {
    if (!acc[t.class]) acc[t.class] = [];
    acc[t.class].push(t);
    return acc;
  }, {});

  const classOrder = ["Class 10", "Class 9"];

  if (toppers.length === 0) return null; // or loading

  return (
    <section className="toppers">
      <h2>🏆 Our Toppers</h2>

      {classOrder.map(cls => {
        const students = grouped[cls] || [];
        if (students.length === 0) return null;
        const sorted = students.sort((a,b) => (a.rank === "1st" ? -1 : a.rank === "2nd" ? 0 : 1));
        return (
          <div className="toppers-section" key={cls}>
            <h3>{cls} Toppers</h3>
            <div className="toppers-container">
              {sorted.map((s, idx) => {
                const className = s.rank === "1st" ? "gold" : s.rank === "2nd" ? "silver" : "bronze";
                return (
                  <div className={`topper-card ${className}`} key={s.id}>
                    <div className="rank-badge">{s.rank}</div>
                    <img src={s.image || "/default-avatar.png"} alt={s.name} />
                    <div className="topper-info">
                      <h4>{s.name}</h4>
                      <p>{s.marks}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}