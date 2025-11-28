import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { BsPersonLock } from "react-icons/bs";
import AdminLogin from "../pages/AdminLogin";
import "../components/AdminLoginModal.css";
import "./HomeHeader.css";
import "../styles/DropDown.css";
import { Home } from "lucide-react";
import { useNotification } from "../context/Notification";
//import { getOrders } from "../services/apiService.js";
import { getOrders } from "../services/orderService.js";
export default function HomeHeader({
  isAdminDashboard = false,
  restaurant = null,
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(() => {
    return sessionStorage.getItem("headerScrolled") === "true";
  });

  const isRegisterPage = location.pathname === "/registerrestaurant";
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDropdownopen, setShowDropdownopen] = useState(false);
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const profileRef = useRef(null);
  const dropdownRef = useRef(null);
  const notificationSoundRef = useRef(null);

  const bellRef = useRef(null);
  const bellDropdownRef = useRef(null);

  const [anchor, setAnchor] = useState({
    top: 80,
    left: window.innerWidth - 230,
  });
  const [bellAnchor, setBellAnchor] = useState({
    top: 80,
    left: 0,
    minWidth: 300,
  });

  const { notificationCount, clearNotifications } = useNotification();
  const computeAnchor = () => {
    if (!profileRef.current) return;
    const rect = profileRef.current.getBoundingClientRect();
    const top = rect.bottom +  8;
    const minWidth = 210;
    let left = rect.right + window.scrollX - minWidth;
    if (left < 8) left = 8;
    if (left + minWidth > window.innerWidth - 8)
      left = window.innerWidth - minWidth - 8;
    return { top, left, minWidth };
  };

  const computeBellAnchor = () => {
    if (!bellRef.current) return;
    const rect = bellRef.current.getBoundingClientRect();
    const top = rect.bottom +  8;
    const minWidth = 300;
    let left = rect.right + window.scrollX - minWidth;
    if (left < 8) left = 8;
    if (left + minWidth > window.innerWidth - 8)
      left = window.innerWidth - minWidth - 8;
    return { top, left, minWidth };
  };

  const fetchRecentOrders = async () => {
    const restaurantId = restaurant?._id;
    if (!restaurantId) return;
    setIsLoadingOrders(true);
    try {
      const data = await getOrders();

      if (data.success) {
        const orders = (data.orders || []).slice(0, 5).map((order) => ({
          orderNo: order.orderId || `ORD-${order.orderNo}`,
          table: `T${order.tableNumber || "N/A"}`,
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
    setShowBellDropdown(false);
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
    setShowDropdownopen(false);
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
  const prevCountRef = useRef(notificationCount);
  useEffect(() => {
    if (notificationCount > prevCountRef.current) {
      if (notificationSoundRef.current) {
        notificationSoundRef.current.play().catch(err => console.log(err));
      }
    }
    prevCountRef.current = notificationCount;
  }, [notificationCount]);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleDocClick = (e) => {
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
    };

    const handleKey = (e) => {
      if (e.key === "Escape") {
        setShowDropdownopen(false);
        setShowBellDropdown(false);
      }
    };

    const handleResizeScroll = () => {
      if (showDropdownopen) {
        const a = computeAnchor();
        if (a) setAnchor(a);
      }
      if (showBellDropdown) {
        const a = computeBellAnchor();
        if (a) setBellAnchor(a);
      }
    };

    document.addEventListener("click", handleDocClick);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResizeScroll);
    window.addEventListener(
      "scroll",
      () => {
        if (showDropdownopen) setShowDropdownopen(false);
        if (showBellDropdown) setShowBellDropdown(false);
      },
      { passive: true }
    );

    return () => {
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResizeScroll);
      window.removeEventListener("scroll", handleResizeScroll);
    };
  }, [showDropdownopen, showBellDropdown]);

  return (
    <>
     <audio ref={notificationSoundRef} src="/notification.mp3" preload="auto" />
      <header
        className={`Home-Header ${scrolled ? "scrolled" : ""} ${
          isAdminDashboard ? "admin" : ""
        }`}
        data-admin={isAdminDashboard ? "true" : "false"}
      >
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
                <button
                  className="btn-global"
                  style={{ height: "50px", fontSize: "16px" }}
                  onClick={() => navigate("/registerrestaurant")}
                >
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
                style={{
                  position: "relative",
                  marginRight: "20px",
                  cursor: "pointer",
                }}
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
                <div
                  className="fb-dropdown-title fb-dropdown-item"
                  style={{
                    fontWeight: "bold",
                    cursor: "default",
                    borderBottom: "1px solid #e9ebee",
                    padding: "12px 20px",
                  }}
                >
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
                      <strong>
                        {order.table}-{order.orderNo}
                      </strong>
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
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
              </div>
            </>
          ) : (
            <button
              className="btn-global"
              style={{ height: "50px", fontSize: "16px" }}
              onClick={() => setShowAdminModal(true)}
            >
              <BsPersonLock style={{ color: "white", fontSize: "20px" }} />{" "}
              Login
            </button>
          )}
        </div>
      </header>

      
      <div
        ref={dropdownRef}
        className={`fb-dropdown ${showDropdownopen ? "" : "hidden"}`}
        style={
          {
           
          }
        }
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
          <FaUserCircle className="dropdown-icon" /> Edit Profile
        </div>

        <div
          className="fb-dropdown-item"
          onClick={() => {
            setShowDropdownopen(false);
            if (onLogout) {
              onLogout();
              sessionStorage.removeItem("headerScrolled");
            }
          }}
          style={{ color: "#e55353", fontWeight: "600", userSelect: "none" }}
        >
          <BsPersonLock className="dropdown-icon" /> Logout
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
