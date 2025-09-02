import express from "express";
import { requireAuth } from "../middleware/auth.js"; 
import { addMenuItem, getMenuByRestaurantId } from "../controllers/MenuController.js";
import multer from "multer";

// import { updateMenuItemStatus } from "../controllers/MenuController.js";


const router = express.Router();

// configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// ✅ Use requireAuth middleware
router.post("/add", requireAuth, upload.single("image"), addMenuItem);

router.get("/:restaurantId", getMenuByRestaurantId);

// router.put("/menu/:id/status", requireAuth, updateMenuItemStatus);


export default router;
