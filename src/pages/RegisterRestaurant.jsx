// // pages/RegisterRestaurant.jsx
// import React, { useState, useEffect, useContext } from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import "aos/dist/aos.css";
// import AOS from "aos";
// import { Country, State, City } from "country-state-city";
// import "../styles/RegisterForm.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import axios from "axios";
// import Select from "react-select";
// import Footer from "../components/Footer.jsx";
// import HomeHeader from "../components/HomeHeader.jsx";
// import { useNavigate } from "react-router-dom";

// const BASE_URL = "http://localhost:5001/api";

// export default function RegisterRestaurant() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     restaurantName: "",
//     ownerName: "",
//     contact: "",
//     tables: "",
//     categories: [],
//     tagline: "",
//     image: null,
//     // ✅ new image fields
//     logoImage: null,
//     headerImage: null,
//     footerImage: null,
//     address: { line1: "", line2: "", country: "", state: "", city: "" },
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [previewImage, setPreviewImage] = useState(null);
//   // ✅ previews for new images
//   const [previewLogo, setPreviewLogo] = useState(null);
//   const [previewHeader, setPreviewHeader] = useState(null);
//   const [previewFooter, setPreviewFooter] = useState(null);

//   const [touched, setTouched] = useState({});
//   const [errors, setErrors] = useState({});
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

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, image: file }));
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   // ✅ handlers for new image fields
//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, logoImage: file }));
//       setPreviewLogo(URL.createObjectURL(file));
//     }
//   };
//   const handleHeaderChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, headerImage: file }));
//       setPreviewHeader(URL.createObjectURL(file));
//     }
//   };
//   const handleFooterChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, footerImage: file }));
//       setPreviewFooter(URL.createObjectURL(file));
//     }
//   };

//   const validate = (data) => {
//     const newErrors = {};
//     const nameRegex = /^[A-Za-z\s]+$/;
//     if (!data.restaurantName) newErrors.restaurantName = "Restaurant name is required.";
//     if (!data.ownerName) newErrors.ownerName = "Owner name is required.";
//     else if (!nameRegex.test(data.ownerName)) newErrors.ownerName = "Owner name must contain letters only.";
//     if (!data.contact || data.contact.length < 10) newErrors.contact = "Valid phone number required.";
//     const { line1, country, state, city } = data.address || {};
//     if (!line1) newErrors.line1 = "Street/Colony is required.";
//     if (!country) newErrors.country = "Country is required.";
//     if (!state) newErrors.state = "State is required.";
//     if (!city) newErrors.city = "City is required.";

//     if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
//       newErrors.email = "Enter a valid email.";
//     if (!data.password || data.password.length < 6)
//       newErrors.password = "Minimum 6 characters.";
//     if (data.password !== data.confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match.";
//     if (!data.tables || data.tables <= 0)
//       newErrors.tables = "Enter a valid number of tables.";

//     setErrors(newErrors);
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const currentErrors = validate(formData);
//     setTouched({
//       restaurantName: true, ownerName: true, contact: true, tables: true,
//       line1: true, country: true, state: true, city: true, email: true, password: true, confirmPassword: true
//     });

//     if (Object.keys(currentErrors).length === 0) {
//       try {
//         const formDataToSend = new FormData();
//         formDataToSend.append("restaurantName", formData.restaurantName);
//         formDataToSend.append("ownerName", formData.ownerName);
//         formDataToSend.append("contact", formData.contact);
//         formDataToSend.append("tables", formData.tables);
//         formDataToSend.append(
//           "categories",
//           JSON.stringify(formData.categories.map((c) => c.value))
//         );
//         formDataToSend.append("tagline", formData.tagline); // ✅ tagline
//         formDataToSend.append("address", JSON.stringify(formData.address));
//         formDataToSend.append("email", formData.email);
//         formDataToSend.append("password", formData.password);
//         if (formData.image) formDataToSend.append("image", formData.image);
//         // ✅ append new image fields
//         if (formData.logoImage) formDataToSend.append("logoImage", formData.logoImage);
//         if (formData.headerImage) formDataToSend.append("headerImage", formData.headerImage);
//         if (formData.footerImage) formDataToSend.append("footerImage", formData.footerImage);

