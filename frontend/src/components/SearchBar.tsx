import { ArrowRight, ChevronRight } from "lucide-react";
import { FormEvent, forwardRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  onSubmit: (q: string) => void;
  loading?: boolean;
  value?: string;
  size?: "lg" | "md";
  autoFocus?: boolean;
};

const SearchBar = forwardRef<HTMLTextAreaElement, Props>(
  ({ onSubmit, loading, value, size = "lg", autoFocus }, ref) => {
    const [q, setQ] = useState(value ?? "");

    useEffect(() => {
      if (value !== undefined) setQ(value);
    }, [value]);

    const submit = (e?: FormEvent) => {
      e?.preventDefault();
      const trimmed = q.trim();
      if (!trimmed || loading) return;
      onSubmit(trimmed);
      setQ("");
    };

    return (
      <form
        onSubmit={submit}
        className={cn(
          "group relative w-full rounded-md border border-border bg-card transition-all duration-200",
          "focus-within:border-primary focus-within:shadow-glow"
        )}
      >
        <div className="flex items-end gap-2 p-2.5">
          <ChevronRight className="ml-1 mt-2.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
          <textarea
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            autoFocus={autoFocus}
            placeholder="ask anything..."
            className={cn(
              "flex-1 resize-none bg-transparent px-1 py-2 font-mono outline-none placeholder:text-muted-foreground",
              size === "lg" ? "text-base" : "text-sm"
            )}
            style={{ maxHeight: 200 }}
          />
          <button
            type="submit"
            disabled={!q.trim() || loading}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-sm px-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-all",
              "bg-primary hover:bg-primary-glow",
              "disabled:cursor-not-allowed disabled:opacity-30"
            )}
            aria-label="Send"
          >
            Run
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </form>
    );
  }
);

SearchBar.displayName = "SearchBar";
export default SearchBar;
