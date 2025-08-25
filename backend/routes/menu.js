import express from "express";
import { requireAuth } from "../middleware/auth.js"; 
import { addMenuItem, getMenuByRestaurantId } from "../controllers/MenuController.js";
import multer from "multer";

const router = express.Router();

// configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// ✅ Use requireAuth middleware
router.post("/add", requireAuth, upload.single("image"), addMenuItem);

router.get("/:restaurantId", getMenuByRestaurantId);

export default router;
