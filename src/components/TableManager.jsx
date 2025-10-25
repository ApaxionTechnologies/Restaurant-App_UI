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
      await updateRestaurantTables( tableCount);
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

const QRGenerator = ({ restaurant }) => {
  const [qrList, setQrList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const qrPreviewRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const downloadSingleQR = async () => {
    if (!qrPreviewRef.current || qrList.length === 0) return;
    
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(qrPreviewRef.current, {
        useCORS: true,
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          
          const clonedElement = clonedDoc.querySelector('.qr-preview-card');
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.transition = 'none';
          }
        }
      });

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `QR_Table_${qrList[currentIndex].table}_Apaxion.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAllQRCodes = async () => {
    if (qrList.length === 0) return;
    
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const originalIndex = currentIndex;

      for (let i = 0; i < qrList.length; i++) {
        setCurrentIndex(i);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const canvas = await html2canvas(qrPreviewRef.current, {
          useCORS: true,
          scale: 2, 
          logging: false,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.querySelector('.qr-preview-card');
            if (clonedElement) {
              clonedElement.style.transform = 'none';
              clonedElement.style.transition = 'none';
            }
          }
        });

        const dataUrl = canvas.toDataURL("image/png", 1.0);
        const imgData = dataUrl.split(",")[1];
        zip.file(`QR_Table_${qrList[i].table}_Apaxion.png`, imgData, { base64: true });

        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      setCurrentIndex(originalIndex);
      
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${restaurant.restaurantName.replace(/\s+/g, "_")}_QRs_Apaxion.zip`);
    } catch (error) {
      console.error("Error downloading all QR codes:", error);
      toast.error("Failed to download QR codes");
    } finally {
      setIsDownloading(false);
    }
  };
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
        disabled={qrList.length === 0 || isDownloading}
      >
        {isDownloading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Preparing Download...
          </>
        ) : (
          <>
            <i className="bi bi-download"></i> Download All QR Codes ({qrList.length})
          </>
        )}
      </button>

      <button
        onClick={downloadSingleQR}
        className="btn btn-global mt-1 w-100"
        disabled={qrList.length === 0 || isDownloading}
      >
        <i className="bi bi-download"></i> Download Current QR Code
      </button>

      <div
        className="qr-preview-card mt-2"
        ref={qrPreviewRef}
        style={qrList.length === 0
          ? { background: "transparent", boxShadow: "none", textAlign: "center", color: "#888", padding: "40px 20px", border: "2px dashed #ccc" }
          : { 
              background: "var(--card-bg)", 
              boxShadow: "var(--shadow-1)", 
              minHeight: "230px",
              transform: 'translateZ(0)', 
              willChange: 'transform' 
            }
        }
      >
        {currentQR ? (
          <>
            <div className="qr-bg">
              <div className="qr-overlay">
                <QRCodeCanvas
                  value={currentQR.value}
                  size={200}
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  imageSettings={{ 
                    src: "",
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>
              <div className="view-menu-btn">View Our Menu</div>
            </div>
            <div className="qr-header-inline" aria-hidden="true">
              <div className="qr-restaurant-name" style={{fontWeight: 'bold', fontSize: '18px'}}>
                {restaurant.restaurantName}
              </div>
              <div className="qr-table-badge">
                Table <span className="qr-table-number">{currentQR.table}</span>
              </div>
            </div>

            <div className="qr-text-section">
              <h3 style={{fontWeight: 'bold', margin: '10px 0'}}>SCAN & ORDER</h3>
              <p style={{fontSize: '14px', lineHeight: '1.4'}}>
                Scan The QR Code with Your Smartphone Camera, read our digital
                menu and order!
              </p>
              <h4 className="brand" style={{fontWeight: 'bold', marginTop: '15px'}}>Powered by Apaxion</h4>
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
        <div className="qr-nav-arrows d-flex justify-content-between align-item-center mb-5 flex-column flex-md-row gap-2">
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

export default function GenerateQR() {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    const fetchRestaurantData = async () => {
      try {
        setIsLoading(true);
        const data = await getMyRestaurant();
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
      {}
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