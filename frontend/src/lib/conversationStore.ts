import { ChatTurn } from "@/components/ChatHistory";

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  turns: ChatTurn[];
};

const API_BASE = "http://localhost:3000";

export async function loadConversations(): Promise<Conversation[]> {
  try {
    const res = await fetch(`${API_BASE}/conversations`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load conversations");
    return await res.json();
  } catch {
    return [];
  }
}

export async function saveConversations(conversations: Conversation[]): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/conversations`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(conversations),
    });
    if (!res.ok) throw new Error("Failed to save conversations");
  } catch {
    /* ignore errors */
  }
}
