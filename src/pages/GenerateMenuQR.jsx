// import React, { useState, useEffect, useRef } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import html2canvas from "html2canvas";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "../styles/GenerateQR.css";
// import Footer from "../components/Footer.jsx";
// import HomeHeader from "../components/HomeHeader.jsx";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { getMyRestaurant ,fetchMe } from "../services/apiService.js";

// export default function GenerateMenuQR() {
//   const navigate = useNavigate();
//   const [restaurantName, setRestaurantName] = useState("My Restaurant");
//   const [adminEmail, setAdminEmail] = useState("");
//   const [restaurantData, setRestaurantData] = useState(null);
//   const [qrValue, setQrValue] = useState("");
//   const previewRef = useRef(null);
//  const [restaurant, setRestaurant] = useState(null);
  
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const token = localStorage.getItem("token");
//                     const res = await getMyRestaurant(token);
//         setRestaurant(res.restaurant);
//       } catch (err) {
//         console.error("Fetch /me failed -", err);
//       }
//     };
//     fetchMe();
//   }, []);
  
// useEffect(() => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     navigate("/");
//     return;
//   }

//   const fetchRestaurantData = async () => {
//     try {
//     const data = await fetchMe(token);
//         const restaurantInfo = data.restaurant;
//         setRestaurantName(restaurantInfo.restaurantName);
//         setAdminEmail(restaurantInfo.email);
//         setRestaurantData(restaurantInfo);

//     } catch (err) {
//       console.error("Failed to fetch restaurant data:", err);
//       toast.error("Session expired, please login again.");
//       localStorage.removeItem("token");
//       localStorage.removeItem("adminEmail");
//       navigate("/");
//     }
//   };

//   fetchRestaurantData();
// }, [navigate]);

// const handleGenerateQR = () => {
//   if (!restaurantData?._id) return;
//   setQrValue(`http://localhost:3000/menu?restaurantId=${restaurantData._id}`);
// };



//   const downloadMenuQR = async () => {
//     if (!previewRef.current) return;
    
//   await new Promise(resolve => setTimeout(resolve, 300));
//     const canvas = await html2canvas(previewRef.current, {
//       useCORS: true,
//       scale: 4,
//     });

//     const dataUrl = canvas.toDataURL("image/png");
//     const link = document.createElement("a");
//     link.href = dataUrl;
//     link.download = `${(restaurantName || "Restaurant").replace(/\s+/g, "_")}_Menu_QR.png`;
//     link.click();
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("adminEmail");
//     navigate("/");
//   };

//   return (
//     <>
//       <HomeHeader
//         isAdminDashboard={true}
//         restaurantName={restaurantName}
//         adminEmail={adminEmail}
//         onLogout={handleLogout}
//         restaurant={restaurant}
//       />

//       <div className="generate-qr-wrapper">
      
// <div className="qr-card">
//   <h2 className="mb-2 mt-3">
//     <i className="bi bi-qr-code-scan"></i> Generate Menu QR
//   </h2>
//   <p>
//     Restaurant: <strong>{restaurantName}</strong>
//   </p>

//   <button
//     onClick={handleGenerateQR}
//     className="btn btn-success mt-2 w-100"
//   >
//     <i className="bi bi-qr-code"></i> Generate Menu QR
//   </button>

//   <div className="instruction-text mt-3">
//     <p>
//       Click below to generate your <b>Menu QR Code</b>.  
//       This QR will directly open your restaurant’s menu page.
//     </p>
//   </div>
//   <div
//     style={{
//       width: "100%",
//       height: "450px", 
//       borderRadius: "10px",
//       overflow: "hidden",
//       marginTop: "15px",
//     }}
//   >
//     <img
//       src="https://tse1.mm.bing.net/th/id/OIP.j3Q5KEdaACrCsdDg-xayvQHaDj?rs=1&pid=ImgDetMain&o=7&rm=3"
//       alt="QR Code Example"
//       style={{
//         width: "100%",
//         height: "100%",
//         objectFit: "cover",
//       }}
//     />
//   </div>
// </div>
//         <div className="qr-card d-flex flex-column">
//           <button
//             onClick={downloadMenuQR}
//             className="btn btn-primary mt-4 w-100"
//             disabled={!qrValue}
//           >
//             <i className="bi bi-download"></i> Download Menu QR
//           </button>

