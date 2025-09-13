// //------------23-08-2024 Updated Code Below------------//
// import Restaurant from "../models/Restaurant.js";

// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// // helpers to sign tokens
// const signAccessToken = (payload) => {
//   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "15m" });
// };
// const signRefreshToken = (payload) => {
//   return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN || "7d" });
// };

// // ✅ Register a new restaurant
// export const registerRestaurant = async (req, res) => {
//   try {
//     const {
//       restaurantName,
//       ownerName,
//       firstName,
//       lastName,
//       contact,
//       email,
//       password,
//       tables,
//       tagline,
//     } = req.body;

//     const categories = req.body.categories ? JSON.parse(req.body.categories) : [];
//     const address = req.body.address ? JSON.parse(req.body.address) : {};

//     const existingRestaurant = await Restaurant.findOne({ email });
//     if (existingRestaurant) {
//       return res
//         .status(400)
//         .json({ error: "Restaurant with this email already exists!" });
//     }

//     const newRestaurant = new Restaurant({
//       restaurantName,
//       ownerName,
//       firstName,
//       lastName,
//       contact,
//       email,
//       password, // ⚠️ In production: hash this
//       tables,
//       tagline,
//       categories,
//       address,
//       image: req.file ? `/uploads/${req.file.filename}` : null, // ✅ image path
//     });

//     await newRestaurant.save();
//     res
//       .status(201)
//       .json({
//         message: "Restaurant registered successfully!",
//         restaurant: newRestaurant,
//       });
//   } catch (err) {
//     console.error("❌ Registration error:", err);
//     return res.status(500).json({ error: "Registration failed" });
//   }
// };

// // ✅ Login
// export const loginRestaurant = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const restaurant = await Restaurant.findOne({ email: email.toLowerCase() });
//     if (!restaurant) {
//       return res.status(401).json({ error: "Restaurant not found" });
//     }

//     if (restaurant.password !== password) {
//       return res.status(401).json({ error: "Invalid password" });
//     }

//     // ✅ Ab email aur name bhi token me dal rahe
//     const token = jwt.sign(
//       { id: restaurant._id, email: restaurant.email, 
//     restaurantName: restaurant.restaurantName  },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({ message: "Login successful", token });
//   } catch (err) {
//     console.error("Login Error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };





// // /auth/me - return current user based on cookie token
// export const getCurrentRestaurant = async (req, res) => {
//   try {
//     // token read by middleware or directly from cookie
//     const token = req.cookies?.token;
//     if (!token) return res.status(401).json({ error: "Not authenticated" });

//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     const restaurant = await Restaurant.findById(payload.id).select("-password");
//     if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

//     return res.status(200).json({ user: restaurant });
//   } catch (err) {
//     console.error("❌ getCurrentRestaurant error:", err);
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// };

// // logout - clear cookies
// export const logoutRestaurant = async (req, res) => {
//   try {
//     res.clearCookie("token");
//     res.clearCookie("refreshToken");
//     return res.status(200).json({ message: "Logged out" });
//   } catch (err) {
//     console.error("❌ Logout error:", err);
//     return res.status(500).json({ error: "Logout failed" });
//   }
// };

// // Get a restaurant by email
// export const getRestaurantByEmail = async (req, res) => {
//   try {
//     const decodedEmail = decodeURIComponent(req.params.email);
//     const restaurant = await Restaurant.findOne({ email: decodedEmail });

//     if (!restaurant) {
//       return res.status(404).json({ error: "Restaurant not found" });
//     }

//     res.status(200).json({ restaurant });
//   } catch (err) {
//     console.error("❌ Fetch error:", err);
//     res.status(500).json({ error: "Failed to fetch restaurant" });
//   }
// };

// // ✅ Update tables
// export const updateTables = async (req, res) => {
//   try {
//     const decodedEmail = decodeURIComponent(req.params.email);
//     const { tables } = req.body;

//     const restaurant = await Restaurant.findOne({ email: decodedEmail });

//     if (!restaurant) {
//       return res.status(404).json({ error: "Restaurant not found" });
//     }

//     restaurant.tables = tables;
//     await restaurant.save();

