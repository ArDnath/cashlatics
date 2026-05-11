"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createGoal, updateGoal, deleteGoal } from "../../_actions/goals";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Target,
  Plus,
  Trash2,
  Pencil,
  CircleCheck as CheckCircle2,
  Clock,
  Loader,
  Trophy,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";
import type { Goal } from "@/types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(n);

interface GoalsClientProps {
  goals: Goal[];
}

/* ── Corner ticks ───────────────────────────────── */
function Ticks({ bright = false }: { bright?: boolean }) {
  const c = bright ? "bg-stone-400" : "bg-stone-300";
  return (
    <>
      <span className={`absolute top-0 left-0 h-3 w-px ${c}`} />
      <span className={`absolute top-0 left-0 h-px w-3 ${c}`} />
      <span className={`absolute bottom-0 right-0 h-3 w-px ${c}`} />
      <span className={`absolute bottom-0 right-0 h-px w-3 ${c}`} />
    </>
  );
}

/* ── Geo progress bar ───────────────────────────── */
function GeoProgress({
  value,
  completed = false,
}: {
  value: number;
  completed?: boolean;
}) {
  return (
    <div className="relative h-[3px] w-full bg-stone-100">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={cn(
          "absolute top-0 left-0 h-full",
          completed ? "bg-stone-400" : "bg-stone-800",
        )}
      />
      <motion.div
        initial={{ left: "0%" }}
        animate={{ left: `${Math.min(value, 100)}%` }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-px bg-stone-300"
      />
    </div>
  );
}

/* ── Geo button ─────────────────────────────────── */
function GeoButton({
  onClick,
  type = "button",
  disabled,
  variant = "primary",
  children,
  className,
}: {
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
  children: React.ReactNode;
  className?: string;
}) {
  const variants = {
    primary: "bg-stone-900 text-white hover:bg-stone-800",
    ghost:
      "border border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-400",
    danger:
      "border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300",
  };
  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] px-4 py-2 transition-all duration-150 disabled:opacity-40",
        variants[variant],
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

/* ── Field ──────────────────────────────────────── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] uppercase tracking-[0.14em] font-semibold text-stone-400">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-white border border-stone-200 text-stone-900 text-[13px] px-3 py-2.5 rounded-none placeholder:text-stone-300 focus:outline-none focus:border-stone-800 transition-colors";

/* ── Section heading ────────────────────────────── */
function SectionHead({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex flex-col gap-[3px]">
        <div className="h-px w-4 bg-stone-200" />
        <div className="h-px w-2.5 bg-stone-300" />
      </div>
      <h2 className="text-[12px] font-semibold text-stone-500 uppercase tracking-[0.12em]">
        {title}
        {count !== undefined && (
          <span className="ml-2 text-stone-300">({count})</span>
        )}
      </h2>
    </div>
  );
}

export function GoalsClient({ goals: initial }: GoalsClientProps) {
  const router = useRouter();
  const [goals, setGoals] = useState(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "0",
    targetDate: "",
  });

  function openCreate() {
    setEditing(null);
    setForm({
      title: "",
      targetAmount: "",
      currentAmount: "0",
      targetDate: "",
    });
    setOpen(true);
  }
  function openEdit(goal: Goal) {
    setEditing(goal);
    setForm({
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate
        ? format(new Date(goal.targetDate), "yyyy-MM-dd")
        : "",
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        const updated = await updateGoal(editing.id, form);
        setGoals((prev) =>
          prev.map((g) =>
            g.id === editing.id ? ({ ...g, ...updated } as Goal) : g,
          ),
        );
        toast.success("Goal updated");
      } else {
        const created = await createGoal(form);
        setGoals((prev) => [created as Goal, ...prev]);
        toast.success("Goal created");
      }
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this goal?")) return;
    setDeletingId(id);
    try {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
      toast.success("Goal deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleComplete(goal: Goal) {
    try {
      const updated = await updateGoal(goal.id, { completed: !goal.completed });
      setGoals((prev) =>
        prev.map((g) =>
          g.id === goal.id ? ({ ...g, ...updated } as Goal) : g,
        ),
      );
      toast.success(goal.completed ? "Goal reopened" : "Goal completed!");
      router.refresh();
    } catch {
      toast.error("Failed to update");
    }
  }

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);
  const totalTarget = goals.reduce((s, g) => s + Number(g.targetAmount), 0);
  const totalSaved = goals.reduce((s, g) => s + Number(g.currentAmount), 0);
  const overallPct =
    totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  return (
    <div className="p-6 space-y-6 bg-white text-stone-900">
      {/* ── Summary banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative border border-stone-200 p-5"
      >
        <Ticks />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-5">
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                label: "Active Goals",
                value: String(activeGoals.length),
                icon: Target,
              },
              { label: "Total Saved", value: fmt(totalSaved), icon: Trophy },
              { label: "Total Target", value: fmt(totalTarget), icon: Flag },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="h-4 w-4 border border-stone-200 flex items-center justify-center">
                    <Icon className="h-2.5 w-2.5 text-stone-400" />
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.16em] text-stone-400 font-semibold">
                    {label}
                  </span>
                </div>
                <p className="text-xl font-semibold text-stone-900 tabular-nums tracking-tight">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <GeoButton
            onClick={openCreate}
            variant="primary"
            className="shrink-0 self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" /> New Goal
          </GeoButton>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.12em] text-stone-400">
              Overall Progress
            </span>
            <span className="text-[10px] text-stone-500 tabular-nums">
              {overallPct.toFixed(0)}%
            </span>
          </div>
          <GeoProgress value={overallPct} />
        </div>
      </motion.div>

      {/* ── Empty state ── */}
      {goals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative border border-stone-200 border-dashed p-20 flex flex-col items-center gap-4"
        >
          <Ticks />
          <div className="h-12 w-12 border border-stone-100 flex items-center justify-center">
            <Target className="h-5 w-5 text-stone-200" />
          </div>
          <div className="text-center">
            <p className="text-[13px] uppercase tracking-[0.1em] font-medium text-stone-400">
              No Goals Yet
            </p>
            <p className="text-[11px] text-stone-300 mt-1 tracking-[0.04em]">
              Set savings goals to track your financial progress
            </p>
          </div>
          <GeoButton onClick={openCreate} variant="ghost">
            <Plus className="h-3.5 w-3.5" /> Create your first goal
          </GeoButton>
        </motion.div>
      )}

      {/* ── Active goals ── */}
      {activeGoals.length > 0 && (
        <div>
          <SectionHead title="Active" count={activeGoals.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {activeGoals.map((goal, i) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  index={i}
                  deleting={deletingId === goal.id}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggleComplete}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── Completed goals ── */}
      {completedGoals.length > 0 && (
        <div>
          <SectionHead title="Completed" count={completedGoals.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {completedGoals.map((goal, i) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  index={i}
                  deleting={deletingId === goal.id}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggleComplete}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── Dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white border border-stone-200 rounded-none p-0 gap-0 max-w-md shadow-xl [&>button]:hidden">
          <div className="relative border-b border-stone-100 px-6 py-4">
            <Ticks bright />
            <DialogTitle className="text-[12px] font-semibold uppercase tracking-[0.14em] text-stone-900">
              {editing ? "Edit Goal" : "New Goal"}
            </DialogTitle>
            <p className="text-[10px] text-stone-400 mt-0.5 tracking-[0.06em]">
              {editing
                ? `Editing "${editing.title}"`
                : "Define your savings target"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <Field label="Goal Title">
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g. Emergency Fund"
                required
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Target Amount">
                <input
                  value={form.targetAmount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, targetAmount: e.target.value }))
                  }
                  placeholder="10000"
                  type="number"
                  min="1"
                  required
                  className={inputCls}
                />
              </Field>
              <Field label="Current Savings">
                <input
                  value={form.currentAmount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, currentAmount: e.target.value }))
                  }
                  placeholder="0"
                  type="number"
                  min="0"
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Target Date (optional)">
              <input
                value={form.targetDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, targetDate: e.target.value }))
                }
                type="date"
                className={cn(inputCls, "text-stone-500")}
              />
            </Field>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-stone-100 mt-5">
              <GeoButton
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </GeoButton>
              <GeoButton type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <Loader className="h-3.5 w-3.5 animate-spin" />
                ) : editing ? (
                  "Update"
                ) : (
                  "Create Goal"
                )}
              </GeoButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ── Goal card ──────────────────────────────────── */
