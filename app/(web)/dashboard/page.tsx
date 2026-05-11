import { Navbar } from "../_components/navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  getDashboardStats,
  getMonthlyChartData,
} from "../_actions/transaction";
import { getAccounts } from "../_actions/accounts";
import { getBudget } from "../_actions/budgets";
import { getGoals } from "../_actions/goals";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const [stats, chartData, accounts, budgetData, goals] = await Promise.all([
    getDashboardStats(),
    getMonthlyChartData(),
    getAccounts(),
    getBudget(),
    getGoals(),
  ]);
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Navbar */}
      <Navbar title="Dashboard" description="Your financial overview" />
      <DashboardClient
        stats={stats}
        chartData={chartData}
        accounts={accounts}
        budgetData={budgetData}
        goals={goals}
      />
    </div>
  );
}
