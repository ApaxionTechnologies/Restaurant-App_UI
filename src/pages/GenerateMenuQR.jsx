import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/GenerateMenuQR.css";
import Footer from "../components/Footer.jsx";
import HomeHeader from "../components/HomeHeader.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyRestaurant, fetchMe } from "../services/apiService.js";

export default function GenerateMenuQR() {
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState("My Restaurant");
  const [adminEmail, setAdminEmail] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [qrValue, setQrValue] = useState("");
  const previewRef = useRef(null);
  const [restaurant, setRestaurant] = useState(null);
  
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await getMyRestaurant();
        setRestaurant(res.restaurant);
      } catch (err) {
        console.error("Fetch /me failed -", err);
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

    const fetchRestaurantData = async () => {
      try {
        const data = await getMyRestaurant();
        const restaurantInfo = data.restaurant;
        setRestaurantName(restaurantInfo.restaurantName);
        setAdminEmail(restaurantInfo.email);
        setRestaurantData(restaurantInfo);
        
        if (restaurantInfo._id) {
          setQrValue(`http://localhost:3000/menu?restaurantId=${restaurantInfo._id}`);
        }
      } catch (err) {
        console.error("Failed to fetch restaurant data:", err);
        toast.error("Session expired, please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("adminEmail");
        navigate("/");
      }
    };

    fetchRestaurantData();
  }, [navigate]);

  const downloadMenuQR = async () => {
    if (!previewRef.current) return;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const canvas = await html2canvas(previewRef.current, {
      useCORS: true,
      scale: 4,
    });

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${(restaurantName || "Restaurant").replace(/\s+/g, "_")}_Menu_QR.png`;
    link.click();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    navigate("/");
  };

  return (
    <>
      {/* <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        onLogout={handleLogout}
        restaurant={restaurant}
      /> */}

      <div className="generate-qr-wrapper">
        <div className="centered-container">
        
          <div className="qr-card d-flex flex-column">
            <h2 className="mb-1 ">
              <i className="bi bi-qr-code-scan"></i> Menu QR 
            </h2>
            <p  className="mt-1" >
              Restaurant: <strong>{restaurantName}</strong>
            </p>
            
            <div
              className="qr-preview-card "
              ref={previewRef}
              style={{
                background: "var(--card-bg)",
                boxShadow: "var(--shadow-1)",
                padding: "20px",
                minHeight: "520px",
              }}
            >
              {qrValue ? (
                <>
                  <div className="qr-bg">
                    <div className="qr-overlay">
                      <QRCodeCanvas
                        value={qrValue}
                        size={200}
                        includeMargin={true}
                        bgColor="#ffffff"
                        fgColor="#000000"
                      />
                    </div>
                    <div className="view-menu-btn">View Our Menu</div>
                  </div>

                  <div className="qr-header-inline" aria-hidden="true">
                    <div className="qr-restaurant-name mt-1">{restaurantName}</div>
                  </div>

                  <div className="qr-text-section ">
                    <h3>SCAN & VIEW MENU</h3>
                    <p>
                      Scan the QR code with your smartphone camera to open our
                      digital menu instantly.
                    </p>
                    <h4 className="brand">Powered by Apaxion</h4>
                  </div>
                </>
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={downloadMenuQR}
              className="btn btn-primary w-100 mt-3 "
              disabled={!qrValue}
            >
              <i className="bi bi-download"></i> Download Menu QR
            </button>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </>
  );
}