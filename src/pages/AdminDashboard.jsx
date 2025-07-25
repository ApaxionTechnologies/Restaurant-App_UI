// import React from "react";
// import { Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function AdminDashboard() {
//   const restaurantId = "yourRestaurantIdHere"; // replace with dynamic ID if needed

//   return (
//     <div className="container mt-5 text-center">
//       <h2>Welcome, Admin 👨‍💻</h2>
//       <p className="lead">Manage your restaurant menu and settings below:</p>
//       <div className="d-flex flex-column gap-3 mt-4">
//         <Link to={`/menu/${restaurantId}`} className="btn btn-info btn-lg">
//           📋 View Menu
//         </Link>
//         <Link to="/add-item" className="btn btn-success btn-lg">
//           ➕ Add Menu Item
//         </Link>
//         <Link to="/remove-item" className="btn btn-danger btn-lg">
//           ❌ Remove Menu Item
//         </Link>
//         <Link to="/generate-qr" className="btn btn-primary btn-lg">
//           🔗 Generate Table QR
//         </Link>
//       </div>
//     </div>
//   );
// }






import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // ✅ Required for dropdown
import Footer from "../components/Footer";
import "../components/AdminDashboard.css";


import { FaUserCircle } from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ✅ State to hold fetched values
  const [restaurantName, setRestaurantName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    const storedRestaurant = localStorage.getItem("restaurantName");

    if (!storedEmail) {
      // Not logged in
      navigate("/admin-login");
    } else {
      setAdminEmail(storedEmail);
      setRestaurantName(storedRestaurant || "My Restaurant");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("restaurantName");
    navigate("/admin-login");
  };

  return (
    <div>
      {/* Header */}
      <header className="admin-header d-flex justify-content-between align-items-center p-3 shadow">
        <div>
          <h5 className="mb-0 fw-bold">{restaurantName}</h5>
          <span className="text-muted small">{adminEmail}</span>
        </div>
        <div className="dropdown">
          <FaUserCircle
            size={30}
            className="dropdown-toggle"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ cursor: "pointer" }}
          />
          <ul className="dropdown-menu dropdown-menu-end">
            <li><span className="dropdown-item-text text-muted">{adminEmail}</span></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mt-5 text-center">
        <h2>Welcome, Admin 👨‍💻</h2>
        <p className="lead">Manage your restaurant menu and settings below:</p>
        <div className="d-flex flex-column gap-3 mt-4">
          <Link to={`/menu/${restaurantName}`} className="btn btn-info btn-lg">
            📋 View Menu
          </Link>
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
      {/* Footer */}
            <div className="footer">
              <Footer />
            </div>
    </div>
  );
}
