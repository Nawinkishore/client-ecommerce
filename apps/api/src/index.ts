import express from "express";
import cors from "cors";
import { sendSuccess } from "./utils/response";
import { errorHandler } from "./middleware/error-handler";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  return sendSuccess(
    res,
    { status: "ok", service: "client-ecommerce-api", timestamp: new Date().toISOString() },
    "Service is healthy"
  );
});

// Global error handler middleware
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
  });
}

export default app;
