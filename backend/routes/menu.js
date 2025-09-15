import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  addMenuItem,
  getMenuByRestaurantId,
  updateMenuStatus,
  updateMenuItem,
  deleteMenuItem,
  getMenuItem,
  addBulkMenuItem
} from "../controllers/MenuController.js";
import multer from "multer";
 
const router = express.Router();
 
// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });
 
// ✅ Use requireAuth middleware
router.post("/add", requireAuth, upload.single("image"), addMenuItem);
router.get("/:restaurantId", getMenuByRestaurantId);
router.put("/:id/status", updateMenuStatus);
router.put("/:id", requireAuth, upload.single("image"), updateMenuItem);
router.delete("/:id", requireAuth, deleteMenuItem);
router.get("/item/:id", getMenuItem);

router.post("/bulkAddMenuItem", requireAuth, upload.single("file"), addBulkMenuItem);
export default router;