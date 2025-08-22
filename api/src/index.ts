import dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import connectDB from "./config/db";
import drillsRouter from "./routes/drills.routes";
import meRoutes from "./routes/me";
import attemptRoutes from "./routes/attempts";
import authRoutes from "./routes/auth";

const app = express();
connectDB();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Allow web origin + credentials
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Basic rate limit
app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 300000),
    max: Number(process.env.RATE_LIMIT_MAX || 100),
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// routes
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", authRoutes);
app.use("/api/drills", drillsRouter);
app.use("/api", meRoutes);
app.use("/api", attemptRoutes);

app.listen(4000, () => console.log("API running on 4000"));
