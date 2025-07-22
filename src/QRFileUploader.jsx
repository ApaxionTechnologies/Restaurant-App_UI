


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import axios from "axios";
// import "./styles/QRFileUploader.css"; // ✅ correct path if styles folder is in src


// const BASE_URL = "http://localhost:5002/api"; // ✅ Update if needed

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
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;

//     if (!selectedFile.type.startsWith("image/")) {
//       setError("Please upload a valid image file.");
//       return;
//     }

//     setFile(selectedFile);
//     setPreview(URL.createObjectURL(selectedFile));
//     setError("");
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       setError("Please select a QR code image file.");
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("file", file); // ✅ Key should match backend multer setup

//     try {
//       const res = await axios.post(`${BASE_URL}/upload-qr`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.status === 200) {
//         const data = res.data;
//         if (data.restaurant && data.table) {
//           localStorage.setItem("restaurantName", data.restaurant);
//           localStorage.setItem("tableNumber", data.table);

//           navigate(`/menu?restaurant=${encodeURIComponent(data.restaurant)}&table=${data.table}`);
//         } else {
//           setError("Invalid QR data. Expected restaurant and table info.");
//         }
//       } else {
//         setError("Failed to upload QR code.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Server error. Please try again later.");
//     } finally {
//       setLoading(false);
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
//               <button
//                 type="button"
//                 className="remove-preview"
//                 onClick={() => {
//                   setFile(null);
//                   setPreview("");
//                 }}
//               >
//                 ❌ Remove
//               </button>
//             </div>
//           )}

//           {error && <p className="error-text">{error}</p>}

//           <button type="submit" className="upload-btn" disabled={loading}>
//             {loading ? "Uploading..." : "Upload & View Menu"}
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
import { Html5Qrcode } from "html5-qrcode";
import "./styles/QRFileUploader.css";

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
    try {
      const decodedText = await Html5Qrcode.scanFile(file, true);
      console.log("Decoded QR:", decodedText);

      // ✅ Handle both JSON and URL QR data
      try {
        const qrData = JSON.parse(decodedText);
        if (qrData.restaurant && qrData.table) {
          localStorage.setItem("restaurantName", qrData.restaurant);
          localStorage.setItem("tableNumber", qrData.table);
          navigate(`/menu?restaurant=${encodeURIComponent(qrData.restaurant)}&table=${qrData.table}`);
        } else {
          setError("Invalid QR data. Missing restaurant or table info.");
        }
      } catch {
        if (decodedText.startsWith("http")) {
          window.location.href = decodedText;
        } else {
          setError("Invalid QR format.");
        }
      }
    } catch (err) {
      console.error("QR Scan Error:", err);
      setError("Could not read QR from image.");
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
            {loading ? "Scanning..." : "Upload & View Menu"}
          </button>
        </form>
      </div>
    </div>
  );
}
