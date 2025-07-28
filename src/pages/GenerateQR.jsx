// import React, { useState, useEffect, useRef } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "../styles/GenerateQR.css";
// import axios from "axios";

// export default function GenerateQR() {
//   const restaurantEmail = localStorage.getItem("restaurantEmail"); // Get logged-in restaurant's email
//   const [restaurantName, setRestaurantName] = useState(localStorage.getItem("restaurantName") || "My Restaurant");
//   const [tables, setTables] = useState(0);  // To store number of tables
//   const [startTable, setStartTable] = useState("");
//   const [endTable, setEndTable] = useState("");
//   const [qrList, setQrList] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const qrRefs = useRef([]);

//   // Fetch restaurant data including the number of tables
//   useEffect(() => {
//     const fetchRestaurantData = async () => {
//       try {
//         const response = await axios.get(`/api/restaurants/${restaurantEmail}`);
//         setRestaurantName(response.data.restaurant.restaurantName);
//         setTables(response.data.restaurant.tables); // Set the number of registered tables
//       } catch (err) {
//         console.error("Failed to fetch restaurant data", err);
//       }
//     };

//     if (restaurantEmail) {
//       fetchRestaurantData(); // Fetch restaurant data when component mounts
//     }
//   }, [restaurantEmail]);

//   const generateQRCodes = () => {
//     const start = parseInt(startTable);
//     const end = parseInt(endTable);

//     // Validation: Ensure the start and end values are within the valid range
//     if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > tables || end > tables || start > end) {
//       alert(`Please enter a valid table range between 1 and ${tables}.`);
//       return;
//     }

//     const list = [];
//     for (let i = start; i <= end; i++) {
//       list.push({
//         table: i,
//         value: JSON.stringify({
//           brand: "Apaxion",   // Add "Apaxion" as the brand name
//           restaurant: restaurantName,  // Add the restaurant name
//           table: i,   // Add the table number
//         }),
//       });
//     }

//     setQrList(list);
//     setCurrentIndex(0);
//   };

//   const drawBrandNameOnCanvas = (canvas) => {
//     const ctx = canvas.getContext("2d");
//     const text = "Apaxion";  // Text to draw
//     const fontSize = 30;  // Font size for the brand text

//     // Set up the font and color
//     ctx.font = `bold ${fontSize}px Arial`;
//     ctx.fillStyle = "#000000";  // Text color
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle"; // Center the text both horizontally and vertically

//     // Calculate text position to center it on the canvas
//     const x = canvas.width / 2;
//     const y = canvas.height / 2;

//     // Draw the text on the canvas
//     ctx.fillText(text, x, y);
//   };

//   const downloadSingleQR = (index) => {
//     const canvas = qrRefs.current[index]?.querySelector("canvas");
//     if (canvas) {
//       drawBrandNameOnCanvas(canvas);  // Draw "Apaxion" on the canvas before downloading
//       const url = canvas.toDataURL("image/png");
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `QR_Table_${qrList[index].table}_Apaxion.png`;  // Updated download name
//       link.click();
//     }
//   };

//   const downloadAllQRCodes = async () => {
//     const zip = new JSZip();
//     for (let i = 0; i < qrList.length; i++) {
//       const canvas = qrRefs.current[i]?.querySelector("canvas");
//       if (canvas) {
//         drawBrandNameOnCanvas(canvas);  // Draw "Apaxion" on the canvas before downloading
//         const dataUrl = canvas.toDataURL("image/png");
//         const imgData = dataUrl.split(",")[1];
//         zip.file(`QR_Table_${qrList[i].table}_Apaxion.png`, imgData, { base64: true });
//       }
//     }

//     const blob = await zip.generateAsync({ type: "blob" });
//     saveAs(blob, `${restaurantName.replace(/\s+/g, "_")}_QRs_Apaxion.zip`);  // Updated zip name
//   };

//   return (
//     <div className="generate-qr-wrapper">
//       {/* Left Box - Input */}
//       <div className="qr-card">
//         <h2 className="mb-2">
//           <i className="bi bi-qr-code-scan"></i> Generate QR Code
//         </h2>
//         <p>
//           Restaurant: <strong>{restaurantName}</strong>
//         </p>
//         <p>Registered Tables: <strong>{tables}</strong></p> {/* Display Registered Tables */}

