"use client";

import { motion } from "framer-motion";
import { StatCard } from "../_components/stat-card";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";
import type { Account, Transaction, Goal } from "@/types";

interface DashboardClientProps {
  stats: {
    totalBalance: number;
    monthIncome: number;
    monthExpenses: number;
    savings: number;
    lastMonthExpenses: number;
    expenseChange: number;
    recentTransactions: Transaction[];
  };
  chartData: { month: string; income: number; expenses: number }[];
  accounts: Account[];
  budgetData: {
    budget: { amount: string } | null;
    totalSpent: number;
    percentage: number;
  };
  goals: Goal[];
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);

const ACCENT_COLORS = ["#2563eb", "#059669", "#d97706", "#4f46e5", "#e11d48"];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3, ease: [0.23, 1, 0.32, 1] } as const,
});

function Card({
  children,
  className,
  delay = 0,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        "relative bg-white border border-stone-200 p-6 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <span className="absolute top-0 left-0 h-3 w-[1px] bg-stone-300" />
      <span className="absolute top-0 left-0 h-[1px] w-3 bg-stone-300" />
      <span className="absolute bottom-0 right-0 h-3 w-[1px] bg-stone-300" />
      <span className="absolute bottom-0 right-0 h-[1px] w-3 bg-stone-300" />
      {children}
    </motion.div>
  );
}

