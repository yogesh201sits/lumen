import { ChatTurn } from "@/components/ChatHistory";

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  turns: ChatTurn[];
};

const KEY = "lumen.conversations.v1";

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Conversation[];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(conversations));
  } catch {
    /* ignore quota errors */
  }
}
