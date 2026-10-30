import { Badge } from "@/components/ui/badge";
import type { LostRequest } from "@/src/lib/api/types";

export function LostRequestStatusBadge({ status }: { status: LostRequest["status"] }) {
  return status === "active" ? (
    <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">Active</Badge>
  ) : (
    <Badge variant="secondary" className="border border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">Archived</Badge>
  );
}
