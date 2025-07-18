// // src/pages/RegisterRestaurant.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import "aos/dist/aos.css";
// import AOS from "aos";
// import "../styles/RegisterForm.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// //import Header from './components/Header'; // ✅ correct if in same folder as src/components

// export default function RegisterRestaurant() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     restaurantName: "",
//     firstName: "",
//     lastName: "",
//     contact: "",
//     address: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [touched, setTouched] = useState({});
//   const [errors, setErrors] = useState({});
//   const [showPasswordHint, setShowPasswordHint] = useState(false);

//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     validate({ ...formData, [name]: value });
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));
//     validate(formData);
//   };

//   const handlePhoneChange = (value) => {
//     setFormData((prev) => ({ ...prev, contact: value }));
//     validate({ ...formData, contact: value });
//     setTouched((prev) => ({ ...prev, contact: true }));
//   };

//   const validate = (data) => {
//     const newErrors = {};
//     const nameRegex = /^[A-Za-z]+$/;

//     if (!data.restaurantName)
//       newErrors.restaurantName = "Restaurant name is required.";

//     if (!data.firstName) {
//       newErrors.firstName = "First name is required.";
//     } else if (!nameRegex.test(data.firstName)) {
//       newErrors.firstName = "First name must contain letters only.";
//     }

//     if (!data.lastName) {
//       newErrors.lastName = "Last name is required.";
//     } else if (!nameRegex.test(data.lastName)) {
//       newErrors.lastName = "Last name must contain letters only.";
//     }

//     if (!data.contact || data.contact.length < 10)
//       newErrors.contact = "Valid phone number required.";

//     if (!data.address)
//       newErrors.address = "Address is required.";

//     if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
//       newErrors.email = "Enter a valid email.";

//     if (!data.password || data.password.length < 6)
//       newErrors.password = "Minimum 6 characters.";

//     if (data.password !== data.confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match.";

//     setErrors(newErrors);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     validate(formData);
//     setTouched({
//       restaurantName: true,
//       firstName: true,
//       lastName: true,
//       contact: true,
//       address: true,
//       email: true,
//       password: true,
//       confirmPassword: true,
//     });

//     if (Object.keys(errors).length === 0) {
//       // Send data to backend API
//       fetch("http://localhost:5001/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           restaurantName: formData.restaurantName,
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           contact: formData.contact,
//           address: formData.address,
//           email: formData.email,
//           password: formData.password,
//         }),
//       })
//         .then(async (res) => {
//           const data = await res.json();
//           if (res.ok) {
//             alert("Restaurant registered successfully!");
//             navigate("/upload-qr");
//           } else {
//             alert(data.error || "Registration failed.");
//           }
//         })
//         .catch(() => {
//           alert("Server error. Please try again later.");
//         });
//     } else {
//       alert("Please fix the errors in the form.");
//     }
//   };

//   return (
//     <div className="register-page">
//       {/* Backend API: POST http://localhost:5000/api/register */}
//       <form className="register-form" onSubmit={handleSubmit} data-aos="fade-up">
//         <h1 className="form-title">Register As Restaurant</h1>
//         <div className="title-divider" />
//         <h2>🍽️ Register Your Restaurant</h2>

//         <div className="form-grid">
//           <div className="form-group full-width">
//             <label><i className="fas fa-store" /> Restaurant Name</label>
//             <input
//               type="text"
//               name="restaurantName"
//               value={formData.restaurantName}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={errors.restaurantName && touched.restaurantName ? "error" : ""}
//             />
//             {errors.restaurantName && touched.restaurantName && <small>{errors.restaurantName}</small>}
//           </div>

//           <div className="form-group">
//             <label><i className="fas fa-user" /> First Name</label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={errors.firstName && touched.firstName ? "error" : ""}
//             />
//             {errors.firstName && touched.firstName && <small>{errors.firstName}</small>}
//           </div>

//           <div className="form-group">
//             <label><i className="fas fa-user" /> Last Name</label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={errors.lastName && touched.lastName ? "error" : ""}
//             />
//             {errors.lastName && touched.lastName && <small>{errors.lastName}</small>}
//           </div>

//           <div className="form-group full-width">
//             <label><i className="fas fa-phone" /> Contact Number</label>
//             <PhoneInput
//               country={"in"}
//               value={formData.contact}
//               onChange={handlePhoneChange}
//               onBlur={() => setTouched((prev) => ({ ...prev, contact: true }))}
//               inputClass={`custom-phone-input ${errors.contact && touched.contact ? "error" : ""}`}
//               enableSearch
//             />
//             {errors.contact && touched.contact && <small>{errors.contact}</small>}
//           </div>

//           <div className="form-group full-width">
//             <label><i className="fas fa-map-marker-alt" /> Address</label>
//             <textarea
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               rows="2"
//               className={errors.address && touched.address ? "error" : ""}
//             />
//             {errors.address && touched.address && <small>{errors.address}</small>}
//           </div>

//           <div className="form-group full-width">
//             <label><i className="fas fa-envelope" /> Email Address</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={errors.email && touched.email ? "error" : ""}
//             />
//             {errors.email && touched.email && <small>{errors.email}</small>}
//           </div>

