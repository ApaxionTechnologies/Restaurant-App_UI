import express from "express";
import { requireAuth } from "../middleware/auth.js"; 
import { addBulkMenuItem, addMenuItem, getMenuByRestaurantId } from "../controllers/MenuController.js";
import multer from "multer";

import { updateMenuStatus } from "../controllers/MenuController.js";

const router = express.Router();

// configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// ✅ Use requireAuth middleware
router.post("/add", requireAuth, upload.single("image"), addMenuItem);
router.post("/bulkAddMenuItem", requireAuth, upload.single("file"), addBulkMenuItem);

router.get("/:restaurantId", getMenuByRestaurantId);

router.put("/:id/status", updateMenuStatus);



export default router;
