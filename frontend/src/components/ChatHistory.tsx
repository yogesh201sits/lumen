import { useEffect, useRef } from "react";
import AnswerCard from "./AnswerCard";
import SourcesList from "./SourcesList";
import FollowUpChips from "./FollowUpChips";
import type { SearchResponse } from "@/lib/searchApi";

export type ChatTurn = {
  id: string;
  query: string;
  loading: boolean;
  response?: SearchResponse;
};

type Props = {
  turns: ChatTurn[];
  onPickFollowUp: (q: string) => void;
  onRegenerate: (turn: ChatTurn) => void;
};

export default function ChatHistory({ turns, onPickFollowUp, onRegenerate }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [turns.length]);

  return (
    <div className="flex flex-col gap-12 pb-8">
      {turns.map((t) => (
        <article key={t.id} className="flex flex-col gap-6">
          <h2 className="flex items-baseline gap-2 font-mono text-xl font-semibold tracking-tight text-foreground md:text-2xl animate-fade-in">
            <span className="text-primary">{">"}</span>
            <span>{t.query}</span>
          </h2>

          <div className="grid gap-8 md:grid-cols-[1fr_280px]">
            <div className="flex flex-col gap-8">
              <AnswerCard
                answer={t.response?.result.answer ?? ""}
                loading={t.loading}
                onRegenerate={t.response ? () => onRegenerate(t) : undefined}
              />
              {t.response && (
                <FollowUpChips
                  questions={t.response.result.followUpQuestions}
                  onPick={onPickFollowUp}
                />
              )}
            </div>
            <aside>
              {t.response ? (
                <SourcesList urls={t.response.urls} />
              ) : (
                <div className="space-y-2">
                  <div className="skeleton-shimmer h-20 rounded-xl" />
                  <div className="skeleton-shimmer h-20 rounded-xl" />
                </div>
              )}
            </aside>
          </div>
        </article>
      ))}
      <div ref={endRef} />
    </div>
  );
}
