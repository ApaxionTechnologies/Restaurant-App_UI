
// import React, { useState, useEffect } from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import "aos/dist/aos.css";
// import AOS from "aos";
// import { Country, State, City } from "country-state-city";
// import "../styles/RegisterForm.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import axios from "axios";
// import Select from 'react-select';


// const BASE_URL = "http://localhost:5001/api";

// export default function RegisterRestaurant() {
//   const [formData, setFormData] = useState({
//     restaurantName: "",
//     firstName: "",
//     lastName: "",
//     contact: "",
//     tables: "",  // Added field for tables
//     address: {
//       line1: "",
//       line2: "",
//       country: "",
//       state: "",
//       city: "",
//     },
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [touched, setTouched] = useState({});
//   const [errors, setErrors] = useState({});
//   const [showPasswordHint, setShowPasswordHint] = useState(false);

//   const [countryList, setCountryList] = useState([]);
//   const [stateList, setStateList] = useState([]);
//   const [cityList, setCityList] = useState([]);

//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//     setCountryList(Country.getAllCountries());
//   }, []);

//   const handleAddressChange = (field, value) => {
//     const updatedAddress = { ...formData.address, [field]: value };

//     if (field === "country") {
//       setStateList(State.getStatesOfCountry(value));
//       updatedAddress.state = "";
//       updatedAddress.city = "";
//       setCityList([]);
//     }

//     if (field === "state") {
//       setCityList(City.getCitiesOfState(formData.address.country, value));
//       updatedAddress.city = "";
//     }

//     setFormData((prev) => ({ ...prev, address: updatedAddress }));
//     validate({ ...formData, address: updatedAddress });
//   };

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

//     if (!data.restaurantName) newErrors.restaurantName = "Restaurant name is required.";
//     if (!data.firstName) newErrors.firstName = "First name is required.";
//     else if (!nameRegex.test(data.firstName)) newErrors.firstName = "First name must contain letters only.";
//     if (!data.lastName) newErrors.lastName = "Last name is required.";
//     else if (!nameRegex.test(data.lastName)) newErrors.lastName = "Last name must contain letters only.";
//     if (!data.contact || data.contact.length < 10) newErrors.contact = "Valid phone number required.";

//     const { line1, country, state, city } = data.address || {};
//     if (!line1) newErrors.line1 = "Street/Colony is required.";
//     if (!country) newErrors.country = "Country is required.";
//     if (!state) newErrors.state = "State is required.";
//     if (!city) newErrors.city = "City is required.";

//     if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "Enter a valid email.";
//     if (!data.password || data.password.length < 6) newErrors.password = "Minimum 6 characters.";
//     if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
//     if (!data.tables || data.tables <= 0) newErrors.tables = "Enter a valid number of tables."; // New validation

//     setErrors(newErrors);
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const currentErrors = validate(formData);
//     setTouched({
//       restaurantName: true,
//       firstName: true,
//       lastName: true,
//       contact: true,
//       tables: true, // Mark tables as touched
//       line1: true,
//       country: true,
//       state: true,
//       city: true,
//       email: true,
//       password: true,
//       confirmPassword: true,
//     });

//     if (Object.keys(currentErrors).length === 0) {
//       try {
//         const payload = {
//           restaurantName: formData.restaurantName,
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           contact: formData.contact,
//           tables: formData.tables,  // Add tables to payload
//           address: {
//             line1: formData.address.line1,
//             line2: formData.address.line2 || '',
//             country: formData.address.country,
//             state: formData.address.state,
//             city: formData.address.city,
//           },
//           email: formData.email,
//           password: formData.password,
//         };

//         const response = await axios.post(`${BASE_URL}/restaurants/register`, payload);

//         const restaurantData = response.data.restaurant || payload;
//         localStorage.setItem("restaurantEmail", restaurantData.email);
//         localStorage.setItem("restaurantName", restaurantData.restaurantName);

