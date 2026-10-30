import { Badge } from "@/components/ui/badge";
import type { FoundPost } from "@/src/lib/api/types";

export function StatusBadge({ post }: { post: Pick<FoundPost, "status" | "resolved"> }) {
  if (post.resolved) {
    return <Badge className="border border-sky-200 bg-sky-50 text-sky-800">Resolved</Badge>;
  }

  if (post.status === "archived") {
    return <Badge variant="secondary" className="border border-zinc-200 bg-zinc-100 text-zinc-700">Archived</Badge>;
  }

  return <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-800">Active</Badge>;
}