//     res.status(200).json({ message: "Tables updated successfully" });
//   } catch (err) {
//     console.error("❌ Table update error:", err);
//     res.status(500).json({ error: "Failed to update tables" });
//   }
// };

// // ✅ Delete a restaurant
// export const deleteRestaurant = async (req, res) => {
//   try {
//     const decodedEmail = decodeURIComponent(req.params.email);
//     const result = await Restaurant.findOneAndDelete({ email: decodedEmail });

//     if (!result) {
//       return res.status(404).json({ error: "Restaurant not found" });
//     }

//     res.status(200).json({ message: "Restaurant deleted successfully" });
//   } catch (err) {
//     console.error("❌ Delete error:", err);
//     res.status(500).json({ error: "Failed to delete restaurant" });
//   }
// };

// // ✅ Update restaurant profile
// export const updateRestaurant = async (req, res) => {
//   try {
//     const decodedEmail = decodeURIComponent(req.params.email);
//     const updatedData = req.body;

//     if (req.file) {
//       updatedData.image = `/uploads/${req.file.filename}`;
//     }
//     if (updatedData.categories && typeof updatedData.categories === "string") {
//       updatedData.categories = JSON.parse(updatedData.categories);
//     }
//     if (updatedData.address && typeof updatedData.address === "string") {
//       updatedData.address = JSON.parse(updatedData.address);
//     }

//     const updated = await Restaurant.findOneAndUpdate(
//       { email: decodedEmail },
//       updatedData,
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ error: "Restaurant not found" });
//     }

//     res
//       .status(200)
//       .json({ message: "Restaurant updated", restaurant: updated });
//   } catch (err) {
//     console.error("❌ Update error:", err);
//     res.status(500).json({ error: "Failed to update restaurant" });
//   }
// };


  
//29-08-2024 Updated Code Below//
// controllers/restaurantController.js

import Restaurant from "../models/Restaurant.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// ✅ Token signers
const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "default_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};
const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET || "refresh_secret", {
    expiresIn: process.env.REFRESH_EXPIRES_IN || "7d",
  });
};

// ✅ Register
export const registerRestaurant = async (req, res) => {
  try {
    const {
      restaurantName,
      ownerName,
      firstName,
      lastName,
      contact,
      email,
      password,
      tables,
      tagline,
    } = req.body;

    const categories = req.body.categories ? JSON.parse(req.body.categories) : [];
    const address = req.body.address ? JSON.parse(req.body.address) : {};

    // ✅ always lowercase email
    const normalizedEmail = email.toLowerCase();

    const existingRestaurantName = await Restaurant.findOne({ restaurantName });
if (existingRestaurantName) {
  return res
    .status(400)
    .json({ error: "Restaurant name already exists!" });
}

    const existingRestaurant = await Restaurant.findOne({ email: normalizedEmail });
    if (existingRestaurant) {
      return res
        .status(400)
        .json({ error: "Restaurant with this email already exists!" });
    }

    // ✅ Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ File uploads
    const files = req.files || {};
    const mainImageFile = (files.image && files.image[0]) || req.file || null;
    const logoImageFile = files.logoImage && files.logoImage[0];
    const headerImageFile = files.headerImage && files.headerImage[0];
    const footerImageFile = files.footerImage && files.footerImage[0];

    const newRestaurant = new Restaurant({
      restaurantName,
      ownerName,
      firstName,
      lastName,
      contact,
      email: normalizedEmail,
      password: hashedPassword,
      tables,
      tagline,
      categories,
      address,

      image: mainImageFile
        ? `/uploads/${mainImageFile.filename || mainImageFile.originalname || mainImageFile}`
        : null,
      logoImage: logoImageFile ? `/uploads/${logoImageFile.filename}` : null,
      headerImage: headerImageFile ? `/uploads/${headerImageFile.filename}` : null,
      footerImage: footerImageFile ? `/uploads/${footerImageFile.filename}` : null,
    });

    await newRestaurant.save();

    res.status(201).json({
      message: "Restaurant registered successfully!",
      restaurant: newRestaurant,
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    return res.status(500).json({ error: "Registration failed", details: err.message });
  }
};


export const loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({ email: email.toLowerCase() });
    if (!restaurant) {
      return res.status(401).json({ error: "Restaurant not found" });
    }

    // ✅ Compare hash
    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: restaurant._id,
        email: restaurant.email,
        restaurantName: restaurant.restaurantName,
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// ✅ Get current restaurant
export const getCurrentRestaurant = async (req, res) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    const restaurant = await Restaurant.findById(payload.id).select("-password");
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    return res.status(200).json({ restaurant });
  } catch (err) {
    console.error("❌ getCurrentRestaurant error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ✅ Logout
export const logoutRestaurant = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("❌ Logout error:", err.message);
    return res.status(500).json({ error: "Logout failed" });
  }
};

// ✅ Get by email
export const getRestaurantByEmail = async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email).toLowerCase();
    const restaurant = await Restaurant.findOne({ email: decodedEmail });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({ restaurant });
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
};

