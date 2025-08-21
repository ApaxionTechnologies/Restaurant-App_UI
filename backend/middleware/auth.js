// middleware/auth.js
import jwt from "jsonwebtoken";
import Restaurant from "../models/Restaurant.js";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Restaurant.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user; // attach for downstream handlers
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
