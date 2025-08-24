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


// In your main server file
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
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
app.use("/api/auth", authRoutes);
app.use("/api/drills", drillsRouter);
app.use("/api", meRoutes);
app.use("/api", attemptRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on ${PORT}`));