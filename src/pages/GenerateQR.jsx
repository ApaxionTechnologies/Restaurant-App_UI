import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/GenerateQR.css";
import axios from "axios";
import Footer from "../components/Footer.jsx";
import HomeHeader from "../components/HomeHeader.jsx";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";
import { getMyRestaurant,fetchMe } from "../services/apiService.js";
export default function GenerateQR() {
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState("My Restaurant");
  const [adminEmail, setAdminEmail] = useState("");
  const [tables, setTables] = useState(0);
  const [startTable, setStartTable] = useState("");
  const [endTable, setEndTable] = useState("");
  const [qrList, setQrList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const qrRefs = useRef([]);


const [restaurantData, setRestaurantData] = useState(null);

 const [restaurant, setRestaurant] = useState(null);
  
  
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getMyRestaurant(token);
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
     const data = await fetchMe(token);
             const restaurantInfo = data.restaurant;
             setRestaurantName(restaurantInfo.restaurantName);
             setAdminEmail(restaurantInfo.email);
              setTables(restaurantInfo.tables || 0);
             setRestaurantData(restaurantInfo);
     
    
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


  const generateQRCodes = () => {

     if (!restaurantData?._id) {
    toast.error("Restaurant data is not loaded yet. Please wait a moment.");
    return;
  }


    const start = parseInt(startTable);
    const end = parseInt(endTable);

    if (
      isNaN(start) ||
      isNaN(end) ||
      start < 1 ||
      end < 1 ||
      start > tables ||
      end > tables ||
      start > end
    ) {
      toast.error(`Please enter a valid table range between 1 and ${tables}.`);
      return;
    }
    const list = [];
    for (let i = start; i <= end; i++) {
list.push({
  table: i,
  value: `http://localhost:3000/menu?restaurantId=${restaurantData._id}&table=${i}`
});

  console.log("Generating QR for restaurant:", restaurantData._id); 
console.log("restaurantData:", restaurantData);
console.log("restaurantData._id:", restaurantData?._id);

    }
    setQrList(list);
    setCurrentIndex(0);
  };

 const downloadSingleQR = async (index) => {
  const qrElement = document.querySelector(".qr-preview-card");
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
    const qrElement = document.querySelector(".qr-preview-card");
    if (!qrElement) continue;

  await new Promise(resolve => setTimeout(resolve, 300));
    const canvas = await html2canvas(qrElement, {
      useCORS: true,
      scale: 4,
    });

    const dataUrl = canvas.toDataURL("image/png");
    const imgData = dataUrl.split(",")[1];
    zip.file(`QR_Table_${qrList[i].table}_Apaxion.png`, imgData, { base64: true });

    setCurrentIndex(i);
    await new Promise((resolve) => setTimeout(resolve, 500)); 
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${restaurantName.replace(/\s+/g, "_")}_QRs_Apaxion.zip`);
};


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    navigate("/");
  };

  return (
    <>
      <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        onLogout={handleLogout}
        restaurant={restaurant}
      />

      <div className="generate-qr-wrapper">
        <div className="qr-card">
          <h2 className="mb-2">
            <i className="bi bi-qr-code-scan"></i> Generate QR Code
          </h2>
          <p>
            Restaurant: <strong>{restaurantName}</strong>
          </p>
          <p>
            Registered Tables: <strong>{tables}</strong>
          </p>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Enter Table Range
            </label>
            <div className="d-flex gap-2">
              <input
                type="number"
                className="form-control"
                placeholder="Start"
                value={startTable}
                onChange={(e) => setStartTable(e.target.value)}
                min="1"
                max={tables}
              />
              <input
                type="number"
                className="form-control"
                placeholder="End"
                value={endTable}
                onChange={(e) => setEndTable(e.target.value)}
                min="1"
                max={tables}
              />
            </div>
            <button
              onClick={generateQRCodes}
              className="btn btn-primary mt-3 w-100"
            >
              Generate QR Codes
            </button>
          </div>
           <div className="instruction-text">
          <p>Input the starting and ending table numbers to generate individual QR codes for each table.</p>
        </div>
           <div className="text-center">
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.j3Q5KEdaACrCsdDg-xayvQHaDj?rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="QR Code Example"
            className="qr-image"
          />
        </div>
        </div>
<div className="qr-card d-flex flex-column">
  <button
    onClick={downloadAllQRCodes}
    className="btn btn-dark mt-1 w-100"
    disabled={qrList.length === 0}
  >
    <i className="bi bi-archive"></i> Download All QR
  </button>

  <button
    onClick={() => downloadSingleQR(currentIndex)}
    className="btn btn-primary mt-1 w-100"
    disabled={qrList.length === 0} 
  >
    <i className="bi bi-download"></i> Download QR
  </button>

<div
  className="qr-preview-card mt-2"
  style={ qrList.length === 0 
    ? { background: "transparent", boxShadow: "none",textAlign: "center", color: "#888", padding: "40px 20px", border: "2px dashed #ccc" } 
    : { background: "var(--card-bg)", boxShadow: "var(--shadow-1)" } }
>
    {qrList.length > 0 ? (
      <>
        <div className="qr-bg">
        
          <div
            className="qr-overlay"
            ref={(el) => (qrRefs.current[currentIndex] = el)}
          >
            <QRCodeCanvas
              value={qrList[currentIndex].value}
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
    {restaurantName || (restaurantData && restaurantData.restaurantName) || "Restaurant"}
  </div>
  <div className="qr-table-badge">
    Table <span className="qr-table-number">{qrList[currentIndex].table}</span>
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
          No QR Generated Yet. <br /> Please enter a table range and click{" "}
          <strong>Generate QR Codes</strong>.
        </p>
      </div>
    )}
  </div>

  {qrList.length > 0 && (
    <div className="qr-nav-arrows d-flex justify-content-between mt-1">
      <button
        className="btn btn-outline-secondary"
        disabled={currentIndex === 0}
        onClick={() => setCurrentIndex(currentIndex - 1)}
      >
        ← Previous
      </button>
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


      </div>
      <div style={{ display: "none" }}>
  {qrList.map((qr, idx) => (
    <div key={idx} ref={(el) => (qrRefs.current[idx] = el)}>
      <QRCodeCanvas
        value={qr.value}
        size={220}
        includeMargin={true}
        bgColor="#ffffff"
        fgColor="#000000"
      />
    </div>
  ))}
</div>

      <Footer />
    </>
  );
}



// import React, { useState, useRef } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import html2canvas from "html2canvas";
// import "../styles/GenerateQR.css";

// export default function GenerateTableQRPage() {
//   const [tableNumber, setTableNumber] = useState("");
//   const [tables, setTables] = useState([]);
//   const [restaurantName] = useState("My Restaurant");
//   const qrRefs = useRef({});

//   const handleAddTable = () => {
//     if (!tableNumber.trim()) return;
//     setTables((prev) => [...prev, tableNumber.trim()]);
//     setTableNumber("");
//   };

//   const handleDownload = async (table) => {
//     const canvas = await html2canvas(qrRefs.current[table], {
//       backgroundColor: null,
//       useCORS: true,
//       scale: 3,
//     });
//     const link = document.createElement("a");
//     link.href = canvas.toDataURL("image/png");
//     link.download = `Table-${table}-QR.png`;
//     link.click();
//   };

//   return (
//     <div className="qr-page">
//       <h1>Generate Table QR Codes</h1>

//       <div className="qr-input-section">
//         <input
//           type="text"
//           value={tableNumber}
//           onChange={(e) => setTableNumber(e.target.value)}
//           placeholder="Enter Table Number"
//         />
//         <button onClick={handleAddTable}>Add Table</button>
//       </div>

//       <div className="qr-grid">
//         {tables.map((table) => (
//           <div key={table} className="qr-card-wrapper">
//             <div
//               className="qr-card"
//               ref={(el) => (qrRefs.current[table] = el)}
//             >
//               <div className="qr-header">
//                 <img src="/food1.png" alt="Food 1" className="food-img" />
//                 <h2 className="restaurant-name">{restaurantName}</h2>
//                 <img src="/food2.png" alt="Food 2" className="food-img" />
//               </div>
//               <QRCodeCanvas
//                 value={`https://your-domain.com/order?table=${table}`}
//                 size={180}
//                 bgColor="white"
//                 fgColor="#000"
//                 level="H"
//                 includeMargin={true}
//               />
//               <h3 className="table-label">Table {table}</h3>
//             </div>
//             <button
//               className="download-btn"
//               onClick={() => handleDownload(table)}
//             >
//               Download QR
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
