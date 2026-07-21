import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DollarSign,
  Users,
  Bot,
  TrendingUp,
  Globe,
  Shield,
  Rocket,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { usePageMeta } from "@/hooks/usePageMeta";

const roi = [
  { m: "Jan", value: 240 },
  { m: "Feb", value: 285 },
  { m: "Mar", value: 340 },
  { m: "Apr", value: 410 },
  { m: "May", value: 495 },
  { m: "Jun", value: 610 },
];

const kpis = [
  { label: "Revenue per Operator", value: "$48.2K", delta: "+22%" },
  { label: "AI Cost per Task", value: "$0.084", delta: "-31%" },
  { label: "Time-to-Resolution", value: "3.4m", delta: "-42%" },
  { label: "CSAT", value: "4.86 / 5", delta: "+0.18" },
];

const regions = [
  { name: "North America", tasks: 84200, ops: 312, health: 96 },
  { name: "EMEA", tasks: 62400, ops: 218, health: 94 },
  { name: "APAC", tasks: 41800, ops: 164, health: 91 },
  { name: "LATAM", tasks: 22600, ops: 88, health: 89 },
];

export default function ExecutiveDashboard() {
  usePageMeta("Executive Operations Dashboard");
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Executive"
        title="Executive Operations Dashboard"
        subtitle="Strategic view of workforce economics, ROI, and operational health."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={DollarSign} label="Operational ROI" value="4.6x" change="+38%" trend="up" hint="YoY" />
        <StatCard icon={TrendingUp} label="Cost Savings" value="$2.84M" change="+$620K" trend="up" hint="quarter" />
        <StatCard icon={Bot} label="AI Leverage" value="72%" change="+9%" trend="up" hint="task share" />
        <StatCard icon={Users} label="Workforce Health" value="94%" change="+2%" trend="up" hint="composite" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-white">
              ROI Growth Trajectory
            </h3>
            <p className="text-xs text-muted-foreground">
              Compounding return on AI-augmented operations
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roi}>
                <defs>
                  <linearGradient id="roiG" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#9AED66" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#9AED66" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(154,237,102,0.08)" />
                <XAxis dataKey="m" stroke="#a8b8a1" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a8b8a1" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#14210b",
                    border: "1px solid rgba(154,237,102,0.2)",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#9AED66"
                  strokeWidth={3}
                  fill="url(#roiG)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-white">Key Metrics</h3>
            <p className="text-xs text-muted-foreground">Board-level KPIs</p>
          </div>
          <ul className="space-y-3">
            {kpis.map((k) => (
              <li
                key={k.label}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/40 p-3.5"
              >
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{k.label}</div>
                  <div className="mt-0.5 font-display text-xl font-semibold text-white">
                    {k.value}
                  </div>
                </div>
                <span className="rounded-full bg-brand/15 px-2.5 py-1 text-xs font-semibold text-brand">
                  {k.delta}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-brand" />
            <h3 className="font-display text-base font-semibold text-white">
              Regional Operations
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3">Region</th>
                  <th className="py-3">Tasks / mo</th>
                  <th className="py-3">Operators</th>
                  <th className="py-3">Health</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((r) => (
                  <tr key={r.name} className="border-b border-border/40 last:border-0">
                    <td className="py-3 font-medium text-white">{r.name}</td>
                    <td className="py-3 text-muted-foreground">
                      {r.tasks.toLocaleString()}
                    </td>
                    <td className="py-3 text-muted-foreground">{r.ops}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/5">
                          <div className="h-full brand-gradient" style={{ width: `${r.health}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-white">{r.health}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-white">
              Strategic Signals
            </h3>
            <p className="text-xs text-muted-foreground">Board-ready insights</p>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 rounded-xl border border-brand/20 bg-brand/5 p-3.5">
              <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <div>
                <div className="text-sm font-medium text-white">
                  AI leverage +9% this quarter
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  On track to exceed 80% by year-end.
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface/40 p-3.5">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <div>
                <div className="text-sm font-medium text-white">
                  Compliance score at all-time high
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  0 material incidents in last 90 days.
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface/40 p-3.5">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <div>
                <div className="text-sm font-medium text-white">
                  APAC region ready for scale-up
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Recommend +45 AI agents, +12 operators.
                </div>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
