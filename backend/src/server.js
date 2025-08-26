import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";            // <-- add
import dotenv from "dotenv";
import authRouter, { requireAuth } from "./routes/auth.js"; // <-- add
import usersRouter from "./routes/users.js";




dotenv.config();
const app = express();
// ✅ Allow frontend (React) to call backend
app.use(cors({
  origin: process.env.CLIENT_URL,       // <- use env
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());           // <-- add


app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


app.use("/api/auth", authRouter);  // <-- mount
app.use("/api/users", usersRouter);


// Example protected endpoint
app.get("/api/profile", requireAuth, (req, res) => {
  res.json({ hello: `user ${req.user.id}` });
});

// Simple protected test
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/api/protected-ping", requireAuth, (req, res) =>
  res.json({ pong: true, user: req.user })
);

const PORT = process.env.PORT || 7542; // <- use env first

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));


