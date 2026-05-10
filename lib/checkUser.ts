import { auth } from "@/lib/auth"; // Your Better-Auth instance
import { db } from "@/db"; // Your Drizzle instance
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const checkUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  try {
    const loggedInUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
    });

    return loggedInUser || null;
  } catch (error) {
    console.error(
      "Error fetching user:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
};
