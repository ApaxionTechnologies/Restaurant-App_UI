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
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const categoryOptions = ["Starter", "Main Course", "Dessert", "Drinks"];
  const cuisineOptions = ["Indian", "Japanese", "Chinese", "Italian", "Mexican"];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? value : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];

    if (imagePreview) {
      try {
        URL.revokeObjectURL(imagePreview);
      } catch (err) {
       
      }
    }

    setImageFile(file || null);

    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        try {
          URL.revokeObjectURL(imagePreview);
        } catch (err) {
        
        }
      }
    };
   
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("category", formData.category);
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("cuisine", formData.cuisine);
    data.append("timeToPrepare", formData.timeToPrepare);
    data.append("ingredients", formData.ingredients);
    data.append("description", formData.description);
    data.append("status", formData.status);
    if (formData.discount) data.append("discount", formData.discount);
    if (imageFile) data.append("image", imageFile);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ No token found. Please log in again.");
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
      });

      if (imagePreview) {
        try {
          URL.revokeObjectURL(imagePreview);
        } catch (err) {
       
        }
      }
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("❌ Error adding item:", err.response?.data || err.message);
      alert("❌ Failed to add item: " + (err.response?.data?.message || "Unauthorized"));
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
              <h2>Add Menu</h2>
              <div className="sub">Add a new dish to your menu</div>
            </div>
            <div className="sub">Restaurant: {restaurantName}</div>
          </div>

          <div className="card-body">
            <div>
              <form onSubmit={handleSubmit} className="add-menu-form">
                <div className="form-grid">
                  <div>
                    <label>Menu Name</label>
                    <input
                      name="name"
                      className="input"
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
                    <label>Category</label>
                    <select
                      name="category"
                      className="select"
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
                </div>

                <div className="form-grid">
                  <div>
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      className="input"
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
                  <div>
                    <label>Upload Image</label>
                    <div className="file-uploader">
                      <div className="file-drop">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                      {imagePreview && (
                        <img src={imagePreview} alt="preview" className="file-preview" />
                      )}
                    </div>
                    <div className="help">Recommended: 800×600px. JPG/PNG up to 2MB</div>
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

                    <label style={{ marginTop: 12, display: "block" }}>Time to Prepare (mins)</label>
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

                <div className="form-full">
                  <label>Ingredients & Description</label>
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
                  <button type="button" className="btn btn-ghost" onClick={handleReset}>
                    Reset
                  </button>
                </div>
              </form>
            </div>
            <aside className="right-panel">
              <h4>Preview</h4>
              <div className="meta">Uploaded image & quick stats will show here.</div>
              {imagePreview && (
                <div style={{ marginTop: 12 }}>
                  <img
                    src={imagePreview}
                    alt="preview small"
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                </div>
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
