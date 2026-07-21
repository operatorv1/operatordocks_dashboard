import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  trend,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  hint?: string;
}) {
  return (
    <div className="glass-panel group relative overflow-hidden rounded-2xl p-5 transition hover:border-brand/30">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand/10 blur-2xl transition group-hover:bg-brand/20" />
      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-2 font-display text-3xl font-semibold text-white">{value}</div>
          {(change || hint) && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              {change && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-medium",
                    trend === "up"
                      ? "bg-brand/15 text-brand"
                      : "bg-red-500/15 text-red-400",
                  )}
                >
                  {trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {change}
                </span>
              )}
              {hint && <span className="text-muted-foreground">{hint}</span>}
            </div>
          )}
        </div>
        <div className="brand-gradient grid h-10 w-10 shrink-0 place-items-center rounded-xl shadow-glow">
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}
