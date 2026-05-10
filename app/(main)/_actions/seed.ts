"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { accounts, transactions } from "@/db/schema";
import { subDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { type InferInsertModel, eq, and } from "drizzle-orm";
import { headers } from "next/headers";

type NewTransaction = InferInsertModel<typeof transactions>;

const CATEGORIES = {
  INCOME: [
    { name: "salary", range: [50000, 80000] },
    { name: "freelance", range: [10000, 30000] },
    { name: "investments", range: [5000, 20000] },
    { name: "other-income", range: [1000, 10000] },
  ],
  EXPENSE: [
    { name: "housing", range: [10000, 20000] },
    { name: "transportation", range: [1000, 5000] },
    { name: "groceries", range: [2000, 6000] },
    { name: "utilities", range: [1000, 3000] },
    { name: "entertainment", range: [50, 2000] },
    { name: "food", range: [50, 150] },
    { name: "shopping", range: [1000, 5000] },
    { name: "healthcare", range: [1000, 10000] },
    { name: "education", range: [2000, 10000] },
    { name: "travel", range: [5000, 20000] },
  ],
} as const;

function getRandomAmount(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomCategory(type: "INCOME" | "EXPENSE") {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

export async function seedTransactions() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    // 1. Find or Create Default Account
    let [account] = await db
      .select()
      .from(accounts)
      .where(
        and(eq(accounts.userId, session.user.id), eq(accounts.isDefault, true)),
      );

    if (!account) {
      [account] = await db
        .insert(accounts)
        .values({
          name: "Default Account",
          type: "CURRENT",
          balance: "0",
          isDefault: true,
          userId: session.user.id,
        })
        .returning();
    }

    // 2. Generate 10 days of transactions
    const transactionBatch: NewTransaction[] = [];
    let totalBalance = parseFloat(account.balance?.toString() || "0");

    for (let i = 10; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < transactionsPerDay; j++) {
        const type = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
        const { category, amount } = getRandomCategory(type);

        transactionBatch.push({
          id: crypto.randomUUID(),
          type,
          amount: amount.toString(),
          description: `${type === "INCOME" ? "Received" : "Paid for"} ${category}`,
          date: date,
          category,
          status: "COMPLETED",
          userId: session.user.id,
          accountId: account.id,
        });

        totalBalance += type === "INCOME" ? amount : -amount;
      }
    }

    // 3. Database Transaction (Atomicity)
    await db.transaction(async (tx) => {
      // Clear existing dummy data for this account
      await tx
        .delete(transactions)
        .where(eq(transactions.accountId, account.id));

      // Batch insert new transactions
      if (transactionBatch.length > 0) {
        await tx.insert(transactions).values(transactionBatch);
      }

      // Update account balance
      await tx
        .update(accounts)
        .set({ balance: totalBalance.toString() })
        .where(eq(accounts.id, account.id));
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${account.id}`);

    return { success: true, message: "Data seeded successfully" };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Seeding failed";
    console.error("Error seeding data:", msg);
    return { success: false, error: msg };
  }
}
