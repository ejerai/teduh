import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Pencil, Phone } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { residents } from "@/data/residents";
import { formatDate, getAge } from "@/lib/format";
import { cn } from "@/lib/utils";

function Panel({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-border bg-card p-5 shadow-sm @lg:p-6",
        className
      )}
    >
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-[15px] font-medium">{children}</dd>
    </div>
  );
}

export default async function ResidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resident = residents.find((r) => r.id === id);
  if (!resident) notFound();

  const initials = resident.fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <Link
        href="/residents"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Penghuni
      </Link>

      <div className="mt-4 flex flex-col gap-4 @2xl:flex-row @2xl:items-center @2xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
            {initials}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight @lg:text-3xl">
              {resident.fullName}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <StatusBadge status={resident.status} />
              <span>Kamar {resident.roomNumber}</span>
              <span aria-hidden>·</span>
              <span>{getAge(resident.birthDate)} tahun</span>
            </div>
          </div>
        </div>

        <Link
          href={`/residents/${resident.id}/edit`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 rounded-xl px-4"
          )}
        >
          <Pencil className="size-4" />
          Ubah data
        </Link>
      </div>

      <div className="mt-6 grid gap-4 @4xl:grid-cols-3">
        <Panel title="Data penghuni" className="@4xl:col-span-2">
          <dl className="grid gap-x-6 gap-y-5 @lg:grid-cols-2">
            <Field label="Nama lengkap">{resident.fullName}</Field>
            <Field label="Jenis kelamin">
              {resident.gender === "L" ? "Laki-laki" : "Perempuan"}
            </Field>
            <Field label="Tanggal lahir">
              {formatDate(resident.birthDate)}
              <span className="font-normal text-muted-foreground">
                {" "}
                ({getAge(resident.birthDate)} tahun)
              </span>
            </Field>
            <Field label="Tanggal masuk">
              {formatDate(resident.admissionDate)}
            </Field>
            <Field label="Nomor kamar">{resident.roomNumber}</Field>
            <Field label="Status">
              <StatusBadge status={resident.status} />
            </Field>
          </dl>
        </Panel>

        <div className="space-y-4">
          <Panel title="Wali / kontak keluarga">
            <dl className="space-y-5">
              <Field label="Nama">{resident.guardian.name}</Field>
              <Field label="Hubungan">{resident.guardian.relationship}</Field>
              <Field label="Telepon">
                <a
                  href={`tel:${resident.guardian.phone}`}
                  className="inline-flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Phone className="size-4" />
                  {resident.guardian.phone}
                </a>
              </Field>
            </dl>
          </Panel>

          <Panel title="Berkas">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold leading-none tabular-nums">
                  {resident.documentCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  berkas terunggah
                </p>
              </div>
            </div>
            <p className="mt-4 rounded-2xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              Unggah dan pratinjau berkas tersedia setelah backend terhubung.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}