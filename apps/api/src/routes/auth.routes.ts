import { Router } from "express";
import { signup, login, logout, forgotPassword } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { SignupSchema, LoginSchema } from "@client-ecommerce/validation";

const router = Router();

router.post("/signup", validateRequest({ body: SignupSchema }), signup);
router.post("/login", validateRequest({ body: LoginSchema }), login);
router.post("/logout", requireAuth, logout);
router.post("/forgot-password", forgotPassword);

export default router;