//         //  withCredentials so cookie can be set by backend
//         const response = await axios.post(`${BASE_URL}/restaurants/register`, formDataToSend, {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials:true,
//         });

//         alert(response.data.message || "Registered successfully! Please log in.");
//         navigate("/");
//       } catch (error) {
//         console.error("Registration error:", error);
//         alert(error.response?.data?.error || "Registration failed.");
//       }
//     } else {
//       alert("Please fill the form correctly.");
//     }
//   };

//   const categoryOptions = [
//     { value: "starters", label: "Starters" },
//     { value: "mains", label: "Mains" },
//     { value: "desserts", label: "Desserts" },
//     { value: "beverages", label: "Beverages" },
//     { value: "snacks", label: "Snacks" },
//     { value: "soups", label: "Soups" },
//   ];

//   // 🔹 Common react-select style override
//   const customSelectStyles = {
//     control: (base) => ({
//       ...base,
//       height: "52px",
//       minHeight: "42px",
//       borderRadius: "8px",
//       border: "1px solid #ccc",
//       boxShadow: "none",
//       "&:hover": { borderColor: "#999" },
//     }),
//     valueContainer: (base) => ({
//       ...base,
//       height: "42px",
//       padding: "0 10px",
//     }),
//     input: (base) => ({
//       ...base,
//       margin: 0,
//       padding: 0,
//     }),
//     indicatorsContainer: (base) => ({
//       ...base,
//       height: "42px",
//     }),
//     multiValue: (base) => ({
//       ...base,
//       backgroundColor: "#f0f0f0",
//       borderRadius: "6px",
//       padding: "2px 4px",
//     }),
//   };

//   return (
//     <>
//       <HomeHeader />

//       <div className="register-page">
//         <form
//           className="register-form"
//           onSubmit={handleSubmit}
//           data-aos="fade-up"
//         >
//           <h1 className="form-title">🍽️ Register As Restaurant</h1>
//           <div className="title-divider" />

//           {/* Basic Info */}
//           <div className="form-grid">
//             <div className="form-group full-width">
//               <label>
//                 <i className="fas fa-store me-2" />
//                 Restaurant Name
//               </label>
//               <input
//                 type="text"
//                 name="restaurantName"
//                 value={formData.restaurantName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={
//                   errors.restaurantName && touched.restaurantName ? "error" : ""
//                 }
//               />
//               {errors.restaurantName && touched.restaurantName && (
//                 <small>{errors.restaurantName}</small>
//               )}
//             </div>

//             <div className="form-group">
//               <label>
//                 <i className="fas fa-user me-2" />
//                 Owner Name
//               </label>
//               <input
//                 type="text"
//                 name="ownerName"
//                 value={formData.ownerName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={
//                   errors.ownerName && touched.ownerName ? "error" : ""
//                 }
//               />
//               {errors.ownerName && touched.ownerName && (
//                 <small>{errors.ownerName}</small>
//               )}
//             </div>

//             <div className="form-group">
//               <label>
//                 <i className="fas fa-phone me-2" />
//                 Contact Number
//               </label>
//               <PhoneInput
//                 country={"in"}
//                 value={formData.contact}
//                 onChange={handlePhoneChange}
//                 onBlur={() =>
//                   setTouched((prev) => ({ ...prev, contact: true }))
//                 }
//                 inputClass={`custom-phone-input ${
//                   errors.contact && touched.contact ? "error" : ""
//                 }`}
//                 containerClass="phone-container"
//                 buttonClass="phone-flag-button"
//                 enableSearch
//               />
//               {errors.contact && touched.contact && (
//                 <small>{errors.contact}</small>
//               )}
//             </div>
//           </div>

