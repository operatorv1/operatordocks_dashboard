import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Menu,
  Search,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  Check,
  X,
  LayoutDashboard,
  Users,
  Workflow,
  BarChart3,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Notif = {
  id: number;
  title: string;
  time: string;
  dot: string;
  read: boolean;
};

const initialNotifications: Notif[] = [
  { id: 1, title: "Agent AX-12 completed 340 tasks", time: "2m ago", dot: "bg-brand", read: false },
  { id: 2, title: "Workload spike detected — Support queue", time: "18m ago", dot: "bg-yellow-400", read: false },
  { id: 3, title: "Weekly forecast report ready", time: "1h ago", dot: "bg-brand/60", read: false },
  { id: 4, title: "New hire onboarding scheduled", time: "3h ago", dot: "bg-brand/60", read: false },
];

const searchIndex = [
  { label: "Dashboard Overview", path: "/", icon: LayoutDashboard, hint: "KPIs, activity, throughput" },
  { label: "Intelligent Workforce Planner", path: "/workforce-planner", icon: Users, hint: "Scheduling & capacity" },
  { label: "AI Task Orchestration Engine", path: "/task-orchestration", icon: Workflow, hint: "Workflows & queues" },
  { label: "Workforce Performance Intelligence", path: "/performance", icon: BarChart3, hint: "Skills & leaderboard" },
  { label: "Operational Forecasting System", path: "/forecasting", icon: TrendingUp, hint: "Predictive signals" },
  { label: "Executive Operations Dashboard", path: "/executive", icon: Briefcase, hint: "ROI & regions" },
  { label: "Settings", path: "/settings", icon: SettingsIcon, hint: "Profile & workspace" },
];

const STORAGE_KEY = "operatordocks.notifications.v1";

const liveFeed = [
  { title: "Agent NX-07 finished a workflow batch", dot: "bg-brand" },
  { title: "SLA breach risk on Billing queue", dot: "bg-yellow-400" },
  { title: "Capacity model recalculated", dot: "bg-brand/60" },
  { title: "Forecast confidence rose to 94%", dot: "bg-brand" },
  { title: "New agent joined the workspace", dot: "bg-brand/60" },
];

