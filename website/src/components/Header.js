// import "./Header.css";
// import logo from "../assets/logo.png";

// export default function Header() {
//   return (
//     <header className="header">

//       <div className="header-container">

//         <div className="logo-section">
//           <img src={logo} alt="School Logo" />
//         </div>

//         <div className="school-info">
//           <h4>ABHINAV EDUCATION SOCIETY'S</h4>
//           <h1>KILBIL ENGLISH MEDIUM SCHOOL</h1>
//           <h2>& Rajarshi Shahu Vidyaniketan, Chandgad</h2>
//           <p>Est. 2006 | Chandgad, Kolhapur</p>
//         </div>

//       </div>

//     </header>
//   );
// }
import "./Header.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <img src={logo} alt="School Logo" />
        </div>

        <div className="school-info">
          <h4>ABHINAV EDUCATION SOCIETY'S</h4>
          <h1>KILBIL ENGLISH MEDIUM SCHOOL</h1>
          <h2>& Rajarshi Shahu Vidyaniketan, Chandgad</h2>
          <p>Est. 2006 | Chandgad, Kolhapur</p>
        </div>

        {/* Login Links - top right corner */}
        <div className="login-links">
          <Link to="/admin/login">Admin</Link>
          <span className="separator">|</span>
          <Link to="/teacher/login">Teacher</Link>
          <span className="separator">|</span>
          <Link to="/clerk/login">Clerk</Link>
        </div>
      </div>
    </header>
  );
}