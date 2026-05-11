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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative bg-white border border-stone-200 p-6 group transition-all duration-200 hover:shadow-lg hover:shadow-stone-200/50"
    >
      {/* Corner Ticks — Refined for Light Theme */}
      <span className="absolute top-0 left-0 h-3 w-[1.5px] bg-stone-300 group-hover:bg-stone-950 transition-colors" />
      <span className="absolute top-0 left-0 h-[1.5px] w-3 bg-stone-300 group-hover:bg-stone-950 transition-colors" />
      <span className="absolute bottom-0 right-0 h-3 w-[1.5px] bg-stone-300 group-hover:bg-stone-950 transition-colors" />
      <span className="absolute bottom-0 right-0 h-[1.5px] w-3 bg-stone-300 group-hover:bg-stone-950 transition-colors" />

      {/* Header row */}
      <div className="flex items-start justify-between mb-6">
        {/* Square icon box - High Contrast */}
        <motion.div
          whileHover={{ rotate: -5, scale: 1.1 }}
          className="h-9 w-9 border border-stone-200 bg-stone-50 flex items-center justify-center group-hover:border-stone-900 group-hover:bg-stone-900 transition-all duration-200"
        >
          <Icon className="h-4 w-4 text-stone-950 group-hover:text-white transition-colors" />
        </motion.div>

        {/* Change badge — Sharper Typography */}
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 border",
              isPositive
                ? "text-emerald-700 border-emerald-100 bg-emerald-50"
                : "text-rose-700 border-rose-100 bg-rose-50",
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Value - Bold Visibility */}
      <motion.p
        layoutId={`value-${title}`}
        className="text-3xl font-black text-stone-950 tracking-tight tabular-nums"
      >
        <span className="text-stone-400 font-medium mr-0.5">{prefix}</span>
        {value}
      </motion.p>

      {/* Title + Animated Separator */}
      <div className="flex items-center gap-3 mt-3">
        <motion.span
          initial={{ width: 12 }}
          whileHover={{ width: 24 }}
          className="h-[2px] bg-stone-950 transition-all duration-300"
        />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 group-hover:text-stone-900 transition-colors">
          {title}
        </p>
      </div>
    </motion.div>
  );
}
