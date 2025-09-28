import express from "express";
import { getAllUsers, getUserProfile } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getUserProfile);   // ✅ User dashboard
router.get("/all", protect, adminOnly, getAllUsers); // ✅ Admin dashboard

export default router;
