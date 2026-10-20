import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ResidentsTable } from "@/components/residents-table";
import { residents } from "@/data/residents";
import { cn } from "@/lib/utils";

export default function ResidentsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Penghuni</h1>
          <p className="mt-1 text-muted-foreground">
            Daftar penghuni lansia Kemah Beth Shalom.
          </p>
        </div>
        <Link
          href="/residents/new"
          className={cn(buttonVariants(), "h-10 rounded-full px-5")}
        >
          <Plus className="size-4" />
          Tambah
        </Link>
      </div>

      <div className="mt-8">
        <ResidentsTable residents={residents} />
      </div>
    </div>
  );
}