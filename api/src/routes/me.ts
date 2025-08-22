import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = req.user;
  res.json({
    _id: user._id,
    email: user.email,
    name: user.name,
    picture: user.picture,
  });
});

export default router;
