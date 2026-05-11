import { Navbar } from "../../_components/navbar";
import { getAccounts } from "../../_actions/accounts";
import { AccountsClient } from "./accounts-client";

export default async function AccountsPage() {
  const accounts = await getAccounts();
  return (
    <>
      <Navbar title="Accounts" description="Manage your financial accounts" />
      <AccountsClient accounts={accounts} />
    </>
  );
}
