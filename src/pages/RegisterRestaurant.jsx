

//     //  This is The Working Version 

// // import React, { useState, useEffect } from "react";
// // import PhoneInput from "react-phone-input-2";
// // import "react-phone-input-2/lib/style.css";
// // import "aos/dist/aos.css";
// // import AOS from "aos";
// // import { Country, State, City } from "country-state-city";
// // import "../styles/RegisterForm.css";
// // import "@fortawesome/fontawesome-free/css/all.min.css";
// // import axios from "axios";
// // import Select from 'react-select';
// // import RegisterRestaurantHeader from "../components/RegisterRestaurantHeader.jsx";
// // import Footer from "../components/Footer.jsx";
// // import AdminLogin from "../pages/AdminLogin"; // adjust path if needed
// // import { FaUser, FaPhone } from "react-icons/fa";


// // const BASE_URL = "http://localhost:5001/api";

// // export default function RegisterRestaurant() {
// //   const [animate, setAnimate] = useState(false);
// //   const [formData, setFormData] = useState({
  

// //     restaurantName: "",
// //     RestaurantOwner: "",
// //     contact: "",
// //     tables: "",
// //     categories: [],
// //     address: {
// //       line1: "",
// //       line2: "",
// //       country: "",
// //       state: "",
// //       city: "",
// //     },
// //     email: "",
// //     password: "",
// //     confirmPassword: "",
// //   });
  

// //   const [touched, setTouched] = useState({});
// //   const [errors, setErrors] = useState({});
// //   const [showPasswordHint, setShowPasswordHint] = useState(false);
// //   const [showLoginModal, setShowLoginModal] = useState(false);


// //   const [countryList, setCountryList] = useState([]);
// //   const [stateList, setStateList] = useState([]);
// //   const [cityList, setCityList] = useState([]);

// //   useEffect(() => {
// //     AOS.init({ duration: 1000 });
// //     setCountryList(Country.getAllCountries());
// //     setAnimate(true);
// //   }, []);

// //   const handleAddressChange = (field, value) => {
// //     const updatedAddress = { ...formData.address, [field]: value };

// //     if (field === "country") {
// //       setStateList(State.getStatesOfCountry(value));
// //       updatedAddress.state = "";
// //       updatedAddress.city = "";
// //       setCityList([]);
// //     }

// //     if (field === "state") {
// //       setCityList(City.getCitiesOfState(formData.address.country, value));
// //       updatedAddress.city = "";
// //     }

// //     setFormData((prev) => ({ ...prev, address: updatedAddress }));
// //     validate({ ...formData, address: updatedAddress });
// //   };

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //     validate({ ...formData, [name]: value });
// //   };

// //   const handleBlur = (e) => {
// //     const { name } = e.target;
// //     setTouched((prev) => ({ ...prev, [name]: true }));
// //     validate(formData);
// //   };

// //   const handlePhoneChange = (value) => {
// //     setFormData((prev) => ({ ...prev, contact: value }));
// //     validate({ ...formData, contact: value });
// //     setTouched((prev) => ({ ...prev, contact: true }));
// //   };

// //   const validate = (data) => {
// //     const newErrors = {};
// //     const nameRegex = /^[A-Za-z]+$/;

// //     if (!data.restaurantName) newErrors.restaurantName = "Restaurant name is required.";
// //     if (!data.RestaurantOwner) newErrors.RestaurantOwner = "RestaurantOwner is required.";
// //     else if (!nameRegex.test(data.firstName)) newErrors.firstName = "First name must contain letters only.";
// //     if (!data.lastName) newErrors.lastName = "Last name is required.";
// //     else if (!nameRegex.test(data.lastName)) newErrors.lastName = "Last name must contain letters only.";
// //     if (!data.contact || data.contact.length < 10) newErrors.contact = "Valid phone number required.";

// //     const { line1, country, state, city } = data.address || {};
// //     if (!line1) newErrors.line1 = "Street/Colony is required.";
// //     if (!country) newErrors.country = "Country is required.";
// //     if (!state) newErrors.state = "State is required.";
// //     if (!city) newErrors.city = "City is required.";

// //     if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "Enter a valid email.";
// //     if (!data.password || data.password.length < 6) newErrors.password = "Minimum 6 characters.";
// //     if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
// //     if (!data.tables || data.tables <= 0) newErrors.tables = "Enter a valid number of tables.";

// //     setErrors(newErrors);
// //     return newErrors;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     const currentErrors = validate(formData);
// //     setTouched({
// //       restaurantName: true,
// //       RestaurantOwner: true,
// //       contact: true,
// //       tables: true,
// //       line1: true,
// //       country: true,
// //       state: true,
// //       city: true,
// //       email: true,
// //       password: true,
// //       confirmPassword: true,
// //     });

// //     if (Object.keys(currentErrors).length === 0) {
// //       try {
// //         const payload = {
// //           restaurantName: formData.restaurantName,
// //           firstName: formData.firstName,
// //           contact: formData.contact,
// //           tables: formData.tables,
// //           categories: formData.categories.map(c => c.value), // ✅ Send only values
// //           address: {
// //             line1: formData.address.line1,
// //             line2: formData.address.line2 || '',
// //             country: formData.address.country,
// //             state: formData.address.state,
// //             city: formData.address.city,
// //           },
// //           email: formData.email,
// //           password: formData.password,
// //         };

// //         const response = await axios.post(`${BASE_URL}/restaurants/register`, payload);

// //         const restaurantData = response.data.restaurant || payload;
// //         localStorage.setItem("restaurantEmail", restaurantData.email);
// //         localStorage.setItem("restaurantName", restaurantData.restaurantName);

// //         alert(response.data.message || "✅ Registered Successfully!");
// //       } catch (error) {
// //         console.error("Registration error:", error);
// //         alert(error.response?.data?.error || "Registration failed.");
// //       }
// //     } else {
// //       alert("Please First Fill the form.");
// //     }
// //   };
// //   const categoryOptions = [
// //   { value: "starters", label: "Starters" },
// //   { value: "mains", label: "Mains" },
// //   { value: "desserts", label: "Desserts" },
// //   { value: "beverages", label: "Beverages" },
// //   { value: "snacks", label: "Snacks" },
// //   { value: "soups", label: "Soups" }
// // ];


// //   return (
// //     <>
    
// //       {/* <RegisterRestaurantHeader /> */}
// //        <div className={`book-opening ${animate ? "animate" : ""}`}>
// //       <RegisterRestaurantHeader onAdminLoginClick={() => setShowLoginModal(true)} />

// //       {showLoginModal && (
// //   <div className="admin-login-overlay">
// //     <div className="admin-login-modal">
// //       <AdminLogin onClose={() => setShowLoginModal(false)} />
// //     </div>
// //   </div>
// // )}

// //       <div className="register-page">
// //         <form className="register-form" onSubmit={handleSubmit} data-aos="fade-up">
// //           <h1 className="form-title">🍽️ Register As Restaurant</h1>
// //           <div className="title-divider" />


// //           <div className="form-grid">
// //             <div className="form-group full-width">
// //               <label><i className="fas fa-store me-2" />Restaurant Name</label>
// //               <input
// //                 type="text"
// //                 name="restaurantName"
// //                 value={formData.restaurantName}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 className={errors.restaurantName && touched.restaurantName ? "error" : ""}
// //               />
// //               {errors.restaurantName && touched.restaurantName && <small>{errors.restaurantName}</small>}
// //             </div>

                
// //              {/* Owner Name + Contact Number Row */}
// //                  <div className="form-group">
// //             <label><i className="fas fa-user me-2" />Owner Name</label>
// //             <input
// //               type="text"
// //               name="OwnerName"
// //               value={formData.OwnerName}
// //               onChange={handleChange}
// //               onBlur={handleBlur}
// //               className={errors.firstName && touched.firstName ? "error" : ""}
// //             />
// //             {errors.OwnerName && touched.OwnerNameName && <small>{errors.OwnerName}</small>}
// //           </div>

  

// //                { <div className="form-group full-width">
// //                 <label><i className="fas fa-phone me-2" />Contact Number</label>
// //                  <PhoneInput
// //                  country={"in"}
// //                  value={formData.contact}
// //                 onChange={handlePhoneChange}
// //                 onBlur={() => setTouched((prev) => ({ ...prev, contact: true }))}
// //                 inputClass={`custom-phone-input ${errors.contact && touched.contact ? "error" : ""}`}
// //                  containerClass="phone-container"
// //                  buttonClass="phone-flag-button"
// //                  enableSearch
// //                  />
// //                 {errors.contact && touched.contact && <small>{errors.contact}</small>}
// //                  </div> }


// //             <div className="form-group full-width">
// //               <label><i className="fas fa-table me-2" />Table Number</label>
// //               <input
// //                 type="number"
// //                 name="tables"
// //                 value={formData.tables}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 className={errors.tables && touched.tables ? "error" : ""}
// //               />
// //               {errors.tables && touched.tables && <small>{errors.tables}</small>}
// //             </div>
// //           </div>

// //           <div className="form-group full-width">
// //   <label><i className="fas fa-list-alt me-2" />Select Categories</label>
// //   <Select
// //     options={categoryOptions}
// //     isMulti
// //     value={formData.categories}
// //     onChange={(selected) => setFormData({ ...formData, categories: selected })}
// //     placeholder="Choose categories"
// //     className="react-select-container"
// //     classNamePrefix="react-select"
// //   />
// // </div>


// //           <div className="form-group full-width">
// //             <label><i className="fas fa-map-marker-alt me-2" />Address Line 1 (Street/Colony)</label>
// //             <input
// //               type="text"
// //               value={formData.address.line1}
// //               onChange={(e) => handleAddressChange("line1", e.target.value)}
// //               className={errors.line1 && touched.line1 ? "error" : ""}
// //             />
// //             {errors.line1 && touched.line1 && <small>{errors.line1}</small>}
// //           </div>

// //           <div className="form-group full-width">
// //             <label><i className="fas fa-building me-2" />Address Line 2 (Apartment/Building)</label>
// //             <input
// //               type="text"
// //               value={formData.address.line2}
// //               onChange={(e) => handleAddressChange("line2", e.target.value)}
// //             />
// //           </div>

// //           <div className="form-group">
// //             <label><i className="fas fa-globe-asia me-2" />Country</label>
// //             <Select
// //               options={countryList.map((c) => ({ label: c.name, value: c.isoCode }))}
// //               value={formData.address.country ? { label: Country.getCountryByCode(formData.address.country)?.name, value: formData.address.country } : null}
// //               onChange={(selected) => handleAddressChange("country", selected.value)}
// //               placeholder="Select Country"
// //               className="react-select-container"
// //               classNamePrefix="react-select"
// //             />
// //           </div>

