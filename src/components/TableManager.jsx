// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../styles/TableManager.css";
// import Footer from "./Footer";
// import HomeHeader from "../components/HomeHeader.jsx";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const TableManager = () => {
//   const [restaurantData, setRestaurantData] = useState(null);
//   const [tables, setTables] = useState(0);
//   const [error, setError] = useState("");
//   const restaurantEmail = localStorage.getItem("restaurantEmail");
//    const [restaurant, setRestaurant] = useState(null);
//     const navigate = useNavigate();
//     const [restaurantName, setRestaurantName] = useState("My Restaurant");
//     const [adminEmail, setAdminEmail] = useState("");
  
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5001/api/restaurants/me", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setRestaurant(res.data.restaurant);
//       } catch (err) {
//         console.error("Fetch /me failed -", err.response?.status, err.response?.data);
//       }
//     };
//     fetchMe();
//   }, []);

//   useEffect(() => {
//     const fetchRestaurantData = async () => {
//       try {
//         if (!restaurantEmail) {
//           setError("Restaurant email is missing.");
//           return;
//         }

//         const encodedEmail = encodeURIComponent(restaurantEmail);
//         const response = await axios.get(
//           `http://localhost:5001/api/restaurants/${encodedEmail}`
//         );

//         if (response.data.restaurant) {
//           setRestaurantData(response.data.restaurant);
//           setTables(response.data.restaurant.tables);
//         } else {
//           setError("No restaurant data found for this email.");
//         }
//       } catch (err) {
//         console.error("Failed to fetch restaurant data", err);
//         setError("Error fetching restaurant data. Please try again later.");
//       }
//     };

//     if (restaurantEmail) {
//       fetchRestaurantData();
//     } else {
//       setError("Restaurant email is missing.");
//     }
//   }, [restaurantEmail]);

//   const handleIncrement = () => {
//     const updated = tables + 1;
//     setTables(updated);
//     updateTablesOnBackend(updated);
//   };

//   const handleDecrement = () => {
//     const updated = tables > 0 ? tables - 1 : 0;
//     setTables(updated);
//     updateTablesOnBackend(updated);
//   };

//   const updateTablesOnBackend = async (updatedTables) => {
//     try {
//       const encodedEmail = encodeURIComponent(restaurantEmail);
//       await axios.put(
//         `http://localhost:5001/api/restaurants/${encodedEmail}/tables`,
//         { tables: updatedTables }
//       );
//     } catch (err) {
//   toast.error("Failed to update tables on backend");
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       const encodedEmail = encodeURIComponent(restaurantEmail);
//       await axios.put(
//         `http://localhost:5001/api/restaurants/${encodedEmail}/tables`,
//         { tables }
//       );
//       toast.success("Tables updated successfully!");
//     } catch (err) {
//       toast.error("Failed to update tables");
//     }
//   };
//  const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("adminEmail");
//     navigate("/");
//   };

//   return (
//     <div className="table-manager-wrapper">

//      <HomeHeader
//             isAdminDashboard={true}
//             restaurantName={restaurantName}
//             adminEmail={adminEmail}
//             onLogout={handleLogout}
//             restaurant={restaurant}
//           />
    
//       <div className="table-manager-container">
//         <div className="table-manager-card">
//           <h3>Manage Tables</h3>
//           <h6>
//             {restaurantData ? restaurantData.restaurantName : "Restaurant"} <br />
//             Current Tables: {tables}
//           </h6>

//           <div className="button-group">
//             <button onClick={handleDecrement}>-</button>
//             <span className="table-count">{tables}</span>
//             <button onClick={handleIncrement}>+</button>
//           </div>

//           <button className="save-button" onClick={handleSubmit}>
//             Save Changes
//           </button>

//           {error && <div className="alert-danger">{error}</div>}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default TableManager;




import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";
import { getMyRestaurant, updateRestaurantTables } from "../services/apiService.js";
import HomeHeader from "./HomeHeader.jsx";

// Table Manager Component
const TableManager = ({ restaurant, onTablesUpdated }) => {
  const [tableCount, setTableCount] = useState(restaurant?.tables || 0);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveTables = async () => {
    if (tableCount < 0) {
      toast.error("Table count cannot be negative");
      return;
    }
    
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await updateRestaurantTables(token, tableCount);
      toast.success("Table count updated successfully!");
      onTablesUpdated(tableCount);
    } catch (err) {
      console.error("Failed to update table count:", err);
      toast.error("Failed to update table count");
    } finally {
      setIsUpdating(false);
    }
  };
   const handleInputChange = (e) => {
    const value = e.target.value;
    const parsedValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
    setTableCount(parsedValue);
  };

  return (
    <>
      <div className="table-manager-card">
        <h3 className="mb-3">
          <i className="bi bi-table"></i> Manage Tables
        </h3>
        
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Number of Tables in Your Restaurant
          </label>
          <input
            type="number"
            className="form-control"
            value={tableCount}
            onChange={handleInputChange}
            min="0"
          />
          <div className="form-text">
            Enter the total number of tables in your restaurant
          </div>
        </div>
        
        <button
          onClick={handleSaveTables}
          className="btn btn-primary w-100"
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Saving...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle"></i> Save Table Count
            </>
          )}
        </button>
        
        {restaurant?.tables > 0 && (
          <div className="alert alert-info mt-3">
            <i className="bi bi-info-circle"></i> Currently have {restaurant.tables} tables saved in database.
          </div>
        )}
      </div>
    </>
  );
};

