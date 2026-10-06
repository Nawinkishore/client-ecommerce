import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { sendSuccess } from "./utils/response";
import { errorHandler } from "./middleware/error-handler";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import checkoutRoutes from "./routes/checkout.routes";
import webhookRoutes from "./routes/webhook.routes";
import orderRoutes from "./routes/order.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Strict Rate Limiting for Authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs for auth endpoints
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many authentication requests from this IP, please try again after 15 minutes",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/health", (_req, res) => {
  return sendSuccess(
    res,
    { status: "ok", service: "client-ecommerce-api", timestamp: new Date().toISOString() },
    "Service is healthy"
  );
});

// API Routes
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/webhooks", webhookRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);

// Global error handler middleware
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
  });
}

export default app;

