import { StateGraph, START, END } from "@langchain/langgraph";
import { searchNode } from "./nodes/searchNode.js";
import { llmNode } from "./nodes/llmNode.js";

const builder = new StateGraph({});

builder.addNode("search", searchNode);
builder.addNode("llm", llmNode);

builder.addEdge(START, "search");
builder.addEdge("search", "llm");
builder.addEdge("llm", END);

export const agent = builder.compile();