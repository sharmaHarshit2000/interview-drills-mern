import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

import drillsRouter from "./routes/drills.routes.js";

dotenv.config();
const app = express();

// connect DB
connectDB();

app.use("/api/drills", drillsRouter);

app.use(express.json());
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(4000, () => console.log('API running on 4000'));