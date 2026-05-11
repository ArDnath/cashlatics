"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createAccount,
  updateAccount,
  deleteAccount,
} from "../../_actions/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox
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
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  Wallet,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Account } from "@/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);

interface AccountsClientProps {
  accounts: Account[];
}

export function AccountsClient({ accounts: initial }: AccountsClientProps) {
  const router = useRouter();
  const [accounts, setAccounts] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "CURRENT" as "CURRENT" | "SAVINGS",
    balance: "0",
    isDefault: false,
  });

  function openCreate() {
    setEditing(null);
    setForm({ name: "", type: "CURRENT", balance: "0", isDefault: false });
    setOpen(true);
  }

  function openEdit(acct: Account) {
    setEditing(acct);
    setForm({
      name: acct.name,
      type: acct.type,
      balance: acct.balance,
      isDefault: acct.isDefault,
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        const updated = await updateAccount(editing.id, form);
        setAccounts((prev) =>
          prev.map((a) =>
            a.id === editing.id
              ? { ...a, ...updated }
              : { ...a, isDefault: form.isDefault ? false : a.isDefault },
          ),
        );
        toast.success("Account updated");
      } else {
        const created = await createAccount(form);
        setAccounts((prev) =>
          form.isDefault
            ? prev
                .map((a) => ({ ...a, isDefault: false }))
                .concat(created as Account)
            : [...prev, created as Account],
        );
        toast.success("Account created");
      }
      setOpen(false);
    } catch {
      toast.error("Process failed");
    } finally {
      setLoading(false);
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete account?")) return;
    try {
      await deleteAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      toast.success("Removed");
      router.refresh();
    } catch {
      toast.error("Failed");
    }
  }

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

  return (
    <div className="p-8 space-y-10 bg-[#fafafa] min-h-screen text-stone-700">
      {/* Refined Minimal Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">
            Consolidated Assets
          </p>
          <h2 className="text-3xl font-medium text-stone-900 tracking-tight">
            {fmt(totalBalance)}
          </h2>
        </div>

        <Button
          onClick={openCreate}
          variant="outline"
          className="rounded-none border-stone-300 hover:bg-stone-50 text-stone-700 h-10 px-6 text-[11px] font-bold uppercase tracking-widest transition-all"
        >
          <Plus className="h-3.5 w-3.5 mr-2" /> New Account
        </Button>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {accounts.map((acct, i) => (
            <motion.div
              key={acct.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ borderColor: "#a8a29e" }}
              className="group relative bg-white border border-stone-200 p-6 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="h-8 w-8 flex items-center justify-center bg-stone-50 border border-stone-100 text-stone-400">
                  {acct.type === "SAVINGS" ? (
                    <Wallet className="h-4 w-4" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(acct)}
                    className="text-stone-300 hover:text-stone-900 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(acct.id)}
                    className="text-stone-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900">
                    {acct.name}
                  </h3>
                  {acct.isDefault && (
                    <ShieldCheck className="h-3.5 w-3.5 text-stone-400" />
                  )}
                </div>
                <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
                  {acct.type} Account
                </p>
                <p className="text-xl font-medium text-stone-900 pt-2">
                  {fmt(Number(acct.balance))}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-300 group-hover:text-stone-500 transition-colors">
                <span>Details</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dialog with Checkbox for Primary Status */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-none border-stone-200 bg-white sm:max-w-[400px] p-8 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-stone-900">
              {editing ? "Edit Account" : "Add Account"}
            </DialogTitle>
            <p className="text-[11px] text-stone-400 uppercase tracking-widest">
              Vault Configuration
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase text-stone-500">
                Label
              </Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="rounded-none border-stone-200 focus-visible:ring-0 focus-visible:border-stone-900"
                placeholder="Checking, Savings, etc."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-stone-500">
                  Type
                </Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, type: v as "CURRENT" | "SAVINGS" }))
                  }
                >
                  <SelectTrigger className="rounded-none border-stone-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="CURRENT">Current</SelectItem>
                    <SelectItem value="SAVINGS">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-stone-500">
                  Balance
                </Label>
                <Input
                  value={form.balance}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, balance: e.target.value }))
                  }
                  type="number"
                  className="rounded-none border-stone-200"
                />
              </div>
            </div>

            {/* Functional Checkbox instead of Switch */}
            <div className="flex items-center space-x-3 py-2">
              <Checkbox
                id="isDefault"
                checked={form.isDefault}
                onCheckedChange={(checked) =>
                  setForm((p) => ({ ...p, isDefault: !!checked }))
                }
                className="rounded-none border-stone-300 data-[state=checked]:bg-stone-900 data-[state=checked]:border-stone-900"
              />
              <Label
                htmlFor="isDefault"
                className="text-xs font-medium text-stone-600 cursor-pointer"
              >
                Set as primary account
              </Label>
            </div>

            <DialogFooter className="pt-4 border-t border-stone-100">
              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-none bg-stone-900 hover:bg-stone-800 text-white font-bold uppercase text-[11px] tracking-widest h-11"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Account"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
