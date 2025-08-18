// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Footer from "./Footer";

// export default function ScannerPage() {
//   const navigate = useNavigate();

//   return (
//     <>
//       <div className="home-container">
//         {/* Scanner Section */}
//         <div className="home-card">
//           <h1 className="mb-3">📷 QR Scanner</h1>
//           <p className="mb-4">Scan your table QR to begin ordering.</p>
//           <div className="action-buttons">
//             {/* Later you can integrate actual QR scanner library here */}
//             <button
//               className="btn btn-primary scan-btn"
//               onClick={() => navigate("/scanner")}
//             >
//               🚀 Start Scanning
//             </button>
//           </div>
//         </div>

//         {/* Back Button */}
//         <div style={{ marginTop: "20px" }}>
//           <button className="header-btn" onClick={() => navigate("/")}>
//             ⬅️ Back to Home
//           </button>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="footer">
//         <Footer />
//       </div>
//     </>
//   );
// }




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import jsQR from "jsqr";
import Footer from "../components/Footer";
import "../styles/Home.css";


export default function ScannerPage() {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [cameraActive, setCameraActive] = useState(false); // ✅ controls camera

  // ✅ When QR is scanned by camera
  const handleScan = (result) => {
    if (result) {
      const qrText = result?.text || result;
      setScanResult(qrText);
      redirectToMenu(qrText);
    }
  };

  // ✅ For errors
  const handleError = (error) => {
    console.error("QR Scan Error:", error);
    setErrorMsg("Unable to access camera or scan QR");
  };

  // ✅ Handle QR Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, img.width, img.height);

        if (code) {
          setScanResult(code.data);
          redirectToMenu(code.data);
        } else {
          setErrorMsg("❌ No QR code detected in the image.");
        }
      };
    };
    reader.readAsDataURL(file);
  };

  // ✅ Navigate to Menu with table info
  const redirectToMenu = (qrText) => {
    try {
      let tableId = qrText;
      if (qrText.includes("table")) {
        tableId = qrText.split("-")[1];
      }
      navigate(`/menu?table=${tableId}`);
    } catch (err) {
      console.error("Redirect Error:", err);
      navigate("/menu");
    }
  };

  return (
    <>
      <div className="home-container">
        <div className="home-card">
          <h1 className="mb-3">📷 QR Scanner</h1>
          <p className="mb-4">Scan with camera or upload a QR image.</p>

          {/* ✅ Camera Permission Button */}
          {!cameraActive ? (
            <button
              className="header-btn"
              onClick={() => setCameraActive(true)}
            >
              🎥 Allow Camera & Start Scanning
            </button>
          ) : (
            <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
              <QrReader
                onResult={(result, error) => {
                  if (!!result) handleScan(result);
                  if (!!error) handleError(error);
                }}
                constraints={{ facingMode: "environment" }}
                style={{ width: "90%" }}
              />
              <button
                className="header-btn"
                style={{ marginTop: "10px" }}
                onClick={() => setCameraActive(false)}
              >
                ⏹ Stop Camera
              </button>
            </div>
          )}

          {/* OR Upload Image */}
          <div style={{ marginTop: "20px" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ marginTop: "10px" }}
            />
          </div>

          {/* Show scanned result */}
          {scanResult && (
            <p style={{ marginTop: "15px", color: "green" }}>
              ✅ Scanned QR: {scanResult}
            </p>
          )}
          {errorMsg && (
            <p style={{ marginTop: "15px", color: "red" }}>{errorMsg}</p>
          )}
        </div>

        {/* Back Button */}
        <div style={{ marginTop: "20px" }}>
          <button className="header-btn" onClick={() => navigate("/")}>
            ⬅️ Back to Home
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <Footer />
      </div>
    </>
  );
}




