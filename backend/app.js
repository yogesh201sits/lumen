// Backend server for Perplexity-style AI assistant
import express from "express";
import cors from "cors";
import resLlm from "./llm.js";
import runSearch from "./seltzService.js";
import transformDocuments from './utils/parseSearc.js'

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.post("/conversation", async(req, res) => {
  console.log("Received conversation request:", req.body);
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
    console.error("Error processing conversation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});