import { Router } from "express";
import {
  getAnalytics,
  createProduct,
  updateProduct,
  updateOrderStatus,
} from "../controllers/admin.controller";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";
import { validateRequest } from "../middleware/validate";
import {
  CreateProductSchema,
  UpdateProductSchema,
  UpdateOrderStatusSchema,
} from "@client-ecommerce/validation";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/analytics", getAnalytics);
router.post("/products", validateRequest({ body: CreateProductSchema }), createProduct);
router.put("/products/:id", validateRequest({ body: UpdateProductSchema }), updateProduct);
router.patch("/orders/:id/status", validateRequest({ body: UpdateOrderStatusSchema }), updateOrderStatus);

export default router;
