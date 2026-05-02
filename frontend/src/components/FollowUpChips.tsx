import { ChevronRight } from "lucide-react";

type Props = {
  questions: string[];
  onPick: (q: string) => void;
};

export default function FollowUpChips({ questions, onPick }: Props) {
  if (!questions?.length) return null;
  return (
    <div className="animate-slide-up">
      <h3 className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>// related queries</span>
        <span className="h-px flex-1 bg-border" />
      </h3>
      <div className="flex flex-col">
        {questions.map((q, i) => (
          <button
            key={q + i}
            onClick={() => onPick(q)}
            className="group flex items-center gap-3 border-b border-border py-3 text-left transition-colors hover:bg-muted/50"
          >
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" strokeWidth={2.5} />
            <span className="text-sm text-foreground/90 group-hover:text-foreground">{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
