import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Workflow,
  BarChart3,
  TrendingUp,
  Briefcase,
  Settings as SettingsIcon,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Dashboard Overview", icon: LayoutDashboard, end: true },
  { to: "/workforce-planner", label: "Workforce Planner", icon: Users },
  { to: "/task-orchestration", label: "Task Orchestration", icon: Workflow },
  { to: "/performance", label: "Performance", icon: BarChart3 },
  { to: "/forecasting", label: "Forecasting", icon: TrendingUp },
  { to: "/executive", label: "Executive", icon: Briefcase },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

interface Props {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onCloseMobile}
        className={cn(
          "fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="glass-panel flex h-full flex-col border-r border-border/60">
          {/* Brand */}
          <div className="flex items-center justify-between px-5 py-5">
            <img
              src="/logo.png"
              alt="OperatorDocks Logo"
              className="h-12 w-auto object-contain"
            />

            <button
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mx-4 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

          {/* Nav */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <div className="px-3 pb-2 pt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
              Operations
            </div>
            {items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-brand/10 text-white glow-ring"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full brand-gradient" />
                    )}
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors",
                        isActive ? "text-brand" : "text-muted-foreground group-hover:text-brand/80",
                      )}
                    />
                    <span className="truncate">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Upgrade card */}
          <div className="p-4">
            <div className="relative overflow-hidden rounded-xl border border-brand/20 bg-gradient-to-br from-brand-muted/60 to-transparent p-4">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand/20 blur-2xl" />
              <div className="relative">
                <div className="text-xs font-medium text-brand">Enterprise Tier</div>
                <div className="mt-1 font-display text-sm font-semibold text-white">
                  Unlimited AI agents
                </div>
                <a
                  href="https://operatordocks.com/#pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="brand-gradient mt-3 w-full rounded-lg px-3 py-1.5 text-xs font-semibold hover:opacity-90">
                    Upgrade
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
