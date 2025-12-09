import React, { useEffect, useState, useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "aos/dist/aos.css";
import AOS from "aos";
import { Country, State, City } from "country-state-city";
import "../styles/RegisterForm.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { registerRestaurant ,logoutRestaurant } from "../services/apiService";
import { useTranslation } from "react-i18next";
import { validatePassword, PasswordRequirements } from "../utils/passwordValidation";

const BASE_URL = "http://localhost:5001/api/v1";

export default function RegisterForm() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    gstNumber: "",
    contact: "",
    restaurantAddress1: "",
    restaurantAddress2: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
    tagLine: "",
    images: [],
    logo: null,
    email: "",
    password: "",
    confirmPassword: "",
  });

  // For image previews
  const [previewImage, setPreviewImage] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const { t } = useTranslation("register");

  // For form validation
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  
  // For location dropdowns
  const [countries, setCountries] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [hasStates, setHasStates] = useState(false);
  const [hasCities, setHasCities] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const artworkImages = [
    "/foodculter.png",
    "/artwork-step-2.png",
    "/steper3.png",
    "/steper4.png",
  ];

  const [artworkSrc, setArtworkSrc] = useState(artworkImages[0]);
  const [artworkFade, setArtworkFade] = useState(false);
  const artworkRef = useRef(null);

  // Initialize AOS and countries
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    setCountries(Country.getAllCountries());
    
    // Handle browser back/forward navigation
    try {
      window.history.replaceState({ step: 1 }, "");
    } catch (e) {
      console.log("History state error:", e);
    }

    const onPopState = (event) => {
      const state = event.state;
      if (state && state.step) {
        setStep(state.step);
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    const newSrc = artworkImages[step - 1] || artworkImages[0];
   
    setArtworkFade(true);
    const t = setTimeout(() => {
      setArtworkSrc(newSrc);
      setTimeout(() => setArtworkFade(false), 300);
    }, 150);

    return () => clearTimeout(t);
  }, [step]);

  // Update states and cities when country changes
  useEffect(() => {
    if (formData.country) {
      const states = State.getStatesOfCountry(formData.country);
      setStateList(states);
      setHasStates(states.length > 0);
      
      if (states.length === 0) {
        const cities = City.getCitiesOfCountry(formData.country);
        setCityList(cities || []);
        setHasCities(cities && cities.length > 0);
      } else {
        setCityList([]);
        setHasCities(false);
      }
    }
  }, [formData.country]);

  // Update cities when state changes
  useEffect(() => {
    if (formData.country && formData.state) {
      const cities = City.getCitiesOfState(formData.country, formData.state);
      setCityList(cities || []);
      setHasCities(cities && cities.length > 0);
    }
  }, [formData.state]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert email to lowercase
    if (name === "email") {
      setFormData({ ...formData, [name]: value.toLowerCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Validate on change
    validateField(name, value);
  };

  // Handle phone input change
  const handlePhoneChange = (value) => {
    setFormData({ ...formData, contact: value });
    validateField("contact", value);
  };

  // Handle country/state/city selection
  const handleLocationChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    
    // Reset dependent fields
    if (field === "country") {
      newFormData.state = "";
      newFormData.city = "";
    } else if (field === "state") {
      newFormData.city = "";
    }
    
    setFormData(newFormData);
    validateField(field, value);
  };

  // Validate individual field
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case "restaurantName":
        if (!value) newErrors.restaurantName = t("errors.restaurantName");
        else delete newErrors.restaurantName;
        break;
        
      case "ownerName":
        if (!value) newErrors.ownerName = t("errors.ownerName");
        else if (!/^[A-Za-z\s]+$/.test(value))
          newErrors.ownerName = t("errors.validOwnerName");
        else delete newErrors.ownerName;
        break;
        
      case "contact":
        if (!value || value.length < 10)
          newErrors.contact = t("errors.contact");
        else delete newErrors.contact;
        break;
        
      case "restaurantAddress1":
        if (!value) newErrors.restaurantAddress1 = t("errors.addressLine1");
        else delete newErrors.restaurantAddress1;
        break;
        
      case "country":
        if (!value) newErrors.country = t("errors.country");
        else delete newErrors.country;
        break;
        
      case "pinCode":
        if (!value) newErrors.pinCode = t("errors.pincode");
        else if (!/^[0-9]{5,6}$/.test(value))
          newErrors.pinCode = "Enter a valid pincode (5-6 digits).";
        else delete newErrors.pinCode;
        break;
        
      case "email":
        if (!value) newErrors.email = t("errors.requiredField");
        else if (!/\S+@\S+\.\S+/.test(value))
          newErrors.email = t("errors.email");
        else delete newErrors.email;
        break;
        
      case "password":
        const passwordValidation = validatePassword(value);
        if (!value) newErrors.password = t("errors.requiredField");
        else if (!passwordValidation.isValid)
          newErrors.password = t("errors.password");
        else delete newErrors.password;
        break;
        
      case "confirmPassword":
        if (!value) newErrors.confirmPassword = "Please confirm password.";
        else if (value !== formData.password)
          newErrors.confirmPassword = t("errors.confirmPassword");
        else delete newErrors.confirmPassword;
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  // Handle blur event
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name]);
  };

  // Handle file uploads
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image type
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG files are allowed.");
      e.target.value = null;
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === "images") {
        setPreviewImage(event.target.result);
        setFormData({ ...formData, images: [file] });
      } else if (type === "logo") {
        setPreviewLogo(event.target.result);
        setFormData({ ...formData, logo: file });
      }
    };
    reader.readAsDataURL(file);
  };

  // Validate current step
  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.restaurantName) newErrors.restaurantName = t("errors.restaurantName");
      if (!formData.ownerName) newErrors.ownerName = t("errors.ownerName");
      else if (!/^[A-Za-z\s]+$/.test(formData.ownerName))
        newErrors.ownerName = t("validOwnerName");
      if (!formData.contact || formData.contact.length < 10)
        newErrors.contact = t("errors.contact");
    }
    
    if (stepNumber === 2) {
      if (!formData.restaurantAddress1) newErrors.restaurantAddress1 = t("errors.address1");
      if (!formData.country) newErrors.country = t("errors.country");
      if (hasStates && !formData.state) newErrors.state = t("errors.state");
      if (hasCities && !formData.city) newErrors.city = t("errors.city");
      if (!formData.pinCode) newErrors.pinCode = t("errors.pincode");
      else if (!/^[0-9]{5,6}$/.test(formData.pinCode))
        newErrors.pinCode = "Enter a valid pincode (5-6 digits).";
    }
    
    if (stepNumber === 3) {
      // Step 3 doesn't have required fields
    }
    
    if (stepNumber === 4) {
      if (!formData.email) newErrors.email = t("errors.requiredField");
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = t("errors.email");
      
      const passwordValidation = validatePassword(formData.password);
      if (!formData.password) newErrors.password = t("errors.requiredField");
      else if (!passwordValidation.isValid)
        newErrors.password = t("errors.password");
      
      if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm password.";
      else if (formData.confirmPassword !== formData.password)
        newErrors.confirmPassword =t( "errors.confirmPassword");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    // Mark all fields in current step as touched
    let newTouched = { ...touched };
    
    if (step === 1) {
      newTouched = {
        ...newTouched,
        restaurantName: true,
        ownerName: true,
        contact: true,
      };
    } else if (step === 2) {
      newTouched = {
        ...newTouched,
        restaurantAddress1: true,
        country: true,
        pinCode: true,
        state: true,
        city: true,
      };
    } else if (step === 4) {
      newTouched = {
        ...newTouched,
        email: true,
        password: true,
        confirmPassword: true,
      };
    }
    
    setTouched(newTouched);
    
    // Validate current step
    if (validateStep(step)) {
      const newStep = step + 1;
      setStep(newStep);
      try {
        window.history.pushState({ step: newStep }, "");
      } catch (e) {}
      window.scrollTo(0, 0);
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  // Handle previous step
  const handlePrev = () => {
    if (step > 1) {
      const newStep = step - 1;
      setStep(newStep);
      try {
        window.history.replaceState({ step: newStep }, "");
      } catch (e) {}
      window.scrollTo(0, 0);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate step 4
    setTouched({
      ...touched,
      email: true,
      password: true,
      confirmPassword: true,
    });
    
    if (validateStep(4)) {
      try {
        // Prepare form data for API
        const formDataToSend = new FormData();
        formDataToSend.append("restaurantName", formData.restaurantName);
        formDataToSend.append("ownerName", formData.ownerName);
        formDataToSend.append("gstNumber", formData.gstNumber || "");
        formDataToSend.append("contact", formData.contact);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        
        // Prepare address object
        const address = {
          line1: formData.restaurantAddress1,
          line2: formData.restaurantAddress2,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          pincode: formData.pinCode,
        };
        formDataToSend.append("address", JSON.stringify(address));
        
        // Append images
        if (formData.images && formData.images.length > 0) {
          formDataToSend.append("image", formData.images[0]);
        }
        
        if (formData.logo) {
          formDataToSend.append("logoImage", formData.logo);
        }
        
        if (formData.tagLine) {
          formDataToSend.append("tagline", formData.tagLine);
        }
        
       const response = await registerRestaurant(formDataToSend);
        toast.success(
          response.message || "Registered successfully! Please log in."
        );
        // Reset form and navigate
        setFormData({
          restaurantName: "",
          ownerName: "",
          gstNumber: "",
          contact: "",
          restaurantAddress1: "",
          restaurantAddress2: "",
          country: "",
          state: "",
          city: "",
          pinCode: "",
          tagLine: "",
          images: [],
          logo: null,
          email: "",
          password: "",
          confirmPassword: "",
        });
        
        navigate("/login");
        
      } catch (error) {
        console.error("Registration error:", error);
        toast.error(error.response?.data?.error || "Registration failed. Please try again.");
      }
    } else {
      toast.error("Please fill all fields correctly.");
    }
    
    setIsSubmitting(false);
  };

  // Render steps based on current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-inner" data-aos="fade-up">
            {/* ... (step 1 markup unchanged) */}
            <div className="form-group">
              <label className="form-label">{t("restaurantName")}</label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("enterRestaurantName")}
                className={`form-input ${errors.restaurantName && touched.restaurantName ? 'error' : ''}`}
                autoComplete="off"
              />
              {errors.restaurantName && touched.restaurantName && (
                <div className="error-message">{errors.restaurantName}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">{t("ownerName")}</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("enterOwnerName")}
                className={`form-input ${errors.ownerName && touched.ownerName ? 'error' : ''}`}
                autoComplete="off"
              />
              {errors.ownerName && touched.ownerName && (
                <div className="error-message">{errors.ownerName}</div>
              )}
            </div>

            <div className="form-group small-row">
              <div>
                <label className="form-label">{t("gstNumber")}</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder={t("gstNumber")}
                  className="form-input"
                  autoComplete="off"
                />
              </div>

              <div className="form-group phone-input-wrapper">

  <label className="form-label">{t("contactNumber")}</label>

  <PhoneInput
    country={"in"}
    value={formData.contact}
    onChange={handlePhoneChange}
    inputClass={`form-input ${errors.contact && touched.contact ? "error" : ""}`}
    containerClass="phone-container"
    inputProps={{
      name: "contact",
      autoComplete: "off",
      onBlur: () => handleBlur({ target: { name: "contact" } })
    }}
  />

  {errors.contact && touched.contact && (
    <div className="phone-error-message">
      {errors.contact}
    </div>
  )}

</div>

            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-inner" data-aos="fade-up">
            {/* ... (step 2 markup unchanged) */}
            <div className="form-group">
              <label className="form-label">
               {t("restaurantAddress1")}
              </label>
              <input
                type="text"
                name="restaurantAddress1"
                value={formData.restaurantAddress1}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("enterAddress1")}
                className={`form-input ${errors.restaurantAddress1 && touched.restaurantAddress1 ? 'error' : ''}`}
                autoComplete="off"
              />
              {errors.restaurantAddress1 && touched.restaurantAddress1 && (
                <div className="error-message">{errors.restaurantAddress1}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                 {t("restaurantAddress2")}
              </label>
              <input
                type="text"
                name="restaurantAddress2"
                value={formData.restaurantAddress2}
                onChange={handleChange}
                placeholder={t("enterAddress2Optional")}
                className="form-input"
                autoComplete="off"
              />
            </div>

            <div className="form-group small-row">
              <div>
                <label className="form-label">{t("country")}</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={(e) => handleLocationChange("country", e.target.value)}
                  onBlur={handleBlur}
                  className={`form-select ${errors.country && touched.country ? 'error' : ''}`}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && touched.country && (
                  <div className="error-message">{errors.country}</div>
                )}
              </div>

             <div className="pin-wrapper">
  <label className="form-label">{t("pincode")}</label>

  <input
    type="text"
    name="pinCode"
    value={formData.pinCode}
    onChange={handleChange}
    onBlur={handleBlur}
    placeholder="Enter pincode"
    className={`form-input ${errors.pinCode && touched.pinCode ? "error" : ""}`}
    autoComplete="off"
    maxLength="6"
  />

  {errors.pinCode && touched.pinCode && (
    <div className="pin-error-message">{errors.pinCode}</div>
  )}
</div>

            </div>

            {hasStates && (
              <div className="form-group small-row">
                <div>
                  <label className="form-label">{t("state")}</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={(e) => handleLocationChange("state", e.target.value)}
                    onBlur={handleBlur}
                    className={`form-select ${errors.state && touched.state ? 'error' : ''}`}
                  >
                    <option value="">Select State</option>
                    {stateList.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && touched.state && (
                    <div className="error-message">{errors.state}</div>
                  )}
                </div>
              </div>
            )}

            {hasCities && (
              <div className="form-group small-row">
                <div>
                  <label className="form-label">{hasStates ? t("City") : t("City/Region")}</label>
                  {cityList.length > 0 ? (
                    <select
                      name="city"
                      value={formData.city}
                      onChange={(e) => handleLocationChange("city", e.target.value)}
                      onBlur={handleBlur}
                      className={`form-select ${errors.city && touched.city ? 'error' : ''}`}
                    >
                      <option value="">Select {hasStates ? "City" : "City/Region"}</option>
                      {cityList.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter city name"
                      className={`form-input ${errors.city && touched.city ? 'error' : ''}`}
                    />
                  )}
                  {errors.city && touched.city && (
                    <div className="error-message">{errors.city}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="step-inner" data-aos="fade-up">
            {/* ... (step 3 markup unchanged) */}
            <div className="form-group">
              <label className="form-label">Tag-line of your Restaurant</label>
              <textarea
                name="tagLine"
                value={formData.tagLine}
                onChange={handleChange}
                placeholder="Enter a catchy tagline for your restaurant"
                className="form-textarea"
              />
            </div>

            <div className="upload-row">
              <div className="upload-box">
                <label htmlFor="images-upload" style={{ cursor: "pointer", display: "block" }}>
                  <div className="upload-icon">⬇</div>
                  <div className="upload-text">{t("upload.coverLabel")}</div>
                  {previewImage && (
                    <div className="preview-container">
                      <img src={previewImage} alt="Preview" className="preview-image" />
                    </div>
                  )}
                </label>
                <input
                  id="images-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "images")}
                  style={{ display: "none" }}
                />
              </div>

              <div className="upload-box">
                <label htmlFor="logo-upload" style={{ cursor: "pointer", display: "block" }}>
                  <div className="upload-icon">⬇</div>
                  <div className="upload-text">{t("upload.logoLabel")}</div>
                  {previewLogo && (
                    <div className="preview-container">
                      <img src={previewLogo} alt="Logo Preview" className="preview-image" />
                    </div>
                  )}
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logo")}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-inner" data-aos="fade-up">
            {/* ... (step 4 markup unchanged) */}
            <div className="form-group">
              <label className="form-label">{t("email")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="example@gmail.com"
                className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
                autoComplete="off"
              />
              {errors.email && touched.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            <div className="form-group password-field">
              <label className="form-label">{t("password")}</label>
              <div className="input-with-icon">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter password"
                  className={`form-input ${errors.password && touched.password ? 'error' : ''}`}
                />
                
              </div>
              {errors.password && touched.password && (
                <div className="error-message">{errors.password}</div>
              )}
              
              {/* Password Requirements */}
              <div className="password-requirements-container">
                <PasswordRequirements password={formData.password} />
              </div>
            </div>

            <div className="form-group password-field">
              <label className="form-label">{t("confirmPassword")}</label>
              <div className="input-with-icon">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Confirm password"
                  className={`form-input ${errors.confirmPassword && touched.confirmPassword ? 'error' : ''}`}
                />
               
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="error-message">{errors.confirmPassword}</div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="logo-section">
          <div className="logo-icon"></div>
          <div className="logo-text">{t("logoText")}</div>
        </div>

        <div className="form-section">
          <div className="register-form-card">
            <div className="form-header">
              <h1 className="form-title">{t("formTitle")}</h1>
              <p className="form-subtitle">{t("formSubtitle")}</p>
            </div>

           <div className="progress-indicator">
  <div className={`step-circle ${step === 1 ? "active" : ""}`}>1</div>
  <div className="step-line"></div>

  <div className={`step-circle ${step === 2 ? "active" : ""}`}>2</div>
  <div className="step-line"></div>

  <div className={`step-circle ${step === 3 ? "active" : ""}`}>3</div>
  <div className="step-line"></div>

  <div className={`step-circle ${step === 4 ? "active" : ""}`}>4</div>
</div>


            <form onSubmit={handleSubmit} className="form-body">
              {renderStep()}

              <div className="form-actions">
                {step > 1 && (
                  <button type="button" className="btn-secondary" onClick={handlePrev}>
                    Back
                  </button>
                )}

                {step < 4 ? (
                  <button type="button" className="submit-button" onClick={handleNext}>
                    {t("next")}
                  </button>
                ) : (
                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>  t("processing")
                      </>
                    ) : (
                      t("completeRegistration")
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="food-artwork">
        
          <img
            ref={artworkRef}
            src={artworkSrc}
            alt="food artwork"
            className={`food-artwork-img ${artworkFade ? 'artwork-fade' : ''}`}
            draggable="false"
          />
        </div>
      </div>
    </>
  );
}
