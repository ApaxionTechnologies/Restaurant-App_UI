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