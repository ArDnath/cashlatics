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

/* Professional color palette for light mode */
const ACCENT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#f43f5e"];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.22, ease: "easeOut" } as const, // Added as const to fix TS error
});

/* ─── Light Card shell with proper borders ────────────────── */
function Card({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className={cn(
        "relative bg-white border border-gray-200 p-5 shadow-sm",
        className,
      )}
    >
      {/* Structural Corner Marks (Subtle Gray) */}
      <span className="absolute top-0 left-0 h-2 w-px bg-gray-300" />
      <span className="absolute top-0 left-0 h-px w-2 bg-gray-300" />
      <span className="absolute bottom-0 right-0 h-2 w-px bg-gray-300" />
      <span className="absolute bottom-0 right-0 h-px w-2 bg-gray-300" />
      {children}
    </motion.div>
  );
}

/* ─── Section heading ─────────────────────────────────────── */
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
    <div className="flex items-start justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-[3px] shrink-0 mt-0.5">
          <div className="h-px w-4 bg-gray-400" />
          <div className="h-px w-2.5 bg-gray-300" />
        </div>
        <div>
          <h2 className="text-[12px] font-bold text-gray-900 uppercase tracking-wider">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-tight">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="text-[10px] font-medium uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors border border-gray-200 px-3 py-1 bg-gray-50"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

/* ─── Light Progress Bar ────────────────────────── */
function GeoProgress({
  value,
  warning,
}: {
  value: number;
  warning?: "critical" | "caution" | null;
}) {
  const barColor =
    warning === "critical"
      ? "bg-red-500"
      : warning === "caution"
        ? "bg-amber-500"
        : "bg-blue-600";

  return (
    <div className="relative h-[4px] w-full bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn("absolute top-0 left-0 h-full", barColor)}
      />
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────── */
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
    <div className="p-6 space-y-5 bg-gray-50 min-h-screen text-gray-900">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(stats.totalBalance)}
          icon={Wallet}
          delay={0}
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(stats.monthIncome)}
          icon={TrendingUp}
          delay={0.05}
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(stats.monthExpenses)}
          icon={TrendingDown}
          change={stats.expenseChange}
          delay={0.1}
        />
        <StatCard
          title="Net Savings"
          value={formatCurrency(stats.savings)}
          icon={PiggyBank}
          delay={0.15}
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card delay={0.2} className="xl:col-span-2">
          <SectionHead
            title="Income vs Expenses"
            subtitle="Cash Flow Analytics"
          />
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "4px",
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#3b82f6"
                fill="url(#incGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#f43f5e"
                fill="url(#expGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card delay={0.25}>
          <SectionHead title="Spending" subtitle="By Category" />
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={ACCENT_COLORS[i % ACCENT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {pieData.slice(0, 4).map((item, i) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: ACCENT_COLORS[i % ACCENT_COLORS.length],
                        }}
                      />
                      <span className="text-gray-500 truncate max-w-[120px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${item.value.toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
              No Data
            </div>
          )}
        </Card>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Transactions list with clear borders between items */}
        <Card delay={0.3} className="xl:col-span-2">
          <SectionHead
            title="Recent Transactions"
            href="/dashboard/transactions"
            linkLabel="View All"
          />
          <div className="divide-y divide-gray-100 border-t border-gray-100">
            {stats.recentTransactions.map((txn, i) => (
              <div
                key={txn.id}
                className="flex items-center gap-4 py-3 hover:bg-gray-50 transition-colors px-1"
              >
                <div
                  className={cn(
                    "h-10 w-10 flex items-center justify-center rounded-full border",
                    txn.type === "INCOME"
                      ? "bg-green-50 border-green-100"
                      : "bg-red-50 border-red-100",
                  )}
                >
                  {txn.type === "INCOME" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {txn.description || txn.category}
                  </p>
                  <p className="text-xs text-gray-500">
                    {txn.category} • {format(new Date(txn.date), "MMM d")}
                  </p>
                </div>
                <span
                  className={cn(
                    "font-bold text-sm",
                    txn.type === "INCOME" ? "text-green-600" : "text-red-600",
                  )}
                >
                  {txn.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(Number(txn.amount))}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card delay={0.35}>
            <SectionHead
              title="Monthly Budget"
              href="/dashboard/budgets"
              linkLabel="Edit"
            />
            {budgetData.budget ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Spent</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(budgetData.totalSpent)}{" "}
                    <span className="text-gray-400 font-normal">
                      / {formatCurrency(Number(budgetData.budget.amount))}
                    </span>
                  </span>
                </div>
                <GeoProgress
                  value={budgetData.percentage}
                  warning={budgetWarning}
                />
                <p
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    budgetWarning === "critical"
                      ? "text-red-600"
                      : budgetWarning === "caution"
                        ? "text-amber-600"
                        : "text-gray-400",
                  )}
                >
                  {budgetData.percentage.toFixed(0)}% Utilized
                </p>
              </div>
            ) : (
              <Link
                href="/dashboard/budgets"
                className="text-sm text-blue-600 hover:underline"
              >
                Set Budget →
              </Link>
            )}
          </Card>

          <Card delay={0.4}>
            <SectionHead
              title="Savings Goals"
              href="/dashboard/goals"
              linkLabel="View"
            />
            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => {
                const pct = Math.min(
                  (Number(goal.currentAmount) / Number(goal.targetAmount)) *
                    100,
                  100,
                );
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-700">
                        {goal.title}
                      </span>
                      <span className="text-xs font-bold text-blue-600">
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
      <Card delay={0.45}>
        <SectionHead
          title="Linked Accounts"
          href="/dashboard/accounts"
          linkLabel="Manage"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {accounts.map((acct) => (
            <div
              key={acct.id}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-300 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {acct.type}
                </span>
                {acct.isDefault && (
                  <span className="ml-auto text-[8px] bg-blue-50 text-blue-600 px-2 py-0.5 border border-blue-100 rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-gray-700">{acct.name}</p>
              <p className="text-xl font-black text-gray-900 mt-1">
                {formatCurrency(Number(acct.balance))}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
