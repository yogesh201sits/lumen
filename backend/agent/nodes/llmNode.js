import res from "../../llm.js";

export const llmNode = async (state) => {
  const output = await res(state.question, state.context);

  return {
    answer: output.answer,
    followUpQuestions: output.followUpQuestions,
  };
};