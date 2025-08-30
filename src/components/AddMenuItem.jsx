import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/AddMenuItem.css";
import Footer from "./Footer";
import HomeHeader from "./HomeHeader.jsx";
import { useNavigate } from "react-router-dom";

const AddMenuItem = () => {
  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState(
    localStorage.getItem("restaurant") || "My Restaurant"
  );
  const [adminEmail, setAdminEmail] = useState("");
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/api/restaurants/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant(res.data.restaurant);
      } catch (err) {
        console.error("Fetch /me failed -", err.response?.status, err.response?.data);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    const storedToken = localStorage.getItem("token");

    if (!storedEmail || !storedToken) {
      navigate("/");
    } else {
      setAdminEmail(storedEmail);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("restaurant");
    navigate("/");
  };

  const [formData, setFormData] = useState({
    category: "Starter",
    name: "",
    price: "",
    cuisine: "Indian",
    timeToPrepare: "",
    ingredients: "",
    description: "",
    status: "Published",
    discount: "",
    vegType: "veg",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [formError, setFormError] = useState(""); // toaster/form error
  const [errors, setErrors] = useState({}); // field-level errors: { name:true, price:true, category:true, image:true }

  const fileInputRef = useRef(null);
  const toastTimerRef = useRef(null);

  // refs to focus first invalid field
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const categoryRef = useRef(null);

  const categoryOptions = ["Starter", "Main Course", "Dessert", "Drinks"];
  const cuisineOptions = ["Indian", "Japanese", "Chinese", "Italian", "Mexican"];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // clear field error as user types/selects
    setErrors((s) => {
      const copy = { ...s };
      if (copy[name]) delete copy[name];
      return copy;
    });
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? value : value,
    }));
    // also clear global errors
    if (formError) setFormError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // reset error
    setImageError("");
    setFormError("");
    setErrors((s) => {
      const copy = { ...s };
      if (copy.image) delete copy.image;
      return copy;
    });

    // size check (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setImageError("File too large! Max size is 2MB.");
      e.target.value = "";
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    // type check
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setImageError("Only JPG or PNG images are allowed.");
      e.target.value = "";
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (imagePreview) {
        try {
          URL.revokeObjectURL(imagePreview);
        } catch (err) {}
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageError("");
      setFormError("");
    };
    img.src = URL.createObjectURL(file);
  };

  useEffect(() => {
    return () => {
      // cleanup preview url
      if (imagePreview) {
        try {
          URL.revokeObjectURL(imagePreview);
        } catch (err) {}
      }
      // cleanup toast timer
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showFormError = (msg) => {
    setFormError(msg);

    // clear any existing timer
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    // auto-dismiss after 4s
    toastTimerRef.current = setTimeout(() => {
      setFormError("");
      toastTimerRef.current = null;
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   if (!imageFile) {
    setErrors({ image: true });
    showFormError("Please upload an image before saving.");
    if (fileInputRef.current) fileInputRef.current.focus();
    return;
  }
    // proceed with submit
    const data = new FormData();
    data.append("category", formData.category);
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("cuisine", formData.cuisine);
    data.append("timeToPrepare", formData.timeToPrepare);
    data.append("ingredients", formData.ingredients);
    data.append("description", formData.description);
    data.append("status", formData.status);
    data.append("type", formData.vegType.toLowerCase());

    if (formData.discount) data.append("discount", formData.discount);
    if (imageFile) data.append("image", imageFile);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showFormError("⚠️ No token found. Please log in again.");
        navigate("/");
        return;
      }

      await axios.post("http://localhost:5001/api/menu/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Menu item added successfully!");
      setFormData({
        category: "Starter",
        name: "",
        price: "",
        cuisine: "Indian",
        timeToPrepare: "",
        ingredients: "",
        description: "",
        status: "Published",
        discount: "",
       vegType: "veg", 
      });

      if (imagePreview) {
        try {
          URL.revokeObjectURL(imagePreview);
        } catch (err) {}
      }
      setImageFile(null);
      setImagePreview(null);
      setImageError("");
      setFormError("");
      setErrors({});

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("❌ Error adding item:", err.response?.data || err.message);
      showFormError("❌ Failed to add item: " + (err.response?.data?.message || "Please try again."));
    }
  };

  const handleReset = () => {
    setFormData({
      category: "Starter",
      name: "",
      price: "",
      cuisine: "Indian",
      timeToPrepare: "",
      ingredients: "",
      description: "",
      status: "Published",
      discount: "",
      vegType: "veg",
    });

    if (imagePreview) {
      try {
        URL.revokeObjectURL(imagePreview);
      } catch (err) {
        // ignore
      }
    }
    setImageFile(null);
    setImagePreview(null);
    setImageError("");
    setFormError("");
    setErrors({});

    // clear native file input so it shows empty
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      <div className="add-menu-container">
        <div className="add-menu-card">
          <div className="card-header">
            <div className="title">
              <h2>Add Item</h2>
            </div>
            <div className="sub">Restaurant ID: {restaurant?._id || "Loading..."}</div>
          </div>

          <div className="card-body">
            <div style={{ flex: 1 }}>
              {/* TOASTER / FORM ERROR */}
              {formError && (
                <div className="toast toast-error" role="alert" aria-live="assertive">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="add-menu-form" noValidate>
                <div className="form-grid">
                  <div>
                    <label>Item Name</label>
                    <input
                      ref={nameRef}
                      name="name"
                      className={`input ${errors.name ? "error" : ""}`}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label>Ingredients</label>
                    <input
                      name="ingredients"
                      className="input"
                      value={formData.ingredients}
                      onChange={handleChange}
                    />
                  </div>
                </div>

<div className="form-grid">
  <div>
    <label>Status</label>
    <div className="radio-group">
      <label>
        <input
          type="radio"
          name="status"
          value="Published"
          onChange={handleChange}
          checked={formData.status === "Published"}
        />{" "}
        Published
      </label>
      <label>
        <input
          type="radio"
          name="status"
          value="Draft"
          onChange={handleChange}
          checked={formData.status === "Draft"}
        />{" "}
        Draft
      </label>
    </div>
  </div>

  <div>
    <label>Type</label>
    <div className="radio-group">
      <label>
        <input
          type="radio"
           name="vegType"
            value="veg"
          checked={formData.vegType === "veg"}
          onChange={handleChange}
        />{" "}
        Veg
      </label>
      <label>
        <input
          type="radio"
           name="vegType"
    value="non-veg"
          checked={formData.vegType === "non-veg"}
          onChange={handleChange}
        />{" "}
        Non-Veg
      </label>
    </div>
  </div>
</div>
              <div className="form-grid">
  <div>
    <label>Category</label>
    <select
      ref={categoryRef}
      name="category"
      className={`select ${errors.category ? "error" : ""}`}
      value={formData.category}
      onChange={handleChange}
    >
      {categoryOptions.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label>Cuisine</label>
    <select
      name="cuisine"
      className="select"
      value={formData.cuisine}
      onChange={handleChange}
    >
      {cuisineOptions.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  </div>
</div>

<div className="form-grid">
                  <div>
                    <label>Price (₹)</label>
                    <input
                      ref={priceRef}
                      type="number"
                      name="price"
                      className={`input ${errors.price ? "error" : ""}`}
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label>Discount (%)</label>
                    <input
                      type="number"
                      name="discount"
                      className="input"
                      value={formData.discount}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-grid">
                 <div style={{ gridColumn: "1 / -1", width: "100%" }}>
                  <div>
                    <label style={{ display: "block" }}>Time to Prepare (mins)</label>
                    <input
                      type="number"
                      min="0"
                      name="timeToPrepare"
                      className="input"
                      value={formData.timeToPrepare}
                      onChange={handleChange}
                      placeholder="e.g. 30"
                    />
                    <div className="help">Enter expected preparation time in minutes.</div>
                  </div>
                </div>
                </div>

                <div className="form-full">
                  <label>Description</label>
                  <textarea
                    name="description"
                    className="textarea"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save Item
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={handleReset} style={{ color: "#000" }}>
                    Reset
                  </button>
                </div>
              </form>
            </div>

            <aside className="right-panel">
              <div className="right-header">
                <h4>Preview</h4>
                <label
                  className={`upload-btn ${imageError || errors.image ? "error" : ""}`}
                  title="Upload image (required)"
                >
                  Upload Image *
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                  />
                </label>
              </div>

              <div className="help">Recommended: 800×600px. JPG/PNG up to 2MB</div>
              {imageError && (
                <p style={{ color: "red", fontSize: "0.9rem", marginTop: "5px" }}>{imageError}</p>
              )}

              {imagePreview ? (
                <div style={{ marginTop: 12 }}>
                  <img src={imagePreview} alt="preview small" style={{ width: "100%", borderRadius: 8 }} />
                </div>
              ) : (
                <div className="meta">Uploaded image & quick stats will show here.</div>
              )}
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AddMenuItem;
