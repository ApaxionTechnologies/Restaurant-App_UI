import jwt from "jsonwebtoken";
import Restaurant from "../models/Restaurant.js";

export const requireAuth = async (req, res, next) => {
  try {
    // Token from cookies OR headers
    let token = req.cookies?.token;

    // ✅ check header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization; // "Bearer <token>"
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const restaurant = await Restaurant.findById(payload.id).select("-password");

    if (!restaurant) return res.status(401).json({ message: "Restaurant not found" });

    req.restaurant = restaurant;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
