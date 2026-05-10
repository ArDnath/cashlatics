"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { budgets, transactions } from "@/db/schema";
import { eq, and, gte, lte, sum } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const serializeAmount = (val: string | number | null): number =>
  val ? parseFloat(val.toString()) : 0;

export async function getCurrentBudget(accountId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const userBudget = await db.query.budgets.findFirst({
      where: eq(budgets.userId, session.user.id),
    });

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    const [result] = await db
      .select({ total: sum(transactions.amount) })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, session.user.id),
          eq(transactions.accountId, accountId),
          eq(transactions.type, "EXPENSE"),
          gte(transactions.date, startOfMonth),
          lte(transactions.date, endOfMonth),
        ),
      );

    return {
      budget: userBudget
        ? { ...userBudget, amount: serializeAmount(userBudget.amount) }
        : null,
      currentExpenses: serializeAmount(result?.total),
    };
  } catch (error: unknown) {
    console.error("Error fetching budget:", error);
    throw error;
  }
}

export async function updateBudget(amount: number) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");
    const [existingBudget] = await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, session.user.id));

    let budget;

    if (existingBudget) {
      [budget] = await db
        .update(budgets)
        .set({ amount: amount.toString() })
        .where(eq(budgets.userId, session.user.id))
        .returning();
    } else {
      [budget] = await db
        .insert(budgets)
        .values({
          userId: session.user.id,
          amount: amount.toString(),
        })
        .returning();
    }

    revalidatePath("/dashboard");
    return {
      success: true,
      data: { ...budget, amount: serializeAmount(budget.amount) },
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update budget";
    console.error("Error updating budget:", message);
    return { success: false, error: message };
  }
}
