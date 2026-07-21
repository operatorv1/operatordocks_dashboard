import {
  Users,
  Bot,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Cpu,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Card from "@/components/Card";
import { usePageMeta } from "@/hooks/usePageMeta";

const productivity = [
  { day: "Mon", human: 62, ai: 78, digital: 88 },
  { day: "Tue", human: 68, ai: 82, digital: 90 },
  { day: "Wed", human: 71, ai: 85, digital: 92 },
  { day: "Thu", human: 65, ai: 88, digital: 91 },
  { day: "Fri", human: 74, ai: 92, digital: 94 },
  { day: "Sat", human: 58, ai: 79, digital: 89 },
  { day: "Sun", human: 55, ai: 74, digital: 87 },
];

const distribution = [
  { name: "Human Teams", value: 420, color: "#9AED66" },
  { name: "AI Agents", value: 128, color: "#81B837" },
  { name: "Digital Workers", value: 94, color: "#2E4A15" },
];

const throughput = [
  { hr: "00", tasks: 240 },
  { hr: "03", tasks: 180 },
  { hr: "06", tasks: 320 },
  { hr: "09", tasks: 780 },
  { hr: "12", tasks: 920 },
  { hr: "15", tasks: 1040 },
  { hr: "18", tasks: 860 },
  { hr: "21", tasks: 460 },
];

const activity = [
  { icon: CheckCircle2, color: "text-brand", title: "Agent AX-12 completed 340 tasks", meta: "Support · 2m ago" },
  { icon: Zap, color: "text-yellow-400", title: "Auto-rebalance triggered on Ops queue", meta: "System · 12m ago" },
  { icon: Bot, color: "text-brand", title: "Digital worker DW-07 provisioned", meta: "Provisioning · 34m ago" },
  { icon: AlertTriangle, color: "text-orange-400", title: "SLA threshold nearing on Escalations", meta: "Alerts · 1h ago" },
  { icon: Users, color: "text-brand/70", title: "3 new operators onboarded", meta: "HR · 2h ago" },
];

export default function Dashboard() {
  usePageMeta("Dashboard Overview");
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Workforce Command Center"
        subtitle="Real-time visibility across human, AI, and digital workforce operations."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Active Workforce"
          value="642"
          change="+12.4%"
          trend="up"
          hint="vs last week"
        />
        <StatCard
          icon={Bot}
          label="AI Agents Online"
          value="128"
          change="+8"
          trend="up"
          hint="deployed today"
        />
        <StatCard
          icon={Activity}
          label="Tasks Completed"
          value="24,632"
          change="+18.9%"
          trend="up"
          hint="last 24 hours"
        />
        <StatCard
          icon={Cpu}
          label="Utilization"
          value="87.3%"
          change="-2.1%"
          trend="down"
          hint="capacity balanced"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-base font-semibold text-white">
                Productivity Index
              </h3>
              <p className="text-xs text-muted-foreground">
                Weekly performance across workforce types
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <Legend color="#9AED66" label="Human" />
              <Legend color="#81B837" label="AI" />
              <Legend color="#2E4A15" label="Digital" />
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivity}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#9AED66" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#9AED66" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#81B837" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#81B837" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g3" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2E4A15" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#2E4A15" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(154,237,102,0.08)" />
                <XAxis dataKey="day" stroke="#a8b8a1" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a8b8a1" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="digital" stroke="#2E4A15" fill="url(#g3)" strokeWidth={2} />
                <Area type="monotone" dataKey="ai" stroke="#81B837" fill="url(#g2)" strokeWidth={2} />
                <Area type="monotone" dataKey="human" stroke="#9AED66" fill="url(#g1)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-white">Workforce Mix</h3>
            <p className="text-xs text-muted-foreground">Distribution across worker types</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {distribution.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {distribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-semibold text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-white">Task Throughput</h3>
            <p className="text-xs text-muted-foreground">Tasks processed by hour (today)</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={throughput}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(154,237,102,0.08)" />
                <XAxis dataKey="hr" stroke="#a8b8a1" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a8b8a1" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(154,237,102,0.06)" }} />
                <Bar dataKey="tasks" radius={[6, 6, 0, 0]}>
                  {throughput.map((_, i) => (
                    <Cell key={i} fill={i === 5 ? "#9AED66" : "#81B837"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold text-white">Live Activity</h3>
              <p className="text-xs text-muted-foreground">Streaming operations feed</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-brand">
              <span className="h-2 w-2 animate-pulse-glow rounded-full bg-brand" /> Live
            </span>
          </div>
          <ul className="space-y-3">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5">
                  <a.icon className={`h-4 w-4 ${a.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-white">{a.title}</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {a.meta}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-brand/20 bg-surface-elevated/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      {label && <div className="mb-1 font-semibold text-white">{label}</div>}
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color ?? p.fill }} />
          <span className="capitalize text-muted-foreground">{p.name || p.dataKey}:</span>
          <span className="font-semibold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// Extra icons used in change indicators (kept so tree-shaker retains them if referenced elsewhere)
export { ArrowUpRight, ArrowDownRight };
