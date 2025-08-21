// routes/menuRoutes.js
import express from "express";
import { addMenuItem, getMenuByRestaurantId } from "../controllers/MenuController.js";
import multer from "multer";

const router = express.Router();

// configure multer for file uploads
const upload = multer({ dest: "uploads/" });

router.post("/add", upload.single("image"), addMenuItem);
router.get("/:restaurantId", getMenuByRestaurantId);

export default router;
