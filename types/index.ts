export type TransactionType = "INCOME" | "EXPENSE";
export type AccountType = "CURRENT" | "SAVINGS";
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";
export type RecurringInterval = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: string;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: string;
  description?: string | null;
  date: Date;
  category: string;
  receiptUrl?: string | null;
  isRecurring: boolean;
  recurringInterval?: RecurringInterval | null;
  nextRecurringDate?: Date | null;
  lastProcessed?: Date | null;
  status: TransactionStatus;
  userId: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  amount: string;
  lastAlertSent?: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: string;
  currentAmount: string;
  targetDate?: Date | null;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiInsight {
  id: string;
  userId: string;
  type: string;
  prompt?: string | null;
  response?: string | null;
  model?: string | null;
  tokensUsed?: number | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

export const EXPENSE_CATEGORIES = [
  "Housing",
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Utilities",
  "Travel",
  "Personal Care",
  "Insurance",
  "Investments",
  "Gifts & Donations",
  "Other",
] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investments",
  "Rental Income",
  "Bonus",
  "Gift",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
