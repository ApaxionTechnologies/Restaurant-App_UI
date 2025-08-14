// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../components/RegisterRestaurantHeader.css"; 

// const Header = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="header">
//       <button className="header-btn" onClick={() => navigate("/register")}>
//         🧾 Register as Restaurant
//       </button>
//       <button className="header-btn" onClick={() => navigate("/admin-login")}>
//         🔐 Login as Admin
//       </button>
//     </div>
//   );
// };

// export default Header;




import React from "react";
import "../components/RegisterRestaurantHeader.css"; // optional

const Header = ({ onAdminLoginClick }) => {
  return (
    <div className="header">
      <button className="header-btn" onClick={() => window.location.href = "/register"}>
        🧾 Register as Restaurant
      </button>
      <button className="header-btn" onClick={onAdminLoginClick}>
        🔐 Login as Admin
      </button>
    </div>
  );
};

export default Header;
