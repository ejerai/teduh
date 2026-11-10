import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Pencil } from "lucide-react";
import { DeleteResidentDialog } from "@/components/delete-resident-dialog";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { getResident } from "@/lib/data";
import { getSession } from "@/lib/session";
import { formatAdmission, formatDate, getAge, getStay } from "@/lib/format";
import { genderLabel, mobilityLabel } from "@/lib/labels";
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

const empty = <span className="font-normal text-muted-foreground">Belum dicatat</span>;

export default async function ResidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resident = await getResident(id);
  if (!resident) notFound();

  // Pengasuh hanya boleh melihat data, jadi tombol ubah dan hapus disembunyikan.
  const user = await getSession();
  const canEdit = !!user && user.role !== "pengasuh";

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
            <h1 className="break-words text-2xl font-semibold tracking-tight @lg:text-3xl">
              {resident.fullName}
              {resident.nickname && (
                <span className="font-normal text-muted-foreground">
                  {" "}
                  ({resident.nickname})
                </span>
              )}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <StatusBadge status={resident.status} />
              <span>{getAge(resident.birthDate)} tahun</span>
              <span aria-hidden>·</span>
              <span>Tinggal {getStay(resident.admissionDate)}</span>
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center gap-2">
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
            <DeleteResidentDialog id={resident.id} name={resident.fullName} />
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 @4xl:grid-cols-3">
        <Panel title="Data penghuni" className="@4xl:col-span-2">
          <dl className="grid gap-x-6 gap-y-5 @lg:grid-cols-2">
            <Field label="Nama lengkap">{resident.fullName}</Field>
            <Field label="Nama panggilan">{resident.nickname ?? empty}</Field>
            <Field label="Jenis kelamin">{genderLabel[resident.gender]}</Field>
            <Field label="Tanggal lahir">
              {formatDate(resident.birthDate)}
              <span className="font-normal text-muted-foreground">
                {" "}
                ({getAge(resident.birthDate)} tahun)
              </span>
            </Field>
            <Field label="Ukuran baju">{resident.clothingSize ?? empty}</Field>
            <Field label="Status">
              <StatusBadge status={resident.status} />
            </Field>
            <Field label="Tanggal masuk">
              {resident.admissionDate
                ? formatAdmission(resident.admissionDate, resident.admissionApprox)
                : empty}
              {resident.admissionApprox && (
                <span className="font-normal text-muted-foreground"> (perkiraan)</span>
              )}
            </Field>
            <Field label="Lama tinggal">{getStay(resident.admissionDate)}</Field>
            <Field label="Asal rujukan">{resident.referral ?? empty}</Field>
          </dl>
        </Panel>

        <div className="space-y-4">
          <Panel title="Kondisi">
            <dl className="space-y-5">
              <Field label="Alat bantu">
                {resident.mobility ? mobilityLabel[resident.mobility] : empty}
              </Field>
              <Field label="Catatan kesehatan">{resident.healthNotes ?? empty}</Field>
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
              Unggah dan pratinjau berkas menyusul.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
