import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { BsPersonLock } from "react-icons/bs";
import AdminLogin from "../pages/AdminLogin";
import "../components/AdminLoginModal.css";
import "./HomeHeader.css";
import { Home } from "lucide-react";
import { useNotification } from '../context/Notification';

export default function HomeHeader({
  isAdminDashboard = false,
  restaurant = null,
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegisterPage = location.pathname === "/registerrestaurant";
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDropdownopen, setShowDropdownopen] = useState(false);
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const profileRef = useRef(null);
  const dropdownRef = useRef(null);

  const bellRef = useRef(null);
  const bellDropdownRef = useRef(null);

  const [anchor, setAnchor] = useState({ top: 80, left: window.innerWidth - 230 });
  const [bellAnchor, setBellAnchor] = useState({ top: 80, left: 0, minWidth: 300 });

  const { notificationCount, clearNotifications } = useNotification();

  const computeAnchor = () => {
    if (!profileRef.current) return;
    const rect = profileRef.current.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 8;
    const minWidth = 210;
    let left = rect.right + window.scrollX - minWidth;
    if (left < 8) left = 8;
    if (left + minWidth > window.innerWidth - 8) left = window.innerWidth - minWidth - 8;
    return { top, left, minWidth };
  };

  const computeBellAnchor = () => {
    if (!bellRef.current) return;
    const rect = bellRef.current.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 8;
    const minWidth = 300;
    let left = rect.right + window.scrollX - minWidth;
    if (left < 8) left = 8;
    if (left + minWidth > window.innerWidth - 8) left = window.innerWidth - minWidth - 8;
    return { top, left, minWidth };
  };

  const fetchRecentOrders = async () => {
    const restaurantId = restaurant?._id;
    if (!restaurantId) return;
    setIsLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders?restaurantId=${restaurantId}`);
      const data = await res.json();
      if (data.success) {
        const orders = (data.orders || []).slice(0, 5).map(order => ({
          orderNo: order.orderId || `ORD-${order.orderNo}`,
          table: `T${order.tableNumber || "N/A"}`
        }));
        setRecentOrders(orders);
      } else {
        setRecentOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch recent orders for bell dropdown", err);
      setRecentOrders([]);
    }
    setIsLoadingOrders(false);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setShowDropdownopen((prev) => {
      const willOpen = !prev;
      if (willOpen) {
        const a = computeAnchor();
        if (a) setAnchor(a);
      }
      return willOpen;
    });
  };

  const handleBellClick = (e) => {
    e.stopPropagation();
    setShowBellDropdown((prev) => {
      const willOpen = !prev;
      if (willOpen) {
        const a = computeBellAnchor();
        if (a) setBellAnchor(a);
        fetchRecentOrders();
        clearNotifications();
      }
      return willOpen;
    });
  };

  const handleOrderClick = () => {
    setShowBellDropdown(false);
    navigate("/order-management");
  };

  useEffect(() => {
    function handleDocClick(e) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdownopen(false);
      }
      if (
        bellRef.current &&
        !bellRef.current.contains(e.target) &&
        bellDropdownRef.current &&
        !bellDropdownRef.current.contains(e.target)
      ) {
        setShowBellDropdown(false);
      }
    }

    function handleKey(e) {
      if (e.key === "Escape") {
        setShowDropdownopen(false);
        setShowBellDropdown(false);
      }
    }

    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleKey);

    function handleResizeScroll() {
      if (showDropdownopen) {
        const a = computeAnchor();
        if (a) setAnchor(a);
      }
      if (showBellDropdown) {
        const a = computeBellAnchor();
        if (a) setBellAnchor(a);
      }
    }

    window.addEventListener("resize", handleResizeScroll);
    window.addEventListener("scroll", handleResizeScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResizeScroll);
      window.removeEventListener("scroll", handleResizeScroll);
    };
  }, [showDropdownopen, showBellDropdown]);

  return (
    <>
      <style>{`
        .fb-dropdown {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
          padding: 10px 0;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          font-size: 14px;
          color: #1c1e21;
          border-left: 4px solid #1877f2;
          max-height: 350px;
          overflow-y: auto;
          user-select: none;
          transition: opacity 0.3s ease, transform 0.3s ease;
          opacity: 1;
          transform: translateY(0);
          z-index: 99999;
        }
        .fb-dropdown.hidden {
          opacity: 0;
          transform: translateY(-15px);
          pointer-events: none;
        }
        .fb-dropdown-item {
          padding: 12px 20px;
          cursor: pointer;
          border-bottom: 1px solid #e9ebee;
          display: flex;
          flex-direction: column;
          transition: background-color 0.15s ease;
        }
        .fb-dropdown-item:hover {
          background-color: #f2f5f9;
        }
        .fb-dropdown-item strong {
          font-weight: 600;
          margin-bottom: 4px;
          color: #050505;
        }
        .fb-dropdown-loading,
        .fb-dropdown-empty {
          padding: 14px 20px;
          color: #65676b;
          font-style: italic;
          text-align: center;
          user-select: none;
        }
        .fb-view-all {
          text-align: center;
          padding: 12px 20px;
          cursor: pointer;
          font-weight: 700;
          color: #1877f2;
          border-top: 1px solid #e9ebee;
          user-select: none;
          transition: background-color 0.2s ease;
        }
        .fb-view-all:hover {
          background-color: #e7f3ff;
        }
      `}</style>


      <header className="Home-Header">
        <div className="Header-left">
          {isAdminDashboard ? (
            <span className="restaurant-name-text">
              {typeof restaurant?.restaurantName === "string"
                ? restaurant.restaurantName
                : typeof restaurant?.restaurant === "object"
                  ? restaurant.restaurant.restaurantName
                  : "My Restaurant"}
            </span>
          ) : (
            <>
              {!isRegisterPage && (
                <button className="btn-global" style={{ height: "50px", fontSize: "16px" }} onClick={() => navigate("/registerrestaurant")}>
                  Register as Restaurant
                </button>
              )}
              {isRegisterPage && (
                <Home
                  className="home-icon"
                  size={26}
                  strokeWidth={2}
                  style={{ cursor: "pointer", color: "#333" }}
                  onClick={() => navigate("/")}
                />
              )}
            </>
          )}
        </div>

        <div className="header-right">
          {isAdminDashboard ? (
            <>
              <div
                className="notification-bell"
                style={{ position: "relative", marginRight: "20px", cursor: "pointer" }}
                onClick={handleBellClick}
                ref={bellRef}
              >
                <FaBell size={26} />
                {notificationCount > 0 && !isLoadingOrders && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      userSelect: "none",
                    }}
                  >
                    {notificationCount}
                  </span>
                )}
              </div>

              {/* Facebook-style notification dropdown */}
              <div
                ref={bellDropdownRef}
                className={`fb-dropdown ${showBellDropdown ? "" : "hidden"}`}
                style={{
                  position: "fixed",
                  top: bellAnchor.top,
                  left: bellAnchor.left,
                  minWidth: bellAnchor.minWidth,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="fb-dropdown-title fb-dropdown-item" style={{ fontWeight: "bold", cursor: "default", borderBottom: "1px solid #e9ebee", padding: "12px 20px" }}>
                  Recent Orders
                </div>
                {isLoadingOrders ? (
                  <div className="fb-dropdown-loading">Loading...</div>
                ) : recentOrders.length === 0 ? (
                  <div className="fb-dropdown-empty">No recent orders</div>
                ) : (
                  recentOrders.map((order, idx) => (
                    <div
                      key={idx}
                      className="fb-dropdown-item"
                      onClick={handleOrderClick}
                      title={`Go to Table: ${order.table}, Order ID: ${order.orderNo}`}
                    >
                      <strong>{order.table}-{order.orderNo}</strong>
                    </div>
                  ))
                )}
                <div
                  className="fb-view-all"
                  onClick={() => {
                    setShowBellDropdown(false);
                    clearNotifications();
                    navigate("/order-management");
                  }}
                >
                  View All Orders
                </div>
              </div>

              <div className="profile-menu" ref={profileRef}>
                <img
                  src={
                    restaurant?.logoImage
                      ? restaurant.logoImage.startsWith("http")
                        ? restaurant.logoImage
                        : `http://localhost:5001${restaurant.logoImage}`
                      : "/burger.jpg"
                  }
                  alt="Restaurant Logo"
                  className="profile-logo"
                  onClick={handleProfileClick}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer" }}
                />
              </div>
            </>
          ) : (
            <button className="btn-global" style={{ height: "50px", fontSize: "16px" }} onClick={() => setShowAdminModal(true)}>
              <BsPersonLock style={{ color: "white", fontSize: "20px" }} /> Login
            </button>
          )}
        </div>
      </header>

      <div
        ref={dropdownRef}
        className={`fb-dropdown ${showDropdownopen ? "" : "hidden"}`}
        style={{
          position: "fixed",
          top: anchor.top,
          left: anchor.left,
          minWidth: anchor.minWidth || 210,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="fb-dropdown-item"
          onClick={() => {
            setShowDropdownopen(false);
            navigate("/admin-dashboard");
          }}
          style={{ userSelect: "none" }}
        >
          Dashboard
        </div>

        <div
          className="fb-dropdown-item"
          onClick={() => {
            setShowDropdownopen(false);
            navigate("/edit-restaurant-profile");
          }}
          style={{ userSelect: "none" }}
        >
          Edit Profile
        </div>

        <div
          className="fb-dropdown-item"
          onClick={() => {
            setShowDropdownopen(false);
            if (onLogout) onLogout();
          }}
          style={{ color: "#e55353", fontWeight: "600", userSelect: "none" }}
        >
          Logout
        </div>
      </div>

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
