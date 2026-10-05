import { Router } from "express";
import { getProducts, getProductBySlug, createReview } from "../controllers/product.controller";
import { validateRequest } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { ProductQuerySchema, ReviewSchema } from "@client-ecommerce/validation";

const router = Router();

router.get("/", validateRequest({ query: ProductQuerySchema }), getProducts);
router.get("/:slug", getProductBySlug);
router.post("/:id/reviews", requireAuth, validateRequest({ body: ReviewSchema }), createReview);

export default router;