function GoalCard({ goal, index, deleting, onEdit, onDelete, onToggle }: any) {
  const pct = Math.min(
    (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100,
    100,
  );
  const remaining = Number(goal.targetAmount) - Number(goal.currentAmount);
  const daysLeft = goal.targetDate
    ? differenceInDays(new Date(goal.targetDate), new Date())
    : null;

  const dateLabel =
    daysLeft === null
      ? null
      : daysLeft > 0
        ? `${daysLeft}d left`
        : daysLeft === 0
          ? "Due today"
          : goal.completed
            ? "Completed"
            : "Overdue";
  const dateColor =
    daysLeft === null || goal.completed
      ? "text-stone-300"
      : daysLeft <= 7
        ? "text-red-500"
        : daysLeft <= 30
          ? "text-amber-500"
          : "text-stone-400";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{
        opacity: deleting ? 0.4 : goal.completed ? 0.6 : 1,
        y: 0,
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className="relative border border-stone-200 p-5 group hover:border-stone-400 transition-colors duration-150"
    >
      <Ticks />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "h-7 w-7 border flex items-center justify-center shrink-0",
              goal.completed
                ? "border-stone-100 bg-stone-50"
                : "border-stone-200 bg-white",
            )}
          >
            {goal.completed ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-stone-300" />
            ) : (
              <Target className="h-3.5 w-3.5 text-stone-500" />
            )}
          </div>
          {dateLabel && (
            <div
              className={cn(
                "flex items-center gap-1 text-[10px] uppercase tracking-[0.1em] font-medium",
                dateColor,
              )}
            >
              <Clock className="h-2.5 w-2.5" />
              {dateLabel}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200">
          <button
            onClick={() => onEdit(goal)}
            className="h-6 w-6 border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-900 hover:border-stone-400 transition-colors"
          >
            <Pencil className="h-2.5 w-2.5" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            disabled={deleting}
            className="h-6 w-6 border border-stone-200 flex items-center justify-center text-stone-400 hover:text-red-500 hover:border-red-200 transition-colors"
          >
            {deleting ? (
              <Loader className="h-2.5 w-2.5 animate-spin" />
            ) : (
              <Trash2 className="h-2.5 w-2.5" />
            )}
          </button>
        </div>
      </div>

      <p className="text-[13px] font-semibold text-stone-900 tracking-[0.02em] mb-1 truncate">
        {goal.title}
      </p>

      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[11px] text-stone-400 tabular-nums">
          {fmt(Number(goal.currentAmount))}{" "}
          <span className="text-stone-200 mx-1">/</span>{" "}
          {fmt(Number(goal.targetAmount))}
        </span>
        <span className="text-[11px] font-semibold text-stone-800 tabular-nums">
          {pct.toFixed(0)}%
        </span>
      </div>

      <GeoProgress value={pct} completed={goal.completed} />

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 bg-stone-200 rotate-45" />
          <span className="text-[9px] uppercase tracking-[0.14em] text-stone-400">
            {goal.completed
              ? "Done"
              : remaining > 0
                ? `${fmt(remaining)} to go`
                : "Target reached"}
          </span>
        </div>
        <button
          onClick={() => onToggle(goal)}
          className={cn(
            "text-[9px] uppercase tracking-[0.12em] font-semibold px-2.5 py-1 border transition-colors",
            goal.completed
              ? "border-stone-100 text-stone-300 hover:border-stone-300 hover:text-stone-600"
              : "border-stone-200 text-stone-500 hover:border-stone-800 hover:text-stone-900",
          )}
        >
          {goal.completed ? "Reopen" : "Mark done"}
        </button>
      </div>
    </motion.div>
  );
}