//           {/* Tables & Categories side by side */}
//           <div className="form-grid">
//             <div className="form-group ">
//               <label>
//                 <i className="fas fa-table me-2" />
//                 Table Number
//               </label>
//               <input
//                 type="number"
//                 name="tables"
//                 value={formData.tables}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={errors.tables && touched.tables ? "error" : ""}
//                 styles={customSelectStyles}
//               />
//               {errors.tables && touched.tables && (
//                 <small>{errors.tables}</small>
//               )}
//             </div>

//             <div className="form-group">
//               <label>
//                 <i className="fas fa-list-alt me-2" />
//                 Select Categories
//               </label>
//               <Select
//                 options={categoryOptions}
//                 isMulti
//                 value={formData.categories}
//                 onChange={(selected) =>
//                   setFormData({ ...formData, categories: selected })
//                 }
//                 placeholder="Choose categories"
//                 className="react-select-container"
//                 classNamePrefix="react-select"
//                 styles={customSelectStyles}
//               />
//             </div>
//           </div>

//           {/* ✅ Tagline */}
//           <div className="form-group full-width">
//             <label>
//               <i className="fas fa-quote-left me-2" />
//               Tagline
//             </label>
//             <input
//               type="text"
//               name="tagline"
//               value={formData.tagline}
//               onChange={handleChange}
//               placeholder="e.g. Fresh Taste, Better Life"
//             />
//           </div>

//           {/* ✅ Upload Image (Main/Cover) */}
//           <div className="form-group full-width">
//             <label>
//               <i className="fas fa-image me-2" />
//               Upload Restaurant Image
//             </label>
//             <input type="file" accept="image/*" onChange={handleImageChange} />
//             {previewImage && (
//               <img
//                 src={previewImage}
//                 alt="Preview"
//                 style={{
//                   marginTop: "10px",
//                   width: "200px",
//                   borderRadius: "10px",
//                 }}
//               />
//             )}
//           </div>

//           {/* ✅ New Image Fields: Logo / Header / Footer */}
//           <div className="form-grid">
//             <div className="form-group">
//               <label>
//                 <i className="fas fa-tag me-2" />
//                 Upload Logo Image
//               </label>
//               <input type="file" accept="image/*" onChange={handleLogoChange} />
//               {previewLogo && (
//                 <img
//                   src={previewLogo}
//                   alt="Logo Preview"
//                   style={{ marginTop: 10, width: 120, borderRadius: 8 }}
//                 />
//               )}
//             </div>

//             <div className="form-group">
//               <label>
//                 <i className="fas fa-heading me-2" />
//                 Upload Header Image
//               </label>
//               <input type="file" accept="image/*" onChange={handleHeaderChange} />
//               {previewHeader && (
//                 <img
//                   src={previewHeader}
//                   alt="Header Preview"
//                   style={{ marginTop: 10, width: 200, borderRadius: 8 }}
//                 />
//               )}
//             </div>

//             <div className="form-group">
//               <label>
//                 <i className="fas fa-window-maximize me-2" />
//                 Upload Footer Image
//               </label>
//               <input type="file" accept="image/*" onChange={handleFooterChange} />
//               {previewFooter && (
//                 <img
//                   src={previewFooter}
//                   alt="Footer Preview"
//                   style={{ marginTop: 10, width: 200, borderRadius: 8 }}
//                 />
//               )}
//             </div>
//           </div>

//           {/* Address */}
//           <div className="form-group full-width">
//             <label>
//               <i className="fas fa-map-marker-alt me-2" />
//               Address Line 1 (Street/Colony)
//             </label>
//             <input
//               type="text"
//               value={formData.address.line1}
//               onChange={(e) => handleAddressChange("line1", e.target.value)}
//               className={errors.line1 && touched.line1 ? "error" : ""}
//             />
//             {errors.line1 && touched.line1 && <small>{errors.line1}</small>}
//           </div>

//           <div className="form-group full-width">
//             <label>
//               <i className="fas fa-building me-2" />
//               Address Line 2 (Apartment/Building)
//             </label>
//             <input
//               type="text"
//               value={formData.address.line2}
//               onChange={(e) => handleAddressChange("line2", e.target.value)}
//             />
//           </div>

