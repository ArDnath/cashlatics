import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { v4 as uuidv4 } from "uuid";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🚀 Seeding database...");

  try {
    // 1. Clear existing data (Child tables first to respect Foreign Keys)
    console.log("🗑️ Deleting existing data...");
    await db.delete(schema.transactions);
    await db.delete(schema.budgets);
    await db.delete(schema.accounts);
    await db.delete(schema.user); // Using 'user' based on your pgTable definition
    console.log("✅ Existing data deleted.");

    // 2. Create a dummy user
    const dummyUserId = uuidv4();
    await db.insert(schema.user).values({
      id: dummyUserId,
      name: "Test User",
      email: "test@example.com",
      emailVerified: true,
      image: "https://i.pravatar.cc/150?img=68",
    });
    console.log("👤 Created test user.");

    // 3. Create a default account
    const defaultAccountId = uuidv4();
    await db.insert(schema.accounts).values({
      id: defaultAccountId,
      name: "Main Checking",
      type: "CURRENT",
      balance: "1500.75",
      isDefault: true,
      userId: dummyUserId,
    });
    console.log("💳 Created default account.");

    // 4. Create transactions
    await db.insert(schema.transactions).values([
      {
        id: uuidv4(),
        type: "EXPENSE",
        amount: "50.25",
        description: "Groceries",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        category: "Food",
        status: "COMPLETED",
        userId: dummyUserId,
        accountId: defaultAccountId,
      },
      {
        id: uuidv4(),
        type: "INCOME",
        amount: "2000.00",
        description: "Monthly Salary",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        category: "Salary",
        isRecurring: true,
        recurringInterval: "MONTHLY",
        status: "COMPLETED",
        userId: dummyUserId,
        accountId: defaultAccountId,
      },
    ]);
    console.log("💸 Created test transactions.");

    // 5. Create a budget
    await db.insert(schema.budgets).values({
      id: uuidv4(),
      amount: "1000.00",
      userId: dummyUserId,
    });
    console.log("💰 Created test budget.");

    console.log("✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
