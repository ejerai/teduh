import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { formatAdmission, getAge, getStay } from "@/lib/format";
import { genderLabel, mobilityLabel } from "@/lib/labels";
import type { Resident } from "@/types/resident";

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words text-sm font-medium">{children}</dd>
    </div>
  );
}

const dash = <span className="font-normal text-muted-foreground">-</span>;

export function ResidentCard({
  resident: r,
  href,
}: {
  resident: Resident;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words font-semibold leading-snug">{r.fullName}</p>
          {r.nickname && (
            <p className="text-sm text-muted-foreground">({r.nickname})</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <StatusBadge status={r.status} />
          {href && <ChevronRight className="size-4 text-muted-foreground" aria-hidden />}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        <Fact label="Umur">{getAge(r.birthDate)} tahun</Fact>
        <Fact label="Jenis kelamin">{genderLabel[r.gender]}</Fact>
        <Fact label="Ukuran baju">{r.clothingSize ?? dash}</Fact>
        <Fact label="Alat bantu">{r.mobility ? mobilityLabel[r.mobility] : dash}</Fact>
        <Fact label="Masuk">{formatAdmission(r.admissionDate, r.admissionApprox)}</Fact>
        <Fact label="Lama tinggal">{getStay(r.admissionDate)}</Fact>
        <div className="col-span-2">
          <Fact label="Rujukan">{r.referral ?? dash}</Fact>
        </div>
        <div className="col-span-2">
          <Fact label="Catatan kesehatan">{r.healthNotes ?? dash}</Fact>
        </div>
      </dl>
    </>
  );

  const className =
    "block rounded-3xl border border-border bg-card p-4 shadow-sm @lg:p-5";

  return href ? (
    <Link
      href={href}
      className={`${className} transition-colors hover:bg-muted/40 active:bg-muted/60`}
    >
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
