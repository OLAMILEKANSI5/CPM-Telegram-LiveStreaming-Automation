import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return "0:00";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
    case "connected":
    case "active":
    case "running":
    case "enabled":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "pending":
    case "connecting":
    case "starting":
    case "scheduled":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "failed":
    case "stopped":
    case "disconnected":
    case "error":
    case "disabled":
      return "text-rose-600 bg-rose-50 border-rose-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
}

export function getStatusDotColor(status: string): string {
  switch (status) {
    case "completed":
    case "connected":
    case "active":
    case "running":
    case "enabled":
      return "bg-emerald-500";
    case "pending":
    case "connecting":
    case "starting":
    case "scheduled":
      return "bg-amber-500 animate-pulse";
    case "failed":
    case "stopped":
    case "disconnected":
    case "error":
    case "disabled":
      return "bg-rose-500";
    default:
      return "bg-slate-400";
  }
}
