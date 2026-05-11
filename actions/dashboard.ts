"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getUserAccounts() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const userAccounts = await db.query.accounts.findMany({
      where: eq(accounts.userId, session.user.id),
      orderBy: (accounts, { desc }) => [desc(accounts.createdAt)],
    });

    return userAccounts.map(account => ({
      ...account,
      balance: parseFloat(account.balance.toString()),
    }));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Get accounts failed";
    throw new Error(msg);
  }
}

export async function createAccount(data: any) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const accountData = {
      ...data,
      balance: data.balance.toString(),
      userId: session.user.id,
    };

    await db.insert(accounts).values(accountData);
    revalidatePath("/dashboard");
    return { success: true, data: accountData };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Create account failed";
    return { success: false, error: msg };
  }
}
