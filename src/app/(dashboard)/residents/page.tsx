import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ResidentsTable } from "@/components/residents-table";
import { residents } from "@/data/residents";
import { cn } from "@/lib/utils";

export default function ResidentsPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight @lg:text-3xl">
            Penghuni
          </h1>
          <p className="mt-1 text-sm text-muted-foreground @lg:text-base">
            Daftar penghuni lansia Kemah Beth Shalom.
          </p>
        </div>
        <Link
          href="/residents/new"
          className={cn(buttonVariants(), "h-10 shrink-0 rounded-full px-5")}
        >
          <Plus className="size-4" />
          Tambah
        </Link>
      </div>

      <div className="mt-6 @lg:mt-8">
        <ResidentsTable residents={residents} />
      </div>
    </div>
  );
}