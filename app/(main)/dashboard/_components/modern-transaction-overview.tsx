"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import {
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  PieChart as PieIcon,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- Interfaces ---
interface Account {
  id: string;
  name: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  accountId: string;
  type: "EXPENSE" | "INCOME";
  amount: number;
  category: string;
  date: string | Date;
  description?: string | null;
}

interface ModernDashboardOverviewProps {
  accounts: Account[];
  transactions: Transaction[];
}

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
];

export function ModernDashboardOverview({
  accounts,
  transactions,
}: ModernDashboardOverviewProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id || "",
  );

  // Memoize filtered transactions to avoid unnecessary re-calculations
  const accountTransactions = useMemo(
    () => transactions.filter((t) => t.accountId === selectedAccountId),
    [transactions, selectedAccountId],
  );

  const recentTransactions = useMemo(
    () =>
      [...accountTransactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [accountTransactions],
  );

  const pieChartData = useMemo(() => {
    const currentDate = new Date();
    const expenses = accountTransactions.reduce(
      (acc, t) => {
        const transactionDate = new Date(t.date);
        const isCurrentMonth =
          transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear();

        if (t.type === "EXPENSE" && isCurrentMonth) {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(expenses).map(([name, value]) => ({ name, value }));
  }, [accountTransactions]);

  if (accounts.length === 0) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Chart Section */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm border border-slate-100 dark:border-neutral-800 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Spending Breakdown
          </h3>
          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="w-40 h-9 rounded-lg bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-h-75 relative">
          {pieChartData.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <PieIcon className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-neutral-400 font-medium">
                No expenses this month
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ color: "#1e293b", fontWeight: "bold" }}
                  formatter={(value) =>
                    typeof value === "number"
                      ? `₹${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : ""
                  }
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm border border-slate-100 dark:border-neutral-800 flex flex-col h-112.5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Activity
          </h3>
          <div className="p-2 bg-slate-50 dark:bg-neutral-800 rounded-full text-slate-400">
            <Filter className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10">
              <p className="text-slate-500 dark:text-neutral-400 font-medium">
                No recent transactions
              </p>
            </div>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-neutral-800"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
                      transaction.type === "EXPENSE"
                        ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                        : "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
                    )}
                  >
                    {transaction.type === "EXPENSE" ? (
                      <ArrowDownRight className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-neutral-500 capitalize">
                      {transaction.category.toLowerCase()} •{" "}
                      {format(new Date(transaction.date), "MMM d")}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "font-bold text-sm",
                    transaction.type === "EXPENSE"
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400",
                  )}
                >
                  {transaction.type === "EXPENSE" ? "-" : "+"}₹
                  {transaction.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
