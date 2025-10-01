import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Footer from "../components/Footer";
import { FaUserCircle } from "react-icons/fa";
import { FcDataConfiguration } from "react-icons/fc";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../components/AdminDashboard.css";
import HomeHeader from "../components/HomeHeader"; 
import { Helmet } from "react-helmet";
import { getMyRestaurant } from "../services/apiService";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await getMyRestaurant();
        setRestaurant(res.restaurant);
      } catch (err) {
        console.error(
          "Fetch /me failed -",
          err.response?.status,
          err.response?.data
        );
        navigate("/");
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setAdminEmail(decoded.email);
      
      setRestaurantName(decoded.restaurantName || "My Restaurant");

    } catch (err) {
      console.error("Invalid token", err);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    if (!favicon) return;

    if (restaurant?.logoUrl) {

      favicon.href = `${restaurant.logoUrl}?${new Date().getTime()}`;

    } else {
      favicon.href = "%PUBLIC_URL%/favicon.ico";
    }
  }, [restaurant]);

  const handleLogout = () => {

    localStorage.removeItem("token");
    setRestaurantName("");
    document.title = "React App";


    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = "%PUBLIC_URL%/favicon.ico?" + new Date().getTime();
    }

    navigate("/");
  };

  return (
    <div className="admin-dashboard-wrapper">
      <Helmet>
        <title>{restaurantName ? `${restaurantName}` : "React-App"}</title>
      </Helmet>


      {/* Admin Header */}

      <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        onLogout={handleLogout}
        restaurant={restaurant}
      />
      <main className="admin-dashboard-content container text-center mt-5">
        <h2 className="fw-bold">Welcome, Admin 👨‍💻</h2>
        <p className="lead text-muted">
          Manage your restaurant menu and settings below:
        </p>

        <div className="dashboard-grid mt-5">
          <Link
            to={`/menu/${restaurant?.restaurantName || "restaurant"}`}
            className="dashboard-card view"
          >
            <span className="icon">📋</span>
            <h5>View Menu</h5>
            <p>See your restaurant's full menu.</p>
          </Link>

          <Link to="/add-item" className="dashboard-card add">
            <span className="icon">➕</span>
            <h5>Add Menu Item</h5>
            <p>Add new dishes and beverages.</p>
          </Link>

          {/* <Link to="/add-bulk-items" className="dashboard-card add">
            <span className="icon">📁</span>
            <h5>Add Bulk Item</h5>
            <p>Add all items with a single file</p>
          </Link> */}


          <Link to="/generate-menu-qr" className="dashboard-card add">
            <span className="icon">➕</span>
            <h5>Generate Menu QR</h5>
            <p>Create QR codes for Restaurant Menu.</p>
          </Link>


          <Link to="/table-manager" className="dashboard-card tables">
            <span className="icon">🪑</span>
            <h5>Manage Tables</h5>
            <p>Organize seating and reservations.</p>
          </Link>
          {/* ✅ New Order Management Card */}

          <Link to="/order-management" className="dashboard-card orders">
            <span className="icon">🛒</span>
            <h5>Order Management</h5>
            <p>View placed orders by tables & dishes.</p>
            </Link>

             {/* <Link to="/tax-management" className="dashboard-card orders">
            <span className="icon">🛒</span>
            <h5>Tax Slab Management</h5>
            <p>View placed orders by tables & dishes.</p>
          </Link> */}
          <Link to="/config" className="dashboard-card orders">
            <span className="icon"><FcDataConfiguration /></span>
            <h5>Configurations</h5>
            <p>Configure categories and cuisines.</p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
