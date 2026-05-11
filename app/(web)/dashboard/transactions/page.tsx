import { Navbar } from "../../_components/navbar";
import { getTransactions } from "../../_actions/transaction";
import { getAccounts } from "../../_actions/accounts";
import { TransactionsClient } from "./transactions-client";

export default async function TransactionsPage() {
  const [transactions, accounts] = await Promise.all([
    getTransactions({ limit: 200 }),
    getAccounts(),
  ]);

  return (
    <>
      <Navbar
        title="Transactions"
        description="Track your income and expenses"
      />
      <TransactionsClient transactions={transactions} accounts={accounts} />
    </>
  );
}
