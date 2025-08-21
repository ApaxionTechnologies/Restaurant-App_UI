// routes/menuRoutes.js
import express from "express";
import { addMenuItem, getMenuByRestaurantId } from "../controllers/MenuController.js";
import multer from "multer";

const router = express.Router();

// configure multer for file uploads
const upload = multer({ dest: "uploads/" });

router.post("/add", upload.single("image"), addMenuItem);
router.post("/add", requireAuth, upload.single("image"), addMenuItem);

export default router;
