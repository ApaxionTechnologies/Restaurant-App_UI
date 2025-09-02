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
  const [cameraActive, setCameraActive] = useState(false);

  const parseQrText = (qrText) => {
    if (!qrText) return null;
    const text = String(qrText).trim();
    console.log("parseQrText raw:", text);

   
    try {
      const parsed = JSON.parse(text);
      const restaurantId = parsed.restaurantId || parsed.restaurant || parsed.id || null;
      const table = parsed.table || parsed.tableNumber || parsed.t || null;
      if (restaurantId || table) {
        console.log("parseQrText: JSON result", { restaurantId, table });
        return { restaurantId, table };
      }
    } catch (e) {
      
    }

    try {
    
      const maybeUrl = decodeURIComponent(text);
      const url = new URL(maybeUrl.includes("://") ? maybeUrl : text);
      const restaurantId =
        url.searchParams.get("restaurantId") ||
        url.searchParams.get("restaurant") ||
        url.searchParams.get("id") ||
        null;
      const table =
        url.searchParams.get("table") ||
        url.searchParams.get("tableNumber") ||
        url.searchParams.get("t") ||
        null;

      let finalRestaurantId = restaurantId;
      if (!finalRestaurantId) {
        const parts = url.pathname.split("/").filter(Boolean);
        const menuIndex = parts.indexOf("menu");
        if (menuIndex >= 0 && parts[menuIndex + 1]) {
          finalRestaurantId = parts[menuIndex + 1];
        } else if (parts.length > 0) {
          finalRestaurantId = parts[parts.length - 1];
        }
      }

      if (finalRestaurantId || table) {
        console.log("parseQrText: URL result", { restaurantId: finalRestaurantId, table });
        return { restaurantId: finalRestaurantId, table };
      }
    } catch (e) {
     
    }
    const oidMatch = text.match(/[a-fA-F0-9]{24}/);
    const tableMatch = text.match(/(?:\?|&|=|\/)table(?:Number)?(?:=|\/)?(\d{1,4})/i);
    if (oidMatch || tableMatch) {
      console.log("parseQrText: regex result", { restaurantId: oidMatch?.[0] ?? null, table: tableMatch?.[1] ?? null });
      return { restaurantId: oidMatch?.[0] ?? null, table: tableMatch?.[1] ?? null };
    }
    const lastNum = text.match(/(\d{1,4})(?!.*\d)/);
    if (lastNum) {
      console.log("parseQrText: fallback last numeric", lastNum[1]);
      return { restaurantId: null, table: lastNum[1] };
    }

    return null;
  };
const redirectToMenu = (qrText) => {
  setErrorMsg("");
  const parsed = parseQrText(qrText);

  if (!parsed) {
    setErrorMsg("Could not parse QR content. Check console for the raw decoded text.");
    return;
  }

  const extractedId = parsed.restaurantId || localStorage.getItem("restaurantId");
  const table = parsed.table || parsed.tableNumber || "";

  if (!extractedId) {
    localStorage.setItem("tableNumber", table);
    if (table) {
      navigate(`/menu?table=${table}`);
      return;
    }
    setErrorMsg("restaurantId missing in QR and not available in localStorage.");
    return;
  }
  const rid = typeof extractedId === "object" ? (extractedId._id || extractedId.id || "") : extractedId;
  if (!rid) {
    setErrorMsg("restaurantId parsed but invalid.");
    return;
  }

  localStorage.setItem("restaurantId", rid);
  localStorage.setItem("tableNumber", table);
  console.log("Redirecting to menu with:", { restaurantId: rid, table });  if (table) {
    navigate(
      `/menu?restaurantId=${encodeURIComponent(rid)}&table=${encodeURIComponent(table)}`
    );
  } else {
    navigate(`/menu?restaurantId=${encodeURIComponent(rid)}`);
  }
};

  const handleScan = (result) => {
    if (!result) return;
    const qrText = result?.text || result;
    setScanResult(qrText);
    redirectToMenu(qrText);
  };

  const handleError = (error) => {
    console.error("QR Scan Error:", error);
    setErrorMsg("Unable to access camera or scan QR. Check console for details.");
  };

  const handleImageUpload = (event) => {
    setErrorMsg("");
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const maxDim = 1024;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);

        try {
          const imageData = ctx.getImageData(0, 0, w, h);
          const code = jsQR(imageData.data, w, h);
          if (code && code.data) {
            setScanResult(code.data);
            redirectToMenu(code.data);
          } else {
            setErrorMsg("❌ No QR detected in the uploaded image.");
            console.warn("jsQR found nothing. Raw image data available for debug.");
            console.log("Uploaded image scaled to:", { w, h }, "first pixels:", imageData.data.slice(0, 20));
          }
        } catch (err) {
          console.error("Error while processing uploaded image:", err);
          setErrorMsg("Failed to process image. See console for details.");
        }
      };
      img.onerror = (e) => {
        console.error("Image load error:", e);
        setErrorMsg("Failed to load the image file.");
      };
    };
    reader.onerror = (e) => {
      console.error("FileReader error:", e);
      setErrorMsg("Failed to read the file.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="home-container">
        <div className="home-card">
          <h1 className="mb-3">📷 QR Scanner</h1>
          <p className="mb-4">Scan with camera or upload a QR image.</p>

          {!cameraActive ? (
            <button className="header-btn" onClick={() => { setErrorMsg(""); setCameraActive(true); }}>
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
                style={{ width: "100%" }}
              />
              <button
                className="header-btn"
                style={{ marginTop: "10px" }}
                onClick={() => {
                  setCameraActive(false);
                  setScanResult(null);
                }}
              >
                ⏹ Stop Camera
              </button>
            </div>
          )}
          <div style={{ marginTop: "20px" }}>
            <label htmlFor="qrUploadInput" style={{ display: "block", marginBottom: 8 }}>
               Upload QR image
            </label>
            <input
              id="qrUploadInput"
              name="qrUploadInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ marginTop: "4px" }}
            />
          </div>

          {scanResult && (
            <p style={{ marginTop: "15px", color: "green" }}>
               Scanned QR: {scanResult}
            </p>
          )}
          {errorMsg && (
            <p style={{ marginTop: "15px", color: "red" }}>{errorMsg}</p>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <button className="header-btn" onClick={() => navigate("/")}>
            ⬅️ Back to Home
          </button>
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </>
  );
}
