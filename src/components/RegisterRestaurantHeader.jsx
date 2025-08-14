
// import React from "react";
// import "../components/RegisterRestaurantHeader.css";
// const Header = ({ onAdminLoginClick }) => {
//   return (
//     <div className="header">
//       <button className="header-btn" onClick={() => window.location.href = "/register"}>
//         🧾 Register as Restaurant
//       </button>
//       <button className="header-btn" onClick={onAdminLoginClick}>
//         🔐 Login as Admin
//       </button>
//     </div>
//   );
// };

// export default Header;



import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import "../components/RegisterRestaurantHeader.css"; // optional
import { MdHome } from "react-icons/md";

const Header = ({ onAdminLoginClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Optional: hide back button on home page
  const showBackButton = location.pathname !== "/";

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="header d-flex justify-content-between align-items-center px-3 py-2 shadow-sm">
      <div className="d-flex align-items-center">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="<MdHome />"
            style={{ textDecoration: "none", color: "#000", fontSize: "1.1rem",Border: "none", background: "none", display: "flex", alignItems: "center" }}
          >
            <MdHome />
            
          </button>
        )}
      </div>

      <div className="d-flex align-items-center">
        {/* <button
          className="header-btn me-2"
          onClick={() => (window.location.href = "/register")}
        >
          🧾 Register as Restaurant
        </button> */}
           <button className="header-link login-btn" onClick={onAdminLoginClick}>
          🔐 Login
        </button>
      </div>
    </div>
  );
};

export default Header;



// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";
// import "../components/RegisterRestaurantHeader.css";

// const Header = ({ onAdminLoginClick }) => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const showBackButton = location.pathname !== "/";

//   const handleBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="header d-flex justify-content-between align-items-center px-3 py-2 shadow-sm">
//       <div className="d-flex align-items-center gap-2 flex-wrap">
//         {showBackButton && (
//           <button
//             onClick={handleBack}
//             className="btn btn-link back-button p-0"
//             style={{
//               textDecoration: "none",
//               color: "#000",
//               fontSize: "1.05rem",
//               display: "flex",
//               alignItems: "center",
//             }}
//           >
//             <FaArrowLeft className="me-1" />
//             Back
//           </button>
//         )}

//         <button
//           className="header-btn"
//           onClick={() => (window.location.href = "/register")}
//         >
//           🧾 Register as Restaurant
//         </button>

//         <button className="header-btn" onClick={onAdminLoginClick}>
//           🔐 Login as Admin
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Header;
