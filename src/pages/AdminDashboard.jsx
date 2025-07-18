// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "../styles/AdminDashBoard.css";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [showMenu, setShowMenu] = useState(false);

//   const adminEmail = localStorage.getItem("adminEmail") || "admin@example.com";

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/admin-login");
//   };

//   return (
//     <div className="admin-dashboard">
//       {/* ✅ Top Navbar */}
//       <div className="dashboard-header d-flex justify-content-between align-items-center p-3 shadow-sm">
//         <h2 className="m-0">Admin Dashboard</h2>

//         {/* ✅ Profile Icon */}
//         <div className="profile-container position-relative">
//           <i
//             className="bi bi-person-circle fs-3 text-primary"
//             style={{ cursor: "pointer" }}
//             onClick={() => setShowMenu(!showMenu)}
//           ></i>

//           {/* ✅ Dropdown Menu */}
//           {showMenu && (
//             <div className="profile-menu position-absolute end-0 mt-2 bg-white shadow rounded p-3" style={{ width: "220px" }}>
//               <p className="mb-2 fw-semibold">Signed in as</p>
//               <p className="text-muted small mb-3">{adminEmail}</p>
//               <button
//                 className="btn btn-danger w-100"
//                 onClick={handleLogout}
//               >
//                 <i className="bi bi-box-arrow-right"></i> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ✅ Dashboard Content */}
//       <div className="dashboard-content p-4">
//         <h4>Welcome, Admin!</h4>
//         <p>Manage your restaurant settings, menu, and more.</p>
//       </div>
//     </div>
//   );
// }




import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminDashboard() {
  return (
    <div className="container mt-5 text-center">
      <h2>Welcome, Admin 👨‍💻</h2>
      <p className="lead">Manage your restaurant menu and settings below:</p>
      <div className="d-flex flex-column gap-3 mt-4">
        <Link to="/add-item" className="btn btn-success btn-lg">
          ➕ Add Menu Item
        </Link>
        <Link to="/remove-item" className="btn btn-danger btn-lg">
          ❌ Remove Menu Item
        </Link>
        <Link to="/generate-qr" className="btn btn-primary btn-lg">
          🔗 Generate Table QR
        </Link>
      </div>
    </div>
  );
}
