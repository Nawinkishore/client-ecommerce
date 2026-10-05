import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  syncCart,
} from "../controllers/cart.controller";
import { requireAuth } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import {
  AddToCartSchema,
  UpdateCartItemSchema,
  SyncCartSchema,
} from "@client-ecommerce/validation";

const router = Router();

router.use(requireAuth);

router.get("/", getCart);
router.post("/items", validateRequest({ body: AddToCartSchema }), addToCart);
router.patch("/items/:id", validateRequest({ body: UpdateCartItemSchema }), updateCartItem);
router.delete("/items/:id", removeCartItem);
router.post("/sync", validateRequest({ body: SyncCartSchema }), syncCart);

export default router;
