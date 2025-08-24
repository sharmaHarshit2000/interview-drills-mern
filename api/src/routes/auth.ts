import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Callback URL:", process.env.GOOGLE_CALLBACK_URL);

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
  console.log("Initiating Google OAuth flow");
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "consent",
  });
  console.log("Redirecting to Google:", url);
  res.redirect(url);
  return;
});

// Google callback
router.get("/google/callback", async (req, res): Promise<void> => {
  try {
    console.log("Google callback received");
    console.log("Query parameters:", req.query);
    
    const code = req.query.code as string;
    if (!code) {
      console.error("No authorization code received");
      res.status(400).send("Missing code");
      return;
    }

    // Exchange code for tokens
    console.log("Exchanging code for tokens...");
    const { tokens } = await client.getToken(code);
    console.log("Tokens received successfully");
    
    client.setCredentials(tokens);

    // Verify ID token and get user info
    console.log("Verifying ID token...");
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });
    
    const payload = ticket.getPayload();
    console.log("User payload:", payload);
    
    if (!payload?.email) {
      console.error("No email in Google payload");
      res.status(400).send("No email from Google");
      return;
    }

    // Upsert user in MongoDB
    console.log("Creating/updating user in database:", payload.email);
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

    console.log("User saved with ID:", user._id);

    const token = signSession(String(user._id));
    console.log("JWT token created");
    
    // Set cookie with explicit domain for localhost
    res.cookie(process.env.SESSION_COOKIE_NAME || "upivot_sid", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: "localhost", // Explicitly set domain
      path: "/", // Make available on all paths
    });

    console.log("Cookie set, redirecting to dashboard");
    
    // Redirect to frontend dashboard
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard`);
    return;
  } catch (e) {
    console.error("OAuth error details:", e);
    res.status(500).send("Auth failed: " + (e instanceof Error ? e.message : String(e)));
    return;
  }
});

// Debug endpoint to check cookies
router.get("/debug", (req, res) => {
  console.log("Cookies received:", req.cookies);
  console.log("Headers:", req.headers);
  res.json({ cookies: req.cookies, headers: req.headers });
});

// logout
router.post("/logout", (_req, res): void => {
  res.clearCookie(process.env.SESSION_COOKIE_NAME || "upivot_sid", {
    domain: "localhost",
    path: "/",
  });
  res.json({ ok: true });
});

export default router;