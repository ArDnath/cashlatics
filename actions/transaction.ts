"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const serializeAmount = (val: string | number | null): number =>
  val ? parseFloat(val.toString()) : 0;

export async function createTransaction(data: any) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const transactionData = {
      ...data,
      amount: serializeAmount(data.amount).toString(),
      userId: session.user.id,
      date: new Date(data.date),
    };

    await db.insert(transactions).values(transactionData);
    revalidatePath("/dashboard");
    return { success: true, data: transactionData };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Create transaction failed";
    return { success: false, error: msg };
  }
}

export async function updateTransaction(id: string, data: any) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const transactionData = {
      ...data,
      amount: serializeAmount(data.amount).toString(),
      date: new Date(data.date),
    };

    await db
      .update(transactions)
      .set(transactionData)
      .where(and(eq(transactions.id, id), eq(transactions.userId, session.user.id)));

    revalidatePath("/dashboard");
    return { success: true, data: transactionData };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Update transaction failed";
    return { success: false, error: msg };
  }
}

export async function getTransaction(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const transaction = await db.query.transactions.findFirst({
      where: and(eq(transactions.id, id), eq(transactions.userId, session.user.id)),
    });

    return transaction;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Get transaction failed";
    throw new Error(msg);
  }
}

export async function scanReceipt(file: File) {
  try {
    // Mock receipt scanning - in a real app, this would use OCR or AI
    const mockData = {
      description: "Receipt Purchase",
      amount: "25.50",
      category: "Shopping",
      type: "EXPENSE" as const,
    };

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return { success: true, data: mockData };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Receipt scan failed";
    return { success: false, error: msg };
  }
}
