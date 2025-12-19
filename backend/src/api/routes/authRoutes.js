import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

const router = new Router();

router.get("/me", requireAuth, getMe);
router.post("/register", register);
router.post("/login", login);

export default router;
