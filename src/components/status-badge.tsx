import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ResidentStatus } from "@/types/resident";

const styles: Record<ResidentStatus, { label: string; className: string }> = {
  aktif: {
    label: "Aktif",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  dirawat: {
    label: "Dirawat",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
  keluar: {
    label: "Keluar",
    className:
      "bg-zinc-200 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-300",
  },
};

export function StatusBadge({ status }: { status: ResidentStatus }) {
  const s = styles[status];
  return (
    <Badge
      variant="secondary"
      className={cn("rounded-full border-0 px-2.5 font-medium", s.className)}
    >
      {s.label}
    </Badge>
  );
}