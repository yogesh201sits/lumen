import { MessageSquare, PanelLeftClose, PanelLeftOpen, Plus, Trash2 } from "lucide-react";
import type { Conversation } from "@/lib/conversationStore";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
};

export default function HistorySidebar({
  open,
  onToggle,
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: Props) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm md:hidden"
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
          open ? "w-72" : "w-0 md:w-12",
          "overflow-hidden"
        )}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 border-b border-border px-2 py-2.5">
          <button
            onClick={onToggle}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={open ? "Hide history" : "Show history"}
          >
            {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </button>

          {open && (
            <button
              onClick={onNew}
              className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-sm border border-border bg-background px-2 font-mono text-[11px] uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              New
            </button>
          )}
        </div>

        {/* List */}
        {open && (
          <div className="flex-1 overflow-y-auto py-2">
            <div className="mb-2 px-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              // history
            </div>

            {conversations.length === 0 ? (
              <div className="px-3 py-2 font-mono text-xs text-muted-foreground">
                no conversations yet
              </div>
            ) : (
              <ul className="flex flex-col">
                {conversations.map((c) => (
                  <li key={c.id} className="group relative">
                    <button
                      onClick={() => onSelect(c.id)}
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-left transition-colors",
                        c.id === activeId
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground/80 hover:bg-muted"
                      )}
                    >
                      <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate text-xs">{c.title}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(c.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground opacity-0 transition-all hover:bg-background hover:text-destructive group-hover:opacity-100"
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
