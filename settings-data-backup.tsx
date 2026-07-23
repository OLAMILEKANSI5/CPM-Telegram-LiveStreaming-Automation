"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Music,
  CalendarClock,
  Send,
  Radio,
  History,
  FileText,
  Settings,
  Cross,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Live Control", href: "/live-control", icon: Radio },
  { name: "Audio Library", href: "/audio", icon: Music },
  { name: "Scheduler", href: "/scheduler", icon: CalendarClock },
  { name: "Telegram", href: "/telegram", icon: Send },
  { name: "History", href: "/history", icon: History },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#0a1f44] via-[#0d2856] to-[#0a1f44] text-white shadow-2xl flex flex-col">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="relative w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center shrink-0">
          <Cross className="w-6 h-6 text-[#0d2856]" strokeWidth={2.5} />
          <div className="absolute inset-0 rounded-full ring-2 ring-[#4a90e2]/40"></div>
        </div>
        <div>
          <div className="font-bold text-base leading-tight tracking-tight">
            CHARIS
          </div>
          <div className="text-xs text-blue-200/80 font-medium leading-tight">
            Power Ministry
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="px-6 py-3 border-b border-white/5">
        <div className="text-[11px] uppercase tracking-widest text-blue-300/70 font-semibold">
          Prayer Broadcast
        </div>
        <div className="text-[11px] text-blue-200/60 mt-0.5">
          Automated Daily System
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white text-[#0d2856] shadow-md shadow-blue-900/50"
                  : "text-blue-100/80 hover:bg-white/10 hover:text-white hover:translate-x-0.5"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive ? "text-[#0d2856]" : "text-blue-300/70 group-hover:text-white"
                )}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span>{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#4a90e2]"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer status */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-300">
              System Online
            </span>
          </div>
          <div className="text-[10px] text-blue-200/60 leading-relaxed">
            v1.0.0 • Uptime 3d 7h
          </div>
        </div>
      </div>
    </aside>
  );
}
