"use client";

import { Bell, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function TopBar({ title }: { title: string }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left: Mobile menu + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              {title}
            </h1>
            <div className="hidden sm:block text-xs text-slate-500 mt-0.5">
              CHARIS Power Ministry • Prayer Broadcast Control
            </div>
          </div>
        </div>

        {/* Right: Search + Notifications + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 w-64">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 w-full"
            />
          </div>

          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0d2856] to-[#4a90e2] flex items-center justify-center text-white text-xs font-bold shadow-md">
              CP
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-slate-700 leading-tight">
                Admin
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">
                System Operator
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#0a1f44] text-white shadow-2xl transform transition-transform duration-300 lg:hidden",
          showMobileMenu ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <span className="text-[#0d2856] font-black text-lg">✝</span>
          </div>
          <div>
            <div className="font-bold text-base leading-tight">CHARIS</div>
            <div className="text-xs text-blue-200/80">Power Ministry</div>
          </div>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {[
            { name: "Dashboard", href: "/" },
            { name: "Live Control", href: "/live-control" },
            { name: "Audio Library", href: "/audio" },
            { name: "Scheduler", href: "/scheduler" },
            { name: "Telegram", href: "/telegram" },
            { name: "History", href: "/history" },
            { name: "Logs", href: "/logs" },
            { name: "Settings", href: "/settings" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setShowMobileMenu(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-blue-100/80 hover:bg-white/10 hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
