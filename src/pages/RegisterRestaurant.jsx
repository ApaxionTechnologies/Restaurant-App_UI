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
import { registerRestaurant, logoutRestaurant } from "../services/apiService";
import { useTranslation } from "react-i18next";
import { validatePassword, PasswordRequirements } from "../utils/passwordValidation";
import EmailVerificationModal from "./EmailVerificationModal";
import TermsConditionsModal from "./TermsConditionsModal";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import { sendOtp } from "../services/authService";

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

  const [previewImage, setPreviewImage] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const { t } = useTranslation();

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  
  const [countries, setCountries] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [hasStates, setHasStates] = useState(false);
  const [hasCities, setHasCities] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [emailError, setEmailError] = useState("");

  const artworkImages = [
    "/foodculter.png",
    "/steper3.png",
    "/steper2.png",
    "/steper4.png",
  ];
  const bgImages = {
    1: "/bg-peach.png",
    2: "/bg-step3.png",
    3: "/bg-peach.png",
    4: "/bg-step4.png",
  };

  const [artworkSrc, setArtworkSrc] = useState(artworkImages[0]);
  const [artworkFade, setArtworkFade] = useState(false);
  const artworkRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    setCountries(Country.getAllCountries());
    
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

  const handleEmailVerify = async () => {
    setEmailError("");

    if (!formData.email) {
      setEmailError("Please enter your email first");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      await sendOtp(formData.email);
      console.log("Sending OTP to:", formData.email);
      setShowVerificationModal(true);
    } catch (error) {
      setEmailError("Failed to send verification code. Please try again.");
    }
  };

  const handleVerifyEmail = (verified) => {
    if (verified) {
      setIsEmailVerified(true);
    } else {
      setIsEmailVerified(false);
    }
  };

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

  useEffect(() => {
    if (formData.country && formData.state) {
      const cities = City.getCitiesOfState(formData.country, formData.state);
      setCityList(cities || []);
      setHasCities(cities && cities.length > 0);
    }
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      const newEmail = value.toLowerCase();
      setIsEmailVerified(false);
      setEmailError("");
      setFormData({ ...formData, email: newEmail });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, contact: value });
    validateField("contact", value);
  };

  const handleLocationChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    
    if (field === "country") {
      newFormData.state = "";
      newFormData.city = "";
    } else if (field === "state") {
      newFormData.city = "";
    }
    
    setFormData(newFormData);
    validateField(field, value);
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case "restaurantName":
        if (!value) newErrors.restaurantName = t("register.errors.restaurantName");
        else delete newErrors.restaurantName;
        break;
        
      case "ownerName":
        if (!value) newErrors.ownerName = t("register.errors.ownerName");
        else if (!/^[A-Za-z\s]+$/.test(value))
          newErrors.ownerName = t("register.errors.validOwnerName");
        else delete newErrors.ownerName;
        break;
        
      case "contact":
        if (!value || value.length < 10)
          newErrors.contact = t("register.errors.contact");
        else delete newErrors.contact;
        break;
        
      case "restaurantAddress1":
        if (!value) newErrors.restaurantAddress1 = t("register.errors.addressLine1");
        else delete newErrors.restaurantAddress1;
        break;
        
      case "country":
        if (!value) newErrors.country = t("register.errors.country");
        else delete newErrors.country;
        break;
        
      case "pinCode":
        if (!value) newErrors.pinCode = t("register.errors.pincode");
        else if (!/^[0-9]{5,6}$/.test(value))
          newErrors.pinCode = "Enter a valid pincode (5-6 digits).";
        else delete newErrors.pinCode;
        break;
        
      case "email":
        if (!value) newErrors.email = t("register.errors.requiredField");
        else if (!/\S+@\S+\.\S+/.test(value))
          newErrors.email = t("register.errors.email");
        else delete newErrors.email;
        break;
        
      case "password":
        const passwordValidation = validatePassword(value);
        if (!value) newErrors.password = t("register.errors.requiredField");
        else if (!passwordValidation.isValid)
          newErrors.password = t("register.errors.password");
        else delete newErrors.password;
        break;
        
      case "confirmPassword":
        if (!value) newErrors.confirmPassword = "Please confirm password.";
        else if (value !== formData.password)
          newErrors.confirmPassword = t("register.errors.confirmPassword");
        else delete newErrors.confirmPassword;
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, formData[name]);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      e.target.value = null;
      return;
    }

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

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.restaurantName) newErrors.restaurantName = t("register.errors.restaurantName");
      if (!formData.ownerName) newErrors.ownerName = t("register.errors.ownerName");
      else if (!/^[A-Za-z\s]+$/.test(formData.ownerName))
        newErrors.ownerName = t("validOwnerName");
      if (!formData.contact || formData.contact.length < 10)
        newErrors.contact = t("register.errors.contact");
    }
    
    if (stepNumber === 2) {
      if (!formData.restaurantAddress1) newErrors.restaurantAddress1 = t("register.errors.address1");
      if (!formData.country) newErrors.country = t("register.errors.country");
      if (hasStates && !formData.state) newErrors.state = t("register.errors.state");
      if (hasCities && !formData.city) newErrors.city = t("register.errors.city");
      if (!formData.pinCode) newErrors.pinCode = t("register.errors.pincode");
      else if (!/^[0-9]{5,6}$/.test(formData.pinCode))
        newErrors.pinCode = "Enter a valid pincode (5-6 digits).";
    }
    
    if (stepNumber === 4) {
      if (!formData.email) newErrors.email = t("register.errors.requiredField");
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = t("errors.email");
  
      const passwordValidation = validatePassword(formData.password);
      if (!formData.password) newErrors.password = t("register.errors.requiredField");
      else if (!passwordValidation.isValid)
        newErrors.password = t("register.errors.password");
      
      if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm password.";
      else if (formData.confirmPassword !== formData.password)
        newErrors.confirmPassword = t("register.errors.confirmPassword");
       
      if (!acceptedTerms) newErrors.terms = "Please accept Terms & Conditions";
      if (!acceptedPrivacy) newErrors.privacy = "Please accept Privacy Policy";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
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
    
    if (validateStep(step)) {
      const newStep = step + 1;
      setStep(newStep);
      try {
        window.history.pushState({ step: newStep }, "");
      } catch (e) {}
      window.scrollTo(0, 0);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTouched({
      ...touched,
      email: true,
      password: true,
      confirmPassword: true,
    });
    
    if (validateStep(4)) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("restaurantName", formData.restaurantName);
        formDataToSend.append("ownerName", formData.ownerName);
        formDataToSend.append("gstNumber", formData.gstNumber || "");
        formDataToSend.append("contact", formData.contact);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        
        const address = {
          line1: formData.restaurantAddress1,
          line2: formData.restaurantAddress2,
          country: formData.country,
          state: formData.state,
          city: formData.city,
          pincode: formData.pinCode,
        };
        formDataToSend.append("address", JSON.stringify(address));
        
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
      }
    }
    
    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-inner" data-aos="fade-up">
            <div className="form-group">
              <label className="form-label">Restaurant Name</label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ramen Ipsum H"
                className={`form-input ${errors.restaurantName && touched.restaurantName ? 'error' : ''}`}
                autoComplete="off"
              />
              {errors.restaurantName && touched.restaurantName && (
                <div className="error-message">{errors.restaurantName}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Owner's Name</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Rahul Singh Roy"
                className={`form-input ${errors.ownerName && touched.ownerName ? 'error' : ''}`}
                autoComplete="off"
              />
              {errors.ownerName && touched.ownerName && (
                <div className="error-message">{errors.ownerName}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="Write 45345"
                className="form-input"
                autoComplete="off"
              />
            </div>

            <div className="form-group phone-input-wrapper">
              <label className="form-label">Contact Number</label>
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
        );

      case 2:
        return (
          <div className="step-inner" data-aos="fade-up">
            <div className="form-group">
              <label className="form-label">Restaurant Address 1</label>
              <input
                type="text"
                name="restaurantAddress1"
                value={formData.restaurantAddress1}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter address line 1"
                className={`form-input ${errors.restaurantAddress1 && touched.restaurantAddress1 ? 'error' : ''}`}
                autoComplete="off"
              />
              {errors.restaurantAddress1 && touched.restaurantAddress1 && (
                <div className="error-message">{errors.restaurantAddress1}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Restaurant Address 2</label>
              <input
                type="text"
                name="restaurantAddress2"
                value={formData.restaurantAddress2}
                onChange={handleChange}
                placeholder="Enter address line 2 (Optional)"
                className="form-input"
                autoComplete="off"
              />
            </div>

            <div className="form-row-two">
              <div className="form-group">
                <label className="form-label">Country</label>
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

              <div className="form-group pin-wrapper">
                <label className="form-label">Pincode</label>
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
              <div className="form-group">
                <label className="form-label">State</label>
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
            )}

            {hasCities && (
              <div className="form-group">
                <label className="form-label">{hasStates ? "City" : "City/Region"}</label>
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
            )}
          </div>
        );

      case 3:
        return (
          <div className="step-inner" data-aos="fade-up">
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
                  <div className="upload-text">Upload Cover Image</div>
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
                  <div className="upload-text">Upload Logo</div>
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
            <div className="form-group">
              <div className="form-group email-verify-wrapper">
                <label className="form-label">Email</label>

                <div className="email-input-container">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${errors.email && touched.email ? "error" : ""}`}
                    placeholder="example@gmail.com"
                    autoComplete="off"
                  />

                  {!isEmailVerified && formData.email && /\S+@\S+\.\S+/.test(formData.email) ? (
                    <span className="verify-link" onClick={handleEmailVerify}>
                      Verify
                    </span>
                  ) : null}

                  {isEmailVerified && (
                    <span className="verified-text">Verified ✓</span>
                  )}
                </div>

                {errors.email && touched.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              {isEmailVerified && (
                <div className="verification-status verified">
                  <i className="fas fa-check-circle"></i>
                  Email verified successfully
                </div>
              )}

              {errors.emailVerification && (
                <div className="checkbox-error">{errors.emailVerification}</div>
              )}
            </div>

            <div className="form-group password-field">
              <label className="form-label">Password</label>
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
              
              <div className="password-requirements-container">
                <PasswordRequirements password={formData.password} />
              </div>
            </div>

            <div className="form-group password-field">
              <label className="form-label">Confirm Password</label>
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

            <div className="terms-checkboxes">
              <label className="terms-label">
               <input
  type="checkbox"
  checked={acceptedTerms}
  onChange={(e) => setAcceptedTerms(e.target.checked)}
  style={{ accentColor: "#d0661d" }}
/>
                <span className="checkbox-text">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="terms-link"
                    onClick={() => setShowTermsModal(true)}
                  >
                    Terms &amp; Conditions
                  </button>
                </span>
                {errors.terms && (
                  <span className="checkbox-error">({errors.terms})</span>
                )}
              </label>

              <label className="terms-label">
               <input
  type="checkbox"
  checked={acceptedPrivacy}
  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
 style={{ accentColor: "#d0661d" }}
/>
                <span className="checkbox-text">
                  I agree to the
                  <span className="checkbox-link" onClick={() => setShowPrivacyModal(true)}>
                    {" "}Privacy Policy
                  </span>
                </span>
                {errors.privacy && (
                  <span className="checkbox-error">({errors.privacy})</span>
                )}
              </label>
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
          <div className="hero-logo-row">
            <img
              src="/restaurant_logo.png"
              alt="Restaurant Logo"
              className="hero-logo-image"
            />
            <h1>QRBites</h1>
          </div>
        </div>

        <img src="/vector-line.png" className="vector-line upper-line" alt="" />
        <img src="/vector-line.png" className="vector-line upper-line subtle" alt="" />

        <div className="form-section">
          <div className="register-form-card">
            <div className="form-header">
              <h1 className="form-title">Register your Restaurant</h1>
              <p className="form-subtitle">Lorem ipsum is a placeholder text commonly</p>
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
                {step < 4 ? (
                  <button type="button" className="submit-button" onClick={handleNext}>
                    Next
                  </button>
                ) : (
                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i> Processing
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <img src="/vector-line.png" alt="decorative line" className="vector-line main-line" draggable="false" />
        <img src="/vector-line.png" className="vector-line subtle" alt="" />

        <div className="food-artwork">
          <img 
            src={bgImages[step]} 
            alt="bg circle"
            className={`food-bg-circle 
              ${step === 2 ? "circle-step-3" : "circle-step-default"}
              ${step === 4 ? "circle-step-4-bottom" : "circle-step-default"}`}
            draggable="false"
          />

          {step === 4 && (
            <img
              src={bgImages[step]}
              alt="bg circle top"
              className="food-bg-circle circle-step-4-top"
              draggable="false"
            />
          )}

          <img
            ref={artworkRef}
            src={artworkSrc}
            alt="food artwork"
            className={`food-main ${artworkFade ? 'artwork-fade' : ''} ${
              artworkSrc === "/steper3.png" ? "small-food" : ""
            } ${
              artworkSrc === "/steper4.png" ? "food-img-4" : ""
            }`}
            draggable="false"
          />
        </div>
      </div>

      <EmailVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={formData.email}
        onVerify={handleVerifyEmail}
      />
     {/* TERMS & CONDITIONS MODAL */}
<TermsConditionsModal
  isOpen={showTermsModal}
  onClose={() => {
    setShowTermsModal(false);
    // Auto-check Terms only if unchecked
    setAcceptedTerms(true);
  }}
/>

{/* PRIVACY POLICY MODAL */}
<PrivacyPolicyModal
  isOpen={showPrivacyModal}
  onClose={() => {
    setShowPrivacyModal(false);
    // Auto-check Privacy only if unchecked
    setAcceptedPrivacy(true);
  }}
/>

    </>
  );
}