import { useEffect, useMemo, useState } from "react";
import { Calendar, Users, Bot, Plus, Filter, X, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { usePageMeta } from "@/hooks/usePageMeta";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Schedule = {
  id: string;
  name: string;
  team: string;
  date: string; // yyyy-mm-dd
  shift: "Morning" | "Afternoon" | "Night";
  operators: number;
  aiAgents: number;
  createdAt: number;
};

const teams = [
  "Support Ops",
  "Sales Enablement",
  "Data Processing",
  "Content Ops",
  "Compliance",
  "Engineering",
];

const seedSchedules: Schedule[] = [
  {
    id: "s-001",
    name: "Weekend Support Coverage",
    team: "Support Ops",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    shift: "Morning",
    operators: 12,
    aiAgents: 6,
    createdAt: Date.now() - 3600_000,
  },
  {
    id: "s-002",
    name: "Data Ingestion Sprint",
    team: "Data Processing",
    date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    shift: "Night",
    operators: 4,
    aiAgents: 18,
    createdAt: Date.now() - 7200_000,
  },
];

const STORAGE_KEY = "od.schedules";

const shifts = [
  { role: "Support Ops", human: 24, ai: 12, digital: 6, coverage: 96 },
  { role: "Sales Enablement", human: 18, ai: 8, digital: 4, coverage: 88 },
  { role: "Data Processing", human: 6, ai: 22, digital: 14, coverage: 99 },
  { role: "Content Ops", human: 12, ai: 10, digital: 3, coverage: 82 },
  { role: "Compliance", human: 9, ai: 4, digital: 2, coverage: 91 },
  { role: "Engineering", human: 31, ai: 6, digital: 0, coverage: 78 },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const heat = Array.from({ length: 6 }, (_, r) =>
  Array.from({ length: 7 }, (_, c) => ({
    v: Math.round(30 + Math.random() * 70),
    r,
    c,
  })),
);

export default function WorkforcePlanner() {
  usePageMeta("Intelligent Workforce Planner");

  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Schedule[]) : seedSchedules;
    } catch {
      return seedSchedules;
    }
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    team: teams[0],
    date: new Date().toISOString().slice(0, 10),
    shift: "Morning" as Schedule["shift"],
    operators: 8,
    aiAgents: 4,
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    } catch {
      /* ignore */
    }
  }, [schedules]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const stats = useMemo(() => {
    const totalOps = schedules.reduce((s, x) => s + x.operators, 0);
    const totalAI = schedules.reduce((s, x) => s + x.aiAgents, 0);
    return { totalOps, totalAI, count: schedules.length };
  }, [schedules]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Schedule name is required");
      return;
    }
    const next: Schedule = {
      id: `s-${Date.now().toString(36)}`,
      name: form.name.trim(),
      team: form.team,
      date: form.date,
      shift: form.shift,
      operators: Number(form.operators) || 0,
      aiAgents: Number(form.aiAgents) || 0,
      createdAt: Date.now(),
    };
    setSchedules((s) => [next, ...s]);
    toast.success(`Schedule “${next.name}” created`);
    setOpen(false);
    setForm({ ...form, name: "" });
  };

  const remove = (id: string) => {
    setSchedules((s) => s.filter((x) => x.id !== id));
    toast.success("Schedule removed");
  };

  return (
    <div className="w-full max-w-full space-y-6 px-1 sm:px-0 overflow-x-hidden">
      <PageHeader
        eyebrow="Planner"
        title="Intelligent Workforce Planner"
        subtitle="AI optimized scheduling, workload balancing, and capacity planning."
        action={
          <button
            onClick={() => setOpen(true)}
            className="brand-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-glow hover:opacity-95 w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" /> New Schedule
          </button>
        }
      />

      {/* Improved 1-col on mobile, 2-col on small tablets, 4-col on desktop */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Scheduled Today" value={String(342 + stats.totalOps)} change="+6%" trend="up" hint="operators" />
        <StatCard icon={Bot} label="AI Coverage" value="94%" change="+3.2%" trend="up" hint="shift fill" />
        <StatCard icon={Calendar} label="Active Schedules" value={String(stats.count)} change={`+${stats.count}`} trend="up" hint="in planner" />
        <StatCard icon={Filter} label="Balance Score" value="8.9/10" change="+0.4" trend="up" hint="workload" />
      </div>

      {/* Created Schedules */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-white">Active Schedules</h3>
            <p className="text-xs text-muted-foreground">
              {schedules.length} schedule{schedules.length === 1 ? "" : "s"} planned
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/20 sm:inline-flex"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        {schedules.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            No schedules yet click “New Schedule” to create one.
          </div>
        ) : (
          /* Swapped grid-cols-1 md:grid-cols-2 to give breathing space on smaller tablets */
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {schedules.map((s) => (
              <div
                key={s.id}
                className="group relative rounded-xl border border-border bg-surface/40 p-4 transition-colors hover:border-brand/40"
              >
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-white text-sm sm:text-base">{s.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{s.team}</div>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand self-start">
                    {s.shift}
                  </span>
                </div>
                {/* Safe grid columns fallback on tight widths */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-white/[0.03] py-2 min-w-0">
                    <div className="text-[10px] text-muted-foreground truncate px-0.5">Date</div>
                    <div className="font-semibold text-white truncate px-0.5">{s.date.slice(5)}</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] py-2 min-w-0">
                    <div className="text-[10px] text-muted-foreground truncate px-0.5">Ops</div>
                    <div className="font-semibold text-white truncate px-0.5">{s.operators}</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] py-2 min-w-0">
                    <div className="text-[10px] text-muted-foreground truncate px-0.5">AI</div>
                    <div className="font-semibold text-white truncate px-0.5">{s.aiAgents}</div>
                  </div>
                </div>
                {/* Touch friendly opacity adjustment for mobile actions */}
                <button
                  onClick={() => remove(s.id)}
                  className="absolute right-2 top-2 rounded-lg p-1.5 text-muted-foreground opacity-100 sm:opacity-0 transition-opacity hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                  aria-label="Delete schedule"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Heatmap Section */}
      <Card>
        <div className="mb-4">
          <h3 className="font-display text-base font-semibold text-white">Capacity Heatmap</h3>
          <p className="text-xs text-muted-foreground">
            Utilization by team & day greener means healthier balance
          </p>
        </div>
        {/* Added custom scrollbar utilities and unified element padding alignment */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-thin select-none">
          <table className="w-full min-w-[580px] border-separate border-spacing-1.5">
            <thead>
              <tr>
                <th className="w-28 text-left" />
                {days.map((d) => (
                  <th key={d} className="text-xs font-medium text-muted-foreground text-center">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.slice(0, 6).map((row, r) => (
                <tr key={row.role}>
                  <td className="pr-2 text-left text-xs font-medium text-muted-foreground truncate max-w-[120px]">
                    {row.role}
                  </td>
                  {heat[r].map((cell) => (
                    <td key={cell.c}>
                      <div
                        className="grid aspect-square min-w-[36px] min-h-[36px] place-items-center rounded-md text-[10px] font-bold"
                        style={{
                          background: `rgba(154,237,102,${cell.v / 140})`,
                          color: cell.v > 70 ? "#070E02" : "#fff",
                        }}
                      >
                        {cell.v}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Distribution Section */}
      <Card>
        <div className="mb-4">
          <h3 className="font-display text-base font-semibold text-white">Team Composition</h3>
          <p className="text-xs text-muted-foreground">
            Human / AI / Digital worker distribution per team
          </p>
        </div>
        <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pr-4">Team</th>
                <th className="py-3 px-2">Humans</th>
                <th className="py-3 px-2">AI Agents</th>
                <th className="py-3 px-2">Digital Workers</th>
                <th className="py-3 pl-2 text-right sm:text-left">Coverage</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((s) => (
                <tr key={s.role} className="border-b border-border/40 last:border-0">
                  <td className="py-3 pr-4 font-medium text-white truncate max-w-[140px]">{s.role}</td>
                  <td className="py-3 px-2 text-muted-foreground">{s.human}</td>
                  <td className="py-3 px-2 text-muted-foreground">{s.ai}</td>
                  <td className="py-3 px-2 text-muted-foreground">{s.digital}</td>
                  <td className="py-3 pl-2">
                    <div className="flex items-center justify-end sm:justify-start gap-3">
                      <div className="hidden sm:block h-1.5 w-20 md:w-24 overflow-hidden rounded-full bg-white/5">
                        <div className="h-full brand-gradient" style={{ width: `${s.coverage}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-white">{s.coverage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Schedule Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "glass-panel w-full max-w-lg rounded-t-2xl border border-border p-5 shadow-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto",
              "animate-fade-up",
            )}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-white">New Schedule</h3>
                <p className="text-xs text-muted-foreground">
                  Assign operators & AI agents to a shift.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Schedule Name
                </span>
                <input
                  autoFocus
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Peak Hours Coverage"
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Team</span>
                  <select
                    value={form.team}
                    onChange={(e) => setForm({ ...form, team: e.target.value })}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  >
                    {teams.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Shift</span>
                  <select
                    value={form.shift}
                    onChange={(e) =>
                      setForm({ ...form, shift: e.target.value as Schedule["shift"] })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  >
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Night</option>
                  </select>
                </label>
              </div>

              {/* Converted to a flexible row composition layout for input density control */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Date</span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Operators
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={form.operators}
                    onChange={(e) => setForm({ ...form, operators: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    AI Agents
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={form.aiAgents}
                    onChange={(e) => setForm({ ...form, aiAgents: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </label>
              </div>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full sm:w-auto rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="brand-gradient w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-glow hover:opacity-95"
                >
                  <Plus className="h-4 w-4" /> Create Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}