// QR Generator Component
const QRGenerator = ({ restaurant }) => {
  const [qrList, setQrList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const qrRefs = useRef([]);

  // Automatically generate QR codes based on restaurant table count
  useEffect(() => {
    if (restaurant?.tables > 0 && restaurant?._id) {
      const newQrList = [];
      for (let i = 1; i <= restaurant.tables; i++) {
        newQrList.push({
          table: i,
          value: `${window.location.origin}/menu?restaurantId=${restaurant._id}&table=${i}`
        });
      }
      setQrList(newQrList);
      setCurrentIndex(0);
    } else {
      setQrList([]);
    }
  }, [restaurant]);

  const downloadSingleQR = async (index) => {
    const qrElement = qrRefs.current[index];
    if (!qrElement) return;

    await new Promise(resolve => setTimeout(resolve, 300));
    const canvas = await html2canvas(qrElement, {
      useCORS: true,
      scale: 4,
    });

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `QR_Table_${qrList[index].table}_Apaxion.png`;
    link.click();
  };

  const downloadAllQRCodes = async () => {
    const zip = new JSZip();

    for (let i = 0; i < qrList.length; i++) {
      const qrElement = qrRefs.current[i];
      if (!qrElement) continue;

      await new Promise(resolve => setTimeout(resolve, 300));
      const canvas = await html2canvas(qrElement, {
        useCORS: true,
        scale: 4,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const imgData = dataUrl.split(",")[1];
      zip.file(`QR_Table_${qrList[i].table}_Apaxion.png`, imgData, { base64: true });

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${restaurant.restaurantName.replace(/\s+/g, "_")}_QRs_Apaxion.zip`);
  };

  // Get current QR code safely
  const getCurrentQR = () => {
    if (qrList.length > 0 && currentIndex >= 0 && currentIndex < qrList.length) {
      return qrList[currentIndex];
    }
    return null;
  };

  const currentQR = getCurrentQR();

  if (!restaurant?.tables || restaurant.tables === 0) {
    return (
      <div className="qr-generator-card">
        <div className="alert alert-warning text-center">
          <i className="bi bi-exclamation-triangle"></i>
          <h5>No Tables Configured</h5>
          <p>Please set up your table count first to generate QR codes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-generator-card">
      <button
        onClick={downloadAllQRCodes}
        className="btn btn-global w-100"
        disabled={qrList.length === 0}
      >
        <i className="bi bi-download"></i> Download All QR Codes ({qrList.length})
      </button>

      <button
        onClick={() => downloadSingleQR(currentIndex)}
        className="btn btn-global mt-1 w-100"
        disabled={qrList.length === 0}
      >
        <i className="bi bi-download"></i> Download Current QR Code
      </button>

      <div
        className="qr-preview-card mt-2"
        style={qrList.length === 0
          ? { background: "transparent", boxShadow: "none", textAlign: "center", color: "#888", padding: "40px 20px", border: "2px dashed #ccc" }
          : { background: "var(--card-bg)", boxShadow: "var(--shadow-1)" ,minHeight:"330px"}}
      >
        {currentQR ? (
          <>
            <div className="qr-bg">
              <div
                className="qr-overlay"
                ref={(el) => (qrRefs.current[currentIndex] = el)}
              >
                <QRCodeCanvas
                  value={currentQR.value}
                  size={200}
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <div className="view-menu-btn">View Our Menu</div>
            </div>
            <div className="qr-header-inline" aria-hidden="true">
              <div className="qr-restaurant-name">
                {restaurant.restaurantName}
              </div>
              <div className="qr-table-badge">
                Table <span className="qr-table-number">{currentQR.table}</span>
              </div>
            </div>

            <div className="qr-text-section">
              <h3>SCAN & ORDER</h3>
              <p>
                Scan The QR Code with Your Smartphone Camera, read our digital
                menu and order!
              </p>
              <h4 className="brand">Powered by Apaxion</h4>
            </div>
          </>
        ) : (
          <div className="qr-placeholder text-center p-4">
            <p className="text-muted">
              No QR Generated Yet. <br /> Please set up your table count first.
            </p>
          </div>
        )}
      </div>

      {qrList.length > 0 && (
        <div className="qr-nav-arrows d-flex justify-content-between mb-1">
          <button
            className="btn btn-outline-secondary"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
          >
            ← Previous
          </button>
          <span className="align-self-center">
            Table {currentIndex + 1} of {qrList.length}
          </span>
          <button
            className="btn btn-outline-secondary"
            disabled={currentIndex === qrList.length - 1}
            onClick={() => setCurrentIndex(currentIndex + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

// Main Component
export default function GenerateQR() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchRestaurantData = async () => {
      try {
        setIsLoading(true);
        const data = await getMyRestaurant(token);
        setRestaurant(data.restaurant || data);
        setIsLoading(false);
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
  
  const handleTablesUpdated = (newTableCount) => {
    setRestaurant(prev => ({ ...prev, tables: newTableCount }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    navigate("/");
  };

  if (isLoading) {
    return (
      <>
        <div className="generate-qr-wrapper">
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading restaurant data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurant?.restaurantName}
        adminEmail={localStorage.getItem("adminEmail")}
        onLogout={handleLogout}
        restaurant={restaurant}
      />
      <div className="generate-qr-wrapper">
        <TableManager 
          restaurant={restaurant} 
          onTablesUpdated={handleTablesUpdated} 
        />
        
        <QRGenerator 
          restaurant={restaurant} 
        />
      </div>
    </>
  );
}


