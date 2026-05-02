// LLM integration module using ChatGroq
import { ChatGroq } from "@langchain/groq";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import * as z from "zod";
import dotenv from "dotenv";

dotenv.config();


const tempDataOutputSchema = z.object({
  answer: z.string(),
  followUpQuestions: z.array(z.string()),
});


const parser = StructuredOutputParser.fromZodSchema(tempDataOutputSchema);


const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
});


export default async function res(question, context) {
  console.log("Processing LLM request for question:", question);
  try {
    const formatInstructions = parser.getFormatInstructions();

    const prompt = `
      You are a Perplexity-style AI assistant.

      Rules:
      - Use ONLY the provided context
      - give comprehensive long answers
      - Do NOT hallucinate
      Return output strictly in this format:
      ${formatInstructions}

      User Question:
      ${question}

      Web Search Results:
      ${context}
    `;

    const response = await model.invoke(prompt);

    const parsed = await parser.parse(response.content);
    console.log(parsed)
    return parsed;
  } catch (err) {
    console.error("Error parsing LLM output:", err);

    return {
      answer: "Failed to generate structured response.",
      followUpQuestions: [],
    };
  }
}

// const question = "What is Node.js?";
// const context = `
// Node.js is a JavaScript runtime built on Chrome's V8 engine.
// It allows running JS on the server side.
// `;

// const output = await res(question, context);
// console.log(output)