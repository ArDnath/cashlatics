import {
  pgTable,
  text,
  timestamp,
  decimal,
  boolean,
  uuid,
  pgEnum,
  index,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "INCOME",
  "EXPENSE",
]);
export const accountTypeEnum = pgEnum("account_type", ["CURRENT", "SAVINGS"]);
export const transactionStatusEnum = pgEnum("transaction_status", [
  "PENDING",
  "COMPLETED",
  "FAILED",
]);
export const recurringIntervalEnum = pgEnum("recurring_interval", [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
]);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    type: accountTypeEnum("type").notNull(),
    balance: decimal("balance", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("account_user_id_idx").on(table.userId),
  }),
);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: transactionTypeEnum("type").notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    description: text("description"),
    date: timestamp("date").notNull(),
    category: text("category").notNull(),
    receiptUrl: text("receipt_url"),
    isRecurring: boolean("is_recurring").default(false).notNull(),
    recurringInterval: recurringIntervalEnum("recurring_interval"),
    nextRecurringDate: timestamp("next_recurring_date"),
    lastProcessed: timestamp("last_processed"),
    status: transactionStatusEnum("status").default("COMPLETED").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("trans_user_id_idx").on(table.userId),
    accountIdIdx: index("trans_account_id_idx").on(table.accountId),
  }),
);

export const budgets = pgTable(
  "budgets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    lastAlertSent: timestamp("last_alert_sent"),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("budget_user_id_idx").on(table.userId),
  }),
);

export const goals = pgTable(
  "goals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    targetAmount: decimal("target_amount", {
      precision: 12,
      scale: 2,
    }).notNull(),
    currentAmount: decimal("current_amount", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    targetDate: timestamp("target_date"),
    completed: boolean("completed").default(false).notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("goals_user_id_idx").on(table.userId),
  }),
);

export const aiInsights = pgTable(
  "ai_insights",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    prompt: text("prompt"),
    response: text("response"),
    model: text("model"),
    tokensUsed: integer("tokens_used").default(0),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("ai_insights_user_id_idx").on(table.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(user, { fields: [accounts.userId], references: [user.id] }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(user, { fields: [transactions.userId], references: [user.id] }),
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
}));

export const budgetsRelations = relations(budgets, ({ one }) => ({
  user: one(user, { fields: [budgets.userId], references: [user.id] }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(user, { fields: [goals.userId], references: [user.id] }),
}));

export const aiInsightsRelations = relations(aiInsights, ({ one }) => ({
  user: one(user, { fields: [aiInsights.userId], references: [user.id] }),
}));
