import { FileText, HeartPulse, UserCheck, Users } from "lucide-react";
import { HeroBanner } from "@/components/hero-banner";
import { residents } from "@/data/residents";

const stats = [
  {
    label: "Total penghuni",
    value: residents.length,
    hint: "Terdaftar di sistem",
    icon: Users,
  },
  {
    label: "Aktif",
    value: residents.filter((r) => r.status === "aktif").length,
    hint: "Tinggal di panti",
    icon: UserCheck,
  },
  {
    label: "Dirawat",
    value: residents.filter((r) => r.status === "dirawat").length,
    hint: "Sedang dalam perawatan",
    icon: HeartPulse,
  },
  {
    label: "Berkas",
    value: residents.reduce((total, r) => total + r.documentCount, 0),
    hint: "Dokumen terunggah",
    icon: FileText,
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <h1 className="text-2xl font-semibold tracking-tight @lg:text-3xl">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-muted-foreground @lg:text-base">
        Ringkasan data penghuni panti.
      </p>

      <div className="mt-5 @lg:mt-6">
        <HeroBanner />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 @4xl:grid-cols-4 @4xl:gap-4">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <div
            key={label}
            className="@container relative min-w-0 rounded-3xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5"
          >
            <div className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:right-4 sm:top-4">
              <Icon className="size-[18px]" />
            </div>

            <p className="truncate pr-11 text-[13px] font-medium text-muted-foreground @[13rem]:text-sm">
              {label}
            </p>
            <p className="mt-2 text-[clamp(1.875rem,14cqw,2.75rem)] font-semibold leading-none tabular-nums tracking-tight">
              {value}
            </p>
            <p className="mt-1.5 truncate text-xs text-muted-foreground">
              {hint}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}