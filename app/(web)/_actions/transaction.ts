"use server";

import { db, transactions, accounts } from "@/db";
import { eq, desc, and, gte, lte, ilike, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  description: z.string().optional(),
  date: z.string(),
  category: z.string().min(1),
  accountId: z.string().uuid(),
  isRecurring: z.boolean().optional().default(false),
  recurringInterval: z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .optional(),
  status: z
    .enum(["PENDING", "COMPLETED", "FAILED"])
    .optional()
    .default("COMPLETED"),
});

export async function getTransactions(filters?: {
  type?: "INCOME" | "EXPENSE";
  startDate?: Date;
  endDate?: Date;
  search?: string;
  accountId?: string;
  limit?: number;
}) {
  const user = await getUser();

  const conditions = [eq(transactions.userId, user.id)];
  if (filters?.type) conditions.push(eq(transactions.type, filters.type));
  if (filters?.startDate)
    conditions.push(gte(transactions.date, filters.startDate));
  if (filters?.endDate)
    conditions.push(lte(transactions.date, filters.endDate));
  if (filters?.accountId)
    conditions.push(eq(transactions.accountId, filters.accountId));
  if (filters?.search)
    conditions.push(ilike(transactions.description, `%${filters.search}%`));

  return db
    .select()
    .from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.date))
    .limit(filters?.limit || 100);
}

export async function createTransaction(
  data: z.infer<typeof transactionSchema>,
) {
  const user = await getUser();
  const parsed = transactionSchema.parse(data);

  const [txn] = await db
    .insert(transactions)
    .values({
      ...parsed,
      date: new Date(parsed.date),
      userId: user.id,
    })
    .returning();

  // Update account balance
  const delta =
    parsed.type === "INCOME" ? Number(parsed.amount) : -Number(parsed.amount);
  await db.execute(
    sql`UPDATE accounts SET balance = balance + ${delta} WHERE id = ${parsed.accountId}`,
  );

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
  return txn;
}

export async function updateTransaction(
  id: string,
  data: Partial<z.infer<typeof transactionSchema>>,
) {
  const user = await getUser();

  const [existing] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, id));
  if (!existing || existing.userId !== user.id) throw new Error("Not found");

  // Reverse old balance effect
  const oldDelta =
    existing.type === "INCOME"
      ? -Number(existing.amount)
      : Number(existing.amount);
  await db.execute(
    sql`UPDATE accounts SET balance = balance + ${oldDelta} WHERE id = ${existing.accountId}`,
  );

  const newType = data.type || existing.type;
  const newAmount = data.amount || existing.amount;
  const newDelta =
    newType === "INCOME" ? Number(newAmount) : -Number(newAmount);

  await db.execute(
    sql`UPDATE accounts SET balance = balance + ${newDelta} WHERE id = ${existing.accountId}`,
  );

  const [updated] = await db
    .update(transactions)
    .set({
      ...data,
      date: data.date ? new Date(data.date) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(transactions.id, id))
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
  return updated;
}

export async function deleteTransaction(id: string) {
  const user = await getUser();
  const [txn] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, id));
  if (!txn || txn.userId !== user.id) throw new Error("Not found");

  // Reverse balance effect
  const delta =
    txn.type === "INCOME" ? -Number(txn.amount) : Number(txn.amount);
  await db.execute(
    sql`UPDATE accounts SET balance = balance + ${delta} WHERE id = ${txn.accountId}`,
  );

  await db.delete(transactions).where(eq(transactions.id, id));
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");
}

export async function getDashboardStats() {
  const user = await getUser();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [allAccounts, monthTransactions, lastMonthTransactions] =
    await Promise.all([
      db.select().from(accounts).where(eq(accounts.userId, user.id)),
      db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, user.id),
            gte(transactions.date, startOfMonth),
          ),
        ),
      db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, user.id),
            gte(transactions.date, startOfLastMonth),
            lte(transactions.date, endOfLastMonth),
          ),
        ),
    ]);

  const totalBalance = allAccounts.reduce(
    (sum, a) => sum + Number(a.balance),
    0,
  );
  const monthIncome = monthTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const monthExpenses = monthTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const lastMonthExpenses = lastMonthTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    totalBalance,
    monthIncome,
    monthExpenses,
    savings: monthIncome - monthExpenses,
    lastMonthExpenses,
    expenseChange:
      lastMonthExpenses > 0
        ? ((monthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
        : 0,
    recentTransactions: monthTransactions.slice(0, 5),
  };
}

export async function getMonthlyChartData() {
  const user = await getUser();
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const label = start.toLocaleString("default", { month: "short" });

    const txns = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, user.id),
          gte(transactions.date, start),
          lte(transactions.date, end),
        ),
      );

    months.push({
      month: label,
      income: txns
        .filter((t) => t.type === "INCOME")
        .reduce((s, t) => s + Number(t.amount), 0),
      expenses: txns
        .filter((t) => t.type === "EXPENSE")
        .reduce((s, t) => s + Number(t.amount), 0),
    });
  }

  return months;
}
