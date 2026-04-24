import '../styles/About.css';
import { staffData } from '../data/staffData';
import imagelogo from '../images/p1.jpg';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

function AboutUs() {

    const renderStaffCategory = (title, items, isNonTeaching = false) => (
        <div className="staff-category">
            <h4>{title}</h4>

            <div className="staff-grid">
                {items.map((member, index) => (
                    <div
                        key={index}
                        className={`staff-card ${isNonTeaching ? 'non-teaching' : ''}`}
                    >
                        <div className="card-inner">
                            <div className="staff-image">
                                <img src={imagelogo} alt={member.name} />
                            </div>

                            <div className="staff-info">
                                <span className="designation">{member.designation}</span>
                                <h5 className="staff-name">{member.name}</h5>
                                <p className="education">{member.education}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const group1Teaching = staffData.teaching.filter(m => m.section === "Group 1");
    const group2Teaching = staffData.teaching.filter(m => m.section === "Group 2");

    return (
        <>
            <Header />
            <Navbar/>

            <div className="about-us-page">

                {/* School Info */}
                <section className="school-info-section">
                    <div className="info-content">
                        <h2 className="section-title">Nurturing Excellence Since Our Inception</h2>
                        <div className="title-underline"></div>

                        <p className="info-text">
                            Welcome to <strong>Kilbil English Medium School</strong>, a sanctuary of learning where every child is inspired to discover their unique potential. Located in the heart of Chandgad, we pride ourselves on providing a holistic education that blends academic rigor with personal growth and character development.
                        </p>

                        <p className="info-text">
                            Our faculty is dedicated to creating a supportive environment where innovation and tradition coexist. We believe that education is about more than just textbooks; it's about shaping future leaders and responsible global citizens.
                        </p>

                        <button className="btn-secondary">Explore Our Programs</button>
                    </div>

                    <div className="info-image">
                        <img
                            src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d"
                            alt="School"
                            className="about-img" 
                        />
                    </div>
                </section>

                {/* Leadership Section Only */}
                <section className="staff-section">
                    <div className="section-header">
                        <h2 className="section-title">Our Leadership</h2>
                        <div className="title-underline"></div>
                    </div>

                    {renderStaffCategory(
                        "School Administration",
                        [...group1Teaching, ...group2Teaching]
                            .filter(m => 
                                m.designation.toLowerCase().includes("principal") || 
                                m.designation.toLowerCase().includes("vice principal")
                            )
                            .slice(0, 2) // Keeps only the top 2 (Principal & Vice Principal)
                    )}
                </section>

                {/* History */}
                <section className="history-section">
                    <h2 className="section-title">Our Proud History</h2>

                    <div className="timeline">
                        <div className="timeline-item">
                            <span className="year">Foundation</span>
                            <p>Kilbil School was founded with a single mission: to bring quality English medium education to the rural and semi-urban communities of Chandgad.</p>
                        </div>

                        <div className="timeline-item">
                            <span className="year">Expansion</span>
                            <p>Increasing our building capacity and introducing new laboratories and digital classrooms to enhance student learning experiences.</p>
                        </div>

                        <div className="timeline-item">
                            <span className="year">Present</span>
                            <p>Today, we stand as one of the most respected schools in the region, known for our excellent academic records and all-round development programs.</p>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="values-section">
                    <h2 className="section-title">Our Core Values</h2>
                    <div className="title-underline"></div>

                    <div className="values-grid">
                        <div className="value-item">
                            <div className="value-icon">🤝</div>
                            <h4>Integrity</h4>
                            <p>We uphold the highest ethical standards in everything we do.</p>
                        </div>

                        <div className="value-item">
                            <div className="value-icon">💡</div>
                            <h4>Inclusion</h4>
                            <p>We believe every child deserves a chance to shine regardless of their background.</p>
                        </div>

                        <div className="value-item">
                            <div className="value-icon">🏆</div>
                            <h4>Excellence</h4>
                            <p>We strive for greatness in academics, sports, and life skills.</p>
                        </div>

                        <div className="value-item">
                            <div className="value-icon">🌱</div>
                            <h4>Growth</h4>
                            <p>Continuous learning and improvement are at the center of our culture.</p>
                        </div>
                    </div>
                </section>

            </div>

            <Footer />
        </>
    );
}

export default AboutUs;