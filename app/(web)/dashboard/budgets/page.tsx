import { Navbar } from "../../_components/navbar";
import { getBudget } from "../../_actions/budgets";
import { getTransactions } from "../../_actions/transaction";
import { BudgetsClient } from "./budgets-client";
import { EXPENSE_CATEGORIES } from "@/types";

export default async function BudgetsPage() {
  const [budgetData, allTransactions] = await Promise.all([
    getBudget(),
    getTransactions({ type: "EXPENSE" }),
  ]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthTransactions = allTransactions.filter(
    (t) => new Date(t.date) >= startOfMonth,
  );

  const categoryBreakdown = EXPENSE_CATEGORIES.map((cat) => {
    const total = monthTransactions
      .filter((t) => t.category === cat)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { category: cat, total };
  })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <>
      <Navbar
        title="Budgets"
        description="Track your spending against your budget"
      />
      <BudgetsClient
        budgetData={budgetData}
        categoryBreakdown={categoryBreakdown}
        totalSpent={budgetData.totalSpent}
      />
    </>
  );
}
