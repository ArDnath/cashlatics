import { Navbar } from "../../_components/navbar";
import { getGoals } from "../../_actions/goals";
import { GoalsClient } from "./goals-client";

export default async function GoalsPage() {
  const goals = await getGoals();
  return (
    <>
      <Navbar title="Goals" description="Track your savings goals" />
      <GoalsClient goals={goals} />
    </>
  );
}
