// //23082555
// import express from "express";
// import multer from "multer";
// import {
//   registerRestaurant,
//   loginRestaurant,
//   getRestaurantByEmail,
//   updateTables,
//   deleteRestaurant,
//   updateRestaurant,
// } from "../controllers/restaurantController.js";

// const router = express.Router();

// // ✅ Multer setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage });

// // Routes
// router.post("/register", upload.single("image"), registerRestaurant);
// router.post("/login", loginRestaurant);
// router.get("/:email", getRestaurantByEmail);
// router.put("/:email/tables", updateTables);
// router.put("/:email", upload.single("image"), updateRestaurant);
// router.delete("/:email", deleteRestaurant);

// export default router;


// routes/restaurant.js

import express from "express";
import multer from "multer";
import {
  registerRestaurant,
  loginRestaurant,
  getRestaurantByEmail,
  updateTables,
  deleteRestaurant,
  updateRestaurant,
} from "../controllers/restaurantController.js";

const router = express.Router();

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ allow multiple named fields (backward compatible with main "image")
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },       // existing main image
  { name: "logoImage", maxCount: 1 },   // ✅ new
  { name: "headerImage", maxCount: 1 }, // ✅ new
  { name: "footerImage", maxCount: 1 }, // ✅ new
]);

// Routes
router.post("/register", uploadFields, registerRestaurant);
router.post("/login", loginRestaurant);
router.get("/:email", getRestaurantByEmail);
router.put("/:email/tables", updateTables);
router.put("/:email", uploadFields, updateRestaurant);
router.delete("/:email", deleteRestaurant);

export default router;
