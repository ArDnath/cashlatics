"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { accounts, transactions } from "@/db/schema";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { eq, desc, and } from "drizzle-orm";
import { headers } from "next/headers";

export interface CreateAccountInput {
  name: string;
  type: "CURRENT" | "SAVINGS";
  balance: string | number;
  isDefault: boolean;
}

const serializeAmount = (val: string | number | null): number =>
  val ? parseFloat(val.toString()) : 0;

export async function getUserAccounts() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, session.user.id),
    orderBy: [desc(accounts.createdAt)],
    with: {
      transactions: true,
    },
  });

  return userAccounts.map((acc) => ({
    ...acc,
    balance: serializeAmount(acc.balance),
    transactionCount: acc.transactions.length,
  }));
}

export async function createAccount(data: CreateAccountInput) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const req = await request();
    const decision = await aj.protect(req, {
      userId: session.user.id,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw new Error("Too many requests. Please try again later.");
      }
      throw new Error("Request blocked");
    }

    const balanceFloat =
      typeof data.balance === "string"
        ? parseFloat(data.balance)
        : data.balance;

    if (isNaN(balanceFloat)) throw new Error("Invalid balance amount");

    const existing = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, session.user.id));

    const shouldBeDefault = existing.length === 0 ? true : data.isDefault;

    if (shouldBeDefault) {
      await db
        .update(accounts)
        .set({ isDefault: false })
        .where(
          and(
            eq(accounts.userId, session.user.id),
            eq(accounts.isDefault, true),
          ),
        );
    }

    const [newAccount] = await db
      .insert(accounts)
      .values({
        name: data.name,
        type: data.type,
        balance: balanceFloat.toString(),
        userId: session.user.id,
        isDefault: shouldBeDefault,
      })
      .returning();

    revalidatePath("/dashboard");

    return {
      success: true,
      data: { ...newAccount, balance: serializeAmount(newAccount.balance) },
    };
  } catch (error: unknown) {
    // 2. Properly handle the 'unknown' error type
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    throw new Error(errorMessage);
  }
}

export async function getDashboardData() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const allTransactions = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, session.user.id))
    .orderBy(desc(transactions.date));

  return allTransactions.map((t) => ({
    ...t,
    amount: serializeAmount(t.amount),
  }));
}
