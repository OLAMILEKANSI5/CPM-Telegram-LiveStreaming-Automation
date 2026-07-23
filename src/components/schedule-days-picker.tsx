"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS = [1, 2, 3, 4, 5];
const WEEKENDS = [0, 6];

export function ScheduleDaysPicker({ defaultDays }: { defaultDays: string }) {
  const initial = new Set(
    (defaultDays || "0,1,2,3,4,5,6")
      .split(",")
      .filter((d) => d !== "")
      .map((d) => parseInt(d, 10))
  );
  const [selected, setSelected] = useState<Set<number>>(initial);

  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {DAYS.map((day, i) => (
          <label key={day} className="cursor-pointer">
            <input
              type="checkbox"
              name="days"
              value={i}
              checked={selected.has(i)}
              onChange={() => toggle(i)}
              className="hidden"
            />
            <div
              className={cn(
                "w-12 h-12 rounded-xl font-bold text-sm transition-all flex items-center justify-center",
                selected.has(i)
                  ? "bg-gradient-to-br from-[#0d2856] to-[#4a90e2] text-white shadow-md"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              )}
            >
              {day}
            </div>
          </label>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={() => setSelected(new Set([0, 1, 2, 3, 4, 5, 6]))}
          className="text-xs font-semibold text-[#0d2856] hover:underline"
        >
          Select All
        </button>
        <span className="text-slate-300">•</span>
        <button
          type="button"
          onClick={() => setSelected(new Set(WEEKDAYS))}
          className="text-xs font-semibold text-[#0d2856] hover:underline"
        >
          Weekdays
        </button>
        <span className="text-slate-300">•</span>
        <button
          type="button"
          onClick={() => setSelected(new Set(WEEKENDS))}
          className="text-xs font-semibold text-[#0d2856] hover:underline"
        >
          Weekends
        </button>
      </div>
    </div>
  );
}
