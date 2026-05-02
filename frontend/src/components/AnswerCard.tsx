import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";

type Props = {
  answer: string;
  loading?: boolean;
  onRegenerate?: () => void;
};

function renderAnswer(text: string) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return parts.map((p, i) =>
    /^https?:\/\//.test(p) ? (
      <a
        key={i}
        href={p}
        target="_blank"
        rel="noreferrer noopener"
        className="text-primary underline-offset-4 hover:underline"
      >
        {p}
      </a>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default function AnswerCard({ answer, loading, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card animate-slide-up">
      {/* Terminal-style header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-2">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span>response.json</span>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          {loading ? "● streaming" : "✓ 200 OK"}
        </span>
      </div>

      <div className="p-5">
        {loading ? (
          <div className="space-y-3">
            <div className="skeleton-shimmer h-3 w-11/12 rounded-sm" />
            <div className="skeleton-shimmer h-3 w-full rounded-sm" />
            <div className="skeleton-shimmer h-3 w-10/12 rounded-sm" />
            <div className="skeleton-shimmer h-3 w-7/12 rounded-sm" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/90 animate-fade-in">
            {renderAnswer(answer)}
          </p>
        )}

        {!loading && (
          <div className="mt-5 flex items-center gap-1 border-t border-border pt-3">
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <RefreshCw className="h-3 w-3" />
                Regen
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
