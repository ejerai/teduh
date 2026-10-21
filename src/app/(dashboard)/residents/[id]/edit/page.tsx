import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ResidentForm } from "@/components/resident-form";
import { residents } from "@/data/residents";

export default async function EditResidentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resident = residents.find((r) => r.id === id);
  if (!resident) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href={`/residents/${resident.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {resident.fullName}
      </Link>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight @lg:text-3xl">
        Ubah data penghuni
      </h1>
      <p className="mt-1 text-sm text-muted-foreground @lg:text-base">
        Perbarui informasi penghuni, lalu simpan.
      </p>

      <div className="mt-6">
        <ResidentForm resident={resident} />
      </div>
    </div>
  );
}