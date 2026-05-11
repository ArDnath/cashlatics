import { Navbar } from "../../_components/navbar";
import { getTransactions } from "../../_actions/transaction";
import { getAccounts } from "../../_actions/accounts";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage() {
  const [transactions, accounts] = await Promise.all([
    getTransactions({ limit: 500 }),
    getAccounts(),
  ]);

  return (
    <>
      <Navbar
        title="Analytics"
        description="Deep dive into your financial data"
      />
      <AnalyticsClient transactions={transactions} accounts={accounts} />
    </>
  );
}
