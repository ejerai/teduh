import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ResidentForm } from "@/components/resident-form";

export default function NewResidentPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/residents"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Penghuni
      </Link>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight @lg:text-3xl">
        Tambah penghuni
      </h1>
      <p className="mt-1 text-sm text-muted-foreground @lg:text-base">
        Isi data penghuni baru Kemah Beth Shalom.
      </p>

      <div className="mt-6">
        <ResidentForm />
      </div>
    </div>
  );
}