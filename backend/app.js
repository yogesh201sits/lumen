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

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(clerkMiddleware());

// Connect to MongoDB
connectDB();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.post("/conversation", requireAuth(), async (req, res) => {
  logInfo("Received conversation request", req.body);
  const { query } = req.body;
  const { userId } = getAuth(req);

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

    logInfo("Conversation request completed", { userId, query });

    return res.json({ result, urls });
  } catch (error) {
    logError("Error processing conversation", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Conversations endpoints
app.get("/conversations", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const conversations = await Conversation.find({ userId }).sort({ createdAt: -1 });
    res.json(conversations);
  } catch (error) {
    logError("Error loading conversations", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/conversations", requireAuth(), async (req, res) => {
  try {
    const conversations = req.body; // array of conversations
    if (!Array.isArray(conversations)) {
      return res.status(400).json({ error: "Expected array of conversations" });
    }
    const { userId } = getAuth(req);

    const conversationsForUser = conversations.map((conversation) => ({
      ...conversation,
      userId,
    }));

    await Conversation.deleteMany({ userId });
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