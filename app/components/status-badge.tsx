import { statusLabel } from "@/lib/format";
import type { DeliverableStatus } from "@/lib/types";

const statusClassName: Record<DeliverableStatus, string> = {
  PENDING: "border-amber-200/80 bg-amber-50 text-amber-800 shadow-amber-900/5",
  APPROVED:
    "border-emerald-200/80 bg-emerald-50 text-emerald-800 shadow-emerald-900/5",
  CHANGES_REQUESTED: "border-rose-200/80 bg-rose-50 text-rose-800 shadow-rose-900/5",
};

export function StatusBadge({ status }: { status: DeliverableStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm ${statusClassName[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}