//         <div className="mb-3">
//           <label className="form-label fw-semibold">Enter Table Range</label>
//           <div className="d-flex gap-2">
//             <input
//               type="number"
//               className="form-control"
//               placeholder="Start"
//               value={startTable}
//               onChange={(e) => setStartTable(e.target.value)}
//               min="1"
//               max={tables}  // Limit input to the max number of tables
//             />
//             <input
//               type="number"
//               className="form-control"
//               placeholder="End"
//               value={endTable}
//               onChange={(e) => setEndTable(e.target.value)}
//               min="1"
//               max={tables}  // Limit input to the max number of tables
//             />
//           </div>
//           <button onClick={generateQRCodes} className="btn btn-primary mt-3 w-100">
//             Generate QR Codes
//           </button>
//         </div>

//         {/* Instruction Text Below Table Range */}
//         <div className="instruction-text">
//           <p>Input the starting and ending table numbers to generate individual QR codes for each table.</p>
//         </div>

//         {/* Add Image Below the Input Section */}
//         <div className="text-center mt-4">
//           <img
//             src="https://tse1.mm.bing.net/th/id/OIP.j3Q5KEdaACrCsdDg-xayvQHaDj?rs=1&pid=ImgDetMain&o=7&rm=3"
//             alt="QR Code Example"
//             className="qr-image"
//           />
//         </div>
//       </div>

//       {/* Right Box - QR Display */}
//       {qrList.length > 0 && (
//         <div className="qr-card d-flex flex-column">
//           {/* Download All QR Button Above QR */}
//           <div className="qr-download-buttons">
//             <button
//               onClick={downloadAllQRCodes}
//               className="btn btn-dark mt-3 w-100"
//             >
//               <i className="bi bi-archive"></i> Download All QR
//             </button>
//           </div>

//           {/* Download QR Button Below Download All */}
//           <div className="qr-download-buttons">
//             <button
//               onClick={() => downloadSingleQR(currentIndex)}
//               className="btn btn-primary mt-3 w-100"
//             >
//               <i className="bi bi-download"></i> Download QR
//             </button>
//           </div>

//           {/* Table Number Section Below Download QR */}
//           <div className="text-center fw-bold mb-3 fs-5">
//             Table {qrList[currentIndex].table}
//           </div>

//           {/* QR Preview Section */}
//           <div
//             className="qr-preview d-flex justify-content-center align-items-center"
//             ref={(el) => (qrRefs.current[currentIndex] = el)}
//             style={{ position: "relative" }}
//           >
//             <QRCodeCanvas
//               value={qrList[currentIndex].value}  // This now includes "Apaxion", restaurant name, and table number
//               size={220}  // Adjusted size for better visibility
//               includeMargin={true}
//               renderAs="svg"  // Use svg render mode
//               bgColor="#ffffff"
//               fgColor="#000000"
//             />
//           </div>

//           {/* Tagline */}
//           <div className="text-center mt-2">
//             <p>Powered by: Apaxion</p>
//           </div>

//           {/* Navigation Arrows (Left and Right for Previous and Next QR) */}
//           <div className="qr-nav-arrows d-flex justify-content-between mt-3">
//             <button
//               className="btn btn-outline-secondary"
//               disabled={currentIndex === 0}
//               onClick={() => setCurrentIndex(currentIndex - 1)}
//             >
//               ← Previous
//             </button>

//             <button
//               className="btn btn-outline-secondary"
//               disabled={currentIndex === qrList.length - 1}
//               onClick={() => setCurrentIndex(currentIndex + 1)}
//             >
//               Next →
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/GenerateQR.css";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

