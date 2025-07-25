import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/GenerateQR.css";

export default function GenerateQR() {
  const restaurantName = localStorage.getItem("restaurantName") || "My Restaurant";
  const [startTable, setStartTable] = useState("");
  const [endTable, setEndTable] = useState("");
  const [qrList, setQrList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const qrRefs = useRef([]);

  const generateQRCodes = () => {
    const start = parseInt(startTable);
    const end = parseInt(endTable);

    if (isNaN(start) || isNaN(end) || start > end || start < 1) {
      alert("Please enter a valid table range.");
      return;
    }

    const list = [];
    for (let i = start; i <= end; i++) {
      list.push({
        table: i,
        value: JSON.stringify({
          restaurant: restaurantName,
          table: i,
        }),
      });
    }

    setQrList(list);
    setCurrentIndex(0);
  };

  const downloadSingleQR = (index) => {
    const canvas = qrRefs.current[index]?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `QR_Table_${qrList[index].table}.png`;
      link.click();
    }
  };

  const downloadAllQRCodes = async () => {
    const zip = new JSZip();
    for (let i = 0; i < qrList.length; i++) {
      const canvas = qrRefs.current[i]?.querySelector("canvas");
      if (canvas) {
        const dataUrl = canvas.toDataURL("image/png");
        const imgData = dataUrl.split(",")[1];
        zip.file(`QR_Table_${qrList[i].table}.png`, imgData, { base64: true });
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${restaurantName.replace(/\s+/g, "_")}_QRs.zip`);
  };

  return (
    <div className="generate-qr-wrapper">
      {/* Left Box - Input */}
      <div className="qr-card">
        <h2 className="mb-2">
          <i className="bi bi-qr-code-scan"></i> Generate QR Code
        </h2>
        <p>
          Restaurant: <strong>{restaurantName}</strong>
        </p>

        <div className="mb-3">
          <label className="form-label fw-semibold">Enter Table Range</label>
          <div className="d-flex gap-2">
            <input
              type="number"
              className="form-control"
              placeholder="Start"
              value={startTable}
              onChange={(e) => setStartTable(e.target.value)}
            
            />
            <input
              type="number"
              className="form-control"
              placeholder="End"
              value={endTable}
              onChange={(e) => setEndTable(e.target.value)}
            />
          </div>
          <button onClick={generateQRCodes} className="btn btn-primary mt-3 w-100">
            Generate QR Codes
          </button>
        </div>

        {/* Instruction Text Below Table Range */}
        <div className="instruction-text">
          <p>Input the starting and ending table numbers to generate individual QR codes for each table.</p>
        </div>
      </div>

      {/* Right Box - QR Display */}
      {qrList.length > 0 && (
        <div className="qr-card d-flex flex-column">
          {/* Download All QR Button Above QR */}
          <div className="qr-download-buttons">
            <button
              onClick={downloadAllQRCodes}
              className="btn btn-dark mt-3 w-100"
            >
              <i className="bi bi-archive"></i> Download All QR
            </button>
          </div>

          {/* Download QR Button Below Download All */}
          <div className="qr-download-buttons">
            <button
              onClick={() => downloadSingleQR(currentIndex)}
              className="btn btn-primary mt-3 w-100"
            >
              <i className="bi bi-download"></i> Download QR
            </button>
          </div>

          {/* Table Number Section Below Download QR */}
          <div className="text-center fw-bold mb-3 fs-5">
            Table {qrList[currentIndex].table}
          </div>

          {/* QR Preview Section */}
          <div
            className="qr-preview d-flex justify-content-center align-items-center"
            ref={(el) => (qrRefs.current[currentIndex] = el)}
          >
            <QRCodeCanvas
              value={qrList[currentIndex].value}
              size={220}  // Adjusted size for better visibility
              includeMargin={true}
            />
          </div>

          {/* Navigation Arrows (Left and Right for Previous and Next QR) */}
          <div className="qr-nav-arrows d-flex justify-content-between mt-3">
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
        </div>
      )}
    </div>
  );
}
