import express from "express";
import { addMenuItem, getMenuByRestaurant } from "../controllers/MenuController.js";

const router = express.Router();

// ✅ POST add menu item
router.post("/add", addMenuItem);

// ✅ GET menu by restaurant name
router.get("/:restaurantName", getMenuByRestaurant);

export default router;
