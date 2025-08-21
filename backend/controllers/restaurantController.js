// controllers/restaurantController.js
// controllers/restaurantController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Restaurant from "../models/Restaurant.js";

// helpers to sign tokens
const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "15m" });
};
const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN || "7d" });
};

// Register a new restaurant
export const registerRestaurant = async (req, res) => {
  try {
    // Frontend may send multipart/form-data (with file), so fields can be in req.body and file in req.file
    const {
      restaurantName,
      ownerName,      // from your frontend
      contact,
      email,
      password,
      tables,
      categories,
      tagline,
      address,        // expected as JSON string or object
    } = req.body;

    // basic validation (you can extend)
    if (!restaurantName || !ownerName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const existing = await Restaurant.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: "Restaurant with this email already exists!" });

    // hash password
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const restaurantData = {
      restaurantName,
      ownerName,
      contact,
      email: email.toLowerCase(),
      password: hashed,
      tables,
      categories: categories ? JSON.parse(categories) : [],
      tagline,
      address: typeof address === "string" ? JSON.parse(address) : address,
    };

    // If you're using multer for file upload:
    if (req.file) {
      // req.file.path or buffer depending on multer config
      restaurantData.image = req.file.path; // or handle upload to cloud and store URL
    }

    const newRestaurant = new Restaurant(restaurantData);
    await newRestaurant.save();

    // create tokens
    const payload = { id: newRestaurant._id };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    // set cookies
    res.cookie("token", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }); // 15 min
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days

    // never send password back
    const safeRestaurant = {
      id: newRestaurant._id,
      restaurantName: newRestaurant.restaurantName,
      ownerName: newRestaurant.ownerName,
      email: newRestaurant.email,
      tables: newRestaurant.tables,
      tagline: newRestaurant.tagline,
      categories: newRestaurant.categories,
      address: newRestaurant.address,
      image: newRestaurant.image,
    };

    return res.status(201).json({ message: "Registered successfully", restaurant: safeRestaurant });
  } catch (err) {
    console.error("❌ Registration error:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
};

// Login
// export const loginRestaurant = async (req, res) => {
//   try {
//     console.log("📩 Request Body:", req.body);

//     const { email, password } = req.body;

//     const restaurant = await Restaurant.findOne({ email: email.toLowerCase() });
//     console.log("🔍 Found Restaurant:", restaurant);

//     if (!restaurant) {
//       return res.status(401).json({ error: "Restaurant not found" });
//     }

//     const isMatch = await bcrypt.compare(password, restaurant.password);
//     console.log("✅ Password Match:", isMatch);

//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid password" });
//     }

//     res.json({ message: "Login successful" });
//   } catch (err) {
//     console.error("❌ Login Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// Login Restaurant
export const loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({ email: email.toLowerCase() });
    if (!restaurant) {
      return res.status(401).json({ error: "Restaurant not found" });
    }

    if (restaurant.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // ✅ Ab email aur name bhi token me dal rahe
    const token = jwt.sign(
      { id: restaurant._id, email: restaurant.email, 
    restaurantName: restaurant.restaurantName  },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};





// /auth/me - return current user based on cookie token
export const getCurrentRestaurant = async (req, res) => {
  try {
    // token read by middleware or directly from cookie
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const restaurant = await Restaurant.findById(payload.id).select("-password");
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    return res.status(200).json({ user: restaurant });
  } catch (err) {
    console.error("❌ getCurrentRestaurant error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// logout - clear cookies
export const logoutRestaurant = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("❌ Logout error:", err);
    return res.status(500).json({ error: "Logout failed" });
  }
};


// Get a restaurant by email
export const getRestaurantByEmail = async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email);
    const restaurant = await Restaurant.findOne({ email: decodedEmail });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({ restaurant });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
};

// Update tables
export const updateTables = async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email);
    const { tables } = req.body;

    const restaurant = await Restaurant.findOne({ email: decodedEmail });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    restaurant.tables = tables;
    await restaurant.save();

    res.status(200).json({ message: "Tables updated successfully" });
  } catch (err) {
    console.error("❌ Table update error:", err);
    res.status(500).json({ error: "Failed to update tables" });
  }
};

// Delete a restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email);
    const result = await Restaurant.findOneAndDelete({ email: decodedEmail });

    if (!result) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Failed to delete restaurant" });
  }
};

// Update restaurant profile
export const updateRestaurant = async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email);
    const updatedData = req.body;

    const updated = await Restaurant.findOneAndUpdate(
      { email: decodedEmail },
      updatedData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant updated", restaurant: updated });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: "Failed to update restaurant" });
  }
};