// //           <div className="form-grid">
// //   <div className="form-group">
// //     <label><i className="fas fa-map me-2" />State</label>
// //     <Select
// //       options={stateList.map((s) => ({ label: s.name, value: s.isoCode }))}
// //       value={formData.address.state ? { label: State.getStateByCodeAndCountry(formData.address.state, formData.address.country)?.name, value: formData.address.state } : null}
// //       onChange={(selected) => handleAddressChange("state", selected.value)}
// //       placeholder="Select State"
// //       className="react-select-container"
// //       classNamePrefix="react-select"
// //     />
// //   </div>

// //   <div className="form-group">
// //     <label><i className="fas fa-city me-2" />City</label>
// //     <Select
// //       options={cityList.map((c) => ({ label: c.name, value: c.name }))}
// //       value={formData.address.city ? { label: formData.address.city, value: formData.address.city } : null}
// //       onChange={(selected) => handleAddressChange("city", selected.value)}
// //       placeholder="Select City"
// //       className="react-select-container"
// //       classNamePrefix="react-select"
// //     />
// //   </div>
// // </div>

// //           <div className="form-group full-width">
// //             <label><i className="fas fa-envelope me-2" />Email Address</label>
// //             <input
// //               type="email"
// //               name="email"
// //               value={formData.email}
// //               onChange={handleChange}
// //               onBlur={handleBlur}
// //               className={errors.email && touched.email ? "error" : ""}
// //             />
// //             {errors.email && touched.email && <small>{errors.email}</small>}
// //           </div>

// //           <div className="form-grid">
// //             <div className="form-group">
// //               <label><i className="fas fa-lock me-2" />Password</label>
// //               <input
// //                 type="password"
// //                 name="password"
// //                 value={formData.password}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 onFocus={() => setShowPasswordHint(true)}
// //                 className={errors.password && touched.password ? "error" : ""}
// //               />
// //               {errors.password && touched.password && <small>{errors.password}</small>}
// //             </div>

// //             <div className="form-group">
// //               <label><i className="fas fa-lock me-2" />Confirm Password</label>
// //               <input
// //                 type="password"
// //                 name="confirmPassword"
// //                 value={formData.confirmPassword}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 className={errors.confirmPassword && touched.confirmPassword ? "error" : ""}
// //               />
// //               {errors.confirmPassword && touched.confirmPassword && <small>{errors.confirmPassword}</small>}
// //             </div>
            
// //           </div>
          

// //           <button type="submit">Register</button>
          
// //         </form>
      
// //       </div>
// //         <div className="Footer">
// //        <Footer/>
// //      </div>
// //      </div>
// //     </>
// //   );
// // }




// src/pages/RegisterRestaurant.

// import React, { useState, useEffect } from "react";
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
//     image: null,       // main/cover image
//     logoImage: null,   // ✅ new
//     headerImage: null, // ✅ new
//     footerImage: null, // ✅ new
//     address: { line1: "", line2: "", country: "", state: "", city: "" },
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [previewImage, setPreviewImage] = useState(null);
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
//   const validatePassword = (password) => {
//     const minLength = /.{6,}/;
//     const uppercase = /[A-Z]/;
//     const lowercase = /[a-z]/;
//     const number = /[0-9]/;
//     const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
//     return (
//       minLength.test(password) &&
//       uppercase.test(password) &&
//       lowercase.test(password) &&
//       number.test(password) &&
//       specialChar.test(password)
//     );
//   };
//   const isValidImageType = (file) => {
//     if (!file) return false;
//     const validTypes = ["image/jpeg", "image/jpg", "image/png"];
//     return validTypes.includes(file.type);
//   };
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

//   // ✅ keep everything the same, but force email to lowercase on input
//   const handleChange = (e) => {
//     const { name } = e.target;
//     let { value } = e.target;