//         alert(response.data.message || "✅ Registered Successfully!");
//       } catch (error) {
//         console.error("Registration error:", error);
//         alert(error.response?.data?.error || "Registration failed.");
//       }
//     } else {
//       alert("Please fix the errors in the form.");
//     }
//   };

//   return (
//     <div className="register-page">
//       <form className="register-form" onSubmit={handleSubmit} data-aos="fade-up">
//         <h1 className="form-title">🍽️ Register As Restaurant</h1>
//         <div className="title-divider" />
//         <h2>Fill The Form!</h2>

//         {/* Basic Info */}
//         <div className="form-grid">
//           <div className="form-group full-width">
//             <label><i className="fas fa-store me-2" />Restaurant Name</label>
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
//             <label><i className="fas fa-user me-2" />First Name</label>
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
//             <label><i className="fas fa-user me-2" />Last Name</label>
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
//             <label><i className="fas fa-phone me-2" />Contact Number</label>
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

//           {/* New Tables Input */}
//           <div className="form-group full-width">
//             <label><i className="fas fa-table me-2" />Enter Tables</label>
//             <input
//               type="number"
//               name="tables"
//               value={formData.tables}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={errors.tables && touched.tables ? "error" : ""}
//             />
//             {errors.tables && touched.tables && <small>{errors.tables}</small>}
//           </div>
//         </div>

//         {/* Address Fields */}
//         <div className="form-group full-width">
//           <label><i className="fas fa-map-marker-alt me-2" />Address Line 1 (Street/Colony)</label>
//           <input
//             type="text"
//             value={formData.address.line1}
//             onChange={(e) => handleAddressChange("line1", e.target.value)}
//             className={errors.line1 && touched.line1 ? "error" : ""}
//           />
//           {errors.line1 && touched.line1 && <small>{errors.line1}</small>}
//         </div>

//         <div className="form-group full-width">
//           <label><i className="fas fa-building me-2" />Address Line 2 (Apartment/Building)</label>
//           <input
//             type="text"
//             value={formData.address.line2}
//             onChange={(e) => handleAddressChange("line2", e.target.value)}
//           />
//         </div>
// <div className="form-group">
// <label><i className="fas fa-globe-asia me-2" />Country</label>
// <Select
//   options={countryList.map((c) => ({ label: c.name, value: c.isoCode }))}
//   value={formData.address.country ? { label: Country.getCountryByCode(formData.address.country)?.name, value: formData.address.country } : null}
//   onChange={(selected) => handleAddressChange("country", selected.value)}
//   placeholder="Select Country"
//   className="react-select-container"
//   classNamePrefix="react-select"
// />
// </div>

// <div className="form-group">
// <label><i className="fas fa-map me-2" />State</label>
// <Select
//   options={stateList.map((s) => ({ label: s.name, value: s.isoCode }))}
//   value={formData.address.state ? { label: State.getStateByCodeAndCountry(formData.address.state, formData.address.country)?.name, value: formData.address.state } : null}
//   onChange={(selected) => handleAddressChange("state", selected.value)}
//   placeholder="Select State"
//   className="react-select-container"
//   classNamePrefix="react-select"
// />
// </div>

// <div className="form-group">
// <label><i className="fas fa-city me-2" />City</label>
// <Select
//   options={cityList.map((c) => ({ label: c.name, value: c.name }))}
//   value={formData.address.city ? { label: formData.address.city, value: formData.address.city } : null}
//   onChange={(selected) => handleAddressChange("city", selected.value)}
//   placeholder="Select City"
//   className="react-select-container"
//   classNamePrefix="react-select"
// />
// </div>

//         {/* Email & Password */}
//         <div className="form-group full-width">
//           <label><i className="fas fa-envelope me-2" />Email Address</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             className={errors.email && touched.email ? "error" : ""}
//           />
//           {errors.email && touched.email && <small>{errors.email}</small>}
//         </div>

