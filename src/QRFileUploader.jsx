// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { Html5Qrcode } from "html5-qrcode";
// import "./styles/QRFileUploader.css";

// export default function QRFileUploader() {
//   const navigate = useNavigate();
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     AOS.init({ duration: 800 });
//   }, []);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;

//     if (!selectedFile.type.startsWith("image/")) {
//       setError("Please upload a valid image file.");
//       return;
//     }

//     setFile(selectedFile);
//     setPreview(URL.createObjectURL(selectedFile));
//     setError("");
//   };

//   // Robust file upload + decode handler
//   const handleFileUpload = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setError("Please select a QR code image.");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     let html5QrCode = null;

//     try {
//       html5QrCode = new Html5Qrcode("qr-file-reader");
//       const decodedText = await html5QrCode.scanFile(file, true);

//       console.log("Decoded QR Raw Text:", decodedText);

//       let qrData = null;

//       // 1) Try JSON format
//       try {
//         qrData = JSON.parse(decodedText);
//         console.log("Parsed JSON QR:", qrData);
//       } catch (jsonErr) {
//         // 2) Not JSON — try as URL (query params or path fallback)
//         try {
//           const url = new URL(decodedText);

//           // Prefer common query names
//           let restaurantId =
//             url.searchParams.get("restaurantId") ||
//             url.searchParams.get("restaurant") ||
//             url.searchParams.get("id");

//           let table =
//             url.searchParams.get("table") ||
//             url.searchParams.get("tableNumber") ||
//             url.searchParams.get("t");

//           // If restaurantId missing, extract from path like /menu/<id>
//           if (!restaurantId) {
//             const parts = url.pathname.split("/").filter(Boolean);
//             const menuIndex = parts.indexOf("menu");
//             if (menuIndex >= 0 && parts[menuIndex + 1]) {
//               restaurantId = parts[menuIndex + 1];
//             } else if (parts.length > 0) {
//               // fallback: last segment might be the id
//               restaurantId = parts[parts.length - 1];
//             }
//           }

//           qrData = { restaurantId, table };
//           console.log("Parsed URL QR (with path fallback):", qrData);
//         } catch (urlErr) {
//           console.error("Decoded text is neither JSON nor valid URL:", urlErr);
//           setError("Invalid QR code format.");
//           return;
//         }
//       }

//       // Normalize fields
//       const restaurantId =
//         qrData?.restaurantId || qrData?.restaurant || qrData?.id || null;
//       const table = qrData?.table || qrData?.tableNumber || qrData?.t || null;

//       if (!restaurantId || !table) {
//         setError("QR code missing restaurantId or table.");
//         return;
//       }

//       // Save to localStorage and navigate
//       localStorage.setItem("restaurantId", restaurantId);
//       localStorage.setItem("table", table);
//       localStorage.setItem("tableNumber", table);

//       navigate(`/menu?restaurantId=${restaurantId}&table=${table}`);
//     } catch (err) {
//       console.error("QR Scan Error:", err);
//       setError("Could not read QR from image.");
//     } finally {
//       setLoading(false);
//       if (html5QrCode) {
//         try {
//           await html5QrCode.clear();
//         } catch (clearErr) {
//           console.warn("Failed to clear Html5Qrcode instance:", clearErr);
//         }
//       }
//     }
//   };

//   return (
//     <div className="qr-upload-page" data-aos="fade-up">
//       <div className="upload-box">
//         <h1>📤 Upload Your Table QR Code</h1>
//         <p>Upload the QR code image to view the digital menu for your table.</p>

//         <form onSubmit={handleFileUpload} className="qr-upload-form">
//           {/* Accessible label + file input with id & name to satisfy browser autofill/a11y */}
//           <label htmlFor="qrFile" className="form-label visually-hidden">
//             Upload QR image
//           </label>
//           <input
//             id="qrFile"
//             name="qrFile"
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="file-input"
//           />

//           {preview && (
//             <div className="preview-container">
//               <img src={preview} alt="QR Preview" className="qr-preview" />
//               <button
//                 type="button"
//                 className="remove-preview"
//                 onClick={() => {
//                   setFile(null);
//                   setPreview("");
//                   setError("");
//                 }}
//               >
//                 ❌ Remove
//               </button>
//             </div>
//           )}

//           {error && <p className="error-text">{error}</p>}

//           <button type="submit" className="upload-btn" disabled={loading}>
//             {loading ? "Scanning..." : "Upload & View Menu"}
//           </button>
//         </form>

//         {/* hidden container used by Html5Qrcode */}
//         <div id="qr-file-reader" style={{ display: "none" }}></div>
//       </div>
//     </div>
//   );
// }