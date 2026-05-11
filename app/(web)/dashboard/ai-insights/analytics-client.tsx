"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  ChartBar as BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import type { Transaction, Account } from "@/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#84cc16",
  "#ec4899",
  "#14b8a6",
];

interface AnalyticsClientProps {
  transactions: Transaction[];
  accounts: Account[];
}

export function AnalyticsClient({ transactions }: AnalyticsClientProps) {
  const monthlyData = useMemo(() => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const start = startOfMonth(subMonths(new Date(), i));
      const end = endOfMonth(subMonths(new Date(), i));
      const label = format(start, "MMM yy");

      const monthTxns = transactions.filter((t) => {
        const d = new Date(t.date);
        return d >= start && d <= end;
      });

      const income = monthTxns
        .filter((t) => t.type === "INCOME")
        .reduce((s, t) => s + Number(t.amount), 0);
      const expenses = monthTxns
        .filter((t) => t.type === "EXPENSE")
        .reduce((s, t) => s + Number(t.amount), 0);

      months.push({
        month: label,
        income,
        expenses,
        savings: income - expenses,
      });
    }
    return months;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((t) => {
        cats[t.category] = (cats[t.category] || 0) + Number(t.amount);
      });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const incomeByCategory = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "INCOME")
      .forEach((t) => {
        cats[t.category] = (cats[t.category] || 0) + Number(t.amount);
      });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + Number(t.amount), 0);
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Income",
            value: fmt(totalIncome),
            color: "text-emerald-400",
            icon: TrendingUp,
            bg: "bg-emerald-400/10",
          },
          {
            label: "Total Expenses",
            value: fmt(totalExpenses),
            color: "text-red-400",
            icon: TrendingDown,
            bg: "bg-red-400/10",
          },
          {
            label: "Net Savings",
            value: fmt(totalIncome - totalExpenses),
            color:
              totalIncome - totalExpenses >= 0
                ? "text-blue-400"
                : "text-red-400",
            icon: DollarSign,
            bg: "bg-blue-400/10",
          },
          {
            label: "Savings Rate",
            value: `${savingsRate.toFixed(1)}%`,
            color:
              savingsRate >= 20
                ? "text-emerald-400"
                : savingsRate >= 10
                  ? "text-amber-400"
                  : "text-red-400",
            icon: BarChart3,
            bg: "bg-amber-400/10",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5"
          >
            <div
              className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center mb-3",
                s.bg,
              )}
            >
              <s.icon className={cn("h-5 w-5", s.color)} />
            </div>
            <p className={cn("text-2xl font-semibold", s.color)}>{s.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 12-month trend */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-foreground">12-Month Trend</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Income, expenses and savings over time
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              Expenses
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Savings
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 16%)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(222 47% 10%)",
                border: "1px solid hsl(222 47% 16%)",
                borderRadius: 8,
              }}
              formatter={(v) => [fmt(Number(v)), ""]}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#3b82f6"
              fill="url(#ig)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              fill="url(#eg)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="#10b981"
              fill="url(#sg)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Expense pie */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-xl p-5"
        >
          <h2 className="font-semibold text-foreground mb-1">
            Expenses by Category
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            All-time breakdown
          </p>
          {categoryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              No expense data
            </div>
          ) : (
            <div className="flex gap-6 items-center">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {categoryData.slice(0, 8).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(222 47% 10%)",
                      border: "1px solid hsl(222 47% 16%)",
                      borderRadius: 8,
                    }}
                    formatter={(v) => [fmt(Number(v)), ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {categoryData.slice(0, 8).map((c, i) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-muted-foreground truncate max-w-[100px]">
                        {c.name}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      {fmt(c.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Income pie */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-5"
        >
          <h2 className="font-semibold text-foreground mb-1">
            Income by Category
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            All-time breakdown
          </p>
          {incomeByCategory.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              No income data
            </div>
          ) : (
            <div className="flex gap-6 items-center">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={incomeByCategory.slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {incomeByCategory.slice(0, 8).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(222 47% 10%)",
                      border: "1px solid hsl(222 47% 16%)",
                      borderRadius: 8,
                    }}
                    formatter={(v) => [fmt(Number(v)), ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {incomeByCategory.slice(0, 8).map((c, i) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-muted-foreground truncate max-w-[100px]">
                        {c.name}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      {fmt(c.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Monthly bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-xl p-5"
      >
        <h2 className="font-semibold text-foreground mb-1">
          Monthly Comparison
        </h2>
        <p className="text-xs text-muted-foreground mb-5">
          Income vs expenses per month
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 16%)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(222 47% 10%)",
                border: "1px solid hsl(222 47% 16%)",
                borderRadius: 8,
              }}
              formatter={(v) => [fmt(Number(v)), ""]}
            />
            <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
