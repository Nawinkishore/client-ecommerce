import { Router } from "express";
import { getMe, updateMe, addAddress, deleteAddress } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";
import { CreateAddressSchema } from "@client-ecommerce/validation";

const router = Router();

router.use(requireAuth);

router.get("/me", getMe);
router.put("/me", updateMe);
router.post("/me/addresses", validateRequest({ body: CreateAddressSchema }), addAddress);
router.delete("/me/addresses/:id", deleteAddress);

export default router;
