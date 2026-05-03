// Backend server for Perplexity-style AI assistant
import 'dotenv/config';
import express from "express";
import cors from "cors";
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';
import resLlm from "./llm.js";
import runSearch from "./seltzService.js";
import transformDocuments from './utils/parseSearc.js'
import { logInfo, logError } from './utils/logger.js'
import connectDB from './utils/db.js'
import Conversation from './models/Conversation.js'

const app = express();
const PORT = 3000;

const allowedOrigins = ["http://localhost:5173", "http://localhost:8080", "http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(clerkMiddleware());
app.use((req, res, next) => {
  const auth = getAuth(req);
  req.auth = {
    userId: auth.userId || null,
    sessionId: auth.sessionId || null,
    orgId: auth.orgId || null,
  };
  logInfo("Auth middleware - userId:", auth.userId);
  next();
});

// Connect to MongoDB
connectDB();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Debug auth endpoint
app.get("/auth/debug", (req, res) => {
  const auth = getAuth(req);
  logInfo("Auth debug request", {
    clerkUserId: auth.userId,
    clerkSessionId: auth.sessionId,
    clerkOrgId: auth.orgId,
    reqAuthUserId: req.auth?.userId,
    hasCookie: !!req.headers.cookie,
    cookieHeader: req.headers.cookie ? "Present" : "Missing",
  });
  res.json({
    auth: req.auth,
    clerkAuth: {
      userId: auth.userId,
      sessionId: auth.sessionId,
      orgId: auth.orgId,
    },
    cookies: req.headers.cookie ? "Present" : "Missing",
    message: "Sign in via the frontend first if userId is null",
  });
});

// Test endpoint (no auth required)
app.get("/test", (req, res) => {
  res.json({ message: "Backend is working", timestamp: new Date().toISOString() });
});

app.post("/conversation", async (req, res) => {
  logInfo("Received conversation request", req.body);
  const { query } = req.body;
  const auth = req.auth;

  if (!auth?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!query) {
    return res.status(400).json({
      error: "query is required in request body",
    });
  }

  try {
    const searchRes = await runSearch(query);
    const parsed = transformDocuments(searchRes.documents);
    const urls = parsed.urls;
    const context = parsed.contents;
    const result = await resLlm(query, context);

    logInfo("Conversation request completed", { auth, query });

    return res.json({ result, urls });
  } catch (error) {
    logError("Error processing conversation", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Conversations endpoints
app.get("/conversations", async (req, res) => {
  try {
    const auth = req.auth;
    if (!auth?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const conversations = await Conversation.find({ userId: auth.userId }).sort({ createdAt: -1 });
    res.json(conversations);
  } catch (error) {
    logError("Error loading conversations", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/conversations", async (req, res) => {
  try {
    const conversations = req.body; // array of conversations
    if (!Array.isArray(conversations)) {
      return res.status(400).json({ error: "Expected array of conversations" });
    }
    const auth = req.auth;
    if (!auth?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const conversationsForUser = conversations.map((conversation) => ({
      ...conversation,
      userId: auth.userId,
      sessionId: auth.sessionId,
      orgId: auth.orgId,
    }));

    await Conversation.deleteMany({ userId: auth.userId });
    await Conversation.insertMany(conversationsForUser);
    res.json({ message: "Conversations saved" });
  } catch (error) {
    logError("Error saving conversations", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  logInfo(`Server running on http://localhost:${PORT}`);
  logInfo(`Health check available at http://localhost:${PORT}/health`);
});