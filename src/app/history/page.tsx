import { TopBar } from "@/components/topbar";
import { getHistory } from "@/lib/db-service";
import { HistoryTableClient } from "@/components/history-table-client";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const history = await getHistory(100);

  return (
    <>
      <TopBar title="Broadcast History" />
      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <HistoryTableClient history={history} />
      </div>
    </>
  );
}
