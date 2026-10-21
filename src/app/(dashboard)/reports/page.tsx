import { ReportPanel } from "@/components/report-panel";
import { residents } from "@/data/residents";

export default function ReportsPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <h1 className="text-2xl font-semibold tracking-tight @lg:text-3xl">
        Laporan
      </h1>
      <p className="mt-1 text-sm text-muted-foreground @lg:text-base">
        Pratinjau data penghuni dan ekspor laporan.
      </p>

      <div className="mt-6 @lg:mt-8">
        <ReportPanel residents={residents} />
      </div>
    </div>
  );
}