import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/GenerateQR.css";

export default function GenerateQR() {
  const restaurantName = localStorage.getItem("restaurantName") || "My Restaurant";
  const [totalTables, setTotalTables] = useState(1);
  const [qrList, setQrList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const qrRefs = useRef([]);

  const generateQRCodes = () => {
    const list = [];
    for (let i = 1; i <= totalTables; i++) {
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
        const imgData = dataUrl.split(",")[1]; // Get base64 string
        zip.file(`QR_Table_${qrList[i].table}.png`, imgData, { base64: true });
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${restaurantName.replace(/\s+/g, "_")}_QRs.zip`);
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

        <div className="mb-3">
          <label className="form-label fw-semibold">Enter Total Tables</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={totalTables}
            onChange={(e) => setTotalTables(Number(e.target.value))}
          />
          <button onClick={generateQRCodes} className="btn btn-success mt-2 w-100">
            Generate QR Codes
          </button>
        </div>

        {qrList.length > 0 && (
          <>
            <div className="text-center fw-bold mb-2">
              Table {qrList[currentIndex].table}
            </div>
            <div
              className="qr-preview"
              ref={(el) => (qrRefs.current[currentIndex] = el)}
            >
              <QRCodeCanvas
                value={qrList[currentIndex].value}
                size={220}
                includeMargin={true}
              />
            </div>

            <div className="d-flex justify-content-between my-2">
              <button
                className="btn btn-outline-secondary"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
              >
                <i className="bi bi-arrow-left"></i> Prev
              </button>
              <button
                className="btn btn-outline-secondary"
                disabled={currentIndex === qrList.length - 1}
                onClick={() => setCurrentIndex(currentIndex + 1)}
              >
                Next <i className="bi bi-arrow-right"></i>
              </button>
            </div>

            <button
              onClick={() => downloadSingleQR(currentIndex)}
              className="btn btn-primary w-100"
            >
              <i className="bi bi-download"></i> Download QR
            </button>

            {/* Render all hidden QR canvases for ZIP */}
            <div style={{ display: "none" }}>
              {qrList.map((qr, index) => (
                <div
                  key={index}
                  ref={(el) => (qrRefs.current[index] = el)}
                >
                  <QRCodeCanvas value={qr.value} size={220} includeMargin={true} />
                </div>
              ))}
            </div>

            <button
              onClick={downloadAllQRCodes}
              className="btn btn-dark w-100 mt-2"
            >
              <i className="bi bi-archive"></i> Download All QR
            </button>
          </>
        )}
      </div>
    </div>
  );
}
