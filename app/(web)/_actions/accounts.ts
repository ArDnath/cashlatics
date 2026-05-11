"use server";

import { db, accounts } from "@/db";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

const accountSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["CURRENT", "SAVINGS"]),
  balance: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional()
    .default("0"),
  isDefault: z.boolean().optional().default(false),
});

export async function getAccounts() {
  const user = await getUser();
  return db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, user.id))
    .orderBy(desc(accounts.createdAt));
}

export async function createAccount(data: z.infer<typeof accountSchema>) {
  const user = await getUser();
  const parsed = accountSchema.parse(data);

  if (parsed.isDefault) {
    await db
      .update(accounts)
      .set({ isDefault: false })
      .where(eq(accounts.userId, user.id));
  }

  const [acct] = await db
    .insert(accounts)
    .values({
      ...parsed,
      userId: user.id,
    })
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/accounts");
  return acct;
}

export async function updateAccount(
  id: string,
  data: Partial<z.infer<typeof accountSchema>>,
) {
  const user = await getUser();

  if (data.isDefault) {
    await db
      .update(accounts)
      .set({ isDefault: false })
      .where(eq(accounts.userId, user.id));
  }

  const [acct] = await db
    .update(accounts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(accounts.id, id))
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/accounts");
  return acct;
}

export async function deleteAccount(id: string) {
  const user = await getUser();
  await db.delete(accounts).where(eq(accounts.id, id));
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/accounts");
}
