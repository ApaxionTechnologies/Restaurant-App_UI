// // import React, { useState, useRef, useEffect } from 'react';
// // import QRCode from 'qrcode';
// // import AOS from 'aos';
// // import 'aos/dist/aos.css';
// // import './styles/QRFileUploader.css';
// // //import Header from './components/Header'; // ✅ correct if in same folder as src/components



// // export default function QRFileUploader() {
// //   const [file, setFile] = useState(null);
// //   const [fileURL, setFileURL] = useState('');
// //   const [tableNumber, setTableNumber] = useState(1);
// //   const [qrSrc, setQrSrc] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [showGenerateBtn, setShowGenerateBtn] = useState(false);

// //   const fileInputRef = useRef();
// //   const canvasRef = useRef();

// //   useEffect(() => {
// //     AOS.init({ duration: 800 });
// //   }, []);

// //   const handleFileChange = (e) => {
// //     const selectedFile = e.target.files[0];
// //     if (selectedFile) {
// //       const url = URL.createObjectURL(selectedFile);
// //       setFile(selectedFile);
// //       setFileURL(url);
// //       setQrSrc('');
// //       setShowGenerateBtn(true);
// //     }
// //   };

// //   const generateQR = () => {
// //     const qrData = `t${tableNumber}`;
// //     setLoading(true);
// //     QRCode.toDataURL(
// //       qrData,
// //       {
// //         errorCorrectionLevel: 'L',
// //         margin: 1,
// //         scale: 6,
// //         width: 180,
// //       },
// //       (err, url) => {
// //         if (err) return console.error(err);
// //         setQrSrc(url);
// //         setLoading(false);
// //         setShowGenerateBtn(false);
// //       }
// //     );
// //   };

// //   const handleRemove = () => {
// //     setFile(null);
// //     setFileURL('');
// //     setQrSrc('');
// //     setShowGenerateBtn(false);
// //     if (fileInputRef.current) {
// //       fileInputRef.current.value = '';
// //     }
// //   };

// //   const downloadQRCode = () => {
// //     const link = document.createElement('a');
// //     link.href = qrSrc;
// //     link.download = `Table-${tableNumber}-QR.png`;
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);
// //   };

// //  const handleTableChange = (e) => {
// //   const selectedTable = parseInt(e.target.value, 10);
// //   setTableNumber(selectedTable);

// //   if (file && !qrSrc) {
// //     setShowGenerateBtn(true);
// //   }

// //   // 🔄 Update table count on server
// //   const restaurantEmail = localStorage.getItem('restaurantEmail'); // or however you're storing email
// //   if (restaurantEmail) {
// //     fetch("http://localhost:5001/api/tables/update", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ email: restaurantEmail, tables: selectedTable }),
// //     })
// //       .then(res => res.json())
// //       .then(data => {
// //         if (data.tables) {
// //           console.log("✅ Table count updated to:", data.tables);
// //         } else {
// //           console.error("❌ Failed to update tables:", data);
// //         }
// //       })
// //       .catch(err => console.error("Server error while updating tables:", err));
// //   }
// // };


// //   return (
// //     <div className="qr-page-bg py-5">
// //       <div className="container">
// //         <div className="row justify-content-center">
// //           <div className="col-md-8 col-lg-6">
// //             <div className="card shadow-lg border-0" data-aos="fade-up">
// //               <div className="card-body">
// //                 <h4 className="card-title text-center mb-4">📥 Upload & Generate Table QR</h4>

// //                 <div className="mb-3">
// //                   <label className="form-label">Table Number</label>
// //                   <select
// //                     className="form-select"
// //                     value={tableNumber}
// //                     onChange={handleTableChange}
// //                   >
// //                     {[...Array(5).keys()].map((num) => (
// //                       <option key={num + 1} value={num + 1}>
// //                         Table {num + 1}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>

// //                 <div className="mb-3">
// //                   <label className="form-label">Select File</label>
// //                   <input
// //                     type="file"
// //                     className="form-control"
// //                     onChange={handleFileChange}
// //                     ref={fileInputRef}
// //                   />
// //                 </div>

// //                 {file && (
// //                   <div className="mt-4 p-3 bg-light rounded border">
// //                     <p>
// //                       <strong>📄 File:</strong> {file.name}
// //                     </p>
// //                     <p>
// //                       <strong>🍽️ Table:</strong> {tableNumber}
// //                     </p>
// //                     <a
// //                       href={fileURL}
// //                       download={file.name}
// //                       className="btn btn-outline-primary btn-sm mb-3"
// //                     >
// //                       ⬇️ Download File
// //                     </a>

// //                     {showGenerateBtn && (
// //                       <button className="btn btn-warning w-100 mb-3" onClick={generateQR}>
// //                         ⚙️ Generate QR Code
// //                       </button>
// //                     )}

