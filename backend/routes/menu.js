import express from "express";
import multer from "multer";
import { addMenuItem } from "../controllers/MenuController.js";
import { getMenuByRestaurantId } from "../controllers/MenuController.js";
const router = express.Router();

// Multer setup
const upload = multer({ dest: "uploads/" });

// Route
router.post("/add", upload.single("image"), addMenuItem);

router.get("/:restaurantId", getMenuByRestaurantId);

export default router;
