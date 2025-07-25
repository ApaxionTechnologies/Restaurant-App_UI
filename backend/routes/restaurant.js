// import express from "express";
// import Restaurant from "../models/Restaurant.js";

// const router = express.Router();

// // ✅ Register Route
// router.post("/register", async (req, res) => {
//   try {
//     const { restaurantName, firstName, lastName, contact, email, password, tables, address } = req.body;

//     const newRestaurant = new Restaurant({
//       restaurantName,
//       firstName,
//       lastName,
//       contact,
//       email,
//       password,
//       tables, // Accepts the number of tables here
//       address,
//     });

//     await newRestaurant.save();
//     res.status(201).json({ message: "Restaurant registered successfully!" });
//   } catch (err) {
//     console.error("❌ Registration error:", err);
//     res.status(500).json({ error: "Registration failed" });
//   }
// });

// // ✅ Login Route
// router.post("/login", async (req, res) => {
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
//         tables: restaurant.tables, // Also return tables information
//       },
//     });
//   } catch (err) {
//     console.error("❌ Login error:", err);
//     res.status(500).json({ error: "Login failed" });
//   }
// });

// export default router;



import express from "express";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    const { restaurantName, firstName, lastName, contact, email, password, tables, address } = req.body;

    const newRestaurant = new Restaurant({
      restaurantName,
      firstName,
      lastName,
      contact,
      email,
      password,
      tables, // Accepts the number of tables here
      address,
    });

    await newRestaurant.save();
    res.status(201).json({ message: "Restaurant registered successfully!" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const restaurant = await Restaurant.findOne({ email });

    if (!restaurant || restaurant.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      restaurant: {
        id: restaurant._id,
        name: restaurant.restaurantName,
        email: restaurant.email,
        tables: restaurant.tables, // Also return tables information
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ Get Restaurant Data by Email (For Table Management)
router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const restaurant = await Restaurant.findOne({ email });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({ restaurant });
  } catch (err) {
    console.error("❌ Error fetching restaurant data:", err);
    res.status(500).json({ error: "Failed to fetch restaurant data" });
  }
});

// ✅ Update Tables for a Restaurant
router.put("/:email/tables", async (req, res) => {
  const { email } = req.params;
  const { tables } = req.body;

  try {
    // Find the restaurant by email
    const restaurant = await Restaurant.findOne({ email });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    // Update the number of tables
    restaurant.tables = tables;
    await restaurant.save();

    res.status(200).json({ message: "Tables updated successfully!" });
  } catch (err) {
    console.error("❌ Error updating tables:", err);
    res.status(500).json({ error: "Failed to update tables" });
  }
});

export default router;
