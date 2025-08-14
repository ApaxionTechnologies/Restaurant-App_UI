

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Home.css";
// import Footer from "../components/Footer";
// import AdminLogin from "../pages/AdminLogin"; // import correctly
// import "../components/AdminLoginModal.css";

// export default function HomePage() {
//   const navigate = useNavigate();
//   const [showAdminModal, setShowAdminModal] = useState(false);

//   return (
//     <>
//       <div className="home-container">
//         {/* Header Bar */}
//         <div className="header-bar">
//           <button
//             className="header-btn"
//             onClick={() => navigate("/register")}
//           >
//             🏪 Register as Restaurant
//           </button>
//           <button
//             className="header-btn"
//             onClick={() => setShowAdminModal(true)}
//           >
//             🔐 Login as Admin
//           </button>
//         </div>

//         {/* Main Card */}
//         <div className="home-card">
//           <h1 className="mb-3">🍽️ Welcome to QR Menu App</h1>
//           <p className="mb-4">Please scan your table QR to begin ordering.</p>

//           <div className="action-buttons">
//             <button
//               className="btn btn-primary scan-btn"
//               onClick={() => navigate("/scanner")}
//             >
//               📷 Scan your table QR to begin ordering!
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="footer">
//         <Footer />
//       </div>

//       {/* Admin Login Modal */}
//       {showAdminModal && (
//         <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             {<button className="modal-close" onClick={() => setShowAdminModal(false)}>
//               ❌
//             </button> }
//             <AdminLogin />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Home.css";
// import Footer from "../components/Footer";
// import AdminLogin from "../pages/AdminLogin"; // Correct import
// import "../components/AdminLoginModal.css"; // For modal styles

// export default function HomePage() {
//   const navigate = useNavigate();
//   const [showAdminModal, setShowAdminModal] = useState(false);

//   return (
//     <>
//       <div className="home-container">
//         {/* Header Bar */}
//         <div className="header-bar">
//           <button className="header-btn" onClick={() => navigate("/register")}>
//             🏪 Register as Restaurant
//           </button>
//           <button className="header-btn" onClick={() => setShowAdminModal(true)}>
//             🔐 Login as Admin
//           </button>
//         </div>

//         {/* Main Card */}
//         <div className="home-card">
//           <h1 className="mb-3">🍽️ Welcome to QR Menu App</h1>
//           <p className="mb-4">Please scan your table QR to begin ordering.</p>
//           <div className="action-buttons">
//             <button
//               className="btn btn-primary scan-btn"
//               onClick={() => navigate("/scanner")}
//             >
//               📷 Scan your table QR to begin ordering!
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="footer">
//         <Footer />
//       </div>

//       {/* Admin Login Modal */}
//       {showAdminModal && (
//         <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <AdminLogin onClose={() => setShowAdminModal(false)} />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }










// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Home.css";
// import Footer from "../components/Footer";
// import AdminLogin from "../pages/AdminLogin";
// import "../components/AdminLoginModal.css";
// import "./HomePage.css";

// export default function HomePage() {
//   const navigate = useNavigate();
//   const [showAdminModal, setShowAdminModal] = useState(false);

//   return (
//     <>
//       <div
//         className="homepage-container"
//         style={{
//           backgroundImage: "url('/restaurant-interior.jpg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         {/* Overlay */}
//         <div className="homepage-overlay"></div>

//         {/* Header */}
//         <div className="header-bar">
//           <button className="header-btn" onClick={() => navigate("/register")}>
//             🏪 Register as Restaurant
//           </button>
//           <button className="header-btn" onClick={() => setShowAdminModal(true)}>
//             🔐 Login as Admin
//           </button>
//         </div>

//         {/* Main Content */}
//         <div className="homepage-content">
//           <div className="home-card">
//             <h1 className="mb-3">🍽️ Welcome to QR Menu App</h1>
//             <p className="mb-4">Please scan your table QR to begin ordering.</p>
//             <div className="action-buttons">
//               <button
//                 className="btn btn-primary scan-btn"
//                 onClick={() => navigate("/scanner")}
//               >
//                 📷 Scan your table QR to begin ordering!
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="footer">
//         <Footer />
//       </div>

