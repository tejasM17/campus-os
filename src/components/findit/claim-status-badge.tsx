import { Badge } from "@/components/ui/badge";
import type { Claim } from "@/src/lib/api/types";

const styles: Record<Claim["decision"], string> = {
  pending: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
  approved: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  rejected: "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
};

export function ClaimStatusBadge({ decision }: { decision: Claim["decision"] }) {
  return <Badge variant="outline" className={`capitalize ${styles[decision]}`}>{decision}</Badge>;
}