// ✅ Update tables
export const updateTables = async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email).toLowerCase();
    const { tables } = req.body;

    const restaurant = await Restaurant.findOne({ email: decodedEmail });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    restaurant.tables = tables;
    await restaurant.save();

    res.status(200).json({ message: "Tables updated successfully" });
  } catch (err) {
    console.error("❌ Table update error:", err.message);
    res.status(500).json({ error: "Failed to update tables" });
  }
};

// ✅ Delete
export const deleteRestaurant = async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email).toLowerCase();
    const result = await Restaurant.findOneAndDelete({ email: decodedEmail });

    if (!result) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ error: "Failed to delete restaurant" });
  }
};

// ✅ Update profile
export const updateRestaurant = async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email).toLowerCase();
    const updatedData = { ...req.body };

    // ❌ Email cannot be changed
    if ("email" in updatedData) {
      delete updatedData.email;
    }

    // Parse JSON fields if needed
    if (updatedData.categories && typeof updatedData.categories === "string") {
      try {
        updatedData.categories = JSON.parse(updatedData.categories);
      } catch {}
    }
    if (updatedData.address && typeof updatedData.address === "string") {
      try {
        updatedData.address = JSON.parse(updatedData.address);
      } catch {}
    }

    // Handle file uploads
    const files = req.files || {};
    const mainImageFile = (files.image && files.image[0]) || null;
    const logoImageFile = files.logoImage && files.logoImage[0];
    const headerImageFile = files.headerImage && files.headerImage[0];
    const footerImageFile = files.footerImage && files.footerImage[0];

    if (mainImageFile) updatedData.image = `/uploads/${mainImageFile.filename}`;
    if (logoImageFile) updatedData.logoImage = `/uploads/${logoImageFile.filename}`;
    if (headerImageFile) updatedData.headerImage = `/uploads/${headerImageFile.filename}`;
    if (footerImageFile) updatedData.footerImage = `/uploads/${footerImageFile.filename}`;

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
    console.error("❌ Update error:", err.message);
    res.status(500).json({ error: "Failed to update restaurant" });
  }
};




// ✅ Update profile - FIX THIS TO USE ES6 EXPORT
export const updateProfile = async (req, res) => {
  try {
    const restaurantId = req.restaurant.id;
    const updates = { ...req.body };
    
    // Parse address if it's sent as a string
    if (updates.address && typeof updates.address === 'string') {
      updates.address = JSON.parse(updates.address);
    }
    
    // Handle image uploads
    if (req.files) {
   if (req.files.image) {
  updates.image = `/uploads/${req.files.image[0].filename}`;
}
if (req.files.logoImage) {
  updates.logoImage = `/uploads/${req.files.logoImage[0].filename}`;
}

    }
    
    // Password update logic
    if (updates.password) {
      if (!updates.currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password' });
      }
      
      const restaurant = await Restaurant.findById(restaurantId);
      const isMatch = await bcrypt.compare(updates.currentPassword, restaurant.password);
      
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    // Remove currentPassword from updates
    delete updates.currentPassword;
    
    // Update restaurant
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from the response
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      restaurant
    });
  } catch (error) {
    console.error('Update error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};