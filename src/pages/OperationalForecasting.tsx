import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
  Legend,
} from "recharts";
import { TrendingUp, Brain, AlertCircle, Gauge } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { usePageMeta } from "@/hooks/usePageMeta";

const forecast = [
  { w: "W-4", actual: 4200, predicted: 4180, upper: 4300, lower: 4050 },
  { w: "W-3", actual: 4520, predicted: 4480, upper: 4600, lower: 4350 },
  { w: "W-2", actual: 4780, predicted: 4720, upper: 4850, lower: 4600 },
  { w: "W-1", actual: 5040, predicted: 5010, upper: 5150, lower: 4900 },
  { w: "Now", actual: 5320, predicted: 5280, upper: 5400, lower: 5150 },
  { w: "W+1", actual: null, predicted: 5580, upper: 5750, lower: 5420 },
  { w: "W+2", actual: null, predicted: 5820, upper: 6050, lower: 5620 },
  { w: "W+3", actual: null, predicted: 6120, upper: 6400, lower: 5860 },
  { w: "W+4", actual: null, predicted: 6420, upper: 6780, lower: 6100 },
];

const scenarios = [
  { name: "Baseline", demand: "+12%", capacity: "+8%", risk: "Low", color: "text-brand" },
  { name: "Aggressive Growth", demand: "+28%", capacity: "+15%", risk: "Medium", color: "text-yellow-400" },
  { name: "AI Acceleration", demand: "+18%", capacity: "+42%", risk: "Low", color: "text-brand" },
  { name: "Cost Optimization", demand: "+8%", capacity: "-4%", risk: "Medium", color: "text-yellow-400" },
];

const signals = [
  { title: "Support demand spike expected Q3", severity: "high", detail: "Model confidence: 89%" },
  { title: "AI capacity headroom: 34%", severity: "info", detail: "Auto-scaling ready" },
  { title: "Compliance workload rising 4wk trend", severity: "medium", detail: "Consider +3 agents" },
  { title: "Off-peak digital worker underutilized", severity: "info", detail: "22% idle window" },
];

const sevStyle: Record<string, string> = {
  high: "border-red-500/40 bg-red-500/5 text-red-400",
  medium: "border-yellow-500/40 bg-yellow-500/5 text-yellow-400",
  info: "border-brand/30 bg-brand/5 text-brand",
};

export default function OperationalForecasting() {
  usePageMeta("Operational Forecasting System");
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Forecasting"
        title="Operational Forecasting System"
        subtitle="Predictive analytics for workforce demand, capacity, and resource planning."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={TrendingUp} label="Demand Forecast" value="+18.4%" change="4 weeks" trend="up" hint="predicted" />
        <StatCard icon={Brain} label="Model Accuracy" value="94.2%" change="+1.1%" trend="up" hint="MAPE" />
        <StatCard icon={Gauge} label="Capacity Headroom" value="34%" change="Safe" trend="up" hint="autoscale ready" />
        <StatCard icon={AlertCircle} label="Signals Detected" value="12" change="+3" trend="up" hint="last 24h" />
      </div>

      <Card>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-semibold text-white">
              Demand vs Capacity Forecast
            </h3>
            <p className="text-xs text-muted-foreground">
              4-week actuals + 4-week AI predictions (95% confidence band)
            </p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecast}>
              <defs>
                <linearGradient id="band" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#9AED66" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#9AED66" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(154,237,102,0.08)" />
              <XAxis dataKey="w" stroke="#a8b8a1" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a8b8a1" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#14210b",
                  border: "1px solid rgba(154,237,102,0.2)",
                  borderRadius: 12,
                  color: "#fff",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#a8b8a1" }} />
              <Area type="monotone" dataKey="upper" stroke="none" fill="url(#band)" name="Upper CI" />
              <Area type="monotone" dataKey="lower" stroke="none" fill="#070E02" name="Lower CI" />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#9AED66"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#9AED66" }}
                name="Actual"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#81B837"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                dot={{ r: 4, fill: "#81B837" }}
                name="Predicted"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-white">
              Scenario Planning
            </h3>
            <p className="text-xs text-muted-foreground">Simulated operational scenarios</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-3">Scenario</th>
                  <th className="py-3">Demand</th>
                  <th className="py-3">Capacity</th>
                  <th className="py-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s) => (
                  <tr key={s.name} className="border-b border-border/40 last:border-0">
                    <td className="py-3 font-medium text-white">{s.name}</td>
                    <td className="py-3 text-brand">{s.demand}</td>
                    <td className="py-3 text-muted-foreground">{s.capacity}</td>
                    <td className={`py-3 font-semibold ${s.color}`}>{s.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-white">
              Predictive Signals
            </h3>
            <p className="text-xs text-muted-foreground">Anomalies & recommendations</p>
          </div>
          <ul className="space-y-2.5">
            {signals.map((s, i) => (
              <li
                key={i}
                className={`rounded-xl border p-3.5 ${sevStyle[s.severity]}`}
              >
                <div className="text-sm font-medium text-white">{s.title}</div>
                <div className="mt-1 text-xs">{s.detail}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
