import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  status?: "success" | "warning" | "error" | "info" | "neutral";
  accent?: string;
  footer?: React.ReactNode;
}

const statusStyles = {
  success: "from-emerald-500 to-emerald-600 text-emerald-50",
  warning: "from-amber-500 to-orange-500 text-amber-50",
  error: "from-rose-500 to-red-600 text-rose-50",
  info: "from-[#0d2856] to-[#4a90e2] text-blue-50",
  neutral: "from-slate-500 to-slate-700 text-slate-50",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  status = "info",
  footer,
}: StatCardProps) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-slate-200/70 hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden">
      {/* Top accent bar */}
      <div className={cn("h-1 bg-gradient-to-r", statusStyles[status].split(" ").slice(0, 2).join(" "))}></div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              {title}
            </p>
          </div>
          {Icon && (
            <div
              className={cn(
                "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-md shrink-0 ml-3",
                statusStyles[status]
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            {value}
          </div>
        </div>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-1.5 leading-snug">{subtitle}</p>
        )}
        {footer && <div className="mt-3 pt-3 border-t border-slate-100">{footer}</div>}
      </div>
    </div>
  );
}

export function StatusBadge({
  status,
  children,
}: {
  status: string;
  children: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 border-emerald-200",
    running: "bg-emerald-100 text-emerald-700 border-emerald-200",
    connected: "bg-emerald-100 text-emerald-700 border-emerald-200",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    enabled: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    connecting: "bg-amber-100 text-amber-700 border-amber-200",
    scheduled: "bg-amber-100 text-amber-700 border-amber-200",
    starting: "bg-amber-100 text-amber-700 border-amber-200",
    idle: "bg-slate-100 text-slate-600 border-slate-200",
    stopped: "bg-rose-100 text-rose-700 border-rose-200",
    failed: "bg-rose-100 text-rose-700 border-rose-200",
    disconnected: "bg-rose-100 text-rose-700 border-rose-200",
    error: "bg-rose-100 text-rose-700 border-rose-200",
    disabled: "bg-slate-100 text-slate-600 border-slate-300",
  };
  const dotMap: Record<string, string> = {
    active: "bg-emerald-500",
    running: "bg-emerald-500 animate-pulse",
    connected: "bg-emerald-500",
    completed: "bg-emerald-500",
    enabled: "bg-emerald-500",
    pending: "bg-amber-500 animate-pulse",
    connecting: "bg-amber-500 animate-pulse",
    scheduled: "bg-amber-500",
    starting: "bg-amber-500 animate-pulse",
    idle: "bg-slate-400",
    stopped: "bg-rose-500",
    failed: "bg-rose-500",
    disconnected: "bg-rose-500",
    error: "bg-rose-500",
    disabled: "bg-slate-400",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
        colorMap[status] || colorMap.idle
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          dotMap[status] || "bg-slate-400"
        )}
      ></span>
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  title,
  description,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-slate-200/70",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-100">
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-800">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-[#0d2856] to-[#1e4080] text-white hover:from-[#0a1f44] hover:to-[#0d2856] shadow-sm hover:shadow-md",
    secondary:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200",
    danger:
      "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 shadow-sm",
    success:
      "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-sm",
    ghost: "text-slate-600 hover:bg-slate-100",
    outline:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ProgressBar({
  value,
  max = 100,
  color = "blue",
  showLabel = false,
}: {
  value: number;
  max?: number;
  color?: "blue" | "green" | "amber" | "red";
  showLabel?: boolean;
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    blue: "from-[#0d2856] to-[#4a90e2]",
    green: "from-emerald-500 to-green-500",
    amber: "from-amber-500 to-orange-500",
    red: "from-rose-500 to-red-600",
  };
  return (
    <div className="w-full">
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full bg-gradient-to-r rounded-full transition-all duration-500", colors[color])}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-xs text-slate-500">
          <span>{value.toFixed(1)}%</span>
          <span>{max === 100 ? "" : `${value} / ${max}`}</span>
        </div>
      )}
    </div>
  );
}