//           <div className="form-group">
//             <label><i className="fas fa-lock" /> Set Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               onFocus={() => setShowPasswordHint(true)}
//               onBlur={(e) => {
//                 handleBlur(e);
//                 setShowPasswordHint(false);
//               }}
//               className={errors.password && touched.password ? "error" : ""}
//             />
//             {showPasswordHint && formData.confirmPassword && formData.password !== formData.confirmPassword && (
//               <div className="password-popup">🔐 Passwords don’t match</div>
//             )}
//             {errors.password && touched.password && <small>{errors.password}</small>}
//           </div>

//           <div className="form-group">
//             <label><i className="fas fa-lock" /> Confirm Password</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={errors.confirmPassword && touched.confirmPassword ? "error" : ""}
//             />
//             {errors.confirmPassword && touched.confirmPassword && <small>{errors.confirmPassword}</small>}
//           </div>
//         </div>

//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// }

// src/pages/RegisterRestaurant.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "aos/dist/aos.css";
import AOS from "aos";
import "../styles/RegisterForm.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";

const BASE_URL = "http://localhost:5002/api";

export default function RegisterRestaurant() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    restaurantName: "",
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(formData);
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, contact: value }));
    validate({ ...formData, contact: value });
    setTouched((prev) => ({ ...prev, contact: true }));
  };

  const validate = (data) => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z]+$/;

    if (!data.restaurantName)
      newErrors.restaurantName = "Restaurant name is required.";

    if (!data.firstName) {
      newErrors.firstName = "First name is required.";
    } else if (!nameRegex.test(data.firstName)) {
      newErrors.firstName = "First name must contain letters only.";
    }

    if (!data.lastName) {
      newErrors.lastName = "Last name is required.";
    } else if (!nameRegex.test(data.lastName)) {
      newErrors.lastName = "Last name must contain letters only.";
    }

    if (!data.contact || data.contact.length < 10)
      newErrors.contact = "Valid phone number required.";

    if (!data.address) newErrors.address = "Address is required.";

    if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = "Enter a valid email.";

    if (!data.password || data.password.length < 6)
      newErrors.password = "Minimum 6 characters.";

    if (data.password !== data.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validate(formData);

    setTouched({
      restaurantName: true,
      firstName: true,
      lastName: true,
      contact: true,
      address: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(errors).length === 0) {
      try {
        const res = await axios.post(`${BASE_URL}/register`, formData);

        // ✅ Use safe fallback
        const restaurantData = res.data.restaurant || formData;

        localStorage.setItem("restaurantEmail", restaurantData.email);
        localStorage.setItem("restaurantName", restaurantData.restaurantName);

        alert(res.data.message || "✅ Registered Successfully!");
        navigate("/generate-qr");
      } catch (error) {
        console.error("Error:", error);
        alert(error.response?.data?.error || "Registration failed.");
      }
    } else {
      alert("Please fix the errors in the form.");
    }
  };

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmit} data-aos="fade-up">
        <h1 className="form-title">Register As Restaurant</h1>
        <div className="title-divider" />
        <h2>🍽️ Register Your Restaurant</h2>

        <div className="form-grid">
          {/* Restaurant Name */}
          <div className="form-group full-width">
            <label><i className="fas fa-store" /> Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.restaurantName && touched.restaurantName ? "error" : ""}
            />
            {errors.restaurantName && touched.restaurantName && <small>{errors.restaurantName}</small>}
          </div>

          {/* First & Last Name */}
          <div className="form-group">
            <label><i className="fas fa-user" /> First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.firstName && touched.firstName ? "error" : ""}
            />
            {errors.firstName && touched.firstName && <small>{errors.firstName}</small>}
          </div>

          <div className="form-group">
            <label><i className="fas fa-user" /> Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.lastName && touched.lastName ? "error" : ""}
            />
            {errors.lastName && touched.lastName && <small>{errors.lastName}</small>}
          </div>

          {/* Contact */}
          <div className="form-group full-width">
            <label><i className="fas fa-phone" /> Contact Number</label>
            <PhoneInput
              country={"in"}
              value={formData.contact}
              onChange={handlePhoneChange}
              onBlur={() => setTouched((prev) => ({ ...prev, contact: true }))}
              inputClass={`custom-phone-input ${errors.contact && touched.contact ? "error" : ""}`}
              enableSearch
            />
            {errors.contact && touched.contact && <small>{errors.contact}</small>}
          </div>

          {/* Address */}
          <div className="form-group full-width">
            <label><i className="fas fa-map-marker-alt" /> Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="2"
              className={errors.address && touched.address ? "error" : ""}
            />
            {errors.address && touched.address && <small>{errors.address}</small>}
          </div>

          {/* Email */}
          <div className="form-group full-width">
            <label><i className="fas fa-envelope" /> Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email && touched.email ? "error" : ""}
            />
            {errors.email && touched.email && <small>{errors.email}</small>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label><i className="fas fa-lock" /> Set Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setShowPasswordHint(true)}
              onBlur={(e) => {
                handleBlur(e);
                setShowPasswordHint(false);
              }}
              className={errors.password && touched.password ? "error" : ""}
            />
            {errors.password && touched.password && <small>{errors.password}</small>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label><i className="fas fa-lock" /> Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.confirmPassword && touched.confirmPassword ? "error" : ""}
            />
            {errors.confirmPassword && touched.confirmPassword && <small>{errors.confirmPassword}</small>}
          </div>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