//           {/* (Your original Country block kept) */}
//           <div className="form-group">
//             <label>
//               <i className="fas fa-globe-asia me-2" />
//               Country
//             </label>
//             <Select
//               options={countryList.map((c) => ({
//                 label: c.name,
//                 value: c.isoCode,
//               }))}
//               value={
//                 formData.address.country
//                   ? {
//                       label: Country.getCountryByCode(formData.address.country)
//                         ?.name,
//                       value: formData.address.country,
//                     }
//                   : null
//               }
//               onChange={(selected) =>
//                 handleAddressChange("country", selected.value)
//               }
//               placeholder="Select Country"
//               className="react-select-container"
//               classNamePrefix="react-select"
//             />
//           </div>

//           <div className="form-grid">
//             <div className="form-group">
//               <label>
//                 <i className="fas fa-map me-2" />
//                 State
//               </label>
//               <Select
//                 options={stateList.map((s) => ({
//                   label: s.name,
//                   value: s.isoCode,
//                 }))}
//                 value={
//                   formData.address.state
//                     ? {
//                         label: State.getStateByCodeAndCountry(
//                           formData.address.state,
//                           formData.address.country
//                         )?.name,
//                         value: formData.address.state,
//                       }
//                     : null
//                 }
//                 onChange={(selected) =>
//                   handleAddressChange("state", selected.value)
//                 }
//                 placeholder="Select State"
//                 className="react-select-container"
//                 classNamePrefix="react-select"
//               />
//             </div>

//             <div className="form-group">
//               <label>
//                 <i className="fas fa-city me-2" />
//                 City
//               </label>
//               <Select
//                 options={cityList.map((c) => ({
//                   label: c.name,
//                   value: c.name,
//                 }))}
//                 value={
//                   formData.address.city
//                     ? {
//                         label: formData.address.city,
//                         value: formData.address.city,
//                       }
//                     : null
//                 }
//                 onChange={(selected) =>
//                   handleAddressChange("city", selected.value)
//                 }
//                 placeholder="Select City"
//                 className="react-select-container"
//                 classNamePrefix="react-select"
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div className="form-group full-width">
//             <label>
//               <i className="fas fa-envelope me-2" />
//               Email Address
//             </label>
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

//           {/* Passwords */}
//           <div className="form-grid">
//             <div className="form-group">
//               <label>
//                 <i className="fas fa-lock me-2" />
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={errors.password && touched.password ? "error" : ""}
//               />
//               {errors.password && touched.password && (
//                 <small>{errors.password}</small>
//               )}
//             </div>

