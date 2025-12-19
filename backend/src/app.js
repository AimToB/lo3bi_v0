// Module Imports
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

// Middleware Imports
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

// API Imports
import authRoutes from "./api/routes/authRoutes.js";

dotenv.config();
const app = express();

// Middlewares & Utilities
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(rateLimiter);
app.use(cors());
app.use(morgan("dev"));

// Router Mounts
app.use("/auth", authRoutes);

// HTTP
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Was able to reach the server!",
  });
});

app.get("/error-test", (req, res) => {
  throw new Error("Test Crash");
});

app.use(errorHandler);

export default app;
