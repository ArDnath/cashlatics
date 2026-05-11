"use server";

import { db, goals } from "@/db";
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

const goalSchema = z.object({
  title: z.string().min(1).max(100),
  targetAmount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currentAmount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .optional()
    .default("0"),
  targetDate: z.string().optional(),
});

export async function getGoals() {
  const user = await getUser();
  return db
    .select()
    .from(goals)
    .where(eq(goals.userId, user.id))
    .orderBy(desc(goals.createdAt));
}

export async function createGoal(data: z.infer<typeof goalSchema>) {
  const user = await getUser();
  const parsed = goalSchema.parse(data);

  const [goal] = await db
    .insert(goals)
    .values({
      ...parsed,
      targetDate: parsed.targetDate ? new Date(parsed.targetDate) : null,
      userId: user.id,
    })
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/goals");
  return goal;
}

export async function updateGoal(
  id: string,
  data: Partial<z.infer<typeof goalSchema>> & { completed?: boolean },
) {
  const user = await getUser();
  const [existing] = await db.select().from(goals).where(eq(goals.id, id));
  if (!existing || existing.userId !== user.id) throw new Error("Not found");

  const [goal] = await db
    .update(goals)
    .set({
      ...data,
      targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(goals.id, id))
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/goals");
  return goal;
}

export async function deleteGoal(id: string) {
  const user = await getUser();
  const [existing] = await db.select().from(goals).where(eq(goals.id, id));
  if (!existing || existing.userId !== user.id) throw new Error("Not found");

  await db.delete(goals).where(eq(goals.id, id));
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/goals");
}