export default function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notif[]>(() => {
    if (typeof window === "undefined") return initialNotifications;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Notif[];
    } catch {}
    return initialNotifications;
  });
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const pick = liveFeed[Math.floor(Math.random() * liveFeed.length)];
      const n: Notif = {
        id: Date.now(),
        title: pick.title,
        time: "just now",
        dot: pick.dot,
        read: false,
      };
      setNotifications((list) => [n, ...list].slice(0, 20));
      toast(pick.title, { description: "New system event" });
    }, 45000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return searchIndex;
    return searchIndex.filter(
      (r) => r.label.toLowerCase().includes(q) || r.hint.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query, searchOpen]);

  const unread = notifications.filter((n) => !n.read).length;

  const initials =
    user?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ??
    user?.email?.slice(0, 2).toUpperCase() ??
    "OP";

  const go = (path: string, label: string) => {
    setSearchOpen(false);
    setQuery("");
    navigate(path);
    toast.success(`Opened ${label}`);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-2xl" ref={searchRef}>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIdx((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIdx((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && results[activeIdx]) {
                e.preventDefault();
                go(results[activeIdx].path, results[activeIdx].label);
              }
            }}
            placeholder="Search modules, agents, tasks…"
            className="w-full rounded-xl border border-border bg-surface/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
            ⌘K
          </kbd>

          {searchOpen && (
            <div className="glass-panel absolute left-0 right-0 mt-2 rounded-xl p-1 shadow-2xl">
              <div className="border-b border-border px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {results.length} result{results.length === 1 ? "" : "s"}
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {results.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    No matches for “{query}”
                  </div>
                ) : (
                  results.map((r, i) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.path}
                        onMouseEnter={() => setActiveIdx(i)}
                        onClick={() => go(r.path, r.label)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                          i === activeIdx ? "bg-brand/10" : "hover:bg-white/5",
                        )}
                      >
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-surface">
                          <Icon className="h-4 w-4 text-brand" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-white">{r.label}</div>
                          <div className="truncate text-xs text-muted-foreground">{r.hint}</div>
                        </div>
                        <span className="hidden text-[10px] text-muted-foreground sm:block">↵</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-xl border border-border bg-surface/50 p-2.5 text-muted-foreground hover:border-brand/40 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-bold text-background animate-pulse-glow">
                {unread}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="glass-panel absolute right-[-40px] xs:right-0 mt-2 w-[340px] max-w-[calc(100vw-2rem)] rounded-xl p-1 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border px-3 py-2.5 gap-2">
                <div className="font-display text-xs sm:text-sm font-semibold truncate">Notifications</div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <span className="rounded-full bg-brand/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-brand whitespace-nowrap">
                    {unread} new
                  </span>
                  <button
                    onClick={() => {
                      setNotifications((n) => n.map((x) => ({ ...x, read: true })));
                      toast.success("All notifications marked read");
                    }}
                    className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] sm:text-[10px] text-muted-foreground hover:bg-white/5 hover:text-white whitespace-nowrap"
                    title="Mark all read"
                  >
                    <Check className="h-3 w-3 shrink-0" /> Read
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                    You're all caught up ✨
                  </div>
                )}
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-white/5",
                      !n.read && "bg-brand/[0.04]",
                    )}
                  >
                    <button
                      onClick={() =>
                        setNotifications((list) =>
                          list.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
                        )
                      }
                      className="mt-1 flex items-center shrink-0"
                      title={n.read ? "Read" : "Mark as read"}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full transition-opacity",
                          n.dot,
                          n.read && "opacity-25",
                        )}
                      />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          "truncate text-xs sm:text-sm",
                          n.read ? "text-muted-foreground" : "text-white",
                        )}
                      >
                        {n.title}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">{n.time}</div>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications((list) => list.filter((x) => x.id !== n.id))
                      }
                      className="opacity-0 transition-opacity group-hover:opacity-100 shrink-0 self-center"
                      title="Dismiss"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground hover:text-white" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-border p-2">
                <button
                  onClick={() => {
                    setNotifications([]);
                    toast.success("All notifications cleared");
                  }}
                  className="rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-white/5 hover:text-white"
                >
                  Clear all
                </button>
                <button
                  onClick={() => {
                    setNotifOpen(false);
                    navigate("/settings");
                  }}
                  className="rounded-lg px-2 py-1.5 text-xs font-medium text-brand hover:bg-brand/10"
                >
                  View all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-surface/50 py-1.5 pl-1.5 pr-2 hover:border-brand/40 sm:pr-3"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                className="h-8 w-8 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="brand-gradient grid h-8 w-8 place-items-center rounded-lg text-xs font-bold">
                {initials}
              </div>
            )}
            <div className="hidden text-left sm:block">
              <div className="max-w-[140px] truncate text-xs font-semibold text-white">
                {user?.displayName ?? "Admin"}
              </div>
              <div className="text-[10px] text-muted-foreground">Operations Admin</div>
            </div>
          </button>
          {profileOpen && (
            <div className="glass-panel absolute right-0 mt-2 w-64 rounded-xl p-1 shadow-2xl">
              <div className="border-b border-border px-3 py-3">
                <div className="truncate text-sm font-semibold text-white">
                  {user?.displayName ?? "Admin User"}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {user?.email ?? "admin@operatordocks.com"}
                </div>
              </div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-white"
              >
                <UserIcon className="h-4 w-4" /> Profile
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-white"
              >
                <SettingsIcon className="h-4 w-4" /> Settings
              </button>
              <div className="my-1 h-px bg-border" />
              <button
                onClick={async () => {
                  await signOut();
                  toast.success("Signed out");
                  navigate("/auth");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}