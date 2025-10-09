



// import React, { useRef, useState, useEffect } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import { useNavigate } from "react-router-dom";
// import "./QRScanner.css";
// import Footer from "../components/Footer.jsx";
// import AdminLogin from "../pages/AdminLogin"; 



// export default function QRScanner() {
//   const navigate = useNavigate();
//   const scannerRef = useRef(null);

//   const [scanning, setScanning] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showLoginModal, setShowLoginModal] = useState(false);


//   useEffect(() => {
//     return () => stopScanner();
//   }, []);

//   const stopScanner = () => {
//     if (scannerRef.current) {
//       scannerRef.current
//         .stop()
//         .then(() => {
//           scannerRef.current.clear();
//           scannerRef.current = null;
//           setScanning(false);
//         })
//         .catch((err) => console.error("Stop failed:", err));
//     }
//   };

// const handleScanSuccess = (data) => {
//   if (!data) return;

//   try {
//     const qrInfo = JSON.parse(data);

//     console.log("Scanned QR Data:", qrInfo);
//     if (!qrInfo.restaurantId || !qrInfo.tableNumber) {
//       setErrorMsg("Invalid QR data: missing restaurantId or tableNumber");
//       return;
//     }

   
//     localStorage.setItem("restaurantId", qrInfo.restaurantId);
//     localStorage.setItem("table", qrInfo.table);
//     localStorage.setItem("restaurantName", qrInfo.restaurantName);

 
//     navigate(`/menu?restaurant=${qrInfo.restaurantId}&table=${qrInfo.table}`);
//   } catch (e) {
//     console.error("Invalid QR format", e);
//     setErrorMsg("Invalid QR data");
//   }
// };


//   const startScanner = () => {
//     if (!scanning) {
//       setScanning(true);
//     }
//   };

//   useEffect(() => {
//     if (scanning) {
//       setLoading(true);
//       const html5QrCode = new Html5Qrcode("qr-reader");
//       scannerRef.current = html5QrCode;

//       html5QrCode
//         .start(
//           { facingMode: "environment" },
//           { fps: 10, qrbox: { width: 250, height: 250 } },
//           handleScanSuccess,
//           (error) => console.warn("Scan error:", error)
//         )
//         .then(() => setLoading(false))
//         .catch(() => {
//           setErrorMsg("Camera access failed. Please allow permissions.");
//           setLoading(false);
//         });
//     }
//   }, [scanning]);

//   // ✅ Fixed File Upload method
//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     try {
//       const html5QrCode = new Html5Qrcode("qr-file-reader"); // Dummy hidden container
//       const decodedText = await html5QrCode.scanFile(file, true);
//       handleScanSuccess(decodedText);
//     } catch (err) {
//       console.error("QR Scan Error:", err);
//       setErrorMsg("Could not read QR from image.");
//     }
//   };

//   return (
//     <>    
//     {/* <RegisterRestaurantHeader /> */}
//       {showLoginModal && (
//   <div className="admin-login-overlay">
//     <div className="admin-login-modal">
//       <AdminLogin onClose={() => setShowLoginModal(false)} />
//     </div>
//   </div>
// )}
//     <div className="scanner-wrapper">
//       <div className="scanner-box">
//         <h1>📱 Scan Your Table QR</h1>
//         <p>Scan the QR on your table to view the menu.</p>

//         {!scanning && (
//           <div className="button-row">
//             <button className="btn btn-primary" onClick={startScanner}>
//               ▶️ Start Scanning
//             </button>
//             <label className="btn btn-success" style={{ cursor: "pointer" }}>
//               📂 Upload QR
//               <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
//             </label>
//           </div>
//         )}

//         {scanning && (
//           <div>
//             <div id="qr-reader" className="qr-area"></div>
//             <button className="btn btn-danger mt-3" onClick={stopScanner}>
//               🛑 Stop Scanning
//             </button>
//             {loading && <p className="loading">Starting Camera...</p>}
//           </div>
//         )}

//         {errorMsg && <p className="text-danger mt-3">{errorMsg}</p>}

//         {/* ✅ Hidden container for file scan */}
//         <div id="qr-file-reader" style={{ display: "none" }}></div>
//       </div>
//     </div>
//     <Footer/>
//     </>
//   );
// }