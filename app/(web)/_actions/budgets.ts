"use server";

import { db, budgets, transactions } from "@/db";
import { eq, and, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function getBudget() {
  const user = await getUser();
  const [budget] = await db
    .select()
    .from(budgets)
    .where(eq(budgets.userId, user.id));

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthExpenses = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, user.id),
        eq(transactions.type, "EXPENSE"),
        gte(transactions.date, startOfMonth),
      ),
    );

  const totalSpent = monthExpenses.reduce(
    (sum, t) => sum + Number(t.amount),
    0,
  );

  return {
    budget: budget || null,
    totalSpent,
    percentage: budget
      ? Math.min((totalSpent / Number(budget.amount)) * 100, 100)
      : 0,
  };
}

export async function upsertBudget(amount: string) {
  const user = await getUser();
  z.string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .parse(amount);

  const [existing] = await db
    .select()
    .from(budgets)
    .where(eq(budgets.userId, user.id));

  if (existing) {
    await db
      .update(budgets)
      .set({ amount, updatedAt: new Date() })
      .where(eq(budgets.userId, user.id));
  } else {
    await db.insert(budgets).values({ amount, userId: user.id });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/budgets");
}
