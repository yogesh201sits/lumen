import { ArrowUpRight } from "lucide-react";

const domainOf = (u: string) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
};

const faviconOf = (u: string) =>
  `https://www.google.com/s2/favicons?domain=${domainOf(u)}&sz=64`;

export default function SourcesList({ urls }: { urls: string[] }) {
  if (!urls?.length) return null;
  return (
    <div className="animate-slide-up">
      <h3 className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>// sources</span>
        <span className="h-px flex-1 bg-border" />
        <span className="text-primary">{urls.length}</span>
      </h3>
      <ul className="flex flex-col">
        {urls.map((url, i) => (
          <li key={url + i}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-3 border-b border-border py-2.5 transition-colors hover:bg-muted/50"
            >
              <span className="font-mono text-[11px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <img
                src={faviconOf(url)}
                alt=""
                className="h-3.5 w-3.5"
                loading="lazy"
                onError={(e) => ((e.currentTarget.style.visibility = "hidden"))}
              />
              <span className="truncate text-xs text-foreground/90 group-hover:text-primary">
                {domainOf(url)}
              </span>
              <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
