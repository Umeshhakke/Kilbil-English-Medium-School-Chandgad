import "./Toppers.css";

export default function Toppers() {

  const class9 = [
    {
      name: "Rahul Patil",
      rank: "1st",
      marks: "92%",
      img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e"
    },
    {
      name: "Sneha Joshi",
      rank: "2nd",
      marks: "89%",
      img: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6"
    },
    {
      name: "Amit Kale",
      rank: "3rd",
      marks: "87%",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
    }
  ];

  const class10 = [
    {
      name: "Priya Sharma",
      rank: "1st",
      marks: "95%",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956"
    },
    {
      name: "Rohit Singh",
      rank: "2nd",
      marks: "91%",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
    },
    {
      name: "Neha Verma",
      rank: "3rd",
      marks: "88%",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
    }
  ];

  const renderSection = (title, data) => {
    const order = [1, 0, 2]; // center gold

    return (
      <div className="toppers-section">
        <h3>{title}</h3>

        <div className="toppers-container">
          {order.map((i, idx) => {
            const student = data[i];

            const className =
              i === 0 ? "gold" : i === 1 ? "silver" : "bronze";

            return (
              <div className={`topper-card ${className}`} key={idx}>
                <div className="rank-badge">{student.rank}</div>

                <img src={student.img} alt={student.name} />

                <div className="topper-info">
                  <h4>{student.name}</h4>
                  <p>{student.marks}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="toppers">
      <h2>🏆 Our Toppers</h2>

      {renderSection("Class 10 Toppers", class10)}
      {renderSection("Class 9 Toppers", class9)}
    </section>
  );
}