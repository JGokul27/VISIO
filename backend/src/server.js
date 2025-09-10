import express from "express";
import "dotenv/config";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { inngest, functions } from "./config/inngest.js";
import { serve } from "inngest/express";

const app = express();

// Middleware
app.use(express.json());
app.use(clerkMiddleware());

// Routes
// Health check for Inngest
app.get("/api/inngest", (req, res) => {
    res.send("✅ Inngest endpoint is live");
  });
  
  // Inngest handler
  app.use("/api/inngest", serve({ client: inngest, functions }));
  

app.get("/", (req, res) => {
  res.send("Hello world");
});

// ✅ Connect DB only once per cold start
let isConnected = false;
const initDB = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("✅ MongoDB connected");
    } catch (err) {
      console.error("❌ MongoDB connection failed:", err.message);
    }
  }
};
initDB();

// ❌ Don't use app.listen() → Vercel auto-handles this
export default app;
