// Search service using Seltz API
import dotenv from "dotenv";
import { logInfo, logError } from './utils/logger.js'
dotenv.config();

import { Seltz } from "seltz";

export default async function runSearch(query) {
  logInfo("Running search for query", { query });
  
    try {
    const apiKey = process.env.SELTZ_API_KEY;

    if (!apiKey) {
      throw new Error("Missing SELTZ_API_KEY in .env file");
    }

    const client = new Seltz({ apiKey });

    const result = await client.search(query, 1);
    logInfo("Search completed successfully");
    return result;


  } catch (err) {
    logError("Error in search service", err.message);
    throw err; // Re-throw to let caller handle
  }

}

// const res1 = await runSearch("Apache Kafka performance");
// console.log(res1)