import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_CALLBACK_URL!,
});

// Sign JWT session
function signSession(uid: string) {
  return jwt.sign({ uid }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

// Redirect to Google
router.get("/google", async (_req, res): Promise<void> => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "consent",
  });
  res.redirect(url);
  return;
});

// Google callback 
router.get("/google/callback", async (req, res): Promise<void> => {
  try {
    const code = req.query.code as string;
    if (!code) {
      res.status(400).send("Missing code");
      return;
    }

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Verify ID token and get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      res.status(400).send("No email from Google");
      return;
    }

    // Upsert user in MongoDB
    const user = await User.findOneAndUpdate(
      { email: payload.email },
      {
        $setOnInsert: { createdAt: new Date() },
        $set: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
        },
        $addToSet: {
          providers: { provider: "google", providerId: payload.sub },
        },
      },
      { new: true, upsert: true }
    );

    // Set httpOnly cookie
    const token = signSession(String(user._id));
    res.cookie(process.env.SESSION_COOKIE_NAME || "upivot_sid", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend dashboard
    res.redirect("http://localhost:3000/dashboard");
    return;
  } catch (e) {
    console.error("OAuth error:", e);
    res.status(500).send("Auth failed");
    return;
  }
});

// logout
router.post("/logout", (_req, res): void => {
  res.clearCookie(process.env.SESSION_COOKIE_NAME || "upivot_sid");
  res.json({ ok: true });
});

export default router;
