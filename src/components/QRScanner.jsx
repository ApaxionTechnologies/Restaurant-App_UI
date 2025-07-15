// // src/components/QRScanner.jsx
// import React, { useRef, useState, useEffect } from "react";
// import { Html5Qrcode } from "html5-qrcode";
// import { useNavigate } from "react-router-dom";
// import "./QRScanner.css";

// export default function QRScanner() {
//   const navigate = useNavigate();
//   const scannerRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [scanning, setScanning] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

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
//     navigate(`/menu?${decodedText}`);
//   };

//   const startScanner = () => {
//     if (scannerRef.current) return;
//     setScanning(true);
//     setTimeout(() => {
//       const html5QrCode = new Html5Qrcode("qr-reader");
//       scannerRef.current = html5QrCode;

//       html5QrCode.start(
//         { facingMode: "environment" },
//         {
//           fps: 10,
//           qrbox: { width: 250, height: 250 },
//         },
//         handleScanSuccess,
//         (error) => console.warn("Scan error:", error)
//       );
//     }, 0);
//   };

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     setLoading(true);
//     setErrorMsg("");
//     const html5QrCode = new Html5Qrcode("qr-reader-temp");
//     try {
//       const result = await html5QrCode.scanFile(file, true);
//       handleScanSuccess(result);
//     } catch (err) {
//       console.error("Image scan error:", err);
//       setErrorMsg("❌ Could not scan image. Try a clearer QR.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page-center fade-in">
//       <div className="scanner-box">
//         <h1 className="scanner-title">📱 Welcome to Apaxion QR Menu</h1>
//         <p className="scanner-subtext">Scan the QR on your table or upload one</p>

//         {!scanning && (
//           <button className="btn green" onClick={startScanner}>
//             ▶️ Start Scanning
//           </button>
//         )}

//         {scanning && (
//           <>
//             <div className="qr-area-wrapper">
//               <div className="scan-line"></div>
//               <div id="qr-reader" className="qr-area"></div>
//             </div>

//             <div className="button-row">
//               <label htmlFor="qr-upload" className="btn blue">
//                 📁 Upload QR Image
//               </label>
//               <input
//                 id="qr-upload"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileUpload}
//                 style={{ display: "none" }}
//               />

//               <button className="btn red" onClick={stopScanner}>
//                 🛑 Stop Scanning
//               </button>
//             </div>
//           </>
//         )}

//         {loading && <p className="loading">⏳ Scanning image...</p>}
//         {errorMsg && <p className="error">{errorMsg}</p>}

//         <div id="qr-reader-temp" style={{ display: "none" }}></div>
//       </div>
//     </div>
//   );
// }


import React, { useRef, useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import "./QRScanner.css";
//import Header from './components/Header'; // ✅ correct if in same folder as src/components


export default function QRScanner() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

    const match = decodedText.trim().match(/^t(\d+)$/i);
    if (match) {
      const tableNumber = match[1];
      navigate(`/menu?table=${tableNumber}`);
    } else {
      setErrorMsg("❌ Invalid QR code. Please scan a valid table QR (like t1, t2, ...).");
    }
  };

  const startScanner = () => {
    if (scannerRef.current) return;
    setScanning(true);
    setTimeout(() => {
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        handleScanSuccess,
        (error) => console.warn("Scan error:", error)
      );
    }, 0);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    setErrorMsg("");
    const html5QrCode = new Html5Qrcode("qr-reader-temp");
    try {
      const result = await html5QrCode.scanFile(file, true);
      handleScanSuccess(result);
    } catch (err) {
      console.error("Image scan error:", err);
      setErrorMsg("❌ Could not scan image. Please upload a clear and valid QR.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center fade-in">
      <div className="scanner-box">
        <h1 className="scanner-title">📱 Welcome to Apaxion QR Menu</h1>
        <p className="scanner-subtext">Scan the QR on your table or upload one</p>

        {!scanning && (
          <button className="btn green" onClick={startScanner}>
            ▶️ Start Scanning
          </button>
        )}

        {scanning && (
          <>
            <div className="qr-area-wrapper">
              <div className="scan-line"></div>
              <div id="qr-reader" className="qr-area"></div>
            </div>

            <div className="button-row">
              <label htmlFor="qr-upload" className="btn blue">
                📁 Upload QR Image
              </label>
              <input
                id="qr-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />

              <button className="btn red" onClick={stopScanner}>
                🛑 Stop Scanning
              </button>
            </div>
          </>
        )}

        {loading && <p className="loading">⏳ Scanning image...</p>}
        {errorMsg && <p className="error">{errorMsg}</p>}

        <div id="qr-reader-temp" style={{ display: "none" }}></div>
      </div>
    </div>
  );
}


