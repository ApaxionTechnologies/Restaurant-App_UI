// import React, { useRef, useState, useEffect } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import { useNavigate } from "react-router-dom";
// import "./QRScanner.css";

// export default function QRScanner() {
//   const navigate = useNavigate();
//   const scannerRef = useRef(null);

//   const [scanning, setScanning] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Cleanup on unmount
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

//   const handleScanSuccess = (decodedText) => {
//     stopScanner();
//     try {
//       const qrData = JSON.parse(decodedText);
//       if (qrData.restaurant && qrData.table) {
//         localStorage.setItem("restaurantName", qrData.restaurant);
//         localStorage.setItem("tableNumber", qrData.table);
//         navigate(`/menu?restaurant=${encodeURIComponent(qrData.restaurant)}&table=${qrData.table}`);
//       } else {
//         setErrorMsg("Invalid QR code. Missing restaurant or table info.");
//       }
//     } catch (e) {
//       setErrorMsg("Invalid QR format. Expected JSON data.");
//     }
//   };

//   const startScanner = () => {
//     if (!scanning) {
//       setScanning(true); // Render #qr-reader first
//     }
//   };

//   // Initialize scanner after #qr-reader renders
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
//         .catch((err) => {
//           setErrorMsg("Camera access failed. Please allow permissions.");
//           setLoading(false);
//         });
//     }
//   }, [scanning]);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // ✅ Use Html5Qrcode in file mode without DOM element
//     const html5QrCode = new Html5Qrcode("");
//     html5QrCode
//       .scanFile(file, true)
//       .then(handleScanSuccess)
//       .catch(() => setErrorMsg("Could not read QR from image."));
//   };

//   return (
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
//       </div>
//     </div>
//   );
// }


import React, { useRef, useState, useEffect } from "react";
import { Html5Qrcode, Html5QrcodeScanType } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import "./QRScanner.css";

export default function QRScanner() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current.clear();
          scannerRef.current = null;
          setScanning(false);
        })
        .catch((err) => console.error("Stop failed:", err));
    }
  };

  const handleScanSuccess = (decodedText) => {
    stopScanner();
    try {
      const qrData = JSON.parse(decodedText);
      if (qrData.restaurant && qrData.table) {
        localStorage.setItem("restaurantName", qrData.restaurant);
        localStorage.setItem("tableNumber", qrData.table);
        navigate(`/menu?restaurant=${encodeURIComponent(qrData.restaurant)}&table=${qrData.table}`);
      } else {
        setErrorMsg("Invalid QR code. Missing restaurant or table info.");
      }
    } catch (e) {
      setErrorMsg("Invalid QR format. Expected JSON data.");
    }
  };

  const startScanner = () => {
    if (!scanning) {
      setScanning(true);
    }
  };

  useEffect(() => {
    if (scanning) {
      setLoading(true);
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      html5QrCode
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          handleScanSuccess,
          (error) => console.warn("Scan error:", error)
        )
        .then(() => setLoading(false))
        .catch(() => {
          setErrorMsg("Camera access failed. Please allow permissions.");
          setLoading(false);
        });
    }
  }, [scanning]);

  // ✅ Updated for file scanning
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode(Html5QrcodeScanType.SCAN_TYPE_FILE);
      const decodedText = await html5QrCode.scanFile(file, true);
      handleScanSuccess(decodedText);
    } catch (err) {
      console.error("QR Scan Error:", err);
      setErrorMsg("Could not read QR from image.");
    }
  };

  return (
    <div className="scanner-wrapper">
      <div className="scanner-box">
        <h1>📱 Scan Your Table QR</h1>
        <p>Scan the QR on your table to view the menu.</p>

        {!scanning && (
          <div className="button-row">
            <button className="btn btn-primary" onClick={startScanner}>
              ▶️ Start Scanning
            </button>
            <label className="btn btn-success" style={{ cursor: "pointer" }}>
              📂 Upload QR
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
            </label>
          </div>
        )}

        {scanning && (
          <div>
            <div id="qr-reader" className="qr-area"></div>
            <button className="btn btn-danger mt-3" onClick={stopScanner}>
              🛑 Stop Scanning
            </button>
            {loading && <p className="loading">Starting Camera...</p>}
          </div>
        )}

        {errorMsg && <p className="text-danger mt-3">{errorMsg}</p>}
      </div>
    </div>
  );
}
