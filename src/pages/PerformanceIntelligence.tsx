import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, Award, Target, Zap } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { usePageMeta } from "@/hooks/usePageMeta";

const perf = [
  { m: "Jan", human: 72, ai: 78 },
  { m: "Feb", human: 74, ai: 81 },
  { m: "Mar", human: 76, ai: 84 },
  { m: "Apr", human: 78, ai: 87 },
  { m: "May", human: 81, ai: 90 },
  { m: "Jun", human: 83, ai: 93 },
];

const radar = [
  { skill: "Accuracy", A: 92 },
  { skill: "Speed", A: 88 },
  { skill: "Quality", A: 94 },
  { skill: "Utilization", A: 87 },
  { skill: "SLA", A: 96 },
  { skill: "Cost", A: 82 },
];

const leaderboard = [
  { name: "AX-12 · Support Agent", score: 984, tasks: 4820, sla: 99.4 },
  { name: "Marcus Johnson", score: 942, tasks: 682, sla: 98.1 },
  { name: "DW-07 · Reconciler", score: 921, tasks: 3120, sla: 99.9 },
  { name: "Priya Ravi", score: 908, tasks: 594, sla: 97.6 },
  { name: "AX-04 · Enrichment", score: 894, tasks: 2840, sla: 98.4 },
];

const dept = [
  { name: "Support", value: 92 },
  { name: "Sales", value: 78 },
  { name: "Ops", value: 88 },
  { name: "Eng", value: 84 },
  { name: "Finance", value: 90 },
  { name: "Compliance", value: 81 },
];

export default function PerformanceIntelligence() {
  usePageMeta("Workforce Performance Intelligence");
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Workforce Performance Intelligence"
        subtitle="Multi-dimensional performance analytics across your entire workforce."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={TrendingUp} label="Performance Index" value="91.4" change="+4.8" trend="up" hint="composite" />
        <StatCard icon={Award} label="Top Performers" value="48" change="+6" trend="up" hint="this month" />
        <StatCard icon={Target} label="SLA Attainment" value="98.7%" change="+0.9%" trend="up" hint="30-day" />
        <StatCard icon={Zap} label="Efficiency Gain" value="+34%" change="YoY" trend="up" hint="AI leverage" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-white">
              Performance Trend
            </h3>
            <p className="text-xs text-muted-foreground">Human vs AI performance index</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={perf}>
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
                <Line
                  type="monotone"
                  dataKey="human"
                  stroke="#9AED66"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#9AED66" }}
                />
                <Line
                  type="monotone"
                  dataKey="ai"
                  stroke="#81B837"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#81B837" }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-white">Skill Matrix</h3>
            <p className="text-xs text-muted-foreground">Aggregate workforce competency</p>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid stroke="rgba(154,237,102,0.15)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "#a8b8a1", fontSize: 11 }} />
                <Radar dataKey="A" stroke="#9AED66" fill="#9AED66" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-white">Top Performers</h3>
            <p className="text-xs text-muted-foreground">Cross-workforce leaderboard</p>
          </div>
          <ul className="space-y-2">
            {leaderboard.map((p, i) => (
              <li
                key={p.name}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 bg-surface/40 p-3.5"
              >
                <div
                  className={`grid h-9 w-9 place-items-center rounded-lg font-display text-sm font-bold ${
                    i === 0
                      ? "brand-gradient"
                      : "bg-white/5 text-brand"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-medium text-white">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.tasks.toLocaleString()} tasks · {p.sla}% SLA
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-semibold text-white">{p.score}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Score
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-white">Dept. Scorecard</h3>
            <p className="text-xs text-muted-foreground">Performance by department</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dept} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(154,237,102,0.08)" horizontal={false} />
                <XAxis type="number" stroke="#a8b8a1" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#a8b8a1" fontSize={11} tickLine={false} axisLine={false} width={60} />
                <Tooltip
                  cursor={{ fill: "rgba(154,237,102,0.06)" }}
                  contentStyle={{
                    background: "#14210b",
                    border: "1px solid rgba(154,237,102,0.2)",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" fill="#9AED66" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