//             <div className="form-group">
//               <label>
//                 <i className="fas fa-lock me-2" />
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={
//                   errors.confirmPassword && touched.confirmPassword
//                     ? "error"
//                     : ""
//                 }
//               />
//               {errors.confirmPassword && touched.confirmPassword && (
//                 <small>{errors.confirmPassword}</small>
//               )}
//             </div>
//           </div>

//           <button type="submit">Register</button>
//         </form>
//       </div>

//       <div className="Footer">
//         <Footer />
//       </div>
//     </>
//   );
// }

// src/pages/RegisterRestaurant.jsx
import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "aos/dist/aos.css";
import AOS from "aos";
import { Country, State, City } from "country-state-city";
import "../styles/RegisterForm.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import Select from "react-select";
import Footer from "../components/Footer.jsx";
import HomeHeader from "../components/HomeHeader.jsx";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5001/api";

export default function RegisterRestaurant() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    contact: "",
    tables: "",
    categories: [],
    tagline: "",
    image: null,       // main/cover image
    logoImage: null,   // ✅ new
    headerImage: null, // ✅ new
    footerImage: null, // ✅ new
    address: { line1: "", line2: "", country: "", state: "", city: "" },
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewHeader, setPreviewHeader] = useState(null);
  const [previewFooter, setPreviewFooter] = useState(null);

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
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

  // ✅ keep everything the same, but force email to lowercase on input
  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === "email") value = value.toLowerCase();

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logoImage: file }));
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleHeaderChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, headerImage: file }));
      setPreviewHeader(URL.createObjectURL(file));
    }
  };

  const handleFooterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, footerImage: file }));
      setPreviewFooter(URL.createObjectURL(file));
    }
  };

  const validate = (data) => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!data.restaurantName) newErrors.restaurantName = "Restaurant name is required.";
    if (!data.ownerName) newErrors.ownerName = "Owner name is required.";
    else if (!nameRegex.test(data.ownerName)) newErrors.ownerName = "Owner name must contain letters only.";

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
      ownerName: true,
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
        const formDataToSend = new FormData();
        formDataToSend.append("restaurantName", formData.restaurantName);
        formDataToSend.append("ownerName", formData.ownerName);
        formDataToSend.append("contact", formData.contact);
        formDataToSend.append("tables", formData.tables);
        formDataToSend.append(
          "categories",
          JSON.stringify(formData.categories.map((c) => c.value))
        );
        formDataToSend.append("tagline", formData.tagline);
        formDataToSend.append("address", JSON.stringify(formData.address));
        formDataToSend.append("email", formData.email.toLowerCase()); // ✅ safety
        formDataToSend.append("password", formData.password);

        if (formData.image) formDataToSend.append("image", formData.image);
        if (formData.logoImage) formDataToSend.append("logoImage", formData.logoImage);
        if (formData.headerImage) formDataToSend.append("headerImage", formData.headerImage);
        if (formData.footerImage) formDataToSend.append("footerImage", formData.footerImage);

        const response = await axios.post(`${BASE_URL}/restaurants/register`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        alert(response.data.message || "Registered successfully! Please log in.");
        navigate("/");
      } catch (error) {
        console.error("Registration error:", error);
        alert(error.response?.data?.error || "Registration failed.");
      }
    } else {
      alert("Please fill the form correctly.");
    }
  };

  const categoryOptions = [
    { value: "starters", label: "Starters" },
    { value: "mains", label: "Mains" },
    { value: "desserts", label: "Desserts" },
    { value: "beverages", label: "Beverages" },
    { value: "snacks", label: "Snacks" },
    { value: "soups", label: "Soups" },
  ];

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      height: "52px",
      minHeight: "42px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      boxShadow: "none",
      "&:hover": { borderColor: "#999" },
    }),
    valueContainer: (base) => ({
      ...base,
      height: "42px",
      padding: "0 10px",
    }),
    input: (base) => ({ ...base, margin: 0, padding: 0 }),
    indicatorsContainer: (base) => ({ ...base, height: "42px" }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#f0f0f0",
      borderRadius: "6px",
      padding: "2px 4px",
    }),
  };

  return (
    <>
      <HomeHeader />

      <div className="register-page">
        <form className="register-form" onSubmit={handleSubmit} data-aos="fade-up">
          <h1 className="form-title">🍽️ Register As Restaurant</h1>
          <div className="title-divider" />

          {/* Basic Info */}
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
              <label><i className="fas fa-user me-2" />Owner Name</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.ownerName && touched.ownerName ? "error" : ""}
              />
              {errors.ownerName && touched.ownerName && <small>{errors.ownerName}</small>}
            </div>

            <div className="form-group">
              <label><i className="fas fa-phone me-2" />Contact Number</label>
              <PhoneInput
                country={"in"}
                value={formData.contact}
                onChange={handlePhoneChange}
                onBlur={() => setTouched((prev) => ({ ...prev, contact: true }))}
                inputClass={`custom-phone-input ${errors.contact && touched.contact ? "error" : ""}`}
                containerClass="phone-container"
                buttonClass="phone-flag-button"
                enableSearch
              />
              {errors.contact && touched.contact && <small>{errors.contact}</small>}
            </div>
          </div>

          {/* Tables & Categories */}
          <div className="form-grid">
            <div className="form-group">
              <label><i className="fas fa-table me-2" />Table Number</label>
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

            <div className="form-group">
              <label><i className="fas fa-list-alt me-2" />Select Categories</label>
              <Select
                options={categoryOptions}
                isMulti
                value={formData.categories}
                onChange={(selected) => setFormData({ ...formData, categories: selected })}
                placeholder="Choose categories"
                className="react-select-container"
                classNamePrefix="react-select"
                styles={customSelectStyles}
              />
            </div>
          </div>

          {/* Tagline */}
          <div className="form-group full-width">
            <label><i className="fas fa-quote-left me-2" />Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="e.g. Fresh Taste, Better Life"
            />
          </div>

          {/* Main/Cover Image */}
          <div className="form-group full-width">
            <label><i className="fas fa-image me-2" />Upload Restaurant Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{ marginTop: 10, width: 200, borderRadius: 10 }}
              />
            )}
          </div>

          {/* Logo / Header / Footer Images */}
          <div className="form-grid">
            <div className="form-group">
              <label><i className="fas fa-tag me-2" />Upload Logo Image</label>
              <input type="file" accept="image/*" onChange={handleLogoChange} />
              {previewLogo && (
                <img src={previewLogo} alt="Logo Preview" style={{ marginTop: 10, width: 120, borderRadius: 8 }} />
              )}
            </div>

            <div className="form-group">
              <label><i className="fas fa-heading me-2" />Upload Header Image</label>
              <input type="file" accept="image/*" onChange={handleHeaderChange} />
              {previewHeader && (
                <img src={previewHeader} alt="Header Preview" style={{ marginTop: 10, width: 200, borderRadius: 8 }} />
              )}
            </div>

            <div className="form-group">
              <label><i className="fas fa-window-maximize me-2" />Upload Footer Image</label>
              <input type="file" accept="image/*" onChange={handleFooterChange} />
              {previewFooter && (
                <img src={previewFooter} alt="Footer Preview" style={{ marginTop: 10, width: 200, borderRadius: 8 }} />
              )}
            </div>
          </div>

          {/* Address */}
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

          {/* Country */}
          <div className="form-group">
            <label><i className="fas fa-globe-asia me-2" />Country</label>
            <Select
              options={countryList.map((c) => ({ label: c.name, value: c.isoCode }))}
              value={
                formData.address.country
                  ? {
                      label: Country.getCountryByCode(formData.address.country)?.name,
                      value: formData.address.country,
                    }
                  : null
              }
              onChange={(selected) => handleAddressChange("country", selected.value)}
              placeholder="Select Country"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label><i className="fas fa-map me-2" />State</label>
              <Select
                options={stateList.map((s) => ({ label: s.name, value: s.isoCode }))}
                value={
                  formData.address.state
                    ? {
                        label: State.getStateByCodeAndCountry(
                          formData.address.state,
                          formData.address.country
                        )?.name,
                        value: formData.address.state,
                      }
                    : null
                }
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
                value={
                  formData.address.city
                    ? { label: formData.address.city, value: formData.address.city }
                    : null
                }
                onChange={(selected) => handleAddressChange("city", selected.value)}
                placeholder="Select City"
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group full-width">
            <label><i className="fas fa-envelope me-2" />Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange} // lowercases automatically
              onBlur={handleBlur}
              className={errors.email && touched.email ? "error" : ""}
              autoComplete="email"
            />
            {errors.email && touched.email && <small>{errors.email}</small>}
          </div>

          {/* Passwords */}
          <div className="form-grid">
            <div className="form-group">
              <label><i className="fas fa-lock me-2" />Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.password && touched.password ? "error" : ""}
                autoComplete="new-password"
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
                autoComplete="new-password"
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <small>{errors.confirmPassword}</small>
              )}
            </div>
          </div>

          <button type="submit">Register</button>
        </form>
      </div>

      <div className="Footer">
        <Footer />
      </div>
    </>
  );
}
