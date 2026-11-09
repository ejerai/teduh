import { HistoryList } from "@/components/history-list";
import { getHistory } from "@/lib/data";

export default async function HistoryPage() {
  const history = await getHistory();

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <h1 className="text-2xl font-semibold tracking-tight @lg:text-3xl">
        Riwayat
      </h1>
      <p className="mt-1 text-sm text-muted-foreground @lg:text-base">
        Catatan setiap perubahan data penghuni: siapa, apa, dan kapan.
      </p>

      <div className="mt-6 @lg:mt-8">
        <HistoryList entries={history} />
      </div>
    </div>
  );
}