//           <div
//             className="qr-preview-card mt-5"
//             ref={previewRef}
//             style={
//               !qrValue
//                 ? {
//                     background: "transparent",
//           boxShadow: "none",
//           textAlign: "center",
//           color: "#888",
//           padding: "40px 20px",
//           border: "2px dashed #ccc",
//           height: "500px",
//                   }
//                 : {  background: "var(--card-bg)",
//           boxShadow: "var(--shadow-1)",
//           padding: "20px",
//           minHeight: "550px", }
//             }
//           >
//             {qrValue ? (
//               <>
//                 <div className="qr-bg">
//                   <div className="qr-overlay">
//                     <QRCodeCanvas
//                       value={qrValue}
//                       size={200}
//                       includeMargin={true}
//                       bgColor="#ffffff"
//                       fgColor="#000000"
//                     />
//                   </div>
//                   <div className="view-menu-btn">View Our Menu</div>
//                 </div>

//                 <div className="qr-header-inline" aria-hidden="true">
//                   <div className="qr-restaurant-name mt-1">{restaurantName}</div>
//                 </div>

//                 <div className="qr-text-section mt-2">
//                   <h3>SCAN & VIEW MENU</h3>
//                   <p>
//                     Scan the QR code with your smartphone camera to open our
//                     digital menu instantly.
//                   </p>
//                   <h4 className="brand">Powered by Apaxion</h4>
//                 </div>
//               </>
//             ) : (
//               <div className="qr-placeholder text-center p-4">
//                 <p className="text-muted">
//                   Click <strong>Generate Menu QR</strong> to preview your QR code.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }



// import React, { useState, useEffect, useRef } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import html2canvas from "html2canvas";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "../styles/GenerateQR.css";
// import Footer from "../components/Footer.jsx";
// import HomeHeader from "../components/HomeHeader.jsx";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { getMyRestaurant, fetchMe } from "../services/apiService.js";

// export default function GenerateMenuQR() {
//   const navigate = useNavigate();
//   const [restaurantName, setRestaurantName] = useState("My Restaurant");
//   const [adminEmail, setAdminEmail] = useState("");
//   const [restaurantData, setRestaurantData] = useState(null);
//   const [qrValue, setQrValue] = useState("");
//   const previewRef = useRef(null);
//   const [restaurant, setRestaurant] = useState(null);
  
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await getMyRestaurant(token);
//         setRestaurant(res.restaurant);
//       } catch (err) {
//         console.error("Fetch /me failed -", err);
//       }
//     };
//     fetchMe();
//   }, []);
  
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/");
//       return;
//     }

//     const fetchRestaurantData = async () => {
//       try {
//         const data = await fetchMe(token);
//         const restaurantInfo = data.restaurant;
//         setRestaurantName(restaurantInfo.restaurantName);
//         setAdminEmail(restaurantInfo.email);
//         setRestaurantData(restaurantInfo);
        
//         // Automatically generate QR code when data is available
//         if (restaurantInfo._id) {
//           setQrValue(`http://localhost:3000/menu?restaurantId=${restaurantInfo._id}`);
//         }
//       } catch (err) {
//         console.error("Failed to fetch restaurant data:", err);
//         toast.error("Session expired, please login again.");
//         localStorage.removeItem("token");
//         localStorage.removeItem("adminEmail");
//         navigate("/");
//       }
//     };

//     fetchRestaurantData();
//   }, [navigate]);

//   const downloadMenuQR = async () => {
//     if (!previewRef.current) return;
    
//     await new Promise(resolve => setTimeout(resolve, 300));
//     const canvas = await html2canvas(previewRef.current, {
//       useCORS: true,
//       scale: 4,
//     });

//     const dataUrl = canvas.toDataURL("image/png");
//     const link = document.createElement("a");
//     link.href = dataUrl;
//     link.download = `${(restaurantName || "Restaurant").replace(/\s+/g, "_")}_Menu_QR.png`;
//     link.click();
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("adminEmail");
//     navigate("/");
//   };

//   return (
//     <>
//       <HomeHeader
//         isAdminDashboard={true}
//         restaurantName={restaurantName}
//         adminEmail={adminEmail}
//         onLogout={handleLogout}
//         restaurant={restaurant}
//       />

//       <div className="generate-qr-wrapper">
//         <div className="qr-card">
//           <h2 className="mb-2 mt-3">
//             <i className="bi bi-qr-code-scan"></i> Menu QR Code
//           </h2>
//           <p>
//             Restaurant: <strong>{restaurantName}</strong>
//           </p>

//           <div className="instruction-text mt-3">
//             <p>
//               Your <b>Menu QR Code</b> is automatically generated below.  
//               This QR will directly open your restaurant's menu page.
//             </p>
//           </div>
//         </div>
        
//         <div className="qr-card d-flex flex-column">
//           <button
//             onClick={downloadMenuQR}
//             className="btn btn-primary w-100"
//             disabled={!qrValue}
//           >
//             <i className="bi bi-download"></i> Download Menu QR
//           </button>

