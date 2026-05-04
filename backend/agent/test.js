import { agent } from "./graph.js";
import { AgentState } from "./state.js";

async function main() {
  const input = new AgentState({
    question: "What is Node.js?",
  });

  const result = await agent.invoke(input);

  console.log("\n=== FINAL OUTPUT ===\n");
  console.log(result);
}

main();