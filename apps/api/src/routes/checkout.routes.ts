import { Router } from "express";
import { createCheckoutIntent } from "../controllers/checkout.controller";
import { requireAuth } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { CheckoutIntentSchema } from "@client-ecommerce/validation";

const router = Router();

router.use(requireAuth);

router.post("/intent", validateRequest({ body: CheckoutIntentSchema }), createCheckoutIntent);

export default router;
