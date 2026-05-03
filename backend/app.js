// Backend server for Perplexity-style AI assistant
import express from "express";
import cors from "cors";
import resLlm from "./llm.js";
import runSearch from "./seltzService.js";
import transformDocuments from './utils/parseSearc.js'
import { logInfo, logError } from './utils/logger.js'
import connectDB from './utils/db.js'
import Conversation from './models/Conversation.js'

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.post("/conversation", async(req, res) => {
  logInfo("Received conversation request", req.body);
  const { query } = req.body;

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

    const result = await resLlm(query,context);

    return res.json({result,urls});
  } catch (error) {
    logError("Error processing conversation", error);
    return res.status(500).json({ error: "Internal server error" });
  }

});

// Conversations endpoints
app.get("/conversations", async (req, res) => {
  try {
    const conversations = await Conversation.find({});
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
    // Delete all existing and insert new ones
    await Conversation.deleteMany({});
    await Conversation.insertMany(conversations);
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