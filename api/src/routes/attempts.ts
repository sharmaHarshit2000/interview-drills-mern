import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";
import Attempt from "../models/Attempt";
import { Drill } from "../models/Drill";
import mongoose from "mongoose";

const router = Router();

// Scoring function

function scoreAnswers(
  drill: any,
  answers: { qid: string; text?: string }[]
): number {
  let totalKeywords = 0;
  let matched = 0;

  drill.questions.forEach((q: any) => {
    const ans = answers.find((a) => a.qid === q.id);
    totalKeywords += q.keywords.length;

    if (ans?.text) {
      const answerText = ans.text.toLowerCase();

      q.keywords.forEach((kw: string) => {
        const keyword = kw.toLowerCase();
        // Use word boundary regex for exact word matching
        const regex = new RegExp(`\\b${keyword}\\b`, "i");
        if (regex.test(answerText)) {
          matched++;
        }
      });
    }
  });

  return totalKeywords > 0 ? Math.round((matched / totalKeywords) * 100) : 0;
}
// POST /api/attempts
router.post("/attempts", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { drillId, answers } = req.body;

    if (!drillId || !Array.isArray(answers)) {
      return res.status(400).json({
        error: {
          code: "bad_request",
          message: "drillId and answers are required",
        },
      });
    }

    if (!mongoose.Types.ObjectId.isValid(drillId)) {
      return res
        .status(400)
        .json({ error: { code: "bad_request", message: "Invalid drillId" } });
    }

    const drill = await Drill.findById(drillId);
    if (!drill) {
      return res
        .status(404)
        .json({ error: { code: "not_found", message: "Drill not found" } });
    }

    const score = scoreAnswers(drill, answers);

    const attempt = await Attempt.create({
      userId: req.user._id,
      drillId,
      answers,
      score,
    });

    return res.json({
      id: attempt._id,
      drillId,
      score,
      createdAt: attempt.createdAt,
    });
  } catch (err) {
    console.error("Error submitting attempt:", err);
    return res.status(500).json({
      error: { code: "server_error", message: "Failed to submit attempt" },
    });
  }
});

// GET /api/attempts?limit=5
router.get("/attempts", requireAuth, async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    const attempts = await Attempt.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("drillId", "title difficulty");

    return res.json(
      attempts.map((a) => ({
        id: a._id,
        drill: a.drillId,
        score: a.score,
        createdAt: a.createdAt,
      }))
    );
  } catch (err) {
    console.error("Error fetching attempts:", err);
    return res.status(500).json({
      error: { code: "server_error", message: "Failed to fetch attempts" },
    });
  }
});

export default router;
