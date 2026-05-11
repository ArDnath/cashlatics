"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { transactions, accounts } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { headers } from "next/headers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const serializeAmount = (val: string | number | null): number =>
  val ? parseFloat(val.toString()) : 0;

interface TransactionInput {
  amount: string | number;
  type: "INCOME" | "EXPENSE";
  accountId: string;
  description?: string | null;
  date: Date;
  category: string;
  receiptUrl?: string | null;
  isRecurring: boolean;
  recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | null;
}

// --- CREATE TRANSACTION ---
export async function createTransaction(data: TransactionInput) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    // ArcJet Rate Limiting
    const req = await request();
    const decision = await aj.protect(req, {
      userId: session.user.id,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) throw new Error("Too many requests.");
      throw new Error("Request blocked");
    }

    // Atomic Database Transaction
    const newTransaction = await db.transaction(async (tx) => {
      // 1. Calculate Balance Change
      const amount = parseFloat(data.amount.toString());
      const balanceChange = data.type === "EXPENSE" ? -amount : amount;

      // 2. Insert Transaction
      const [inserted] = await tx
        .insert(transactions)
        .values({
          type: data.type,
          amount: amount.toString(),
          date: data.date,
          accountId: data.accountId,
          category: data.category,
          description: data.description || null,
          receiptUrl: data.receiptUrl || null,
          isRecurring: data.isRecurring,
          recurringInterval: data.recurringInterval || null,
          userId: session.user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        })
        .returning();

      // 3. Update Account Balance
      await tx
        .update(accounts)
        .set({
          balance: sql`${accounts.balance} + ${balanceChange.toString()}::numeric`,
        })
        .where(eq(accounts.id, data.accountId));

      return inserted;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${newTransaction.accountId}`);
    return {
      success: true,
      data: {
        ...newTransaction,
        amount: serializeAmount(newTransaction.amount),
      },
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(errorMessage);
  }
}

// --- UPDATE TRANSACTION ---
export async function updateTransaction(id: string, data: TransactionInput) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("Unauthorized");

    const original = await db.query.transactions.findFirst({
      where: and(
        eq(transactions.id, id),
        eq(transactions.userId, session.user.id),
      ),
    });

    if (!original) throw new Error("Transaction not found");

    const oldAmount = serializeAmount(original.amount);
    const oldChange = original.type === "EXPENSE" ? -oldAmount : oldAmount;
    const newAmount = parseFloat(data.amount.toString());
    const newChange = data.type === "EXPENSE" ? -newAmount : newAmount;
    const netChange = newChange - oldChange;

    const updated = await db.transaction(async (tx) => {
      const [res] = await tx
        .update(transactions)
        .set({
          type: data.type,
          amount: newAmount.toString(),
          date: data.date,
          category: data.category,
          description: data.description || null,
          receiptUrl: data.receiptUrl || null,
          isRecurring: data.isRecurring,
          recurringInterval: data.recurringInterval || null,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        })
        .where(eq(transactions.id, id))
        .returning();

      await tx
        .update(accounts)
        .set({ balance: sql`${accounts.balance} + ${netChange.toString()}` })
        .where(eq(accounts.id, data.accountId));

      return res;
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: { ...updated, amount: serializeAmount(updated.amount) },
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(errorMessage);
  }
}

// --- SCAN RECEIPT (GEMINI) ---
export async function scanReceipt(file: File) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `Analyze this receipt. Return ONLY valid JSON:
      { "amount": number, "date": "ISO string", "description": "string", "merchantName": "string", "category": "string" }
      Categories: housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expense.`;

    const result = await model.generateContent([
      { inlineData: { data: base64String, mimeType: file.type } },
      prompt,
    ]);

    const cleanedText = result.response
      .text()
      .replace(/```(?:json)?\n?/g, "")
      .trim();
    const data = JSON.parse(cleanedText);

    return {
      amount: parseFloat(data.amount),
      date: new Date(data.date),
      description: data.description,
      category: data.category,
      merchantName: data.merchantName,
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Receipt Scan Error:", errorMessage);
    throw new Error("Failed to scan receipt");
  }
}

// --- UTILS ---
function calculateNextRecurringDate(startDate: Date, interval: string) {
  const date = new Date(startDate);
  if (interval === "DAILY") date.setDate(date.getDate() + 1);
  if (interval === "WEEKLY") date.setDate(date.getDate() + 7);
  if (interval === "MONTHLY") date.setMonth(date.getMonth() + 1);
  if (interval === "YEARLY") date.setFullYear(date.getFullYear() + 1);
  return date;
}
