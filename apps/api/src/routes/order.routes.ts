import { Router } from "express";
import { getOrders, getOrderByNumber } from "../controllers/order.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", getOrders);
router.get("/:orderNumber", getOrderByNumber);

export default router;
