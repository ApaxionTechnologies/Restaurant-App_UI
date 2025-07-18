import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/GenerateQR.css";

export default function GenerateQR() {
  const restaurantName = localStorage.getItem("restaurantName") || "My Restaurant";
  const email = localStorage.getItem("restaurantEmail") || "email@example.com";

  const [tableNumber, setTableNumber] = useState("1");

  // ✅ Stable QR value
  const qrValue = JSON.stringify({
    restaurant: restaurantName,
    table: tableNumber,
  });

  const downloadQR = () => {
    const canvas = document.querySelector(".qr-preview canvas"); // ✅ Scoped selector
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `QR_Table_${tableNumber}.png`;
      link.click();
    }
  };

  return (
    <div className="generate-qr-wrapper">
      <div className="qr-card">
        <h2>
          <i className="bi bi-qr-code-scan"></i> Generate QR Code
        </h2>
        <p>
          Restaurant: <strong>{restaurantName}</strong>
        </p>

        {/* Table Selector */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Select Table Number</label>
          <select
            className="form-select"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
          >
            {[...Array(5)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Table {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Keep QR always mounted */}
        <div className="qr-preview">
          <QRCodeCanvas value={qrValue} size={220} includeMargin={true} />
        </div>

        <button onClick={downloadQR} className="btn btn-primary w-100">
          <i className="bi bi-download"></i> Download QR
        </button>
      </div>
    </div>
  );
}
