export type SearchResponse = {
  result: {
    answer: string;
    followUpQuestions: string[];
  };
  urls: string[];
};

// Calls POST http://localhost:3000/conversation with JSON body.
export async function search(query: string): Promise<SearchResponse> {
  console.log('Making API call to http://localhost:3000/conversation with query:', query);
  const res = await fetch("http://localhost:3000/conversation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const data = (await res.json()) as SearchResponse;
  console.log('API response data:', data);
  if (data?.result?.answer) return data;
  throw new Error("Malformed response");
}

// async function mockSearch(query: string): Promise<SearchResponse> {
//   await new Promise((r) => setTimeout(r, 900));
//   return {
//     answer: `Here's a concise overview about "${query}". This is a demo response shown because no backend is connected yet. Connect to get real grounded answers with citations from across the web. The interface supports streaming-style fade-in, structured sources, and clickable follow-up suggestions just like Perplexity.`,
//     followUpQuestions: [
//       `What are the latest developments around ${query}?`,
//       `How does ${query} compare to alternatives?`,
//       `Practical examples of ${query} in 2026`,
//     ],
//     urls: [
//       "https://en.wikipedia.org/wiki/Main_Page",
//       "https://news.ycombinator.com",
//       "https://arxiv.org",
//       "https://github.com/trending",
//     ],
//   };
// }
