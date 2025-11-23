import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getOrCreateProfile } from "../controllers/profileController.js";

const router = express.Router();

// GET /profile/me → returns or creates user's profile
router.get("/me", authMiddleware, getOrCreateProfile);

export default router;
