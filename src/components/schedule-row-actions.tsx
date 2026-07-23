"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, ToggleLeft, ToggleRight, Trash2, Loader2 } from "lucide-react";
import { toggleScheduleAction, deleteScheduleAction } from "@/app/scheduler/actions";

export function ScheduleRowActions({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleScheduleAction(id, !enabled);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this schedule? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteScheduleAction(id);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/scheduler?id=${id}`}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
        title="Edit"
      >
        <Pencil className="w-4 h-4" />
      </Link>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-50"
        title={enabled ? "Disable" : "Enable"}
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : enabled ? (
          <ToggleRight className="w-5 h-5 text-emerald-600" />
        ) : (
          <ToggleLeft className="w-5 h-5 text-slate-400" />
        )}
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-2 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 disabled:opacity-50"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