//           <div
//             className="qr-preview-card mt-4"
//             ref={previewRef}
//             style={{
//               background: "var(--card-bg)",
//               boxShadow: "var(--shadow-1)",
//               padding: "20px",
//               minHeight: "550px",
//             }}
//           >
//             {qrValue ? (
//               <>
//                 <div className="qr-bg">
//                   <div className="qr-overlay">
//                     <QRCodeCanvas
//                       value={qrValue}
//                       size={200}
//                       includeMargin={true}
//                       bgColor="#ffffff"
//                       fgColor="#000000"
//                     />
//                   </div>
//                   <div className="view-menu-btn">View Our Menu</div>
//                 </div>

//                 <div className="qr-header-inline" aria-hidden="true">
//                   <div className="qr-restaurant-name mt-1">{restaurantName}</div>
//                 </div>

//                 <div className="qr-text-section mt-2">
//                   <h3>SCAN & VIEW MENU</h3>
//                   <p>
//                     Scan the QR code with your smartphone camera to open our
//                     digital menu instantly.
//                   </p>
//                   <h4 className="brand">Powered by Apaxion</h4>
//                 </div>
//               </>
//             ) : (
//               <div className="d-flex justify-content-center align-items-center h-100">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }


// import React, { useState, useEffect, useRef } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import html2canvas from "html2canvas";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "../styles/GenerateMenuQR.css";
// import Footer from "../components/Footer.jsx";
// import HomeHeader from "../components/HomeHeader.jsx";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { getMyRestaurant, fetchMe } from "../services/apiService.js";

// export default function GenerateMenuQR() {
//   const navigate = useNavigate();
//   const [restaurantName, setRestaurantName] = useState("My Restaurant");
//   const [adminEmail, setAdminEmail] = useState("");
//   const [restaurantData, setRestaurantData] = useState(null);
//   const [qrValue, setQrValue] = useState("");
//   const previewRef = useRef(null);
//   const [restaurant, setRestaurant] = useState(null);
  
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await getMyRestaurant(token);
//         setRestaurant(res.restaurant);
//       } catch (err) {
//         console.error("Fetch /me failed -", err);
//       }
//     };
//     fetchMe();
//   }, []);
  
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/");
//       return;
//     }

//     const fetchRestaurantData = async () => {
//       try {
//         const data = await fetchMe(token);
//         const restaurantInfo = data.restaurant;
//         setRestaurantName(restaurantInfo.restaurantName);
//         setAdminEmail(restaurantInfo.email);
//         setRestaurantData(restaurantInfo);
        
//         // Automatically generate QR code when data is available
//         if (restaurantInfo._id) {
//           setQrValue(`http://localhost:3000/menu?restaurantId=${restaurantInfo._id}`);
//         }
//       } catch (err) {
//         console.error("Failed to fetch restaurant data:", err);
//         toast.error("Session expired, please login again.");
//         localStorage.removeItem("token");
//         localStorage.removeItem("adminEmail");
//         navigate("/");
//       }
//     };

//     fetchRestaurantData();
//   }, [navigate]);

//   const downloadMenuQR = async () => {
//     if (!previewRef.current) return;
    
//     await new Promise(resolve => setTimeout(resolve, 300));
//     const canvas = await html2canvas(previewRef.current, {
//       useCORS: true,
//       scale: 4,
//     });

//     const dataUrl = canvas.toDataURL("image/png");
//     const link = document.createElement("a");
//     link.href = dataUrl;
//     link.download = `${(restaurantName || "Restaurant").replace(/\s+/g, "_")}_Menu_QR.png`;
//     link.click();
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("adminEmail");
//     navigate("/");
//   };

//   return (
//     <>
//       <HomeHeader
//         isAdminDashboard={true}
//         restaurantName={restaurantName}
//         adminEmail={adminEmail}
//         onLogout={handleLogout}
//         restaurant={restaurant}
//       />

//       <div className="generate-qr-wrapper">
//         {/* Left side - QR Code Preview */}
//         <div className="qr-card d-flex flex-column">
//         <h2 className="mb-2 mt-3">
//             <i className="bi bi-qr-code-scan"></i> Menu QR Code
//           </h2>
//           <p>
//             Restaurant: <strong>{restaurantName}</strong>
//           </p>
//            <button
//             onClick={downloadMenuQR}
//             className="btn btn-primary w-100 mt-4"
//             disabled={!qrValue}
//           >
//             <i className="bi bi-download"></i> Download Menu QR
//           </button>
//           <div
//             className="qr-preview-card mt-4"
//             ref={previewRef}
//             style={{
//               background: "var(--card-bg)",
//               boxShadow: "var(--shadow-1)",
//               padding: "20px",
//               minHeight: "550px",
//             }}
//           >
//             {qrValue ? (
//               <>
//                 <div className="qr-bg">
//                   <div className="qr-overlay">
//                     <QRCodeCanvas
//                       value={qrValue}
//                       size={200}
//                       includeMargin={true}
//                       bgColor="#ffffff"
//                       fgColor="#000000"
//                     />
//                   </div>
//                   <div className="view-menu-btn">View Our Menu</div>
//                 </div>

