"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  prefix?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  prefix = "",
  delay = 0,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay, ease: "easeOut" }}
      className="relative  border border-stone-800 p-5 group hover:border-stone-700 transition-colors duration-150"
    >
      {/* Corner ticks — top-left */}
      <span className="absolute top-0 left-0 h-2.5 w-px  group-hover:bg-stone-500 transition-colors" />
      <span className="absolute top-0 left-0 h-px w-2.5  group-hover:bg-stone-500 transition-colors" />
      {/* Corner ticks — bottom-right */}
      <span className="absolute bottom-0 right-0 h-2.5 w-px group-hover:bg-stone-500 transition-colors" />
      <span className="absolute bottom-0 right-0 h-px w-2.5  group-hover:bg-stone-500 transition-colors" />

      {/* Header row */}
      <div className="flex items-start justify-between mb-5">
        {/* Square icon box */}
        <div className="h-7 w-7 border border-stone-800 bg-stone-800/10 flex items-center justify-center group-hover:border-stone-600 transition-colors">
          <Icon className="h-3.5 w-3.5 text-stone-800" />
        </div>

        {/* Change badge — square, no pill */}
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] px-2 py-1 border",
              isPositive
                ? "text-emerald-400 border-emerald-900 bg-emerald-950/60"
                : "text-red-400 border-red-900 bg-red-950/60",
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-2.5 w-2.5" />
            ) : (
              <TrendingDown className="h-2.5 w-2.5" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Value */}
      <p className="text-2xl font-semibold text-stone-100 tracking-tight tabular-nums">
        {prefix}
        {value}
      </p>

      {/* Title + geometric separator */}
      <div className="flex items-center gap-2 mt-2">
        <span className="h-px w-3 bg-stone-700" />
        <p className="text-[10px] uppercase tracking-[0.14em] text-stone-500">
          {title}
        </p>
      </div>
    </motion.div>
  );
}