function SectionHead({
  title,
  subtitle,
  href,
  linkLabel,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1 shrink-0 mt-1">
          <div className="h-[2px] w-5 bg-stone-900" />
          <div className="h-[2px] w-3 bg-stone-400" />
        </div>
        <div>
          <h2 className="text-[13px] font-black text-stone-950 uppercase tracking-[0.15em]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[10px] text-stone-500 mt-0.5 font-medium uppercase tracking-wider">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="group flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-blue-600 transition-all border border-stone-200 px-4 py-1.5 bg-stone-50 hover:bg-white"
        >
          {linkLabel}
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

function GeoProgress({
  value,
  warning,
}: {
  value: number;
  warning?: "critical" | "caution" | null;
}) {
  const barColor =
    warning === "critical"
      ? "bg-rose-500"
      : warning === "caution"
        ? "bg-amber-500"
        : "bg-blue-600";

  return (
    <div className="relative h-[6px] w-full bg-stone-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className={cn("absolute top-0 left-0 h-full relative", barColor)}
      >
        {warning === "critical" && (
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 bg-white/20"
          />
        )}
      </motion.div>
    </div>
  );
}

export function DashboardClient({
  stats,
  chartData,
  accounts,
  budgetData,
  goals,
}: DashboardClientProps) {
  const categoryBreakdown = stats.recentTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

  const pieData = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name,
    value,
  }));

  const budgetWarning =
    budgetData.percentage >= 90
      ? "critical"
      : budgetData.percentage >= 75
        ? "caution"
        : null;

  return (
    <div className="p-8 space-y-6 bg-[#fafafa] min-h-screen text-stone-900">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { title: "Total Balance", value: stats.totalBalance, icon: Wallet },
          {
            title: "Monthly Income",
            value: stats.monthIncome,
            icon: TrendingUp,
          },
          {
            title: "Monthly Expenses",
            value: stats.monthExpenses,
            icon: TrendingDown,
            change: stats.expenseChange,
          },
          { title: "Net Savings", value: stats.savings, icon: PiggyBank },
        ].map((s, i) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={formatCurrency(s.value)}
            icon={s.icon}
            change={"change" in s ? s.change : undefined}
            delay={i * 0.05}
          />
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card delay={0.2} className="xl:col-span-2" hover={false}>
          <SectionHead title="Cash Flow" subtitle="Last 6 Months Analytics" />
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#78716c", fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fill: "#78716c", fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                cursor={{ stroke: "#e7e5e4", strokeWidth: 2 }}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e7e5e4",
                  borderRadius: "0px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#2563eb"
                fill="url(#incGrad)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#e11d48"
                fill="url(#expGrad)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card delay={0.25}>
          <SectionHead title="Expenses" subtitle="Category Distribution" />
          {pieData.length > 0 ? (
            <div className="flex flex-col h-[280px]">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={ACCENT_COLORS[i % ACCENT_COLORS.length]}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-auto space-y-2.5">
                {pieData.slice(0, 4).map((item, i) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-2 w-2"
                        style={{
                          background: ACCENT_COLORS[i % ACCENT_COLORS.length],
                        }}
                      />
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide truncate max-w-[110px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-black text-stone-950">
                      ${item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-stone-400 text-[11px] uppercase tracking-widest font-bold">
              Data Pending
            </div>
          )}
        </Card>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card delay={0.3} className="xl:col-span-2" hover={false}>
          <SectionHead
            title="History"
            subtitle="Latest Activity"
            href="/dashboard/transactions"
            linkLabel="Ledger"
          />
          <div className="space-y-1">
            {stats.recentTransactions.map((txn, i) => (
              <motion.div
                key={txn.id}
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 py-3 border-b border-stone-100 last:border-0 group cursor-default"
              >
                <div
                  className={cn(
                    "h-10 w-10 flex items-center justify-center border transition-colors",
                    txn.type === "INCOME"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                      : "bg-rose-50 border-rose-100 text-rose-600",
                  )}
                >
                  {txn.type === "INCOME" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-stone-900 group-hover:text-blue-600 transition-colors">
                    {txn.description || txn.category}
                  </p>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                    {txn.category} •{" "}
                    {format(new Date(txn.date), "MMM dd, yyyy")}
                  </p>
                </div>
                <span
                  className={cn(
                    "font-black text-sm tabular-nums",
                    txn.type === "INCOME"
                      ? "text-emerald-600"
                      : "text-rose-600",
                  )}
                >
                  {txn.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(Number(txn.amount))}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card delay={0.35}>
            <SectionHead
              title="Budget"
              subtitle="Control Center"
              href="/dashboard/budgets"
              linkLabel="Adjust"
            />
            {budgetData.budget ? (
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                      Utilization
                    </p>
                    <p className="text-2xl font-black text-stone-950">
                      {budgetData.percentage.toFixed(0)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-stone-900">
                      {formatCurrency(budgetData.totalSpent)}
                      <span className="text-stone-400 font-medium italic ml-1">
                        / {formatCurrency(Number(budgetData.budget.amount))}
                      </span>
                    </p>
                  </div>
                </div>
                <GeoProgress
                  value={budgetData.percentage}
                  warning={budgetWarning}
                />
              </div>
            ) : (
              <Link
                href="/dashboard/budgets"
                className="block p-4 border-2 border-dashed border-stone-200 text-center text-[11px] font-bold uppercase tracking-widest text-stone-400 hover:border-blue-400 hover:text-blue-500 transition-all"
              >
                Initialize Budget Plan
              </Link>
            )}
          </Card>

          <Card delay={0.4}>
            <SectionHead
              title="Objectives"
              subtitle="Milestones"
              href="/dashboard/goals"
              linkLabel="All"
            />
            <div className="space-y-5">
              {goals.slice(0, 3).map((goal) => {
                const pct = Math.min(
                  (Number(goal.currentAmount) / Number(goal.targetAmount)) *
                    100,
                  100,
                );
                return (
                  <div key={goal.id} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold text-stone-900 uppercase tracking-wider">
                        {goal.title}
                      </span>
                      <span className="text-[11px] font-black text-blue-600">
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <GeoProgress value={pct} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Accounts ── */}
      <Card delay={0.45} hover={false}>
        <SectionHead
          title="Treasury"
          subtitle="Account Portfolio"
          href="/dashboard/accounts"
          linkLabel="Vault"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {accounts.map((acct) => (
            <motion.div
              key={acct.id}
              whileHover={{ scale: 1.02 }}
              className="p-5 border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-blue-500 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-4 w-4 text-stone-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">
                  {acct.type}
                </span>
                {acct.isDefault && (
                  <span className="ml-auto text-[8px] font-black bg-blue-600 text-white px-2 py-0.5 uppercase tracking-tighter">
                    Primary
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-stone-600 uppercase tracking-tight">
                {acct.name}
              </p>
              <p className="text-2xl font-black text-stone-950 mt-1 tabular-nums">
                {formatCurrency(Number(acct.balance))}
              </p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
