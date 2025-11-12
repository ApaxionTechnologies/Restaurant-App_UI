import React, { useState, useEffect, useRef } from "react";
import "../styles/AddMenuItem.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getMyRestaurant,
  addMenuItem,
  updateMenuItem,
} from "../services/apiService.js";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer.jsx";

const AddMenuItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemId } = useParams();
  const editItem = location.state?.itemToEdit;
  const isEditMode = Boolean(itemId);

  const [restaurant, setRestaurant] = useState(null);

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
    taxType: "exclusive", // 🔹 Default
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});
  const toastTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const categoryRef = useRef(null);

  const categoryOptions = ["Starter", "Main Course", "Dessert", "Drinks"];
  const cuisineOptions = [
    "Indian",
    "Japanese",
    "Chinese",
    "Italian",
    "Mexican",
  ];

  // 🔹 Hardcoded GST Slabs per category
  const categoryTaxMap = {
    Starter: 5,
    "Main Course": 12,
    Dessert: 18,
    Drinks: 28,
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await getMyRestaurant();
        setRestaurant(res.restaurant);
      } catch (err) {
        console.error("Fetch /me failed -", err);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    if (isEditMode && editItem) {
      console.log("Editing item:", editItem); 
      setFormData({
        category: editItem.category || "Starter",
        name: editItem.name || "",
        price: editItem.price || "",
        cuisine: editItem.cuisine || "Indian",
        timeToPrepare: editItem.prepTime || "",
        ingredients: JSON.stringify(editItem.ingredients) || "",
        description: editItem.description || "",
        status: editItem.status || "Published",
        discount: editItem.discount || "",
        vegType: editItem.type || "veg",
        taxType: editItem.taxType || "exclusive",
      });
      if (editItem.image) {
        setImagePreview(editItem.image);
        setImageFile(null);
      }
    }
  }, [isEditMode, editItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setErrors((s) => {
      const copy = { ...s };
      delete copy[name];
      return copy;
    });
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formError) setFormError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setImageError("File too large! Max 2MB.");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setImageError("Only JPG or PNG allowed.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageError("");
  };

  const validateRequiredFields = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Item name required";
    if (formData.price === "") newErrors.price = "Price required";
    if (formData.timeToPrepare === "")
      newErrors.timeToPrepare = "Preparation time required";
    if (!formData.cuisine.trim()) newErrors.cuisine = "Cuisine required";
    // if (!formData.gstRate) newErrors.gstRate = "GST rate required";
    if (!formData.ingredients.trim()) newErrors.ingredients = "Ingredients required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateRequiredFields()) return;
    if (!imageFile && !imagePreview) {
      setErrors((s) => ({ ...s, image: true }));
      setFormError("Please upload an image.");
      return;
    }

    // 🔹 Select GST rate based on category
    const gstRate = categoryTaxMap[formData.category] || 5;

   const ingredientsArray = formData.ingredients
  .split(",")
  .map((item) => item.trim())
  .filter((item) => item);

    const data = new FormData();
    data.append("category", formData.category);
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("cuisine", formData.cuisine);
    data.append("prepTime", formData.timeToPrepare);
    data.append("ingredients", JSON.stringify(ingredientsArray));
    data.append("description", formData.description);
    data.append("status", formData.status);
    data.append("type", formData.vegType.toLowerCase());
    data.append("discount", formData.discount || "");
    data.append("gstRate", gstRate); // 🔹 Auto GST from category
    data.append("taxType", formData.taxType);
    if (imageFile) data.append("image", imageFile);

    try {
      if (isEditMode) {
        const updatedItem = await updateMenuItem(itemId, data);
        toast.success("✅ Menu item updated successfully!");
        navigate("/admin-dashboard", { state: { updatedItem } });
      } else {
        const newItem = await addMenuItem(data);
        toast.success("✅ Menu item added successfully!");
        navigate("/admin-dashboard", { state: { newItem } });
      }
      handleReset();
    } catch (err) {
      console.error("❌ Error saving item:", err.response?.data || err.message);
      showFormError(
        "❌ " + (err.response?.data?.message || "Something went wrong.")
      );
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
      taxType: "exclusive",
    });
    setImageFile(null);
    setImagePreview(null);
    setImageError("");
    setFormError("");
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const showFormError = (msg) => {
    setFormError(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setFormError("");
      toastTimerRef.current = null;
    }, 4000);
  };

  return (
    <>
      <div className="add-menu-wrapper">
        <div className="top-buttons1">
          {/* <button
            type="button"
            className="btn btn-secondary add-multiple-btn"
            onClick={() => navigate("/add-bulk-items")}
          >
            ➕ Add Multiple Items
          </button> */}
          <a
            onClick={() => navigate("/add-bulk-items")}
            className="l1"
          >
            Add Multiple Items
          </a>
        </div>
        <div className="add-menu-container">
          <div className="card-header">
            <div className="header-flex">
              <div className="title">
                <h2>{isEditMode ? "Edit Item" : "Add Item"}</h2>
              </div>
              <div className="restaurant-id">
                Restaurant ID: {restaurant?._id || "Loading..."}
              </div>
            </div>
          </div>

          <div className="card-body">
            {formError && <div className="toast toast-error">{formError}</div>}

            <form onSubmit={handleSubmit} className="add-menu-form" noValidate>
              {/* Item Name & Ingredients */}
              <div className="form-grid">
                <div className="field-wrappers">
                  <label>Item Name</label>
                  <input
                    ref={nameRef}
                    name="name"
                    className={`input ${errors.name ? "error" : ""}`}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && (
                    <div className="error-message">{errors.name}</div>
                  )}
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

              {/* Category & Cuisine */}
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
                  {errors.category && (
                    <span className="error-message">{errors.category}</span>
                  )}
                </div>

                <div>
                  <label>Cuisine</label>
                  <select
                    name="cuisine"
                    className={`select ${errors.cuisine ? "error" : ""}`}
                    value={formData.cuisine}
                    onChange={handleChange}
                  >
                    {cuisineOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.cuisine && (
                    <span className="error-message">{errors.cuisine}</span>
                  )}
                </div>
              </div>

              {/* Type & TaxType together as form-grid */}
              <div className="form-grid">
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
                {/* <div>
                  <label>GST.Exclusive / Inclusive</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="taxType"
                        value="exclusive"
                        checked={formData.taxType === "exclusive"}
                        onChange={handleChange}
                      />{" "}
                      Exclusive
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="taxType"
                        value="inclusive"
                        checked={formData.taxType === "inclusive"}
                        onChange={handleChange}
                      />{" "}
                      Inclusive
                    </label>
                  </div>
                </div> */}
              </div>

              {/* Price & Discount */}
              <div className="form-grid">
                <div className="field-wrappers">
                  <label>Price (₹)</label>
                  <input
                    ref={priceRef}
                    type="number"
                    name="price"
                    className={`input ${errors.price ? "error" : ""}`}
                    value={formData.price}
                    onChange={handleChange}
                  />
                  {errors.price && (
                    <div className="error-message">{errors.price}</div>
                  )}
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

              {/* Time to Prepare & Description */}
              <div className="field-wrappers">
                <label>Time to Prepare (mins)</label>
                <input
                  type="number"
                  name="timeToPrepare"
                  className={`input ${errors.timeToPrepare ? "error" : ""}`}
                  value={formData.timeToPrepare}
                  onChange={handleChange}
                />
                {errors.timeToPrepare && (
                  <div className="error-message">{errors.timeToPrepare}</div>
                )}
              </div>

              <div style={{ marginBottom: "5px" }}>
                <label>Description</label>
                <textarea
                  name="description"
                  className="textarea"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Status */}
              <div>
                <label>Status</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="Published"
                      checked={formData.status === "Published"}
                      onChange={handleChange}
                    />{" "}
                    Published
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="Draft"
                      checked={formData.status === "Draft"}
                      onChange={handleChange}
                    />{" "}
                    Draft
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {isEditMode ? "Save Changes" : "Save Item"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </form>

            <aside className="right-panel">
              <h4>Preview</h4>
              <label
                className={`upload-btn ${
                  imageError || errors.image ? "error" : ""
                }`}
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

              <div className="preview-container">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="preview-img"
                  />
                ) : (
                  <p className="no-preview-text">No image uploaded yet</p>
                )}
              </div>

              {imageError && <p style={{ color: "red" }}>{imageError}</p>}
            </aside>
          </div>
        </div>
      </div>

      {<Footer />}
    </>
  );
};

export default AddMenuItem;
