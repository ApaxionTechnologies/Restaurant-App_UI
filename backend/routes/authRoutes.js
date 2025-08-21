// routes/authRoutes.js
import express from "express";
import {
  registerRestaurant,
  loginRestaurant,
  getCurrentRestaurant,
  logoutRestaurant,
} from "../controllers/restaurantController.js";
import multer from "multer";

const router = express.Router();

// simple local storage for images (for dev only)
const upload = multer({ dest: "uploads/" });

// register (multipart if image)
router.post("/register", upload.single("image"), registerRestaurant);

// login
router.post("/login", loginRestaurant);

// me
router.get("/me", getCurrentRestaurant);

// logout
router.post("/logout", logoutRestaurant);

export default router;
