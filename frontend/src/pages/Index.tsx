import { useEffect, useMemo, useRef, useState } from "react";
import { Show, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/react";
import SearchBar from "@/components/SearchBar";
import ChatHistory, { ChatTurn } from "@/components/ChatHistory";
import HistorySidebar from "@/components/HistorySidebar";
import { SearchResponse } from "@/lib/searchApi";
import { Terminal } from "lucide-react";
import {
  Conversation,
  loadConversations,
  saveConversations,
} from "@/lib/conversationStore";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "explain quantum entanglement",
  "best react state libs 2026",
  "how do llms handle long context?",
  "top espresso machines < $500",
];

const Index = () => {
  const { user, isLoaded } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Force light theme — dark mode removed
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  // Load persisted conversations only when user is signed in
  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setConversations([]);
      return;
    }
    const load = async () => {
      const stored = await loadConversations();
      setConversations(stored);
    };
    load();
  }, [user, isLoaded]);

  // Persist on change
  useEffect(() => {
    if (!user) return;
    const save = async () => {
      await saveConversations(conversations);
    };
    save();
  }, [conversations, user]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const turns: ChatTurn[] = activeConversation?.turns ?? [];

  const updateTurns = (
    convoId: string,
    updater: (turns: ChatTurn[]) => ChatTurn[],
    titleIfNew?: string
  ) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === convoId);
      if (idx === -1) {
        return [
          {
            id: convoId,
            title: titleIfNew ?? "New conversation",
            createdAt: Date.now(),
            turns: updater([]),
          },
          ...prev,
        ];
      }
      const next = [...prev];
      next[idx] = { ...next[idx], turns: updater(next[idx].turns) };
      return next;
    });
  };

  const runQuery = async (query: string, replaceTurnId?: string) => {
    let convoId = activeId;
    const isNewConvo = !convoId;
    if (!convoId) {
      convoId = crypto.randomUUID();
      setActiveId(convoId);
    }

    const turnId = replaceTurnId ?? crypto.randomUUID();

    updateTurns(
      convoId,
      (existing) => {
        const turn: ChatTurn = { id: turnId, query, loading: true };
        if (replaceTurnId) {
          return existing.map((t) => (t.id === replaceTurnId ? turn : t));
        }
        return [...existing, turn];
      },
      isNewConvo ? query.slice(0, 60) : undefined
    );

    try {
      console.log('Making API call to http://localhost:3000/conversation with query:', query);
      const res = await fetch("http://localhost:3000/conversation", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      console.log('API response status:', res.status);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log('API response data:', data);
      const response = data as SearchResponse;
      if (!response?.result?.answer) throw new Error("Malformed response");
      updateTurns(convoId, (existing) =>
        existing.map((t) =>
          t.id === turnId ? { ...t, loading: false, response } : t
        )
      );
    } catch (error) {
      console.error('Search failed:', error);
      updateTurns(convoId, (existing) =>
        existing.map((t) =>
          t.id === turnId
            ? {
                ...t,
                loading: false,
                response: {
                  result: {
                    answer: "Something went wrong. Please try again.",
                    followUpQuestions: [],
                  },
                  urls: [],
                },
              }
            : t
        )
      );
    }
  };

  const handleNew = () => {
    setActiveId(null);
  };

  const handleDelete = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const isEmpty = turns.length === 0;
  const isMac =
    typeof navigator !== "undefined" && navigator.platform.includes("Mac");

  return (
    <div className="relative min-h-screen">
      <HistorySidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => setActiveId(id)}
        onNew={handleNew}
        onDelete={handleDelete}
      />

      <main
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "md:ml-72" : "md:ml-12"
        )}
      >
        {!isLoaded ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : !user ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold">Sign in to continue</p>
              <p className="text-muted-foreground mb-6">You need to be signed in to use the chat.</p>
              <div className="flex gap-3 justify-center">
                <SignInButton mode="modal">
                  <button className="rounded-sm border border-border bg-primary text-primary-foreground px-4 py-2 font-semibold transition hover:opacity-90">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-sm border border-border bg-card px-4 py-2 text-foreground transition hover:border-primary hover:text-primary">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </div>
          </div>
        ) : (
          <>
       <header className="sticky top-0 z-20 h-14 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">

        {/* Left side: Logo + Brand */}
        <div className="flex items-center gap-2">

          {/* Fixed-size logo wrapper (prevents layout shift) */}
          <div className="h-14 w-14 flex-shrink-0">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-full w-full object-contain rounded-lg"
            />
          </div>

          <span className="font-mono text-lg font-semibold tracking-tight">
            lumen<span className="text-primary">.</span>sh
          </span>

        </div>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-sm border border-border bg-card px-3 py-1.5 text-sm text-foreground transition hover:border-primary hover:text-primary">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-sm border border-border bg-card px-3 py-1.5 text-sm text-foreground transition hover:border-primary hover:text-primary">
                Sign up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <kbd className="hidden rounded-sm border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">
            {isMac ? "⌘" : "Ctrl"} K
          </kbd>
        </div>

      </div>
    </header>

       <div className="mx-auto w-full max-w-5xl px-4">
  {isEmpty ? (
    <section className="relative flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center gap-10 py-12">
      
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="relative text-center animate-fade-in">

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          grounded ai search
        </div>

        {/* 🔥 BIGGER LOGO FIX HERE */}
        <h1 className="text-balance font-mono text-4xl font-semibold tracking-tight md:text-5xl flex items-center justify-center">
          
          <img
            src="/logo.png"
            alt="Logo"
            className="inline-block h-13 w-12 mr-3 object-contain"
          />

          ask
          <span className="text-primary">()</span>
          <span className="cursor-blink" />

        </h1>

        <p className="mt-4 text-sm text-muted-foreground md:text-base">
          Real-time answers with verifiable sources. Built for developers.
        </p>

      </div>

      <div className="relative w-full max-w-2xl">
        <SearchBar
          ref={inputRef}
          onSubmit={(q) => runQuery(q)}
          autoFocus
        />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          // try
        </div>

        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => runQuery(s)}
              className="rounded-sm border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground transition-all hover:border-primary hover:text-primary"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

    </section>
  ) : (
    <section className="pt-8">
      <ChatHistory
        turns={turns}
        onPickFollowUp={(q) => runQuery(q)}
        onRegenerate={(turn) => runQuery(turn.query, turn.id)}
      />
    </section>
  )}
</div>

        {!isEmpty && (
          <div className="sticky bottom-0 z-10 bg-gradient-to-t from-background via-background to-transparent pb-4 pt-8">
            <div className="mx-auto w-full max-w-3xl px-4">
              <SearchBar ref={inputRef} onSubmit={(q) => runQuery(q)} />
            </div>
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
