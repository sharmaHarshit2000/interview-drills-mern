import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.upivot_sid;
    if (!token) {
      return res
        .status(401)
        .json({ error: { code: "unauthorized", message: "No session" } });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      uid: string;
    };
    const user = await User.findById(payload.uid);
    if (!user) {
      return res
        .status(401)
        .json({ error: { code: "unauthorized", message: "Invalid user" } });
    }

    req.user = user;
    next();
    return;
  } catch (err) {
    res.status(401).json({
      error: { code: "unauthorized", message: "Invalid/expired session" },
    });
    return;
  }
};