// //                     {loading ? (
// //                       <div className="text-center my-3">
// //                         <div className="spinner-border text-primary" role="status" />
// //                       </div>
// //                     ) : (
// //                       qrSrc && (
// //                         <>
// //                           <div className="text-center my-3">
// //                             <img
// //                               src={qrSrc}
// //                               alt="QR Code"
// //                               ref={canvasRef}
// //                               className="img-fluid border border-2 rounded mb-2"
// //                               style={{ maxWidth: '200px', cursor: 'pointer' }}
// //                               data-bs-toggle="modal"
// //                               data-bs-target="#qrPreviewModal"
// //                             />
// //                           </div>

// //                           <button
// //                             className="btn btn-success w-100 mb-2"
// //                             onClick={downloadQRCode}
// //                           >
// //                             ⬇️ Download QR Code
// //                           </button>
// //                         </>
// //                       )
// //                     )}

// //                     <button className="btn btn-outline-danger w-100" onClick={handleRemove}>
// //                       ❌ Remove
// //                     </button>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Modal Preview */}
// //       <div className="modal fade" id="qrPreviewModal" tabIndex="-1" aria-hidden="true">
// //         <div className="modal-dialog modal-dialog-centered">
// //           <div className="modal-content border-0">
// //             <div className="modal-header">
// //               <h5 className="modal-title">QR Code Preview</h5>
// //               <button type="button" className="btn-close" data-bs-dismiss="modal" />
// //             </div>
// //             <div className="modal-body text-center">
// //               <img
// //                 src={qrSrc}
// //                 alt="QR Code Full"
// //                 className="img-fluid border border-3 rounded"
// //                 style={{ maxWidth: '300px' }}
// //               />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // src/pages/QRFileUploader.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import axios from "axios";
// import "./styles/QRFileUploader.css";


// const BASE_URL = "http://localhost:5002/api";

// export default function QRFileUploader() {
//   const navigate = useNavigate();
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     AOS.init({ duration: 800 });
//   }, []);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//     setError("");
//     if (selectedFile) {
//       setPreview(URL.createObjectURL(selectedFile));
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setError("Please select a QR code image file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file); // ✅ Match backend key

//     try {
//       const res = await axios.post(`${BASE_URL}/upload-qr`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const data = res.data;

//       if (res.status === 200) {
//         // ✅ Assuming backend returns { restaurant, table }
//         if (data.restaurant && data.table) {
//           localStorage.setItem("restaurantName", data.restaurant);
//           localStorage.setItem("tableNumber", data.table);

//           navigate(
//             `/menu?restaurant=${encodeURIComponent(data.restaurant)}&table=${data.table}`
//           );
//         } else {
//           alert("Invalid QR data. Expected restaurant and table info.");
//         }
//       } else {
//         setError(data.error || "Failed to upload QR code.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Server error. Please try again later.");
//     }
//   };

//   return (
//     <div className="qr-upload-page" data-aos="fade-up">
//       <div className="upload-box">
//         <h1>📤 Upload Your Table QR Code</h1>
//         <p>Upload the QR code image to view the digital menu for your table.</p>

//         <form onSubmit={handleUpload} className="qr-upload-form">
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             className="file-input"
//           />

//           {preview && (
//             <div className="preview-container">
//               <img src={preview} alt="QR Preview" className="qr-preview" />
//             </div>
//           )}

//           {error && <p className="error-text">{error}</p>}

//           <button type="submit" className="upload-btn">
//             Upload & View Menu
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import "./styles/QRFileUploader.css"; // ✅ correct path if styles folder is in src


const BASE_URL = "http://localhost:5002/api"; // ✅ Update if needed

export default function QRFileUploader() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a QR code image file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file); // ✅ Key should match backend multer setup

    try {
      const res = await axios.post(`${BASE_URL}/upload-qr`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        const data = res.data;
        if (data.restaurant && data.table) {
          localStorage.setItem("restaurantName", data.restaurant);
          localStorage.setItem("tableNumber", data.table);

          navigate(`/menu?restaurant=${encodeURIComponent(data.restaurant)}&table=${data.table}`);
        } else {
          setError("Invalid QR data. Expected restaurant and table info.");
        }
      } else {
        setError("Failed to upload QR code.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qr-upload-page" data-aos="fade-up">
      <div className="upload-box">
        <h1>📤 Upload Your Table QR Code</h1>
        <p>Upload the QR code image to view the digital menu for your table.</p>

        <form onSubmit={handleUpload} className="qr-upload-form">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />

          {preview && (
            <div className="preview-container">
              <img src={preview} alt="QR Preview" className="qr-preview" />
              <button
                type="button"
                className="remove-preview"
                onClick={() => {
                  setFile(null);
                  setPreview("");
                }}
              >
                ❌ Remove
              </button>
            </div>
          )}

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? "Uploading..." : "Upload & View Menu"}
          </button>
        </form>
      </div>
    </div>
  );
}
