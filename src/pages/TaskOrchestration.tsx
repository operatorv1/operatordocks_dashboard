import { useState } from "react";
import { Workflow, Zap, Play, Pause, MoreHorizontal, CheckCircle2, Circle, Clock } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import { usePageMeta } from "@/hooks/usePageMeta";

// Initial real data state
const initialFlows = [
  { name: "Customer Onboarding", steps: 8, status: "running", success: 98, runs: 1240 },
  { name: "Invoice Reconciliation", steps: 12, status: "running", success: 99, runs: 3820 },
  { name: "Lead Qualification", steps: 6, status: "paused", success: 94, runs: 512 },
  { name: "Contract Review", steps: 10, status: "running", success: 96, runs: 284 },
  { name: "Ticket Triage", steps: 5, status: "running", success: 92, runs: 6420 },
];

const queue = [
  { id: "TSK-8231", name: "Enrich prospect data", agent: "AX-04", priority: "High", eta: "2m", state: "processing" },
  { id: "TSK-8230", name: "Summarize support ticket #4820", agent: "AX-12", priority: "Medium", eta: "4m", state: "queued" },
  { id: "TSK-8229", name: "Generate weekly Ops report", agent: "DW-07", priority: "Low", eta: "12m", state: "queued" },
  { id: "TSK-8228", name: "Reconcile invoice batch A-291", agent: "DW-02", priority: "High", eta: "1m", state: "processing" },
  { id: "TSK-8227", name: "Escalate SLA-breach case", agent: "AX-09", priority: "Critical", eta: "Now", state: "processing" },
];

const priColor: Record<string, string> = {
  Critical: "bg-red-500/15 text-red-400 border-red-500/30",
  High: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Low: "bg-brand/10 text-brand border-brand/30",
};

export default function TaskOrchestration() {
  usePageMeta("AI Task Orchestration Engine");
  
  // Managing the flows state dynamically
  const [flows, setFlows] = useState(initialFlows);

  // Handler to toggle the status between running and paused
  const toggleFlowStatus = (flowName: string) => {
    setFlows((prevFlows) =>
      prevFlows.map((flow) =>
        flow.name === flowName
          ? { ...flow, status: flow.status === "running" ? "paused" : "running" }
          : flow
      )
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Orchestration"
        title="AI Task Orchestration Engine"
        subtitle="Intelligent task allocation, routing, and multi-agent workflow execution."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Workflow} label="Active Workflows" value="42" change="+5" trend="up" hint="deployed" />
        <StatCard icon={Zap} label="Tasks / min" value="184" change="+12%" trend="up" hint="throughput" />
        <StatCard icon={CheckCircle2} label="Success Rate" value="97.4%" change="+0.6%" trend="up" hint="last 24h" />
        <StatCard icon={Clock} label="Avg. Latency" value="1.2s" change="-8%" trend="up" hint="p95" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold text-white">Active Workflows</h3>
              <p className="text-xs text-muted-foreground">Live orchestration pipelines</p>
            </div>
          </div>
          <ul className="space-y-2.5">
            {flows.map((f) => (
              <li
                key={f.name}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/40 p-3.5 transition hover:border-brand/30"
              >
                <div className="brand-gradient grid h-10 w-10 shrink-0 place-items-center rounded-lg">
                  <Workflow className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium text-white">{f.name}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors duration-200 ${
                        f.status === "running"
                          ? "bg-brand/15 text-brand"
                          : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${f.status === "running" ? "bg-brand animate-pulse-glow" : "bg-muted-foreground"}`} />
                      {f.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {f.steps} steps · {f.runs.toLocaleString()} runs · {f.success}% success
                  </div>
                </div>
                {/* Implemented onClick functionality here */}
                <button 
                  onClick={() => toggleFlowStatus(f.name)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-white transition-colors"
                  aria-label={f.status === "running" ? "Pause workflow" : "Start workflow"}
                >
                  {f.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="xl:col-span-2">
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-white">Live Task Queue</h3>
            <p className="text-xs text-muted-foreground">Real-time allocation stream</p>
          </div>
          <ul className="space-y-2">
            {queue.map((t) => (
              <li
                key={t.id}
                className="rounded-xl border border-border/60 bg-surface/40 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="font-mono">{t.id}</span>
                      <span
                        className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${priColor[t.priority]}`}
                      >
                        {t.priority}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-sm text-white">{t.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      → {t.agent} · ETA {t.eta}
                    </div>
                  </div>
                  {t.state === "processing" ? (
                    <span className="mt-1 inline-flex h-6 items-center gap-1 rounded-full bg-brand/15 px-2 text-[10px] font-semibold text-brand">
                      <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-brand" />
                      Live
                    </span>
                  ) : (
                    <Circle className="mt-2 h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}