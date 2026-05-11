"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { upsertBudget } from "../../_actions/budgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TriangleAlert as AlertTriangle,
  CircleCheck as CheckCircle,
  TrendingDown,
  Loader as Loader2,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);

interface BudgetsClientProps {
  budgetData: {
    budget: { id: string; amount: string; userId: string } | null;
    totalSpent: number;
    percentage: number;
  };
  categoryBreakdown: { category: string; total: number }[];
  totalSpent: number;
}

const STONE_COLORS = [
  "#1c1917",
  "#44403c",
  "#78716c",
  "#a8a29e",
  "#d6d3d1",
  "#57534e",
];

export function BudgetsClient({
  budgetData,
  categoryBreakdown,
  totalSpent,
}: BudgetsClientProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(!budgetData.budget);
  const [amount, setAmount] = useState(budgetData.budget?.amount || "");
  const [loading, setLoading] = useState(false);

  const pct = budgetData.percentage;
  const remaining = budgetData.budget
    ? Number(budgetData.budget.amount) - totalSpent
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-[#fafafa] min-h-screen text-stone-700">
      {/* Approachable Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 uppercase">
            Budgets
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Monthly Overview
          </p>
        </div>
        {!editing && (
          <Button
            onClick={() => setEditing(true)}
            variant="outline"
            className="rounded-none border-stone-200 h-9 px-4 text-[10px] font-bold uppercase tracking-widest"
          >
            <Pencil className="h-3 w-3 mr-2" /> Edit Limit
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Compact Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-4 bg-white border border-stone-200 p-6 relative"
        >
          <span className="absolute -top-[1px] -left-[1px] h-2 w-2 border-t border-l border-stone-950" />

          {editing ? (
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full space-y-1">
                <label className="text-[9px] font-black uppercase text-stone-400">
                  Target Monthly Budget
                </label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  type="number"
                  className="rounded-none border-stone-200 h-10 font-bold"
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="rounded-none bg-stone-950 text-white h-10 px-8 text-[10px] font-bold uppercase"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Limit"
                )}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.15em] mb-1">
                    Spent to Date
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-stone-900 tabular-nums">
                      {fmt(totalSpent)}
                    </span>
                    <span className="text-stone-300 font-light">
                      / {fmt(Number(budgetData.budget?.amount))}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-2 bg-stone-100 border border-stone-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(pct, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn(
                        "h-full",
                        pct >= 100 ? "bg-rose-600" : "bg-stone-950",
                      )}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                    <span
                      className={
                        pct >= 100 ? "text-rose-600" : "text-stone-500"
                      }
                    >
                      {pct >= 100
                        ? "Limit Exceeded"
                        : `${pct.toFixed(1)}% Utilized`}
                    </span>
                    <span className="text-stone-400">
                      {fmt(Math.max(remaining, 0))} Left
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 p-4 border border-stone-100 flex items-center justify-center">
                {pct >= 100 ? (
                  <div className="text-center">
                    <AlertTriangle className="h-5 w-5 text-rose-600 mx-auto mb-1" />
                    <p className="text-[10px] font-bold uppercase text-rose-600">
                      Action Required
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <CheckCircle className="h-5 w-5 text-stone-900 mx-auto mb-1" />
                    <p className="text-[10px] font-bold uppercase text-stone-900">
                      Inside Parameters
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Smaller Stat Strips */}
        {[
          { label: "Surplus", val: fmt(Math.max(remaining, 0)) },
          { label: "Sectors", val: categoryBreakdown.length },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-stone-200 p-4 flex justify-between items-center md:col-span-2"
          >
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
              {s.label}
            </span>
            <span className="text-sm font-bold text-stone-900">{s.val}</span>
          </div>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white border border-stone-200 p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-stone-100 pb-3">
            <TrendingDown className="h-3.5 w-3.5 text-stone-950" />
            <h2 className="text-[10px] font-bold text-stone-900 uppercase tracking-widest">
              Sector Spending
            </h2>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="category"
                  type="category"
                  tick={{ fill: "#a8a29e", fontSize: 9, fontWeight: "bold" }}
                  width={80}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#fafafa" }}
                  contentStyle={{
                    borderRadius: "0",
                    border: "1px solid #e7e5e4",
                    fontSize: "10px",
                  }}
                />
                <Bar dataKey="total" barSize={12}>
                  {categoryBreakdown.map((_, i) => (
                    <Cell
                      key={i}
                      fill={STONE_COLORS[i % STONE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-stone-200 p-6 space-y-4">
          <h2 className="text-[10px] font-bold text-stone-900 uppercase tracking-widest border-b border-stone-100 pb-3">
            Breakdown
          </h2>
          <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {categoryBreakdown.map((cat, i) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-stone-500 uppercase">
                    {cat.category}
                  </span>
                  <span className="text-stone-900">{fmt(cat.total)}</span>
                </div>
                <div className="h-1 bg-stone-100">
                  <div
                    className="h-full"
                    style={{
                      width: `${totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0}%`,
                      background: STONE_COLORS[i % STONE_COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  async function handleSave() {
    if (!amount || isNaN(Number(amount))) return toast.error("Invalid amount");
    setLoading(true);
    try {
      await upsertBudget(Number(amount).toFixed(2));
      toast.success("Updated");
      setEditing(false);
      router.refresh();
    } catch {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  }
}