//       {/* Admin Login Modal */}
//       {showAdminModal && (
//         <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <AdminLogin onClose={() => setShowAdminModal(false)} />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Footer from "../components/Footer";
// import AdminLogin from "../pages/AdminLogin";
// import "../styles/Home.css";
// import "./HomePage.css";
// import "../components/AdminLoginModal.css";
// import "../components/HomeHeader.jsx";
// import { BsPersonLock } from "react-icons/bs";



// export default function HomePage() {
//   const navigate = useNavigate();
//   const [showAdminModal, setShowAdminModal] = useState(false);

//   return (
//     <>
//       {/* HEADER */}
//       <header className="home-header">
//         <div className="header-left" onClick={() => navigate("/")}>
//           <img src="/logo.png" alt="Restaurant Logo" className="header-logo" />
//         </div>
//         <div className="header-right">
//           <a
//             href="#"
//             className="header-link"
//             onClick={(e) => {
//               e.preventDefault();
//               alert("Redirect to App Download");
//             }}
//           >
//             📲 App Download
//           </a>
//           <button
//             className="header-link login-btn"
//             onClick={() => setShowAdminModal(true)}
//           >
//              <BsPersonLock /> Login
//           </button>
//         </div>
//       </header>

//       {/* HERO BANNER */}
//       <section
//         className="hero-banner"
//         style={{
//           backgroundImage: "url('/food-collage.jpg')", // ✅ from public folder
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className="hero-overlay">
//           <h1 className="hero-title">Great Food Great Offers</h1>
//         </div>
//       </section>

//       {/* FOOD COURT SECTION */}
//       <section className="food-section">
//         <div className="food-card">
//           <div className="food-text">
//             <h2>FOOD COURT</h2>
//             <p>TAKE AWAY | DINE IN</p>
//           </div>
//           <div className="food-image">
//             <img src="/food-court.png" alt="Food Court" /> {/* ✅ from public folder */}
//           </div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <Footer />

//       {/* ADMIN LOGIN MODAL */}
//       {showAdminModal && (
//         <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <AdminLogin onClose={() => setShowAdminModal(false)} />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import AdminLogin from "../pages/AdminLogin";
import "../styles/Home.css";
import "./HomePage.css";
import "../components/AdminLoginModal.css";
import "../components/HomeHeader.jsx";
import { BsPersonLock } from "react-icons/bs";

export default function HomePage() {
  const navigate = useNavigate();
  const [showAdminModal, setShowAdminModal] = useState(false);

  return (
    <>
      {/* HEADER */}
      <header className="home-header">
        <div className="header-left">
          {/* ✅ Register Button */}
          <button
            className="register-btn"
            onClick={() => navigate("/register")}
          >
            Register as Restaurant
          </button>

          {/* ✅ Logo */}
          {/* <img
            src="/logo.png"
            alt="Restaurant Logo"
            className="header-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          /> */}
        </div>

        <div className="header-right">
          {/* <a
            href="#"
            className="header-link"
            onClick={(e) => {
              e.preventDefault();
              alert("Redirect to App Download");
            }}
          >
            📲 App Download
          </a> */}
          <button
            className="header-link login-btn"
            onClick={() => setShowAdminModal(true)}
          >
            <BsPersonLock style={{ color: "green", fontSize: "20px" }} /> Login
          </button>
        </div>
      </header>

      {/* HERO BANNER */}
      <section
        className="hero-banner"
        style={{
          backgroundImage: "url('/food-collage.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay">
          <h1 className="hero-title">Great Food Great Offers</h1>
        </div>
      </section>

      {/* FOOD COURT SECTION */}
      <section className="food-section">
        <div className="food-card">
          <div className="food-text">
            <h2>FOOD COURT</h2>
            <p>TAKE AWAY | DINE IN</p>
          </div>
          <div className="food-image">
            <img src="/food-court.png" alt="Food Court" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* ADMIN LOGIN MODAL */}
      {showAdminModal && (
        <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AdminLogin onClose={() => setShowAdminModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}

