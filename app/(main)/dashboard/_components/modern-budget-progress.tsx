"use client";

import { useState } from "react";
import { Pencil, Check, X, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateBudget } from "@/app/(main)/_actions/budget"; // Assuming this is your Server Action
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSessionState } from "@/hooks/useSessionState";

// --- Types ---
interface Budget {
  amount: number;
}

interface ModernBudgetProgressProps {
  initialBudget: Budget | null | undefined;
  currentExpenses: number;
}

export function ModernBudgetProgress({
  initialBudget,
  currentExpenses,
}: ModernBudgetProgressProps) {
  // Using your custom hook
  const { isAuthenticated, loading: sessionLoading } = useSessionState();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [newBudget, setNewBudget] = useState<string>(
    initialBudget?.amount?.toString() || "",
  );

  const budgetAmount = initialBudget?.amount || 0;
  const percentUsed =
    budgetAmount > 0 ? (currentExpenses / budgetAmount) * 100 : 0;

  const handleUpdateBudget = async (): Promise<void> => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to update your budget");
      return;
    }

    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsUpdating(true);
      const result = await updateBudget(amount);

      if (result.success) {
        setIsEditing(false);
        toast.success("Budget updated successfully");
      } else {
        toast.error(result.error || "Failed to update budget");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = (): void => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  // Helper for status styling
  const getStatusColors = () => {
    if (percentUsed >= 90) return { bar: "bg-red-500", text: "text-red-500" };
    if (percentUsed >= 75)
      return { bar: "bg-yellow-500", text: "text-yellow-500" };
    return { bar: "bg-green-500", text: "text-green-500" };
  };

  const { bar: progressColor, text: textColor } = getStatusColors();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-sm border border-slate-100 dark:border-neutral-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Monthly Budget
          </h3>
          <p className="text-sm text-slate-500 dark:text-neutral-400">
            Track your spending against your monthly limit
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={newBudget}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewBudget(e.target.value)
                }
                disabled={isUpdating}
                className="w-32 h-9 bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUpdateBudget}
                disabled={isUpdating}
                className="h-9 w-9 text-green-500 hover:text-green-600"
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                disabled={isUpdating}
                className="h-9 w-9 text-red-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              disabled={isUpdating}
              className="h-9 w-9 text-slate-400 hover:text-blue-500"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-6 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-4">
        <div
          className={`absolute top-0 left-0 h-full ${progressColor} transition-all duration-1000 ease-out rounded-full`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div className="flex flex-col">
          <span className="text-slate-500 text-xs uppercase font-semibold">
            Spent
          </span>
          <span className={`font-bold text-lg ${textColor}`}>
            ₹
            {currentExpenses.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-500 text-xs uppercase font-semibold">
            Remaining
          </span>
          <span className="font-bold text-lg text-slate-700 dark:text-neutral-300">
            ₹
            {(budgetAmount - currentExpenses).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {percentUsed >= 80 && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <p className="text-xs text-red-600 dark:text-red-400 font-medium">
            Warning: {percentUsed.toFixed(0)}% budget exhausted.
          </p>
        </div>
      )}
    </div>
  );
}
