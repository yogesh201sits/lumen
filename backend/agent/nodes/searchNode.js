import runSearch from "../../seltzService.js";

export const searchNode = async (state) => {
  const result = await runSearch(state.question);

  return {
    context: JSON.stringify(result),
  };
};