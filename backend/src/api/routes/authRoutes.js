import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { authRateLimiter } from "../../middleware/rateLimiter.js";

const router = new Router();

router.get("/me", requireAuth, getMe);
router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);

export default router;
