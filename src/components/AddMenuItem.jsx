
import React, { useState, useEffect, useRef } from "react";
import "../styles/AddMenuItem.css";
import Footer from "./Footer";
import HomeHeader from "./HomeHeader.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyRestaurant, addMenuItem, updateMenuItem } from "../services/apiService.js";
import { useLocation, useParams } from "react-router-dom";

const AddMenuItem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemId } = useParams();
  const editItem = location.state?.itemToEdit;
    const isEditMode = Boolean(itemId);

  const [restaurantName, setRestaurantName] = useState(
    localStorage.getItem("restaurant") || "My Restaurant"
  );
  const [adminEmail, setAdminEmail] = useState("");
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("token");
       const res = await getMyRestaurant(token);
        setRestaurant(res.restaurant);
      } catch (err) {
        console.error("Fetch /me failed -", err);
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
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});
  const showFormError = (msg) => {
    setFormError(msg);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setFormError("");
      toastTimerRef.current = null;
    }, 4000);
  };

  const fileInputRef = useRef(null);
  const toastTimerRef = useRef(null);

  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const categoryRef = useRef(null);

  const categoryOptions = ["Starter", "Main Course", "Dessert", "Drinks"];
  const cuisineOptions = ["Indian", "Japanese", "Chinese", "Italian", "Mexican"];

  useEffect(() => {
    if (isEditMode && editItem) {
      setFormData({
        category: editItem.category || "Starter",
        name: editItem.name || "",
        price: editItem.price || "",
        cuisine: editItem.cuisine || "Indian",
        timeToPrepare: editItem.timeToPrepare || "",
        ingredients: editItem.ingredients || "",
        description: editItem.description || "",
        status: editItem.status || "Published",
        discount: editItem.discount || "",
        vegType: editItem.type || "veg",
      });
      if (editItem.image) {
        setImagePreview(editItem.image);
        setImageFile(null);
      }
    }
  }, [isEditMode, editItem]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((s) => {
      const copy = { ...s };
      delete copy[name];
      return copy;
    });
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const validateRequiredFields = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Item name required";
    if (formData.price === "") newErrors.price = "Price required";
    if (formData.timeToPrepare === "") newErrors.timeToPrepare = "Preparation time required";
    if (!formData.cuisine.trim()) newErrors.cuisine = "Cuisine required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // const handleSubmit = async (e) => {
  // e.preventDefault();
  // if (!validateRequiredFields()) return;
  // if (!imageFile && !imagePreview) {
  //   setErrors((s) => ({ ...s, image: true }));
  //   setFormError("Please upload an image.");
  //   return;
  // }

  // const data = new FormData();
  // data.append("category", formData.category);
  // data.append("name", formData.name);
  // data.append("price", formData.price);
  // data.append("cuisine", formData.cuisine);
  // data.append("timeToPrepare", formData.timeToPrepare);
  // data.append("ingredients", formData.ingredients);
  // data.append("description", formData.description);
  // data.append("status", formData.status);
  // data.append("type", formData.vegType.toLowerCase());

  // if (formData.discount) data.append("discount", formData.discount);
  // if (imageFile) data.append("image", imageFile);

  // try {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     showFormError("⚠️ No token found. Please log in again.");
  //     navigate("/");
  //     return;
  //   }

  //   const res = await addMenuItem(data, token); // ✅ await now valid
  //   const createdItem = res.item || res;

  //   const normalizedNew = {
  //     ...createdItem,
  //     statusNormalized:
  //       (createdItem.status ?? "").toString().trim().toLowerCase() || "draft",
  //     status:
  //       (createdItem.status ?? "").toString().trim().toLowerCase() === "published"
  //         ? "Published"
  //         : "Draft",
  //   };

  //   toast.success("✅ Menu item added successfully!");
  //   navigate("/admin-dashboard");

  //     setFormData({
  //       category: "Starter",
  //       name: "",
  //       price: "",
  //       cuisine: "Indian",
  //       timeToPrepare: "",
  //       ingredients: "",
  //       description: "",
  //       status: "Published",
  //       discount: "",
  //       vegType: "veg",
  //     });

  //     if (imagePreview) {
  //       try {
  //         URL.revokeObjectURL(imagePreview);
  //       } catch (err) {}
  //     }
  //     setImageFile(null);
  //     setImagePreview(null);
  //     setImageError("");
  //     setFormError("");
  //     setErrors({});

  //     if (fileInputRef.current) fileInputRef.current.value = "";
      
  //   } catch (err) {
  //     console.error("❌ Error adding item:", err.response?.data || err.message);
  //     showFormError("❌ Failed to add item: " + (err.response?.data?.message || "Please try again."));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateRequiredFields()) return;
    if (!imageFile && !imagePreview) {
      setErrors((s) => ({ ...s, image: true }));
      setFormError("Please upload an image.");
      return;
    }

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

      let res;
      if (isEditMode) {
        // ✅ Call update API if edit mode
        res = await updateMenuItem(itemId, data, token);
        toast.success("✅ Menu item updated successfully!");
        toast("⚠️ Note: No Edit API found, item duplicated instead!");
      } else {
        // ✅ Call add API if new item
        res = await addMenuItem(data, token);
        toast.success("✅ Menu item added successfully!");
      }

      navigate("/admin-dashboard");

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
    console.error("❌ Error saving item:", err.response?.data || err.message);

    if (isEditMode) {
      toast.error("❌ Failed to update item. Please try again.");
    } else {
      toast.error("❌ Failed to add item. Please try again.");
    }

    showFormError("❌ " + (err.response?.data?.message || "Something went wrong."));
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
    setImageFile(null);
    setImagePreview(null);
    setImageError("");
    setFormError("");
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
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
            <h2>{isEditMode ? "Edit Item" : "Add Item"}</h2>
            <div className="sub">Restaurant ID: {restaurant?._id || "Loading..."}</div>
          </div>

          <div className="card-body">
            {formError && <div className="toast toast-error">{formError}</div>}

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
                  {errors.name && <span className="error-message">{errors.name}</span>}
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
                  <label>Category</label>
                  <select
                    ref={categoryRef}
                    name="category"
                    className={`select ${errors.category ? "error" : ""}`}
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.category && <span className="error-message">{errors.category}</span>}
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
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.cuisine && <span className="error-message">{errors.cuisine}</span>}
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
                  />
                  {errors.price && <span className="error-message">{errors.price}</span>}
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
                      /> Veg
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="vegType"
                        value="non-veg"
                        checked={formData.vegType === "non-veg"}
                        onChange={handleChange}
                      /> Non-Veg
                    </label>
                  </div>
                </div>

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
                      /> Published
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value="Draft"
                        checked={formData.status === "Draft"}
                        onChange={handleChange}
                      /> Draft
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label>Time to Prepare (mins)</label>
                <input
                  type="number"
                  name="timeToPrepare"
                  className={`input ${errors.timeToPrepare ? "error" : ""}`}
                  value={formData.timeToPrepare}
                  onChange={handleChange}
                />
                {errors.timeToPrepare && <span className="error-message">{errors.timeToPrepare}</span>}
              </div>

              <div>
                <label>Description</label>
                <textarea
                  name="description"
                  className="textarea"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                  {isEditMode ? "Save Changes" : "Save Item"}
                </button>
                <button type="button" className="btn btn-ghost" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </form>

            <aside className="right-panel">
  <h4>Preview</h4>

  <label className={`upload-btn ${imageError || errors.image ? "error" : ""}`}>
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
      <img src={imagePreview} alt="preview" className="preview-img" />
    ) : (
      <p className="no-preview-text">No image uploaded yet</p>
    )}
  </div>

  {imageError && <p style={{ color: "red" }}>{imageError}</p>}
</aside>

         </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddMenuItem;
