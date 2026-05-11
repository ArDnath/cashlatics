"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createTransaction,
  deleteTransaction,
} from "../../_actions/transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  ArrowLeftRight,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types";
import type { Transaction, Account } from "@/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);

interface TransactionsClientProps {
  transactions: Transaction[];
  accounts: Account[];
}

const defaultForm = {
  type: "EXPENSE" as "INCOME" | "EXPENSE",
  amount: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  category: "",
  accountId: "",
  isRecurring: false,
  recurringInterval: undefined as
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"
    | "YEARLY"
    | undefined,
  status: "COMPLETED" as "PENDING" | "COMPLETED" | "FAILED",
};

export function TransactionsClient({
  transactions: initial,
  accounts,
}: TransactionsClientProps) {
  const router = useRouter();
  const [transactions, setTransactions] = useState(initial);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">(
    "ALL",
  );
  const [form, setForm] = useState({
    ...defaultForm,
    accountId: accounts[0]?.id || "",
  });

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== "ALL" && t.type !== filterType) return false;
      if (
        search &&
        !t.description?.toLowerCase().includes(search.toLowerCase()) &&
        !t.category.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [transactions, filterType, search]);

  const categories =
    form.type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.accountId) return toast.error("Select an account");
    setLoading(true);
    try {
      const created = await createTransaction({
        ...form,
        recurringInterval: form.isRecurring
          ? form.recurringInterval
          : undefined,
      });
      setTransactions((prev) => [created as Transaction, ...prev]);
      toast.success("Transaction recorded");
      setOpen(false);
      setForm({ ...defaultForm, accountId: accounts[0]?.id || "" });
      router.refresh();
    } catch {
      toast.error("Failed to record transaction");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete transaction?")) return;
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("Transaction removed");
      router.refresh();
    } catch {
      toast.error("Deletion failed");
    }
  }

  const totals = useMemo(() => {
    const inc = filtered
      .filter((t) => t.type === "INCOME")
      .reduce((s, t) => s + Number(t.amount), 0);
    const exp = filtered
      .filter((t) => t.type === "EXPENSE")
      .reduce((s, t) => s + Number(t.amount), 0);
    return { income: inc, expenses: exp, net: inc - exp };
  }, [filtered]);

  return (
    <div className="p-8 space-y-10 bg-[#fafafa] min-h-screen text-stone-700">
      {/* Treasury Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="flex gap-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">
              Net Cash Flow
            </p>
            <h2
              className={cn(
                "text-3xl font-medium tracking-tight",
                totals.net >= 0 ? "text-stone-900" : "text-rose-600",
              )}
            >
              {fmt(totals.net)}
            </h2>
          </div>
          <div className="hidden sm:block border-l border-stone-200 pl-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">
              Inflow / Outflow
            </p>
            <div className="flex gap-4 items-baseline">
              <span className="text-sm font-bold text-stone-900">
                {fmt(totals.income)}
              </span>
              <span className="text-stone-300">/</span>
              <span className="text-sm font-bold text-stone-500">
                {fmt(totals.expenses)}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="rounded-none bg-stone-950 hover:bg-stone-800 text-white h-11 px-8 text-[11px] font-bold uppercase tracking-widest transition-all"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Transaction
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by description or category..."
            className="pl-10 rounded-none border-stone-200 focus-visible:ring-0 focus-visible:border-stone-950 bg-white h-11 text-sm"
          />
        </div>
        <div className="flex bg-stone-100 p-1 border border-stone-200">
          {(["ALL", "INCOME", "EXPENSE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={cn(
                "px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                filterType === f
                  ? "bg-white text-stone-950 shadow-sm"
                  : "text-stone-400 hover:text-stone-600",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table-style List */}
      <div className="bg-white border border-stone-200 relative">
        {/* Corner Decor */}
        <span className="absolute -top-[1px] -left-[1px] h-3 w-3 border-t border-l border-stone-950" />

        <div className="grid grid-cols-1 divide-y divide-stone-100">
          {filtered.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-stone-400">
              <ArrowLeftRight className="h-8 w-8 mb-4 stroke-1" />
              <p className="text-[11px] font-bold uppercase tracking-widest">
                No matching records
              </p>
            </div>
          ) : (
            filtered.map((txn, i) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group flex items-center gap-6 px-6 py-4 hover:bg-stone-50 transition-colors"
              >
                <div
                  className={cn(
                    "h-10 w-10 flex items-center justify-center border transition-all",
                    txn.type === "INCOME"
                      ? "bg-stone-50 border-stone-200 text-stone-600"
                      : "bg-white border-stone-200 text-stone-400",
                  )}
                >
                  {txn.type === "INCOME" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-stone-900 truncate">
                      {txn.description || txn.category}
                    </h4>
                    {txn.isRecurring && (
                      <div className="text-[8px] font-black bg-stone-950 text-white px-1.5 py-0.5 uppercase tracking-tighter">
                        Recurring
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                      {txn.category}
                    </span>
                    <span className="h-1 w-1 bg-stone-200 rounded-full" />
                    <span className="text-[10px] font-medium text-stone-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{" "}
                      {format(new Date(txn.date), "dd MMM yyyy")}
                    </span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-8">
                  <div className="hidden md:block">
                    <div
                      className={cn(
                        "text-[9px] font-black uppercase tracking-[0.2em] mb-1",
                        txn.status === "COMPLETED"
                          ? "text-stone-400"
                          : "text-amber-500",
                      )}
                    >
                      {txn.status}
                    </div>
                  </div>

                  <div className="w-32">
                    <p
                      className={cn(
                        "text-sm font-bold tabular-nums",
                        txn.type === "INCOME"
                          ? "text-stone-900"
                          : "text-stone-500",
                      )}
                    >
                      {txn.type === "INCOME" ? "+" : "-"}{" "}
                      {fmt(Number(txn.amount))}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(txn.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-stone-300 hover:text-rose-600 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-none border-stone-200 bg-white sm:max-w-[450px] p-8 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-stone-900 uppercase tracking-tight">
              Record Movement
            </DialogTitle>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
              Transaction Details
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="flex border border-stone-200 p-1 bg-stone-50">
              {(["EXPENSE", "INCOME"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, type: t, category: "" }))
                  }
                  className={cn(
                    "flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                    form.type === t
                      ? "bg-white text-stone-950 shadow-sm"
                      : "text-stone-400",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-stone-500">
                  Amount
                </Label>
                <Input
                  value={form.amount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  type="number"
                  placeholder="0.00"
                  className="rounded-none border-stone-200 focus-visible:border-stone-900 h-11 font-bold tabular-nums"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-stone-500">
                  Date
                </Label>
                <Input
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                  type="date"
                  className="rounded-none border-stone-200 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-stone-500">
                Account Source
              </Label>
              <Select
                value={form.accountId}
                onValueChange={(v) => setForm((p) => ({ ...p, accountId: v }))}
              >
                <SelectTrigger className="rounded-none border-stone-200 h-11">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-stone-500">
                Category
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger className="rounded-none border-stone-200 h-11 text-stone-900">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-stone-500">
                Description
              </Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="External vendor or note"
                className="rounded-none border-stone-200 h-11"
              />
            </div>

            <div className="flex items-center space-x-3 py-2 border-t border-stone-100 pt-4">
              <Checkbox
                id="isRecurring"
                checked={form.isRecurring}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, isRecurring: !!v }))
                }
                className="rounded-none border-stone-300 data-[state=checked]:bg-stone-950 data-[state=checked]:border-stone-950"
              />
              <Label
                htmlFor="isRecurring"
                className="text-[10px] font-bold uppercase text-stone-600 cursor-pointer"
              >
                Recurring Transaction
              </Label>
            </div>

            {form.isRecurring && (
              <Select
                value={form.recurringInterval || ""}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, recurringInterval: v as any }))
                }
              >
                <SelectTrigger className="rounded-none border-stone-200 h-11">
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  {["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-none bg-stone-950 hover:bg-stone-800 text-white font-bold uppercase text-[11px] tracking-[0.2em] h-12"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Commit Transaction"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
