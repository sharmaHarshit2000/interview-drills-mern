import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

import drillsRouter from "./routes/drills.routes.js";
import meRoutes from "./routes/me.js";
import attemptRoutes from "./routes/attempts.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(cookieParser());

// connect DB
connectDB();

app.use(express.json());

app.use("/api/drills", drillsRouter);
app.use("/api", meRoutes);
app.use("/api", attemptRoutes);


app.use(express.json());
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(4000, () => console.log('API running on 4000'));