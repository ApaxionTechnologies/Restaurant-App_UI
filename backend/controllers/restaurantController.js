// // controllers/restaurantController.js
// import Restaurant from "../models/Restaurant.js";

// // Register a new restaurant
// export const registerRestaurant = async (req, res) => {
//   try {
//     const { restaurantName, firstName, lastName, contact, email, password, tables, address } = req.body;

//     const existingRestaurant = await Restaurant.findOne({ email });
//     if (existingRestaurant) {
//       return res.status(400).json({ error: "Restaurant with this email already exists!" });
//     }

//     const newRestaurant = new Restaurant({
//       restaurantName,
//       firstName,
//       lastName,
//       contact,
//       email,
//       password, // In production, hash it!
//       tables,
//       address,
//     });

//     await newRestaurant.save();
//     res.status(201).json({ message: "Restaurant registered successfully!", restaurant: newRestaurant });
//   } catch (err) {
//     console.error("❌ Registration error:", err);
//     res.status(500).json({ error: "Registration failed" });
//   }
// };

// // Login
// export const loginRestaurant = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const restaurant = await Restaurant.findOne({ email });

//     if (!restaurant || restaurant.password !== password) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     res.status(200).json({
//       message: "Login successful",
//       restaurant: {
//         id: restaurant._id,
//         name: restaurant.restaurantName,
//         email: restaurant.email,
//         tables: restaurant.tables,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Login error:", err);
//     res.status(500).json({ error: "Login failed" });
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

// // Update tables
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

// // Delete a restaurant
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

// // Update restaurant profile
// export const updateRestaurant = async (req, res) => {
//   try {
//     const decodedEmail = decodeURIComponent(req.params.email);
//     const updatedData = req.body;

//     const updated = await Restaurant.findOneAndUpdate(
//       { email: decodedEmail },
//       updatedData,
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ error: "Restaurant not found" });
//     }

//     res.status(200).json({ message: "Restaurant updated", restaurant: updated });
//   } catch (err) {
//     console.error("❌ Update error:", err);
//     res.status(500).json({ error: "Failed to update restaurant" });
//   }
// };

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
//----------mera code ----//
// controllers/restaurantController.js
import Restaurant from "../models/Restaurant.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const signAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "15m" });
};
const signRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRES_IN || "7d" });
};


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

    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res
        .status(400)
        .json({ error: "Restaurant with this email already exists!" });
    }

    // Support both old single-file (req.file) and new multi-file (req.files) uploads
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
      email,
      password, 
      tables,
      tagline,
      categories,
      address,

//       image: req.file ? `/uploads/${req.file.filename}` : null, 

      image: mainImageFile ? `/uploads/${mainImageFile.filename || mainImageFile.originalname ? mainImageFile.filename : mainImageFile}` : null,
      logoImage: logoImageFile ? `/uploads/${logoImageFile.filename}` : null,     // ✅ new
      headerImage: headerImageFile ? `/uploads/${headerImageFile.filename}` : null, // ✅ new
      footerImage: footerImageFile ? `/uploads/${footerImageFile.filename}` : null, // ✅ new

    });

    await newRestaurant.save();
    res
      .status(201)
      .json({
        message: "Restaurant registered successfully!",
        restaurant: newRestaurant,
      });
  } catch (err) {
    console.error("❌ Registration error:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
};

//  Login
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
    let token = req.cookies?.token; 
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1]; 
    }

    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const restaurant = await Restaurant.findById(payload.id).select("-password");
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    return res.status(200).json({ restaurant }); 
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

// ✅ Update tables
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

// ✅ Delete a restaurant
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

// ✅ Update restaurant profile
export const updateRestaurant = async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email);
    const updatedData = { ...req.body };

    // ❌ Email cannot be changed after registration
    if ("email" in updatedData) {
      delete updatedData.email;
    }

    // Handle JSON strings
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

    // Handle files for image fields (main, logo, header, footer)
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

    res
      .status(200)
      .json({ message: "Restaurant updated", restaurant: updated });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: "Failed to update restaurant" });
  }
};