//         <div className="form-grid">
//           <div className="form-group">
//             <label><i className="fas fa-lock me-2" />Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               onFocus={() => setShowPasswordHint(true)}
//               className={errors.password && touched.password ? "error" : ""}
//             />
//             {errors.password && touched.password && <small>{errors.password}</small>}
//           </div>

//           <div className="form-group">
//             <label><i className="fas fa-lock me-2" />Confirm Password</label>
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





    //  This is The Working Version 

import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "aos/dist/aos.css";
import AOS from "aos";
import { Country, State, City } from "country-state-city";
import "../styles/RegisterForm.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import Select from 'react-select';
import RegisterRestaurantHeader from "../components/RegisterRestaurantHeader.jsx";
import Footer from "../components/Footer.jsx";
import AdminLogin from "../pages/AdminLogin"; // adjust path if needed


const BASE_URL = "http://localhost:5001/api";

export default function RegisterRestaurant() {
  const [formData, setFormData] = useState({
    restaurantName: "",
    firstName: "",
    lastName: "",
    contact: "",
    tables: "",
    address: {
      line1: "",
      line2: "",
      country: "",
      state: "",
      city: "",
    },
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);


  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    setCountryList(Country.getAllCountries());
  }, []);

  const handleAddressChange = (field, value) => {
    const updatedAddress = { ...formData.address, [field]: value };

    if (field === "country") {
      setStateList(State.getStatesOfCountry(value));
      updatedAddress.state = "";
      updatedAddress.city = "";
      setCityList([]);
    }

    if (field === "state") {
      setCityList(City.getCitiesOfState(formData.address.country, value));
      updatedAddress.city = "";
    }

    setFormData((prev) => ({ ...prev, address: updatedAddress }));
    validate({ ...formData, address: updatedAddress });
  };

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

    if (!data.restaurantName) newErrors.restaurantName = "Restaurant name is required.";
    if (!data.firstName) newErrors.firstName = "First name is required.";
    else if (!nameRegex.test(data.firstName)) newErrors.firstName = "First name must contain letters only.";
    if (!data.lastName) newErrors.lastName = "Last name is required.";
    else if (!nameRegex.test(data.lastName)) newErrors.lastName = "Last name must contain letters only.";
    if (!data.contact || data.contact.length < 10) newErrors.contact = "Valid phone number required.";

    const { line1, country, state, city } = data.address || {};
    if (!line1) newErrors.line1 = "Street/Colony is required.";
    if (!country) newErrors.country = "Country is required.";
    if (!state) newErrors.state = "State is required.";
    if (!city) newErrors.city = "City is required.";

    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "Enter a valid email.";
    if (!data.password || data.password.length < 6) newErrors.password = "Minimum 6 characters.";
    if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!data.tables || data.tables <= 0) newErrors.tables = "Enter a valid number of tables.";

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentErrors = validate(formData);
    setTouched({
      restaurantName: true,
      firstName: true,
      lastName: true,
      contact: true,
      tables: true,
      line1: true,
      country: true,
      state: true,
      city: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(currentErrors).length === 0) {
      try {
        const payload = {
          restaurantName: formData.restaurantName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          contact: formData.contact,
          tables: formData.tables,
          address: {
            line1: formData.address.line1,
            line2: formData.address.line2 || '',
            country: formData.address.country,
            state: formData.address.state,
            city: formData.address.city,
          },
          email: formData.email,
          password: formData.password,
        };

        const response = await axios.post(`${BASE_URL}/restaurants/register`, payload);

        const restaurantData = response.data.restaurant || payload;
        localStorage.setItem("restaurantEmail", restaurantData.email);
        localStorage.setItem("restaurantName", restaurantData.restaurantName);

        alert(response.data.message || "✅ Registered Successfully!");
      } catch (error) {
        console.error("Registration error:", error);
        alert(error.response?.data?.error || "Registration failed.");
      }
    } else {
      alert("Please fix the errors in the form.");
    }
  };

  return (
    <>
      {/* <RegisterRestaurantHeader /> */}
      <RegisterRestaurantHeader onAdminLoginClick={() => setShowLoginModal(true)} />

      {showLoginModal && (
  <div className="admin-login-overlay">
    <div className="admin-login-modal">
      <AdminLogin closeModal={() => setShowLoginModal(false)} />
    </div>
  </div>
)}

      <div className="register-page">
        <form className="register-form" onSubmit={handleSubmit} data-aos="fade-up">
          <h1 className="form-title">🍽️ Register As Restaurant</h1>
          <div className="title-divider" />
          <h2>Fill The Form!</h2>

          <div className="form-grid">
            <div className="form-group full-width">
              <label><i className="fas fa-store me-2" />Restaurant Name</label>
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

            <div className="form-group">
              <label><i className="fas fa-user me-2" />First Name</label>
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
              <label><i className="fas fa-user me-2" />Last Name</label>
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

            <div className="form-group full-width">
              <label><i className="fas fa-phone me-2" />Contact Number</label>
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

            <div className="form-group full-width">
              <label><i className="fas fa-table me-2" />Enter Tables</label>
              <input
                type="number"
                name="tables"
                value={formData.tables}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.tables && touched.tables ? "error" : ""}
              />
              {errors.tables && touched.tables && <small>{errors.tables}</small>}
            </div>
          </div>

          <div className="form-group full-width">
            <label><i className="fas fa-map-marker-alt me-2" />Address Line 1 (Street/Colony)</label>
            <input
              type="text"
              value={formData.address.line1}
              onChange={(e) => handleAddressChange("line1", e.target.value)}
              className={errors.line1 && touched.line1 ? "error" : ""}
            />
            {errors.line1 && touched.line1 && <small>{errors.line1}</small>}
          </div>

          <div className="form-group full-width">
            <label><i className="fas fa-building me-2" />Address Line 2 (Apartment/Building)</label>
            <input
              type="text"
              value={formData.address.line2}
              onChange={(e) => handleAddressChange("line2", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label><i className="fas fa-globe-asia me-2" />Country</label>
            <Select
              options={countryList.map((c) => ({ label: c.name, value: c.isoCode }))}
              value={formData.address.country ? { label: Country.getCountryByCode(formData.address.country)?.name, value: formData.address.country } : null}
              onChange={(selected) => handleAddressChange("country", selected.value)}
              placeholder="Select Country"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="form-group">
            <label><i className="fas fa-map me-2" />State</label>
            <Select
              options={stateList.map((s) => ({ label: s.name, value: s.isoCode }))}
              value={formData.address.state ? { label: State.getStateByCodeAndCountry(formData.address.state, formData.address.country)?.name, value: formData.address.state } : null}
              onChange={(selected) => handleAddressChange("state", selected.value)}
              placeholder="Select State"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="form-group">
            <label><i className="fas fa-city me-2" />City</label>
            <Select
              options={cityList.map((c) => ({ label: c.name, value: c.name }))}
              value={formData.address.city ? { label: formData.address.city, value: formData.address.city } : null}
              onChange={(selected) => handleAddressChange("city", selected.value)}
              placeholder="Select City"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="form-group full-width">
            <label><i className="fas fa-envelope me-2" />Email Address</label>
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

          <div className="form-grid">
            <div className="form-group">
              <label><i className="fas fa-lock me-2" />Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={() => setShowPasswordHint(true)}
                className={errors.password && touched.password ? "error" : ""}
              />
              {errors.password && touched.password && <small>{errors.password}</small>}
            </div>

            <div className="form-group">
              <label><i className="fas fa-lock me-2" />Confirm Password</label>
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
     <div className="Footer">
       <Footer/>
     </div>
    </>
  );
}