export default function GenerateQR() {
  const restaurantEmail = localStorage.getItem("restaurantEmail"); // Get logged-in restaurant's email
  const [restaurantName, setRestaurantName] = useState(localStorage.getItem("restaurantName") || "My Restaurant");
  const [tables, setTables] = useState(0);  // To store number of tables
  const [startTable, setStartTable] = useState("");
  const [endTable, setEndTable] = useState("");
  const [qrList, setQrList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const qrRefs = useRef([]);

  // Fetch restaurant data including the number of tables
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${restaurantEmail}`);
        setRestaurantName(response.data.restaurant.restaurantName);
        setTables(response.data.restaurant.tables); // Set the number of registered tables
      } catch (err) {
        console.error("Failed to fetch restaurant data", err);
      }
    };

    if (restaurantEmail) {
      fetchRestaurantData(); // Fetch restaurant data when component mounts
    }
  }, [restaurantEmail]);

  const generateQRCodes = () => {
    const start = parseInt(startTable);
    const end = parseInt(endTable);

    // Validation: Ensure the start and end values are within the valid range
    if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > tables || end > tables || start > end) {
      alert(`Please enter a valid table range between 1 and ${tables}.`);
      return;
    }

    const list = [];
    for (let i = start; i <= end; i++) {
      list.push({
        table: i,
        value: JSON.stringify({
          brand: "Apaxion",   // Add "Apaxion" as the brand name
          restaurant: restaurantName,  // Add the restaurant name
          table: i,   // Add the table number
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

      // Create a new image element and load the canvas content into it
      const img = new Image();
      img.src = url;

      img.onload = () => {
        const canvasWithTagline = document.createElement("canvas");
        const ctx = canvasWithTagline.getContext("2d");

        // Set canvas size to include the tagline space
        canvasWithTagline.width = canvas.width;
        canvasWithTagline.height = canvas.height + 50;  // Extra space for tagline

        // Draw the original QR code on the new canvas
        ctx.drawImage(img, 0, 0);

        // Add tagline "Powered by: Apaxion"
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "#007bff";  // Tagline color
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const tagline = "Powered by: Apaxion";
        const taglineY = canvas.height + 25;  // Position below the QR code
        ctx.fillText(tagline, canvas.width / 2, taglineY);  // Draw the tagline

        // Download the final image with tagline
        const finalUrl = canvasWithTagline.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = finalUrl;
        link.download = `QR_Table_${qrList[index].table}_Apaxion.png`;
        link.click();
      };
    }
  };

  const downloadAllQRCodes = async () => {
    const zip = new JSZip();
    for (let i = 0; i < qrList.length; i++) {
      const canvas = qrRefs.current[i]?.querySelector("canvas");
      if (canvas) {
        const url = canvas.toDataURL("image/png");

        // Create a new image element and load the canvas content into it
        const img = new Image();
        img.src = url;

        img.onload = () => {
          const canvasWithTagline = document.createElement("canvas");
          const ctx = canvasWithTagline.getContext("2d");

          // Set canvas size to include the tagline space
          canvasWithTagline.width = canvas.width;
          canvasWithTagline.height = canvas.height + 50;  // Extra space for tagline

          // Draw the original QR code on the new canvas
          ctx.drawImage(img, 0, 0);

          // Add tagline "Powered by: Apaxion"
          ctx.font = "bold 20px Arial";
          ctx.fillStyle = "#007bff";  // Tagline color
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const tagline = "Powered by: Apaxion";
          const taglineY = canvas.height + 25;  // Position below the QR code
          ctx.fillText(tagline, canvas.width / 2, taglineY);  // Draw the tagline

          // Add the image to the zip file
          const dataUrl = canvasWithTagline.toDataURL("image/png");
          const imgData = dataUrl.split(",")[1];
          zip.file(`QR_Table_${qrList[i].table}_Apaxion.png`, imgData, { base64: true });
        };
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${restaurantName.replace(/\s+/g, "_")}_QRs_Apaxion.zip`);  // Updated zip name
  };

  return (
    <AdminLayout> 
    <div className="generate-qr-wrapper">
      {/* Left Box - Input */}
      <div className="qr-card">
        <h2 className="mb-2">
          <i className="bi bi-qr-code-scan"></i> Generate QR Code
        </h2>
        <p>
          Restaurant: <strong>{restaurantName}</strong>
        </p>
        <p>Registered Tables: <strong>{tables}</strong></p> {/* Display Registered Tables */}

        <div className="mb-3">
          <label className="form-label fw-semibold">Enter Table Range</label>
          <div className="d-flex gap-2">
            <input
              type="number"
              className="form-control"
              placeholder="Start"
              value={startTable}
              onChange={(e) => setStartTable(e.target.value)}
              min="1"
              max={tables}  // Limit input to the max number of tables
            />
            <input
              type="number"
              className="form-control"
              placeholder="End"
              value={endTable}
              onChange={(e) => setEndTable(e.target.value)}
              min="1"
              max={tables}  // Limit input to the max number of tables
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

        {/* Add Image Below the Input Section */}
        <div className="text-center mt-4">
          <img
            src="https://tse1.mm.bing.net/th/id/OIP.j3Q5KEdaACrCsdDg-xayvQHaDj?rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="QR Code Example"
            className="qr-image"
          />
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
            style={{ position: "relative" }}
          >
            <QRCodeCanvas
              value={qrList[currentIndex].value}  // This now includes "Apaxion", restaurant name, and table number
              size={220}  // Adjusted size for better visibility
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          {/* Tagline */}
          <div className="text-center mt-2">
            <p>Powered by: Apaxion</p>
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
    </AdminLayout>
  );
}