//                 <div className="qr-header-inline" aria-hidden="true">
//                   <div className="qr-restaurant-name mt-1">{restaurantName}</div>
//                 </div>

//                 <div className="qr-text-section mt-2">
//                   <h3>SCAN & VIEW MENU</h3>
//                   <p>
//                     Scan the QR code with your smartphone camera to open our
//                     digital menu instantly.
//                   </p>
//                   <h4 className="brand">Powered by Apaxion</h4>
//                 </div>
//               </>
//             ) : (
//               <div className="d-flex justify-content-center align-items-center h-100">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Right side - Info and Download Button */}
     
//       </div>

//       <Footer />
//     </>
//   );
// }



import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/GenerateMenuQR.css";
import Footer from "../components/Footer.jsx";
import HomeHeader from "../components/HomeHeader.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyRestaurant, fetchMe } from "../services/apiService.js";

export default function GenerateMenuQR() {
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState("My Restaurant");
  const [adminEmail, setAdminEmail] = useState("");
  const [restaurantData, setRestaurantData] = useState(null);
  const [qrValue, setQrValue] = useState("");
  const previewRef = useRef(null);
  const [restaurant, setRestaurant] = useState(null);
  
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getMyRestaurant(token);
        setRestaurant(res.restaurant);
      } catch (err) {
        console.error("Fetch /me failed -", err);
      }
    };
    fetchMe();
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchRestaurantData = async () => {
      try {
        const data = await fetchMe(token);
        const restaurantInfo = data.restaurant;
        setRestaurantName(restaurantInfo.restaurantName);
        setAdminEmail(restaurantInfo.email);
        setRestaurantData(restaurantInfo);
        
        if (restaurantInfo._id) {
          setQrValue(`http://localhost:3000/menu?restaurantId=${restaurantInfo._id}`);
        }
      } catch (err) {
        console.error("Failed to fetch restaurant data:", err);
        toast.error("Session expired, please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("adminEmail");
        navigate("/");
      }
    };

    fetchRestaurantData();
  }, [navigate]);

  const downloadMenuQR = async () => {
    if (!previewRef.current) return;
    
    await new Promise(resolve => setTimeout(resolve, 300));
    const canvas = await html2canvas(previewRef.current, {
      useCORS: true,
      scale: 4,
    });

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${(restaurantName || "Restaurant").replace(/\s+/g, "_")}_Menu_QR.png`;
    link.click();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    navigate("/");
  };

  return (
    <>
      <HomeHeader
        isAdminDashboard={true}
        restaurantName={restaurantName}
        adminEmail={adminEmail}
        onLogout={handleLogout}
        restaurant={restaurant}
      />

      <div className="generate-qr-wrapper">
        <div className="centered-container">
        
          <div className="qr-card d-flex flex-column">
            <h2 className="mb-1 ">
              <i className="bi bi-qr-code-scan"></i> Menu QR 
            </h2>
            <p  className="mt-1" >
              Restaurant: <strong>{restaurantName}</strong>
            </p>
            
            <div
              className="qr-preview-card "
              ref={previewRef}
              style={{
                background: "var(--card-bg)",
                boxShadow: "var(--shadow-1)",
                padding: "20px",
                minHeight: "520px",
              }}
            >
              {qrValue ? (
                <>
                  <div className="qr-bg">
                    <div className="qr-overlay">
                      <QRCodeCanvas
                        value={qrValue}
                        size={200}
                        includeMargin={true}
                        bgColor="#ffffff"
                        fgColor="#000000"
                      />
                    </div>
                    <div className="view-menu-btn">View Our Menu</div>
                  </div>

                  <div className="qr-header-inline" aria-hidden="true">
                    <div className="qr-restaurant-name mt-1">{restaurantName}</div>
                  </div>

                  <div className="qr-text-section ">
                    <h3>SCAN & VIEW MENU</h3>
                    <p>
                      Scan the QR code with your smartphone camera to open our
                      digital menu instantly.
                    </p>
                    <h4 className="brand">Powered by Apaxion</h4>
                  </div>
                </>
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={downloadMenuQR}
              className="btn btn-primary w-100 mt-3 "
              disabled={!qrValue}
            >
              <i className="bi bi-download"></i> Download Menu QR
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}