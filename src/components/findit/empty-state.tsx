import { PackageSearch } from "lucide-react";

export function EmptyState({ archived }: { archived: boolean }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <PackageSearch aria-hidden="true" className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold tracking-tight">{archived ? "No archived items" : "No found items yet"}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {archived
          ? "Archived posts will appear here. Try the active items filter to browse current finds."
          : "There are no active found item posts right now. Check back later."}
      </p>
    </div>
  );
}
