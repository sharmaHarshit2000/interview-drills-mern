import { Router } from "express";
import { Drill } from "../models/Drill";
import { z } from "zod";

const router = Router();

// Simple in-memory cache (reset every 60s)
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 60 * 1000; // 60s

// GET /api/drills - list all drills (cached)
router.get("/", async (_req, res) => {
  try {
    // if cache is fresh → return it
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return res.json(cache.data);
    }

    const drills = await Drill.find().select("-__v");
    cache = { data: drills, timestamp: Date.now() };

    return res.json(drills);
  } catch (err) {
    console.error("Error fetching drills:", err);
    return res
      .status(500)
      .json({
        error: { code: "SERVER_ERROR", message: "Failed to fetch drills" },
      });
  }
});

// GET /api/drills/:id - get drill detail
router.get("/:id", async (req, res) => {
  const paramsSchema = z.object({
    id: z.string().length(24, "Invalid drill id"), // validate Mongo ObjectId
  });

  const parseResult = paramsSchema.safeParse(req.params);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({
        error: { code: "BAD_REQUEST", message: parseResult.error.message },
      });
  }

  try {
    const drill = await Drill.findById(parseResult.data.id).select("-__v");
    if (!drill) {
      return res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Drill not found" } });
    }
    return res.json(drill);
  } catch (err) {
    console.error("Error fetching drill detail:", err);
    return res
      .status(500)
      .json({
        error: { code: "SERVER_ERROR", message: "Failed to fetch drill" },
      });
  }
});

export default router;