//     if (name === "email") value = value.toLowerCase();

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
//    const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file && !isValidImageType(file)) {
//     setErrors((prev) => ({ ...prev, image: "Only JPG, JPEG, PNG files are allowed." }));
//       e.target.value = null;
//       return;
//     }
//      setErrors((prev) => ({ ...prev, image: "" }));
//     if (file) {
//       setFormData((prev) => ({ ...prev, image: file }));
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (file && !isValidImageType(file)) {
//     setErrors((prev) => ({ ...prev, image: "Only JPG, JPEG, PNG files are allowed." }));
//       e.target.value = null;
//       return;
//     }
//     setErrors((prev) => ({ ...prev, image: "" }));
//     if (file) {
//       setFormData((prev) => ({ ...prev, logoImage: file }));
//       setPreviewLogo(URL.createObjectURL(file));
//     }
//   };

//   const handleHeaderChange = (e) => {
//     const file = e.target.files[0];
//     if (file && !isValidImageType(file)) {
//     setErrors((prev) => ({ ...prev, image: "Only JPG, JPEG, PNG files are allowed." }));
//       e.target.value = null;
//       return;
//     }
//     setErrors((prev) => ({ ...prev, image: "" }));
//     if (file) {
//       setFormData((prev) => ({ ...prev, headerImage: file }));
//       setPreviewHeader(URL.createObjectURL(file));
//     }
//   };

//   const handleFooterChange = (e) => {
//     const file = e.target.files[0];
//     if (file && !isValidImageType(file)) {
//     setErrors((prev) => ({ ...prev, image: "Only JPG, JPEG, PNG files are allowed." }));
//       e.target.value = null;
//       return;
//     }
//     setErrors((prev) => ({ ...prev, image: "" }));
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
//    if (!data.password || !validatePassword(data.password))
//       newErrors.password =
//         "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.";

//     if (data.password !== data.confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match.";

//     if (!data.tables || data.tables <= 0)
//       newErrors.tables = "Enter a valid number of tables.";
//     if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "Enter a valid email.";
//     if (!data.password || data.password.length < 6) newErrors.password = "Minimum 6 characters.";
//     if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
//     if (!data.tables || data.tables <= 0) newErrors.tables = "Enter a valid number of tables.";


//     setErrors(newErrors);
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const currentErrors = validate(formData);

//     setTouched({
//       restaurantName: true,
//       ownerName: true,
//       contact: true,
//       tables: true,
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
//         const formDataToSend = new FormData();
//         formDataToSend.append("restaurantName", formData.restaurantName);
//         formDataToSend.append("ownerName", formData.ownerName);
//         formDataToSend.append("contact", formData.contact);
//         formDataToSend.append("tables", formData.tables);
//         formDataToSend.append(
//           "categories",
//           JSON.stringify(formData.categories.map((c) => c.value))
//         );
//         formDataToSend.append("tagline", formData.tagline);
//         formDataToSend.append("address", JSON.stringify(formData.address));
//         formDataToSend.append("email", formData.email.toLowerCase()); // ✅ safety
//         formDataToSend.append("password", formData.password);

//         if (formData.image) formDataToSend.append("image", formData.image);
//         if (formData.logoImage) formDataToSend.append("logoImage", formData.logoImage);
//         if (formData.headerImage) formDataToSend.append("headerImage", formData.headerImage);
//         if (formData.footerImage) formDataToSend.append("footerImage", formData.footerImage);

//         const response = await axios.post(`${BASE_URL}/restaurants/register`, formDataToSend, {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
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
//     input: (base) => ({ ...base, margin: 0, padding: 0 }),
//     indicatorsContainer: (base) => ({ ...base, height: "42px" }),
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
//         <form className="register-form" onSubmit={handleSubmit} data-aos="fade-up">
//           <h1 className="form-title">🍽️ Register As Restaurant</h1>
//           <div className="title-divider" />

//           {/* Basic Info */}
//           <div className="form-grid">
//             <div className="form-group full-width">
//               <label><i className="fas fa-store me-2" />Restaurant Name</label>
//               <input
//                 type="text"
//                 name="restaurantName"
//                 value={formData.restaurantName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={errors.restaurantName && touched.restaurantName ? "error" : ""}
//               />
//               {errors.restaurantName && touched.restaurantName && <small>{errors.restaurantName}</small>}
//             </div>

//             <div className="form-group">
//               <label><i className="fas fa-user me-2" />Owner Name</label>
//               <input
//                 type="text"
//                 name="ownerName"
//                 value={formData.ownerName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={errors.ownerName && touched.ownerName ? "error" : ""}
//               />
//               {errors.ownerName && touched.ownerName && <small>{errors.ownerName}</small>}
//             </div>

//             <div className="form-group">
//               <label><i className="fas fa-phone me-2" />Contact Number</label>
//               <PhoneInput
//                 country={"in"}
//                 value={formData.contact}
//                 onChange={handlePhoneChange}
//                 onBlur={() => setTouched((prev) => ({ ...prev, contact: true }))}
//                 inputClass={`custom-phone-input ${errors.contact && touched.contact ? "error" : ""}`}
//                 containerClass="phone-container"
//                 buttonClass="phone-flag-button"
//                 enableSearch
//               />
//               {errors.contact && touched.contact && <small>{errors.contact}</small>}
//             </div>
//           </div>

//           {/* Tables & Categories */}
//           <div className="form-grid">
//             <div className="form-group">
//               <label><i className="fas fa-table me-2" />Table Number</label>
//               <input
//                 type="number"
//                 name="tables"
//                 value={formData.tables}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={errors.tables && touched.tables ? "error" : ""}
//               />
//               {errors.tables && touched.tables && <small>{errors.tables}</small>}
//             </div>

//             <div className="form-group">
//               <label><i className="fas fa-list-alt me-2" />Select Categories</label>
//               <Select
//                 options={categoryOptions}
//                 isMulti
//                 value={formData.categories}
//                 onChange={(selected) => setFormData({ ...formData, categories: selected })}
//                 placeholder="Choose categories"
//                 className="react-select-container"
//                 classNamePrefix="react-select"
//                 styles={customSelectStyles}
//               />
//             </div>
//           </div>

//           {/* Tagline */}
//           <div className="form-group full-width">
//             <label><i className="fas fa-quote-left me-2" />Tagline</label>
//             <input
//               type="text"
//               name="tagline"
//               value={formData.tagline}
//               onChange={handleChange}
//               placeholder="e.g. Fresh Taste, Better Life"
//             />
//           </div>

//           {/* Main/Cover Image */}
//           <div className="form-group full-width">
//             <label><i className="fas fa-image me-2" />Upload Restaurant Image</label>
//             <input type="file" accept="image/*" onChange={handleImageChange} />
//             {previewImage && (
//               <img
//                 src={previewImage}
//                 alt="Preview"
//                 style={{ marginTop: 10, width: 200, borderRadius: 10 }}
//               />
//             )}
//           </div>

// {/* Logo Image */}
// <div className="form-group">
//   <label>
//     <i className="fas fa-tag me-2" />
//     Upload Logo Image
//   </label>
//   <input type="file" accept="image/*" onChange={handleLogoChange} />
//   {errors.logoImage && <small>{errors.logoImage}</small>}
//   {previewLogo && (
//     <img src={previewLogo} alt="Logo Preview" style={{ marginTop: 10, width: 120, borderRadius: 8 }} />
//   )}
// </div>

//             <div className="form-group">
//               <label><i className="fas fa-heading me-2" />Upload Header Image</label>
//               <input type="file" accept="image/*" onChange={handleHeaderChange} />
//               {previewHeader && (
//                 <img src={previewHeader} alt="Header Preview" style={{ marginTop: 10, width: 200, borderRadius: 8 }} />
//               )}
//             </div>

// {/* Footer Image */}
// <div className="form-group">
//   <label>
//     <i className="fas fa-window-maximize me-2" />
//     Upload Footer Image
//   </label>
//   <input type="file" accept="image/*" onChange={handleFooterChange} />
//   {errors.footerImage && <small>{errors.footerImage}</small>}
//   {previewFooter && (
//     <img src={previewFooter} alt="Footer Preview" style={{ marginTop: 10, width: 200, borderRadius: 8 }} />
//   )}
// </div>


//           {/* Address */}
//           <div className="form-group full-width">
//             <label><i className="fas fa-map-marker-alt me-2" />Address Line 1 (Street/Colony)</label>
//             <input
//               type="text"
//               value={formData.address.line1}
//               onChange={(e) => handleAddressChange("line1", e.target.value)}
//               className={errors.line1 && touched.line1 ? "error" : ""}
//             />
//             {errors.line1 && touched.line1 && <small>{errors.line1}</small>}
//           </div>

//           <div className="form-group full-width">
//             <label><i className="fas fa-building me-2" />Address Line 2 (Apartment/Building)</label>
//             <input
//               type="text"
//               value={formData.address.line2}
//               onChange={(e) => handleAddressChange("line2", e.target.value)}
//             />
//           </div>
//           {/* Country */}
//           <div className="form-group">
//             <label><i className="fas fa-globe-asia me-2" />Country</label>
//             <Select
//               options={countryList.map((c) => ({ label: c.name, value: c.isoCode }))}
//               value={
//                 formData.address.country
//                   ? {
//                       label: Country.getCountryByCode(formData.address.country)?.name,
//                       value: formData.address.country,
//                     }
//                   : null
//               }
//               onChange={(selected) => handleAddressChange("country", selected.value)}
//               placeholder="Select Country"
//               className="react-select-container"
//               classNamePrefix="react-select"
//               styles={customSelectStyles}
//             />
//           </div>

//           <div className="form-grid">
//             <div className="form-group">
//               <label><i className="fas fa-map me-2" />State</label>
//               <Select
//                 options={stateList.map((s) => ({ label: s.name, value: s.isoCode }))}
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
//                 onChange={(selected) => handleAddressChange("state", selected.value)}
//                 placeholder="Select State"
//                 className="react-select-container"
//                 classNamePrefix="react-select"
//                 styles={customSelectStyles}
//               />
//             </div>

//             <div className="form-group">
//               <label><i className="fas fa-city me-2" />City</label>
//               <Select
//                 options={cityList.map((c) => ({ label: c.name, value: c.name }))}
//                 value={
//                   formData.address.city
//                     ? { label: formData.address.city, value: formData.address.city }
//                     : null
//                 }
//                 onChange={(selected) => handleAddressChange("city", selected.value)}
//                 placeholder="Select City"
//                 className="react-select-container"
//                 classNamePrefix="react-select"
//                 styles={customSelectStyles}
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div className="form-group full-width">
//             <label><i className="fas fa-envelope me-2" />Email Address</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange} // lowercases automatically
//               onBlur={handleBlur}
//               className={errors.email && touched.email ? "error" : ""}
//               autoComplete="email"
//             />
//             {errors.email && touched.email && <small>{errors.email}</small>}
//           </div>

//           {/* Passwords */}
//            <div className="form-group full-width">
//             <label>Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className={errors.password ? "error" : ""}
//             />
//             {errors.password && <small>{errors.password}</small>}
//           </div>

//           {/* Confirm Password */}
//           <div className="form-group full-width">
//             <label>Confirm Password</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className={errors.confirmPassword ? "error" : ""}
//             />
//             {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
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






// import React, { useState, useEffect } from "react";
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
//     image: null,       // main/cover image
//     logoImage: null,   // ✅ new
//     headerImage: null, // ✅ new
//     footerImage: null, // ✅ new
//     address: { line1: "", line2: "", country: "", state: "", city: "" },
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [previewImage, setPreviewImage] = useState(null);
//   const [previewLogo, setPreviewLogo] = useState(null);
//   const [previewHeader, setPreviewHeader] = useState(null);
//   const [previewFooter, setPreviewFooter] = useState(null);
//   const [activeStep, setActiveStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [touched, setTouched] = useState({});
//   const [errors, setErrors] = useState({});
//   const [countryList, setCountryList] = useState([]);
//   const [stateList, setStateList] = useState([]);
//   const [cityList, setCityList] = useState([]);

//   useEffect(() => {
//     AOS.init({ duration: 1000 });
//     setCountryList(Country.getAllCountries());
//   }, []);

//   const validatePassword = (password) => {
//     const minLength = /.{6,}/;
//     const uppercase = /[A-Z]/;
//     const lowercase = /[a-z]/;
//     const number = /[0-9]/;
//     const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
//     return (
//       minLength.test(password) &&
//       uppercase.test(password) &&
//       lowercase.test(password) &&
//       number.test(password) &&
//       specialChar.test(password)
//     );
//   };

//   const isValidImageType = (file) => {
//     if (!file) return false;
//     const validTypes = ["image/jpeg", "image/jpg", "image/png"];
//     return validTypes.includes(file.type);
//   };

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
//     const { name } = e.target;
//     let { value } = e.target;

//     if (name === "email") value = value.toLowerCase();

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
//     if (file && !isValidImageType(file)) {
//       setErrors((prev) => ({ ...prev, image: "Only JPG, JPEG, PNG files are allowed." }));
//       e.target.value = null;
//       return;
//     }
//     setErrors((prev) => ({ ...prev, image: "" }));
//     if (file) {
//       setFormData((prev) => ({ ...prev, image: file }));
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (file && !isValidImageType(file)) {
//       setErrors((prev) => ({ ...prev, logoImage: "Only JPG, JPEG, PNG files are allowed." }));
//       e.target.value = null;
//       return;
//     }
//     setErrors((prev) => ({ ...prev, logoImage: "" }));
//     if (file) {
//       setFormData((prev) => ({ ...prev, logoImage: file }));
//       setPreviewLogo(URL.createObjectURL(file));
//     }
//   };

//   const handleHeaderChange = (e) => {
//     const file = e.target.files[0];
//     if (file && !isValidImageType(file)) {
//       setErrors((prev) => ({ ...prev, headerImage: "Only JPG, JPEG, PNG files are allowed." }));
//       e.target.value = null;
//       return;
//     }
//     setErrors((prev) => ({ ...prev, headerImage: "" }));
//     if (file) {
//       setFormData((prev) => ({ ...prev, headerImage: file }));
//       setPreviewHeader(URL.createObjectURL(file));
//     }
//   };

//   const handleFooterChange = (e) => {
//     const file = e.target.files[0];
//     if (file && !isValidImageType(file)) {
//       setErrors((prev) => ({ ...prev, footerImage: "Only JPG, JPEG, PNG files are allowed." }));
//       e.target.value = null;
//       return;
//     }
//     setErrors((prev) => ({ ...prev, footerImage: "" }));
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
//     if (!data.password || !validatePassword(data.password))
//       newErrors.password =
//         "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.";

//     if (data.password !== data.confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match.";

//     if (!data.tables || data.tables <= 0)
//       newErrors.tables = "Enter a valid number of tables.";

//     setErrors(newErrors);
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     const currentErrors = validate(formData);

//     setTouched({
//       restaurantName: true,
//       ownerName: true,
//       contact: true,
//       tables: true,
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
//         const formDataToSend = new FormData();
//         formDataToSend.append("restaurantName", formData.restaurantName);
//         formDataToSend.append("ownerName", formData.ownerName);
//         formDataToSend.append("contact", formData.contact);
//         formDataToSend.append("tables", formData.tables);
//         formDataToSend.append(
//           "categories",
//           JSON.stringify(formData.categories.map((c) => c.value))
//         );
//         formDataToSend.append("tagline", formData.tagline);
//         formDataToSend.append("address", JSON.stringify(formData.address));
//         formDataToSend.append("email", formData.email.toLowerCase());
//         formDataToSend.append("password", formData.password);

//         if (formData.image) formDataToSend.append("image", formData.image);
//         if (formData.logoImage) formDataToSend.append("logoImage", formData.logoImage);
//         if (formData.headerImage) formDataToSend.append("headerImage", formData.headerImage);
//         if (formData.footerImage) formDataToSend.append("footerImage", formData.footerImage);

//         const response = await axios.post(`${BASE_URL}/restaurants/register`, formDataToSend, {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
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
//     setIsSubmitting(false);
//   };

//   const nextStep = () => {
//     if (activeStep < 4) {
//       setActiveStep(activeStep + 1);
//       window.scrollTo(0, 0);
//     }
//   };

//   const prevStep = () => {
//     if (activeStep > 1) {
//       setActiveStep(activeStep - 1);
//       window.scrollTo(0, 0);
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

//   const customSelectStyles = {
//     control: (base, state) => ({
//       ...base,
//       height: "52px",
//       minHeight: "42px",
//       borderRadius: "12px",
//       border: state.isFocused ? "2px solid #4f46e5" : "1px solid #d1d5db",
//       boxShadow: state.isFocused ? "0 0 0 3px rgba(79, 70, 229, 0.1)" : "none",
//       "&:hover": { borderColor: state.isFocused ? "#4f46e5" : "#9ca3af" },
//       transition: "all 0.2s ease",
//       backgroundColor: "#f9fafb",
//     }),
//     valueContainer: (base) => ({
//       ...base,
//       height: "42px",
//       padding: "0 12px",
//     }),
//     input: (base) => ({ ...base, margin: 0, padding: 0 }),
//     indicatorsContainer: (base) => ({ ...base, height: "42px" }),
//     multiValue: (base) => ({
//       ...base,
//       backgroundColor: "#eef2ff",
//       borderRadius: "6px",
//       padding: "2px 6px",
//     }),
//     menu: (base) => ({
//       ...base,
//       borderRadius: "12px",
//       overflow: "hidden",
//       boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//     }),
//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isSelected ? "#4f46e5" : state.isFocused ? "#eef2ff" : "white",
//       color: state.isSelected ? "white" : "#1f2937",
//       "&:active": {
//         backgroundColor: state.isSelected ? "#4f46e5" : "#e5e7eb",
//       },
//     }),
//   };

//   const steps = [
//     { number: 1, title: "Basic Info" },
//     { number: 2, title: "Restaurant Details" },
//     { number: 3, title: "Location" },
//     { number: 4, title: "Account Setup" },
//   ];

//   return (
//     <>
//       <HomeHeader />

//       <div className="register-page">
//         <div className="register-container">
//           <div className="register-header">
//             <h1>Create Your Restaurant Account</h1>
//             <p>Join thousands of restaurants growing their business with us</p>
//           </div>

//           <div className="progress-container">
//             <div className="progress-steps">
//               {steps.map((step) => (
//                 <div key={step.number} className={`step ${activeStep >= step.number ? "active" : ""}`}>
//                   <div className="step-number">{step.number}</div>
//                   <span className="step-title">{step.title}</span>
//                 </div>
//               ))}
//               <div className="progress-bar">
//                 <div 
//                   className="progress-fill" 
//                   style={{ width: `${(activeStep - 1) * 33.33}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>

//           <form className="register-form" onSubmit={handleSubmit} data-aos="fade-up">
//             {activeStep === 1 && (
//               <div className="form-step">
//                 <h2 className="step-heading">Basic Information</h2>
//                 <p className="step-description">Tell us about your restaurant</p>
                
//                 <div className="form-grid">
//                   <div className="form-group full-width">
//                     <label><i className="fas fa-store me-2" />Restaurant Name</label>
//                     <input
//                       type="text"
//                       name="restaurantName"
//                       value={formData.restaurantName}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       className={errors.restaurantName && touched.restaurantName ? "error" : ""}
//                       placeholder="Enter your restaurant name"
//                     />
//                     {errors.restaurantName && touched.restaurantName && <small>{errors.restaurantName}</small>}
//                   </div>

//                   <div className="form-group">
//                     <label><i className="fas fa-user me-2" />Owner Name</label>
//                     <input
//                       type="text"
//                       name="ownerName"
//                       value={formData.ownerName}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       className={errors.ownerName && touched.ownerName ? "error" : ""}
//                       placeholder="Full name"
//                     />
//                     {errors.ownerName && touched.ownerName && <small>{errors.ownerName}</small>}
//                   </div>

//                   <div className="form-group">
//                     <label><i className="fas fa-phone me-2" />Contact Number</label>
//                     <PhoneInput
//                       country={"in"}
//                       value={formData.contact}
//                       onChange={handlePhoneChange}
//                       onBlur={() => setTouched((prev) => ({ ...prev, contact: true }))}
//                       inputClass={`custom-phone-input ${errors.contact && touched.contact ? "error" : ""}`}
//                       containerClass="phone-container"
//                       buttonClass="phone-flag-button"
//                       enableSearch
//                       placeholder="Enter phone number"
//                     />
//                     {errors.contact && touched.contact && <small>{errors.contact}</small>}
//                   </div>
//                 </div>

//                 <div className="form-actions">
//                   <button type="button" className="btn-next" onClick={nextStep}>
//                     Next <i className="fas fa-arrow-right ms-2"></i>
//                   </button>
//                 </div>
//               </div>
//             )}

//             {activeStep === 2 && (
//               <div className="form-step">
//                 <h2 className="step-heading">Restaurant Details</h2>
//                 <p className="step-description">Customize your restaurant profile</p>
                
//                 <div className="form-grid">
//                   <div className="form-group">
//                     <label><i className="fas fa-table me-2" />Number of Tables</label>
//                     <input
//                       type="number"
//                       name="tables"
//                       value={formData.tables}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       className={errors.tables && touched.tables ? "error" : ""}
//                       placeholder="e.g. 10"
//                     />
//                     {errors.tables && touched.tables && <small>{errors.tables}</small>}
//                   </div>

//                   <div className="form-group">
//                     <label><i className="fas fa-list-alt me-2" />Menu Categories</label>
//                     <Select
//                       options={categoryOptions}
//                       isMulti
//                       value={formData.categories}
//                       onChange={(selected) => setFormData({ ...formData, categories: selected })}
//                       placeholder="Select categories"
//                       className="react-select-container"
//                       classNamePrefix="react-select"
//                       styles={customSelectStyles}
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group full-width">
//                   <label><i className="fas fa-quote-left me-2" />Tagline</label>
//                   <input
//                     type="text"
//                     name="tagline"
//                     value={formData.tagline}
//                     onChange={handleChange}
//                     placeholder="e.g. Fresh Taste, Better Life"
//                   />
//                 </div>

//                 <div className="image-upload-section">
//                   <h3>Upload Images</h3>
//                   <div className="image-grid">
//                     <div className="image-upload-box">
//                       <label>
//                         <i className="fas fa-image me-2" />Cover Image
//                         <input type="file" accept="image/*" onChange={handleImageChange} />
//                         <div className="upload-placeholder">
//                           {previewImage ? (
//                             <img src={previewImage} alt="Preview" />
//                           ) : (
//                             <>
//                               <i className="fas fa-cloud-upload-alt"></i>
//                               <span>Click to upload</span>
//                             </>
//                           )}
//                         </div>
//                       </label>
//                     </div>

//                     <div className="image-upload-box">
//                       <label>
//                         <i className="fas fa-tag me-2" />Logo
//                         <input type="file" accept="image/*" onChange={handleLogoChange} />
//                         <div className="upload-placeholder">
//                           {previewLogo ? (
//                             <img src={previewLogo} alt="Logo Preview" />
//                           ) : (
//                             <>
//                               <i className="fas fa-cloud-upload-alt"></i>
//                               <span>Click to upload</span>
//                             </>
//                           )}
//                         </div>
//                       </label>
//                     </div>

//                     <div className="image-upload-box">
//                       <label>
//                         <i className="fas fa-heading me-2" />Header Image
//                         <input type="file" accept="image/*" onChange={handleHeaderChange} />
//                         <div className="upload-placeholder">
//                           {previewHeader ? (
//                             <img src={previewHeader} alt="Header Preview" />
//                           ) : (
//                             <>
//                               <i className="fas fa-cloud-upload-alt"></i>
//                               <span>Click to upload</span>
//                             </>
//                           )}
//                         </div>
//                       </label>
//                     </div>

//                     <div className="image-upload-box">
//                       <label>
//                         <i className="fas fa-window-maximize me-2" />Footer Image
//                         <input type="file" accept="image/*" onChange={handleFooterChange} />
//                         <div className="upload-placeholder">
//                           {previewFooter ? (
//                             <img src={previewFooter} alt="Footer Preview" />
//                           ) : (
//                             <>
//                               <i className="fas fa-cloud-upload-alt"></i>
//                               <span>Click to upload</span>
//                             </>
//                           )}
//                         </div>
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="form-actions">
//                   <button type="button" className="btn-prev" onClick={prevStep}>
//                     <i className="fas fa-arrow-left me-2"></i> Back
//                   </button>
//                   <button type="button" className="btn-next" onClick={nextStep}>
//                     Next <i className="fas fa-arrow-right ms-2"></i>
//                   </button>
//                 </div>
//               </div>
//             )}

//             {activeStep === 3 && (
//               <div className="form-step">
//                 <h2 className="step-heading">Location Details</h2>
//                 <p className="step-description">Where is your restaurant located?</p>
                
//                 <div className="form-group full-width">
//                   <label><i className="fas fa-map-marker-alt me-2" />Address Line 1 (Street/Colony)</label>
//                   <input
//                     type="text"
//                     value={formData.address.line1}
//                     onChange={(e) => handleAddressChange("line1", e.target.value)}
//                     className={errors.line1 && touched.line1 ? "error" : ""}
//                     placeholder="Street address, colony, etc."
//                   />
//                   {errors.line1 && touched.line1 && <small>{errors.line1}</small>}
//                 </div>

//                 <div className="form-group full-width">
//                   <label><i className="fas fa-building me-2" />Address Line 2 (Apartment/Building)</label>
//                   <input
//                     type="text"
//                     value={formData.address.line2}
//                     onChange={(e) => handleAddressChange("line2", e.target.value)}
//                     placeholder="Apartment, suite, building, etc."
//                   />
//                 </div>

//                 <div className="form-grid">
//                   <div className="form-group">
//                     <label><i className="fas fa-globe-asia me-2" />Country</label>
//                     <Select
//                       options={countryList.map((c) => ({ label: c.name, value: c.isoCode }))}
//                       value={
//                         formData.address.country
//                           ? {
//                               label: Country.getCountryByCode(formData.address.country)?.name,
//                               value: formData.address.country,
//                             }
//                           : null
//                       }
//                       onChange={(selected) => handleAddressChange("country", selected.value)}
//                       placeholder="Select Country"
//                       className="react-select-container"
//                       classNamePrefix="react-select"
//                       styles={customSelectStyles}
//                     />
//                     {errors.country && touched.country && <small>{errors.country}</small>}
//                   </div>

//                   <div className="form-group">
//                     <label><i className="fas fa-map me-2" />State</label>
//                     <Select
//                       options={stateList.map((s) => ({ label: s.name, value: s.isoCode }))}
//                       value={
//                         formData.address.state
//                           ? {
//                               label: State.getStateByCodeAndCountry(
//                                 formData.address.state,
//                                 formData.address.country
//                               )?.name,
//                               value: formData.address.state,
//                             }
//                           : null
//                       }
//                       onChange={(selected) => handleAddressChange("state", selected.value)}
//                       placeholder="Select State"
//                       className="react-select-container"
//                       classNamePrefix="react-select"
//                       styles={customSelectStyles}
//                     />
//                     {errors.state && touched.state && <small>{errors.state}</small>}
//                   </div>

//                   <div className="form-group">
//                     <label><i className="fas fa-city me-2" />City</label>
//                     <Select
//                       options={cityList.map((c) => ({ label: c.name, value: c.name }))}
//                       value={
//                         formData.address.city
//                           ? { label: formData.address.city, value: formData.address.city }
//                           : null
//                       }
//                       onChange={(selected) => handleAddressChange("city", selected.value)}
//                       placeholder="Select City"
//                       className="react-select-container"
//                       classNamePrefix="react-select"
//                       styles={customSelectStyles}
//                     />
//                     {errors.city && touched.city && <small>{errors.city}</small>}
//                   </div>
//                 </div>

//                 <div className="form-actions">
//                   <button type="button" className="btn-prev" onClick={prevStep}>
//                     <i className="fas fa-arrow-left me-2"></i> Back
//                   </button>
//                   <button type="button" className="btn-next" onClick={nextStep}>
//                     Next <i className="fas fa-arrow-right ms-2"></i>
//                   </button>
//                 </div>
//               </div>
//             )}

//             {activeStep === 4 && (
//               <div className="form-step">
//                 <h2 className="step-heading">Account Setup</h2>
//                 <p className="step-description">Create your login credentials</p>
                
//                 <div className="form-group full-width">
//                   <label><i className="fas fa-envelope me-2" />Email Address</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className={errors.email && touched.email ? "error" : ""}
//                     placeholder="your@email.com"
//                     autoComplete="email"
//                   />
//                   {errors.email && touched.email && <small>{errors.email}</small>}
//                 </div>

//                 <div className="form-grid">
//                   <div className="form-group">
//                     <label>Password</label>
//                     <input
//                       type="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       className={errors.password ? "error" : ""}
//                       placeholder="Create a strong password"
//                     />
//                     {errors.password && (
//                       <div className="password-requirements">
//                         <small>Must include: uppercase, lowercase, number, special character, and at least 6 characters</small>
//                       </div>
//                     )}
//                   </div>

//                   <div className="form-group">
//                     <label>Confirm Password</label>
//                     <input
//                       type="password"
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       className={errors.confirmPassword ? "error" : ""}
//                       placeholder="Confirm your password"
//                     />
//                     {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
//                   </div>
//                 </div>

//                 <div className="form-actions">
//                   <button type="button" className="btn-prev" onClick={prevStep}>
//                     <i className="fas fa-arrow-left me-2"></i> Back
//                   </button>
//                   <button type="submit" className="btn-submit" disabled={isSubmitting}>
//                     {isSubmitting ? (
//                       <>
//                         <i className="fas fa-spinner fa-spin me-2"></i> Processing...
//                       </>
//                     ) : (
//                       <>
//                         <i className="fas fa-check-circle me-2"></i> Complete Registration
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
      
//       <div className="Footer">
//         <Footer />
//       </div>
//     </>
//   );
// // }

// import React, { useEffect, useState } from "react";
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
// import { Toaster, toast } from "react-hot-toast";

// import { useDispatch, useSelector } from "react-redux";
// import { setFormField, resetForm } from "../store/formSlice";

// const BASE_URL = "http://localhost:5001/api";

// export default function RegisterRestaurant() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const formData = useSelector((state) => state.form); 

//   const [previewImage, setPreviewImage] = useState(null);
//   const [previewLogo, setPreviewLogo] = useState(null);
//   const [activeStep, setActiveStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [touched, setTouched] = useState({});
//   const [errors, setErrors] = useState({});
//   const [countryList, setCountryList] = useState([]);
//   const [stateList, setStateList] = useState([]);
//   const [cityList, setCityList] = useState([]);
// const [showPassword, setShowPassword] = useState(false);
// const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// const safeFormData = {
//   ...formData,
//   address: formData?.address || {
//     line1: "",
//     line2: "",
//     pincode: "",
//     country: "",
//     state: "",
//     city: "",
//   },
// };

  
//   // useEffect(() => {
//   //   AOS.init({ duration: 1000 });
//   //   setCountryList(Country.getAllCountries());
//   // }, []);

//   useEffect(() => {
//   AOS.init({ duration: 1000 });
//   setCountryList(Country.getAllCountries());

//   // ensure initial history state has step:1
//   try {
//     window.history.replaceState({ step: 1 }, "");
//   } catch (e) {
//     // ignore if browser blocks it
//   }

//   const onPopState = (event) => {
//     const state = event.state;
//     if (state && state.step) {
//       setActiveStep(state.step);
//       window.scrollTo(0, 0);
//     } else {
//       // if user goes further back and we are on step > 1, bring them to step 1
//       setActiveStep((prev) => {
//         if (prev > 1) {
//           try { window.history.replaceState({ step: 1 }, ""); } catch (e) {}
//           return 1;
//         }
//         return prev;
//       });
//     }
//   };

//   window.addEventListener("popstate", onPopState);

//   return () => {
//     window.removeEventListener("popstate", onPopState);
//   };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, []);

//   const validatePassword = (password) => {
//     const minLength = /.{6,}/;
//     const uppercase = /[A-Z]/;
//     const lowercase = /[a-z]/;
//     const number = /[0-9]/;
//     const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
//     return (
//       minLength.test(password) &&
//       uppercase.test(password) &&
//       lowercase.test(password) &&
//       number.test(password) &&
//       specialChar.test(password)
//     );
//   };

//   const isValidImageType = (file) => {
//     if (!file) return false;
//     const validTypes = ["image/jpeg", "image/jpg", "image/png"];
//     return validTypes.includes(file.type);
//   };

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

//     dispatch(setFormField({ field: "address", value: updatedAddress }));
//     validate({ ...formData, address: updatedAddress });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     let updatedValue = value;

//     if (name === "email") {
//       updatedValue = value.toLowerCase();
//     }
//     if (name === "pincode") {
//       dispatch(
//         setFormField({
//           field: "address",
//           value: { ...formData.address, [name]: value },
//         })
//       );
//     } else {
//       dispatch(setFormField({ field: name, value: updatedValue }));
//     }

//     validate({ ...formData, [name]: updatedValue });
//   };

//   const handleBlur = (e) => {
//     const { name } = e.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));
//     validate(formData);
//   };

//   const handlePhoneChange = (value) => {
//     dispatch(setFormField({ field: "contact", value }));
//     validate({ ...formData, contact: value });
//     setTouched((prev) => ({ ...prev, contact: true }));
//   };
// const toBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

// const handleImageChange = async (e) => {
//   const file = e.target.files[0];
//   if (file && !isValidImageType(file)) {
//     setErrors((prev) => ({ ...prev, image: "Only JPG, JPEG, PNG files are allowed." }));
//     e.target.value = null;
//     return;
//   }
//   setErrors((prev) => ({ ...prev, image: "" }));
//   if (file) {
//     const base64 = await toBase64(file);
//     setPreviewImage(base64);
//     dispatch(setFormField({ field: "image", value: file }));
//     dispatch(setFormField({ field: "previewImage", value: base64 }));
//   }
// };

// const handleLogoChange = async (e) => {
//   const file = e.target.files[0];
//   if (file && !isValidImageType(file)) {
//     setErrors((prev) => ({ ...prev, logoImage: "Only JPG, JPEG, PNG files are allowed." }));
//     e.target.value = null;
//     return;
//   }
//   setErrors((prev) => ({ ...prev, logoImage: "" }));
//   if (file) {
//     const base64 = await toBase64(file);
//     setPreviewLogo(base64);
//     dispatch(setFormField({ field: "logoImage", value: file }));
//     dispatch(setFormField({ field: "previewLogo", value: base64 }));
//   }
// };

// useEffect(() => {
//   if (formData.previewImage) setPreviewImage(formData.previewImage);
//   if (formData.previewLogo) setPreviewLogo(formData.previewLogo);
// }, []);

//   const validate = (data) => {
//     const newErrors = {};
//     const nameRegex = /^[A-Za-z\s]+$/;
//     const pincodeRegex = /^[0-9]{5,6}$/;

//     if (!data.restaurantName)
//       newErrors.restaurantName = "Restaurant name is required.";
//     if (!data.ownerName) newErrors.ownerName = "Owner name is required.";
//     else if (!nameRegex.test(data.ownerName))
//       newErrors.ownerName = "Owner name must contain letters only.";

//     if (!data.contact || data.contact.length < 10)
//       newErrors.contact = "Valid phone number required.";

//     const { line1, country, state, city, pincode } = data.address || {};
//     if (!line1) newErrors.line1 = "Address Line 1 is required.";
//     if (!country) newErrors.country = "Country is required.";
//     if (!state) newErrors.state = "State is required.";
//     if (!city) newErrors.city = "City is required.";
//     if (!pincode) newErrors.pincode = "Pincode is required.";
//     else if (!pincodeRegex.test(pincode))
//       newErrors.pincode = "Enter a valid pincode.";

//     if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
//       newErrors.email = "Enter a valid email.";
//     if (!data.password || !validatePassword(data.password))
//       newErrors.password =
//         "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.";

//     if (data.password !== data.confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match.";

//     setErrors(newErrors);
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     const currentErrors = validate(formData);

//     setTouched({
//       restaurantName: true,
//       ownerName: true,
//       contact: true,
//       line1: true,
//       country: true,
//       state: true,
//       city: true,
//       pincode: true,
//       email: true,
//       password: true,
//       confirmPassword: true,
//     });

//     if (Object.keys(currentErrors).length === 0) {
//       try {
//         const formDataToSend = new FormData();
//         formDataToSend.append("restaurantName", formData.restaurantName);
//         formDataToSend.append("ownerName", formData.ownerName);
//         formDataToSend.append("contact", formData.contact);
//         formDataToSend.append("tagline", formData.tagline);
//         formDataToSend.append("address", JSON.stringify(formData.address));
//         formDataToSend.append("email", formData.email.toLowerCase());
//         formDataToSend.append("password", formData.password);

//         if (formData.image) formDataToSend.append("image", formData.image);
//         if (formData.logoImage)
//           formDataToSend.append("logoImage", formData.logoImage);

//         const response = await axios.post(
//           `${BASE_URL}/restaurants/register`,
//           formDataToSend,
//           {
//             headers: { "Content-Type": "multipart/form-data" },
//             withCredentials: true,
//           }
//         );

//         toast.success(
//           response.data.message || "Registered successfully! Please log in."
//         );
//         dispatch(resetForm()); 
//         try { window.history.replaceState(null, ""); } catch (e) {}
//         navigate("/");
//       } catch (error) {
//         console.error("Registration error:", error);
//         toast.error(error.response?.data?.error || "Registration failed.");
//       }
//     } else {
//       toast.error("Please fill the form correctly.");
//     }
//     setIsSubmitting(false);
//   };

//   const validateStep1 = (data) => {
//     const newErrors = {};
//     const nameRegex = /^[A-Za-z\s]+$/;
//     const pincodeRegex = /^[0-9]{5,6}$/;

//     if (!data.restaurantName)
//       newErrors.restaurantName = "Restaurant name is required.";
//     if (!data.ownerName) newErrors.ownerName = "Owner name is required.";
//     else if (!nameRegex.test(data.ownerName))
//       newErrors.ownerName = "Owner name must contain letters only.";

//     if (!data.contact || data.contact.length < 10)
//       newErrors.contact = "Valid phone number required.";

//     const { line1, country, state, city, pincode } = data.address || {};
//     if (!line1) newErrors.line1 = "Address Line 1 is required.";
//     if (!country) newErrors.country = "Country is required.";
//     if (!state) newErrors.state = "State is required.";
//     if (!city) newErrors.city = "City is required.";
//     if (!pincode) newErrors.pincode = "Pincode is required.";
//     else if (!pincodeRegex.test(pincode))
//       newErrors.pincode = "Enter a valid pincode.";

//     return newErrors;
//   };

//   // const nextStep = () => {
//   //   const currentErrors = validateStep1(formData);

//   //   setTouched({
//   //     restaurantName: true,
//   //     ownerName: true,
//   //     contact: true,
//   //     line1: true,
//   //     country: true,
//   //     state: true,
//   //     city: true,
//   //     pincode: true,
//   //   });
//   //   setErrors(currentErrors);

//   //   if (Object.keys(currentErrors).length === 0) {
//   //     setActiveStep(activeStep + 1);
//   //     window.scrollTo(0, 0);
//   //   }
//   // };

//   const nextStep = () => {
//   const currentErrors = validateStep1(formData);

//   setTouched({
//     restaurantName: true,
//     ownerName: true,
//     contact: true,
//     line1: true,
//     country: true,
//     state: true,
//     city: true,
//     pincode: true,
//   });
//   setErrors(currentErrors);

//   if (Object.keys(currentErrors).length === 0) {
//     const newStep = activeStep + 1;
//     setActiveStep(newStep);
//     try {
//       // push so browser back returns to previous step
//       window.history.pushState({ step: newStep - 1 }, "");
//     } catch (e) {}
//     window.scrollTo(0, 0);
//   }
// };


//   // const prevStep = () => {
//   //   if (activeStep > 1) {
//   //     setActiveStep(activeStep - 1);
//   //     window.scrollTo(0, 0);
//   //   }
//   // };

//   const prevStep = () => {
//   if (activeStep > 1) {
//     const newStep = activeStep - 1;
//     setActiveStep(newStep);
//     try {
//       // replaceState so we don't create duplicate entries when user clicks Prev repeatedly
//       window.history.replaceState({ step: newStep }, "");
//     } catch (e) {}
//     window.scrollTo(0, 0);
//   }
// };


//   const customSelectStyles = {
//     control: (base, state) => ({
//       ...base,
//       height: "52px",
//       minHeight: "42px",
//       borderRadius: "12px",
//       border: state.isFocused ? "2px solid #4f46e5" : "1px solid #d1d5db",
//       boxShadow: state.isFocused
//         ? "0 0 0 3px rgba(79, 70, 229, 0.1)"
//         : "none",
//       "&:hover": { borderColor: state.isFocused ? "#4f46e5" : "#9ca3af" },
//       transition: "all 0.2s ease",
//       backgroundColor: "#f9fafb",
//     }),
//     valueContainer: (base) => ({
//       ...base,
//       height: "42px",
//       padding: "0 12px",
//     }),
//     input: (base) => ({ ...base, margin: 0, padding: 0 }),
//     indicatorsContainer: (base) => ({ ...base, height: "42px" }),
//     multiValue: (base) => ({
//       ...base,
//       backgroundColor: "#eef2ff",
//       borderRadius: "6px",
//       padding: "2px 6px",
//     }),
//     menu: (base) => ({
//       ...base,
//       borderRadius: "12px",
//       overflow: "hidden",
//       boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//     }),
//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? "#4f46e5"
//         : state.isFocused
//         ? "#eef2ff"
//         : "white",
//       color: state.isSelected ? "white" : "#1f2937",
//       "&:active": {
//         backgroundColor: state.isSelected ? "#4f46e5" : "#e5e7eb",
//       },
//     }),
//   };

//   const steps = [
//     { number: 1, title: "Restaurant Details" },
//     { number: 2, title: "Login Credentials" },
//   ];

//   return (
//     <>
//       <HomeHeader />

//       <div className="register-page">
//         <div className="register-container">
//           <div className="register-header">
//             <h1>Register Your Restaurant</h1>
//             <p>Join our platform to reach more customers and grow your business</p>
//           </div>

//           <div className="progress-container">
//             <div className="progress-steps">
//               {steps.map((step, index) => (
//                 <div key={step.number} className={`step ${activeStep >= step.number ? "active" : ""}`}>
//                   <div className="step-number">{step.number}</div>
//                   <span className="step-title">{step.title}</span>
//                   {index < steps.length - 1 && (
//                     <div className={`step-connector ${activeStep > step.number ? "completed" : ""}`}></div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <form className="register-form" onSubmit={handleSubmit} data-aos="fade-up">
//             {activeStep === 1 && (
//               <div className="form-step">
//                 <p className="step-description">Tell us about your restaurant business</p>
                
//                 <div className="form-grid">
//                   <div className="form-group">
//   <label><i className="fas fa-store me-2 blue-icon" />Restaurant Name</label>
//   <div className="field-wrapper">
//   <input
//     type="text"
//     name="restaurantName"
//     value={formData.restaurantName}
//     onChange={handleChange}
//     onBlur={handleBlur}
//     className={errors.restaurantName && touched.restaurantName ? "error" : ""}
//     placeholder="Enter your restaurant name"
//   />

//   {errors.restaurantName && touched.restaurantName && <div className="error-message">{errors.restaurantName}</div>}
// </div></div>


//                   <div className="form-group">
//                     <label><i className="fas fa-user me-2 blue-icon" />Owner Name</label>
//                     <div className="field-wrapper">
//                     <input
//                       type="text"
//                       name="ownerName"
//                       value={formData.ownerName}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       className={errors.ownerName && touched.ownerName ? "error" : ""}
//                       placeholder="Full name"
//                     />
//                     {errors.ownerName && touched.ownerName && (<div className="error-message">{errors.ownerName}</div>)}
//                     </div>
//                   </div>
//                   <div className="form-group">
//                     <label><i className="fas fa-quote-left me-2 blue-icon" />Tagline</label>
//                     <input
//                       type="text"
//                       name="tagline"
//                       value={formData.tagline}
//                       onChange={handleChange}
//                       placeholder="e.g. Fresh Taste, Better Life"
//                     />
//                   </div>

//                  <div className="form-group">
//   <label><i className="fas fa-phone me-2 blue-icon" />Contact Number</label>

//   <div className="field-wrapper">
//     <div className={`phone-input-wrapper ${errors.contact && touched.contact ? "error" : ""}`}>
//       <PhoneInput
//         country={"in"}
//         value={formData.contact}
//         onChange={handlePhoneChange}
//         onBlur={() => setTouched((prev) => ({ ...prev, contact: true }))}
//         inputClass="custom-phone-input"
//         buttonClass="phone-flag-button"
//         dropdownClass="phone-dropdown"
//         enableSearch
//         placeholder="Enter phone number"
//       />
//     </div>
//     {errors.contact && touched.contact && (
//       <div className="error-message">{errors.contact}</div>
//     )}
//   </div>
// </div>

//                   <div className="form-group">
//                     <label><i className="fas fa-map-marker-alt me-2 blue-icon" />Address Line 1</label>
//                     <div className="field-wrapper">
//                     <input
//                       type="text"
//                        value={safeFormData.address.line1}
//                       onChange={(e) => handleAddressChange("line1", e.target.value)}
//                       className={errors.line1 && touched.line1 ? "error" : ""}
//                       placeholder="Address Line 1"
//                     />

//                     {errors.line1 && touched.line1 &&( <div className="error-message">{errors.line1}</div>)}
//                     </div>
//                   </div>

//                   <div className="form-group">
//                     <label><i className="fas fa-building me-2 blue-icon" />Address Line 2</label>
//                     <input
//                       type="text"
//                      value={safeFormData.address.line2}
//                       onChange={(e) => handleAddressChange("line2", e.target.value)}
//                       placeholder="Address Line 2"
//                     />
//                   </div>
//                   <div className="form-group">
                  
//                     <label><i className="fas fa-globe-asia me-2 blue-icon" />Country</label>
//                     <div className="field-wrapper">
//                      <Select
//                        options={countryList.map((c) => ({ label: c.name, value: c.isoCode }))}
//                      value={safeFormData.address.country
//   ? { label: Country.getCountryByCode(safeFormData.address.country)?.name, value: safeFormData.address.country }
//   : null
// }
//                        onChange={(selected) => handleAddressChange("country", selected.value)}
//                        placeholder="Select Country"
                       
//                        classNamePrefix="react-select"
//                             className={`react-select-container ${errors.country && touched.country ? "error" : ""}`}
//                        styles={customSelectStyles}
//                      />
//                     {errors.country && touched.country && (<div className="error-message">{errors.country}</div>)}
//                   </div>
// </div>
//                   <div className="form-group">
//                     <label><i className="fas fa-map-pin me-2 blue-icon" />Pincode</label>
//                     <div className="field-wrapper">
//                     <input
//                       type="text"
//                       name="pincode"
                     
//   value={safeFormData.address.pincode}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       className={errors.pincode && touched.pincode ? "error" : ""}
//                       placeholder="Enter pincode"
//                       maxLength="6"
//                     />
//                     {errors.pincode && touched.pincode && <div className="error-message">{errors.pincode}</div>}
//                   </div>
// </div>
// <div className="form-group">
//                     <label><i className="fas fa-map me-2 blue-icon" />State</label>
//                     <div className="field-wrapper">
//                     <Select
//                       options={stateList.map((s) => ({ label: s.name, value: s.isoCode }))}
//                         value={
//     safeFormData.address.state
//       ? {
//           label: State.getStateByCodeAndCountry(
//             safeFormData.address.state,
//             safeFormData.address.country
//           )?.name,
//           value: safeFormData.address.state,
//         }
//       : null
//   }
//                        onChange={(selected) => handleAddressChange("state", selected.value)}
//                        placeholder="Select State"
//                             className={`react-select-container ${errors.state && touched.state ? "error" : ""}`}
//                        classNamePrefix="react-select"
//                        styles={customSelectStyles}
//                      />
//                      {errors.state && touched.state && <div className="error-message">{errors.state}</div>}
//                    </div></div>

//                    <div className="form-group">
//                      <label><i className="fas fa-city me-2 blue-icon" />City</label>
//                      <div className="field-wrapper">
//                     <Select
//                       options={cityList.map((c) => ({ label: c.name, value: c.name }))}
//                        value={
//     safeFormData.address.city
//       ? { label: safeFormData.address.city, value: safeFormData.address.city }
//       : null
//   }
//                       onChange={(selected) => handleAddressChange("city", selected.value)}
//                       placeholder="Select City"
//                             className={`react-select-container ${errors.city && touched.city ? "error" : ""}`}
//                       classNamePrefix="react-select"
//                       styles={customSelectStyles}
//                     />
//                      {errors.city && touched.city && <div className="error-message">{errors.city}</div>}
//                   </div>
//                   </div>
//                 </div>


//                 <div className="image-upload-section">
//                   <h3><i className="fas fa-images me-2 blue-icon" />Upload Images</h3>
//                   <div className="image-grid">
//                     <div className="image-upload-box">
//                       <label>
//                         <i className="fas fa-image me-2 blue-icon" />Cover Image
//                         <input type="file" accept="image/*" onChange={handleImageChange} />
//                         <div className="upload-placeholder">
//                           {previewImage ? (
//                             <img src={previewImage} alt="Preview" />
//                           ) : (
//                             <>
//                               <i className="fas fa-cloud-upload-alt blue-icon"></i>
//                               <span>Click to upload</span>
//                               <small>JPG, PNG up to 5MB</small>
//                             </>
//                           )}
//                         </div>
//                       </label>
//                     </div>

//                     <div className="image-upload-box">
//                       <label>
//                         <i className="fas fa-tag me-2 blue-icon" />Logo
//                         <input type="file" accept="image/*" onChange={handleLogoChange} />
//                         <div className="upload-placeholder">
//                           {previewLogo ? (
//                             <img src={previewLogo} alt="Logo Preview" />
//                           ) : (
//                             <>
//                               <i className="fas fa-cloud-upload-alt blue-icon"></i>
//                               <span>Click to upload</span>
//                               <small>JPG, PNG up to 2MB</small>
//                             </>
//                           )}
//                         </div>
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 {activeStep === 1 && (
//         <div className="form-step">
//           <div className="form-actions single-action">
//             <button type="button" className="btn-next" onClick={nextStep}>
//               Next <i className="fas fa-arrow-right ms-2"></i>
//             </button>
//           </div>
//         </div>
//       )}
//               </div>
//             )}

//             {activeStep === 2 && (
//               <div className="form-step">
//                 <p className="step-description">Create your login credentials</p>
                
//                 <div className="form-group full-width">
//                   <label><i className="fas fa-envelope me-2 blue-icon" />Email Address</label>
//                   <div className="field-wrapper">
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className={errors.email && touched.email ? "error" : ""}
//                     placeholder="your@email.com"
//                     autoComplete="email"
//                   />
//                   {errors.email && touched.email && <div className="error-message">{errors.email}</div>}
//                 </div>
//                 </div>

//                 <div className="form-grid">
//                <div className="form-group mt-4 password-field">
//   <label><i className="fas fa-lock me-2 blue-icon" />Password</label>
//   <div className="input-with-icon">
//     <input
//       type={showPassword ? "text" : "password"}
//       name="password"
//       value={formData.password}
//       onChange={handleChange}
//       className={errors.password ? "error" : ""}
//       placeholder="Create a strong password"
//     />
//     <i
//       className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
//       onClick={() => setShowPassword(!showPassword)}
//     ></i>
//   </div>
//   {errors.password && (
//     <div className="password-requirements">
//       <small>Must include: uppercase, lowercase, number, special character, and at least 6 characters</small>
//     </div>
//   )}
// </div>

// <div className="form-group mt-4 password-field">
//   <label><i className="fas fa-lock me-2 blue-icon" />Confirm Password</label>
//   <div className="input-with-icon">
//     <input
//       type={showConfirmPassword ? "text" : "password"}
//       name="confirmPassword"
//       value={formData.confirmPassword}
//       onChange={handleChange}
//       className={errors.confirmPassword ? "error" : ""}
//       placeholder="Confirm your password"
//     />
//     <i
//       className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
//       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//     ></i>
//   </div>
//   {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
// </div>

//                 </div>

//                 <div className="form-actions">
//                   <button type="button" className="btn-prev" onClick={prevStep}>
//                     <i className="fas fa-arrow-left me-2"></i> Back
//                   </button>
//                   <button type="submit" className="btn-submit" disabled={isSubmitting}>
//                     {isSubmitting ? (
//                       <>
//                         <i className="fas fa-spinner fa-spin me-2"></i> Processing...
//                       </>
//                     ) : (
//                       <>
//                         <i className="fas fa-check-circle me-2"></i> Complete Registration
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
      
//       <div className="Footer">
//         <Footer />
//       </div>
//       <Toaster
//   position="top-center" 
//   reverseOrder={false}
//   toastOptions={{
//     duration: 3000,
//     style: {
//       fontSize: "14px",
//       textAlign: "center", 
//     },
//   }}
// />

//     </>
//   );
// }


import React, { useEffect, useState } from "react";
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
import { Toaster, toast } from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { setFormField, resetForm } from "../store/formSlice";
import { registerRestaurant ,logoutRestaurant } from "../services/apiService";


import { validatePassword, PasswordRequirements } from "../utils/passwordValidation";

const BASE_URL = "http://localhost:5001/api";

export default function RegisterRestaurant() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form); 

  const [previewImage, setPreviewImage] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasStates, setHasStates] = useState(false);
  const [hasCities, setHasCities] = useState(false);
const [restaurantName, setRestaurantName] = useState("");

  const safeFormData = {
    ...formData,
    address: formData?.address || {
      line1: "",
      line2: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
    },
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
    setCountryList(Country.getAllCountries());
    
    if (formData.address?.country) {
      const states = State.getStatesOfCountry(formData.address.country);
      setStateList(states);
      setHasStates(states.length > 0);
      
      if (states.length > 0 && formData.address.state) {
        const cities = City.getCitiesOfState(formData.address.country, formData.address.state);
        setCityList(cities || []);
        setHasCities(cities && cities.length > 0);
      } else if (states.length === 0) {
        const cities = City.getCitiesOfCountry(formData.address.country);
        setCityList(cities || []);
        setHasCities(cities && cities.length > 0);
      }
    }
    try {
      window.history.replaceState({ step: 1 }, "");
    } catch (e) {

    }

    const onPopState = (event) => {
      const state = event.state;
      if (state && state.step) {
        setActiveStep(state.step);
        window.scrollTo(0, 0);
      } else {
        setActiveStep((prev) => {
          if (prev > 1) {
            try { window.history.replaceState({ step: 1 }, ""); } catch (e) {}
            return 1;
          }
          return prev;
        });
      }
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

 

  const isValidImageType = (file) => {
    if (!file) return false;
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    return validTypes.includes(file.type);
  };

  const handleAddressChange = (field, value) => {
    const updatedAddress = { ...formData.address, [field]: value };

    if (field === "country") {
      const states = State.getStatesOfCountry(value);
      setStateList(states);
      setHasStates(states.length > 0);
      
      if (states.length === 0) {
        const cities = City.getCitiesOfCountry(value);
        setCityList(cities || []);
        setHasCities(cities && cities.length > 0);
      } else {
        setCityList([]);
        setHasCities(false);
      }
      
      updatedAddress.state = "";
      updatedAddress.city = "";
    }

    if (field === "state") {
      const cities = City.getCitiesOfState(formData.address.country, value);
      setCityList(cities || []);
      setHasCities(cities && cities.length > 0);
      updatedAddress.city = "";
    }

    dispatch(setFormField({ field: "address", value: updatedAddress }));
    validate({ ...formData, address: updatedAddress });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "email") {
      updatedValue = value.toLowerCase();
    }
    if (name === "pincode") {
      dispatch(
        setFormField({
          field: "address",
          value: { ...formData.address, [name]: value },
        })
      );
    } else {
      dispatch(setFormField({ field: name, value: updatedValue }));
    }

    validate({ ...formData, [name]: updatedValue });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(formData);
  };

  const handlePhoneChange = (value) => {
    dispatch(setFormField({ field: "contact", value }));
    validate({ ...formData, contact: value });
    setTouched((prev) => ({ ...prev, contact: true }));
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && !isValidImageType(file)) {
      setErrors((prev) => ({ ...prev, image: "Only JPG, JPEG, PNG files are allowed." }));
      e.target.value = null;
      return;
    }
    setErrors((prev) => ({ ...prev, image: "" }));
    if (file) {
      const base64 = await toBase64(file);
      setPreviewImage(base64);
      dispatch(setFormField({ field: "image", value: file }));
      dispatch(setFormField({ field: "previewImage", value: base64 }));
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file && !isValidImageType(file)) {
      setErrors((prev) => ({ ...prev, logoImage: "Only JPG, JPEG, PNG files are allowed." }));
      e.target.value = null;
      return;
    }
    setErrors((prev) => ({ ...prev, logoImage: "" }));
    if (file) {
      const base64 = await toBase64(file);
      setPreviewLogo(base64);
      dispatch(setFormField({ field: "logoImage", value: file }));
      dispatch(setFormField({ field: "previewLogo", value: base64 }));
    }
  };

  useEffect(() => {
    if (formData.previewImage) setPreviewImage(formData.previewImage);
    if (formData.previewLogo) setPreviewLogo(formData.previewLogo);
  }, []);

  const validate = (data) => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!data.restaurantName)
      newErrors.restaurantName = "Restaurant name is required.";
    if (!data.ownerName) newErrors.ownerName = "Owner name is required.";
    else if (!nameRegex.test(data.ownerName))
      newErrors.ownerName = "Owner name must contain letters only.";

    if (!data.contact || data.contact.length < 10)
      newErrors.contact = "Valid phone number required.";

    const { line1, country, state, city, pincode } = data.address || {};
    if (!line1) newErrors.line1 = "Address Line 1 is required.";
    if (!country) newErrors.country = "Country is required.";
    if (hasStates && !state) newErrors.state = "State is required.";
    if (hasCities && !city) newErrors.city = "City is required.";
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = "Enter a valid email.";
     const passwordValidation = validatePassword(data.password);
    if (!data.password || !passwordValidation.isValid)
      newErrors.password = "Password does not meet all requirements";

    if (data.password !== data.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return newErrors;
  };


  const validateStep1 = (data) => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const pincodeRegex = /^[0-9]{5,6}$/;

    if (!data.restaurantName)
      newErrors.restaurantName = "Restaurant name is required.";
    if (!data.ownerName) newErrors.ownerName = "Owner name is required.";
    else if (!nameRegex.test(data.ownerName))
      newErrors.ownerName = "Owner name must contain letters only.";

    if (!data.contact || data.contact.length < 10)
      newErrors.contact = "Valid phone number required.";

    const { line1, country, state, city, pincode } = data.address || {};
    if (!line1) newErrors.line1 = "Address Line 1 is required.";
    if (!country) newErrors.country = "Country is required.";
    
    if (hasStates && !state) newErrors.state = "State is required.";
    
    if (hasCities && !city) newErrors.city = "City is required.";
    
    if (!pincode) newErrors.pincode = "Pincode is required.";
    else if (!pincodeRegex.test(pincode))
      newErrors.pincode = "Enter a valid pincode.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const currentErrors = validate(formData);

    setTouched({
      restaurantName: true,
      ownerName: true,
      contact: true,
      line1: true,
      country: true,
      state: true,
      city: true,
      pincode: true,
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
        formDataToSend.append("tagline", formData.tagline);
        formDataToSend.append("address", JSON.stringify(formData.address));
        formDataToSend.append("email", formData.email.toLowerCase());
        formDataToSend.append("password", formData.password);

        if (formData.image) formDataToSend.append("image", formData.image);
        if (formData.logoImage)
          formDataToSend.append("logoImage", formData.logoImage);

        const response = await registerRestaurant(formDataToSend);
        toast.success(
          response.message || "Registered successfully! Please log in."
        );
        dispatch(resetForm()); 
        try { window.history.replaceState(null, ""); } catch (e) {}
        navigate("/");
      } catch (error) {
        console.error("Registration error:", error);
        toast.error(error.response?.data?.error || "Registration failed.");
      }
    } else {
      toast.error("Please fill the form correctly.");
    }
    setIsSubmitting(false);
  };

  const nextStep = () => {
    const currentErrors = validateStep1(formData);

    setTouched({
      restaurantName: true,
      ownerName: true,
      contact: true,
      line1: true,
      country: true,
      state: true,
      city: true,
      pincode: true,
    });
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
      const newStep = activeStep + 1;
      setActiveStep(newStep);
      try {
        window.history.pushState({ step: newStep - 1 }, "");
      } catch (e) {}
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      const newStep = activeStep - 1;
      setActiveStep(newStep);
      try {
        window.history.replaceState({ step: newStep }, "");
      } catch (e) {}
      window.scrollTo(0, 0);
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      height: "52px",
      minHeight: "42px",
      borderRadius: "12px",
      border: state.isFocused ? "2px solid #4f46e5" : "1px solid #d1d5db",
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(79, 70, 229, 0.1)"
        : "none",
      "&:hover": { borderColor: state.isFocused ? "#4f46e5" : "#9ca3af" },
      transition: "all 0.2s ease",
      backgroundColor: "#f9fafb",
    }),
    valueContainer: (base) => ({
      ...base,
      height: "42px",
      padding: "0 12px",
    }),
    input: (base) => ({ ...base, margin: 0, padding: 0 }),
    indicatorsContainer: (base) => ({ ...base, height: "42px" }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#eef2ff",
      borderRadius: "6px",
      padding: "2px 6px",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#4f46e5"
        : state.isFocused
        ? "#eef2ff"
        : "white",
      color: state.isSelected ? "white" : "#1f2937",
      "&:active": {
        backgroundColor: state.isSelected ? "#4f46e5" : "#e5e7eb",
      },
    }),
  };

  const steps = [
    { number: 1, title: "Restaurant Details" },
    { number: 2, title: "Login Credentials" },
  ];

  const handleLogout = async () => {
    try {
      await logoutRestaurant();   
      dispatch(resetForm());      
      localStorage.removeItem("token"); 
      setRestaurantName("");      
      navigate("/");              
    } catch (error) {
      console.error("❌ Logout error:", error);
    }
  };
  return (
    <>
      <HomeHeader />

      <div className="register-page">
        <div className="register-container">
          <div className="register-header">
            <h1>Register Your Restaurant</h1>
            <p>Join our platform to reach more customers and grow your business</p>
          </div>

          <div className="progress-container">
            <div className="progress-steps">
              {steps.map((step, index) => (
                <div key={step.number} className={`step ${activeStep >= step.number ? "active" : ""}`}>
                  <div className="step-number">{step.number}</div>
                  <span className="step-title">{step.title}</span>
                  {index < steps.length - 1 && (
                    <div className={`step-connector ${activeStep > step.number ? "completed" : ""}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form className="register-form" onSubmit={handleSubmit} data-aos="fade-up">
            {activeStep === 1 && (
              <div className="form-step">
                <p className="step-description">Tell us about your restaurant business</p>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label><i className="fas fa-store me-2 blue-icon" />Restaurant Name</label>
                    <div className="field-wrapper">
                      <input
                        type="text"
                        name="restaurantName"
                        value={formData.restaurantName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.restaurantName && touched.restaurantName ? "error" : ""}
                        placeholder="Enter your restaurant name"
                      />
                      {errors.restaurantName && touched.restaurantName && <div className="error-message">{errors.restaurantName}</div>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label><i className="fas fa-user me-2 blue-icon" />Owner Name</label>
                    <div className="field-wrapper">
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.ownerName && touched.ownerName ? "error" : ""}
                        placeholder="Full name"
                      />
                      {errors.ownerName && touched.ownerName && (<div className="error-message">{errors.ownerName}</div>)}
                    </div>
                  </div>
                  <div className="form-group">
                    <label><i className="fas fa-quote-left me-2 blue-icon" />Tagline</label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleChange}
                      placeholder="e.g. Fresh Taste, Better Life"
                    />
                  </div>

                  <div className="form-group">
                    <label><i className="fas fa-phone me-2 blue-icon" />Contact Number</label>
                    <div className="field-wrapper">
                      <div className={`phone-input-wrapper ${errors.contact && touched.contact ? "error" : ""}`}>
                        <PhoneInput
                          country={"in"}
                          value={formData.contact}
                          onChange={handlePhoneChange}
                          onBlur={() => setTouched((prev) => ({ ...prev, contact: true }))}
                          inputClass="custom-phone-input"
                          buttonClass="phone-flag-button"
                          dropdownClass="phone-dropdown"
                          enableSearch
                          placeholder="Enter phone number"
                        />
                      </div>
                      {errors.contact && touched.contact && (
                        <div className="error-message">{errors.contact}</div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label><i className="fas fa-map-marker-alt me-2 blue-icon" />Address Line 1</label>
                    <div className="field-wrapper">
                      <input
                        type="text"
                        value={safeFormData.address.line1}
                        onChange={(e) => handleAddressChange("line1", e.target.value)}
                        className={errors.line1 && touched.line1 ? "error" : ""}
                        placeholder="Address Line 1"
                      />
                      {errors.line1 && touched.line1 &&( <div className="error-message">{errors.line1}</div>)}
                    </div>
                  </div>

                  <div className="form-group">
                    <label><i className="fas fa-building me-2 blue-icon" />Address Line 2</label>
                    <input
                      type="text"
                      value={safeFormData.address.line2}
                      onChange={(e) => handleAddressChange("line2", e.target.value)}
                      placeholder="Address Line 2"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label><i className="fas fa-globe-asia me-2 blue-icon" />Country</label>
                    <div className="field-wrapper">
                      <Select
                        options={countryList.map((c) => ({ label: c.name, value: c.isoCode }))}
                        value={safeFormData.address.country
                          ? { label: Country.getCountryByCode(safeFormData.address.country)?.name, value: safeFormData.address.country }
                          : null
                        }
                        onChange={(selected) => handleAddressChange("country", selected.value)}
                        placeholder="Select Country"
                        classNamePrefix="react-select"
                        className={`react-select-container ${errors.country && touched.country ? "error" : ""}`}
                        styles={customSelectStyles}
                      />
                      {errors.country && touched.country && (<div className="error-message">{errors.country}</div>)}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label><i className="fas fa-map-pin me-2 blue-icon" />Pincode</label>
                    <div className="field-wrapper">
                      <input
                        type="text"
                        name="pincode"
                        value={safeFormData.address.pincode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.pincode && touched.pincode ? "error" : ""}
                        placeholder="Enter pincode"
                        maxLength="6"
                      />
                      {errors.pincode && touched.pincode && <div className="error-message">{errors.pincode}</div>}
                    </div>
                  </div>
                  
                  {hasStates && (
                    <div className="form-group">
                      <label><i className="fas fa-map me-2 blue-icon" />State</label>
                      <div className="field-wrapper">
                        <Select
                          options={stateList.map((s) => ({ label: s.name, value: s.isoCode }))}
                          value={
                            safeFormData.address.state
                              ? {
                                  label: State.getStateByCodeAndCountry(
                                    safeFormData.address.state,
                                    safeFormData.address.country
                                  )?.name,
                                  value: safeFormData.address.state,
                                }
                              : null
                          }
                          onChange={(selected) => handleAddressChange("state", selected.value)}
                          placeholder="Select State"
                          className={`react-select-container ${errors.state && touched.state ? "error" : ""}`}
                          classNamePrefix="react-select"
                          styles={customSelectStyles}
                        />
                        {errors.state && touched.state && <div className="error-message">{errors.state}</div>}
                      </div>
                    </div>
                  )}
                  {hasCities && (
                    <div className="form-group">
                      <label><i className="fas fa-city me-2 blue-icon" />{hasStates ? "City" : "City/Region"}</label>
                      <div className="field-wrapper">
                        {cityList.length > 0 ? (
                          <Select
                            options={cityList.map((c) => ({ label: c.name, value: c.name }))}
                            value={
                              safeFormData.address.city
                                ? { label: safeFormData.address.city, value: safeFormData.address.city }
                                : null
                            }
                            onChange={(selected) => handleAddressChange("city", selected.value)}
                            placeholder={hasStates ? "Select City" : "Select City/Region"}
                            className={`react-select-container ${errors.city && touched.city ? "error" : ""}`}
                            classNamePrefix="react-select"
                            styles={customSelectStyles}
                          />
                        ) : (
                          <input
                            type="text"
                            value={safeFormData.address.city || ""}
                            onChange={(e) => handleAddressChange("city", e.target.value)}
                            className={errors.city && touched.city ? "error" : ""}
                            placeholder="Enter city or region name"
                          />
                        )}
                        {errors.city && touched.city && <div className="error-message">{errors.city}</div>}
                      </div>
                    </div>
                  )}
                </div>

                <div className="image-upload-section">
                  <h3><i className="fas fa-images me-2 blue-icon" />Upload Images</h3>
                  <div className="image-grid">
                    <div className="image-upload-box">
                      <label>
                        <i className="fas fa-image me-2 blue-icon" />Cover Image
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        <div className="upload-placeholder">
                          {previewImage ? (
                            <img src={previewImage} alt="Preview" />
                          ) : (
                            <>
                              <i className="fas fa-cloud-upload-alt blue-icon"></i>
                              <span>Click to upload</span>
                              <small>JPG, PNG up to 5MB</small>
                            </>
                          )}
                        </div>
                      </label>
                    </div>

                    <div className="image-upload-box">
                      <label>
                        <i className="fas fa-tag me-2 blue-icon" />Logo
                        <input type="file" accept="image/*" onChange={handleLogoChange} />
                        <div className="upload-placeholder">
                          {previewLogo ? (
                            <img src={previewLogo} alt="Logo Preview" />
                          ) : (
                            <>
                              <i className="fas fa-cloud-upload-alt blue-icon"></i>
                              <span>Click to upload</span>
                              <small>JPG, PNG up to 2MB</small>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {activeStep === 1 && (
                  <div className="form-step">
                    <div className="form-actions single-action">
                      <button type="button" className="btn-next" onClick={nextStep}>
                        Next <i className="fas fa-arrow-right ms-2"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeStep === 2 && (
              <div className="form-step">
                <p className="step-description">Create your login credentials</p>
                
                <div className="form-group full-width">
                  <label><i className="fas fa-envelope me-2 blue-icon" />Email Address</label>
                  <div className="field-wrapper">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.email && touched.email ? "error" : ""}
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                    {errors.email && touched.email && <div className="error-message">{errors.email}</div>}
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group mt-4 password-field">
     <label><i className="fas fa-lock me-2 blue-icon" />Password</label>
  <div className="field-wrapper">
    <div className="input-with-icon">
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        className={errors.password && touched.password ? "error" : ""}
        placeholder="Create a strong password"
      />
      <i
        className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
        onClick={() => setShowPassword(!showPassword)}
      ></i>
    </div>
    {errors.password && touched.password && (
      <div className="error-message">{errors.password}</div>
    )}
  </div>
 
     <div className="password-requirements-container">
      <PasswordRequirements password={formData.password} />
    </div>
 </div>


                  <div className="form-group mt-4 password-field">
                    <label><i className="fas fa-lock me-2 blue-icon" />Confirm Password</label>
        <div className="field-wrapper">
          
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.confirmPassword && touched.confirmPassword ? "error" : ""}
              placeholder="Confirm your password"
            />
            <i
              className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            ></i>
        
          {errors.confirmPassword && touched.confirmPassword && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}
        </div>
      </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-prev" onClick={prevStep}>
                    <i className="fas fa-arrow-left me-2"></i> Back
                  </button>
                  <button type="submit" className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i> Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle me-2"></i> Complete Registration
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      
      <div className="Footer">
        <Footer />
      </div>
     
    </>
  );
}