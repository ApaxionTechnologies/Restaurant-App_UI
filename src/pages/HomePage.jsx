// src/pages/HomePage.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Home.css";

// export default function HomePage() {
//   const navigate = useNavigate();

//   return (
//     <div className="home-container">
//       {/* Header Bar */}
//       <div className="header-bar">
//         <button
//           className="header-btn"
//           onClick={() => navigate("/register")}
//         >
//           🏪 Register as Restaurant
//         </button>
//         <button
//           className="header-btn"
//           onClick={() => navigate("/admin-login")}
//         >
//           🔐 Login as Admin
//         </button>
//       </div>

//       {/* Main Card */}
//       <div className="home-card">
//         <h1 className="mb-3">🍽️ Welcome to QR Menu App</h1>
//         <p className="mb-4">Please scan your table QR to begin ordering.</p>

//         <div className="action-buttons">
//           <button
//             className="btn btn-primary scan-btn"
//             onClick={() => navigate("/scanner")}
//           >
//             📷 Scan your table QR to begin ordering!
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


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










import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import Footer from "../components/Footer";
import AdminLogin from "../pages/AdminLogin";
import "../components/AdminLoginModal.css";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [showAdminModal, setShowAdminModal] = useState(false);

  return (
    <>
      <div
        className="homepage-container"
        style={{
          backgroundImage: "url('/restaurant-interior.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="homepage-overlay"></div>

        {/* Header */}
        <div className="header-bar">
          <button className="header-btn" onClick={() => navigate("/register")}>
            🏪 Register as Restaurant
          </button>
          <button className="header-btn" onClick={() => setShowAdminModal(true)}>
            🔐 Login as Admin
          </button>
        </div>

        {/* Main Content */}
        <div className="homepage-content">
          <div className="home-card">
            <h1 className="mb-3">🍽️ Welcome to QR Menu App</h1>
            <p className="mb-4">Please scan your table QR to begin ordering.</p>
            <div className="action-buttons">
              <button
                className="btn btn-primary scan-btn"
                onClick={() => navigate("/scanner")}
              >
                📷 Scan your table QR to begin ordering!
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <Footer />
      </div>

      {/* Admin Login Modal */}
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
