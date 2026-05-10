"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { accounts, transactions } from "@/db/schema";
import { eq, and, inArray, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const serializeAmount = (val: string | number | null): number =>
  val ? parseFloat(val.toString()) : 0;

export async function getAccountWithTransactions(accountId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const account = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.id, accountId),
      eq(accounts.userId, session.user.id),
    ),
    with: {
      transactions: {
        orderBy: [desc(transactions.date)],
      },
    },
  });

  if (!account) return null;

  return {
    ...account,
    balance: serializeAmount(account.balance),
    transactions: account.transactions.map((t) => ({
      ...t,
      amount: serializeAmount(t.amount),
    })),
    _count: { transactions: account.transactions.length },
  };
}

export async function bulkDeleteTransactions(transactionIds: string[]) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    // 1. Get transactions to calculate balance changes
    const txToExclude = await db
      .select()
      .from(transactions)
      .where(
        and(
          inArray(transactions.id, transactionIds),
          eq(transactions.userId, session.user.id),
        ),
      );

    // 2. Group balance changes by account
    // If we delete an EXPENSE, we add the money back. If INCOME, we subtract.
    const accountBalanceChanges = txToExclude.reduce(
      (acc, t) => {
        const amount = serializeAmount(t.amount);
        const change = t.type === "EXPENSE" ? amount : -amount;
        acc[t.accountId] = (acc[t.accountId] || 0) + change;
        return acc;
      },
      {} as Record<string, number>,
    );

    // 3. Perform atomic transaction
    await db.transaction(async (tx) => {
      await tx
        .delete(transactions)
        .where(
          and(
            inArray(transactions.id, transactionIds),
            eq(transactions.userId, session.user.id),
          ),
        );

      for (const [accountId, balanceChange] of Object.entries(
        accountBalanceChanges,
      )) {
        await tx
          .update(accounts)
          .set({
            balance: sql`${accounts.balance} + ${balanceChange.toString()}`,
          })
          .where(eq(accounts.id, accountId));
      }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Bulk delete failed";
    return { success: false, error: msg };
  }
}

export async function updateDefaultAccount(accountId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    await db.transaction(async (tx) => {
      // Unset existing default
      await tx
        .update(accounts)
        .set({ isDefault: false })
        .where(
          and(
            eq(accounts.userId, session.user.id),
            eq(accounts.isDefault, true),
          ),
        );

      // Set new default
      await tx
        .update(accounts)
        .set({ isDefault: true })
        .where(
          and(eq(accounts.id, accountId), eq(accounts.userId, session.user.id)),
        );
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Update default failed";
    return { success: false, error: msg };
  }
}

export async function deleteAccount(accountId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    await db.transaction(async (tx) => {
      // Drizzle handles cascade if defined in schema, but manual delete is safer
      await tx
        .delete(transactions)
        .where(eq(transactions.accountId, accountId));
      await tx
        .delete(accounts)
        .where(
          and(eq(accounts.id, accountId), eq(accounts.userId, session.user.id)),
        );
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Delete account failed";
    return { success: false, error: msg };
  }
}
