"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ZAxis,
  Cell,
} from "recharts";
import {
  BrainCircuit,
  ArrowUpRight,
  Fingerprint,
  Zap,
  Target,
  Maximize2,
  ChevronRight,
} from "lucide-react";
import {
  format,
  subMonths,
  startOfMonth,
  isSameMonth,
  addMonths,
} from "date-fns";
import { cn } from "@/lib/utils";
import type { Transaction, Account } from "@/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);

interface AnalyticsClientProps {
  transactions: Transaction[];
  accounts: Account[];
}

export function AnalyticsClient({
  transactions,
  accounts,
}: AnalyticsClientProps) {
  // Logic remains the same, focusing on the "Insight" Layer
  const totalLiquidAssets = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance),
    0,
  );
  const avgMonthlyExpenses = useMemo(() => {
    const last3Months = [0, 1, 2].map((i) =>
      startOfMonth(subMonths(new Date(), i)),
    );
    const total = transactions
      .filter(
        (t) =>
          t.type === "EXPENSE" &&
          last3Months.some((m) => isSameMonth(new Date(t.date), m)),
      )
      .reduce((s, t) => s + Number(t.amount), 0);
    return total / 3 || 1;
  }, [transactions]);

  const runwayMonths = (totalLiquidAssets / avgMonthlyExpenses).toFixed(1);

  const forecastData = useMemo(() => {
    const historical = Array.from({ length: 6 }).map((_, i) => {
      const date = startOfMonth(subMonths(new Date(), 5 - i));
      const income = transactions
        .filter(
          (t) => t.type === "INCOME" && isSameMonth(new Date(t.date), date),
        )
        .reduce((s, t) => s + Number(t.amount), 0);
      const expenses = transactions
        .filter(
          (t) => t.type === "EXPENSE" && isSameMonth(new Date(t.date), date),
        )
        .reduce((s, t) => s + Number(t.amount), 0);
      return {
        name: format(date, "MMM"),
        actual: income - expenses,
        type: "historical",
      };
    });
    const avgNet = historical.reduce((s, h) => s + (h.actual || 0), 0) / 6;
    const projection = Array.from({ length: 4 }).map((_, i) => ({
      name: format(addMonths(new Date(), i + 1), "MMM"),
      forecast: avgNet,
      type: "projection",
    }));
    return [...historical, ...projection];
  }, [transactions]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-8 font-sans selection:bg-stone-200">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* GEOMETRIC HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-stone-200 pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stone-400">
              <Fingerprint className="h-4 w-4" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                Systems / Analytics / 2026
              </span>
            </div>
            <h1 className="text-5xl font-light tracking-tighter text-stone-950">
              Financial <span className="font-medium">Intelligence</span>
            </h1>
          </div>

          <div className="flex divide-x divide-stone-200 border border-stone-200 bg-white">
            <div className="px-6 py-3">
              <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">
                Runway
              </p>
              <p className="text-2xl font-medium tracking-tight">
                {runwayMonths}mo
              </p>
            </div>
            <div className="px-6 py-3 bg-stone-950 text-stone-50">
              <p className="text-[10px] uppercase font-bold text-stone-500 mb-1">
                Status
              </p>
              <p className="text-2xl font-medium tracking-tight">Optimal</p>
            </div>
          </div>
        </header>

        {/* PRIMARY ANALYTIC: THE FORECAST */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-0 border border-stone-200 bg-white overflow-hidden rounded-sm">
          <div className="lg:col-span-3 p-8 border-r border-stone-200">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Maximize2 className="h-4 w-4 text-stone-400" />
                Projected Net Position
              </h2>
              <div className="flex gap-4 text-[10px] font-bold uppercase">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-stone-900" /> Actual
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 border border-stone-400" />{" "}
                  Forecast
                </span>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecastData}>
                  <CartesianGrid
                    strokeDasharray="0"
                    vertical={false}
                    stroke="#e7e5e4"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#a8a29e", fontSize: 10, fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#a8a29e", fontSize: 10 }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    cursor={{ fill: "#f5f5f4" }}
                    content={<CustomTooltip />}
                  />
                  <Bar dataKey="actual" fill="#1c1917" barSize={30} />
                  <Line
                    type="stepAfter"
                    dataKey="forecast"
                    stroke="#a8a29e"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={{ r: 3, fill: "#fff", stroke: "#a8a29e" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-8 bg-stone-50 space-y-8">
            <div>
              <p className="text-[10px] font-bold uppercase text-stone-400 mb-4">
                Core Insights
              </p>
              <div className="space-y-6">
                <InsightRow label="Efficiency" value="84%" icon={Zap} />
                <InsightRow label="Target" value="+12%" icon={Target} />
                <InsightRow
                  label="Volatility"
                  value="Low"
                  icon={BrainCircuit}
                />
              </div>
            </div>
            <div className="pt-8 border-t border-stone-200">
              <p className="text-xs text-stone-500 leading-relaxed italic">
                "Based on the last 180 days, your capital retention is 4% above
                your peer baseline."
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM GRIDS: BEHAVIORAL ANALYTICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Velocity Scatter */}
          <div className="md:col-span-2 border border-stone-200 bg-white p-8 rounded-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-8">
              Spending Velocity
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <XAxis
                    type="category"
                    dataKey="name"
                    name="Month"
                    stroke="#d6d3d1"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis type="number" dataKey="actual" hide />
                  <ZAxis type="number" dataKey="actual" range={[50, 400]} />
                  <Scatter
                    data={forecastData.filter((d) => d.type === "historical")}
                    fill="#1c1917"
                  >
                    {forecastData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={"actual" in entry && entry.actual > 0 ? "#1c1917" : "#a8a29e"}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Call to Action Analytics */}
          <div className="bg-stone-900 text-stone-50 p-8 rounded-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-8 w-8 rounded-full bg-stone-800 flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-stone-400" />
              </div>
              <h3 className="text-xl font-medium leading-tight">
                Optimize your retention.
              </h3>
              <p className="text-stone-400 text-sm">
                You spent $420 more on "Automations" than last month. Consider
                auditing seats.
              </p>
            </div>
            <button className="flex items-center justify-between w-full pt-4 border-t border-stone-800 text-xs font-bold uppercase tracking-widest hover:text-stone-300 transition-colors">
              Full Audit <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MINIMAL SUB-COMPONENTS ────────────────────────────────────────────────

function InsightRow({ label, value, icon: Icon }: any) {
  return (
    <div className="flex justify-between items-center group cursor-default">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-stone-300 group-hover:text-stone-900 transition-colors" />
        <span className="text-xs font-medium text-stone-500">{label}</span>
      </div>
      <span className="text-xs font-bold">{value}</span>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-stone-200 p-4 shadow-xl rounded-sm">
        <p className="text-[10px] font-black uppercase text-stone-400 mb-2">
          {data.name}
        </p>
        <p className="text-lg font-light tracking-tight text-stone-950">
          {data.actual !== undefined ? fmt(data.actual) : fmt(data.forecast)}
        </p>
        <p className="text-[10px] text-stone-400 uppercase mt-1">
          {data.type === "historical" ? "Net Cash Flow" : "Projected Growth"}
        </p>
      </div>
    );
  }
  return null;
}
