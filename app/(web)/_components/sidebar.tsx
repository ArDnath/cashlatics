"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  PiggyBank,
  Target,
  ChartBar as BarChart3,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/accounts", icon: CreditCard, label: "Accounts" },
  {
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
    label: "Transactions",
  },
  { href: "/dashboard/budgets", icon: PiggyBank, label: "Budgets" },
  { href: "/dashboard/goals", icon: Target, label: "Goals" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/ai-insights", icon: Sparkles, label: "AI Insights" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Reusable Navigation Content
  const NavContent = () => (
    <>
      <div className="h-px w-full bg-linear-to-r from-stone-200 via-stone-300 to-transparent" />

      {/* Logo */}
      <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 group"
          onClick={() => setIsOpen(false)}
        >
          <Image src="/wallet.png" alt="logo" width={30} height={30} />
          <div className="flex flex-col leading-none">
            <span className="text-stone-900 text-lg font-black tracking-tight uppercase">
              Cashlatics
            </span>
          </div>
        </Link>
        {/* Mobile Close Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-1 text-stone-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Section label */}
      <div className="px-5 pt-5 pb-2">
        <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-stone-600">
          Navigation
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-px overflow-y-auto pb-2">
        {navItems.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium tracking-wide transition-all duration-150 group rounded-md",
                  isActive
                    ? "text-stone-900 bg-stone-100 border border-stone-300"
                    : "text-stone-700 hover:text-stone-900 hover:bg-stone-100 border border-transparent",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-stone-700"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <div
                  className={cn(
                    "h-6 w-6 flex items-center justify-center shrink-0 border transition-colors duration-150",
                    isActive
                      ? "border-stone-400 bg-stone-200"
                      : "border-stone-300 bg-stone-50 group-hover:border-stone-400 group-hover:bg-stone-100",
                  )}
                >
                  <item.icon className="h-3 w-3 text-stone-700" />
                </div>

                <span className="tracking-[0.04em]">{item.label}</span>

                {item.label === "AI Insights" && (
                  <span className="ml-auto text-[9px] px-1.5 py-0.5 bg-stone-200 border border-stone-300 text-stone-700 tracking-widest uppercase font-semibold">
                    AI
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="px-5 flex items-center gap-2 py-2">
        <div className="flex-1 h-px bg-stone-200" />
        <div className="h-1 w-1 bg-stone-300 rotate-45" />
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      <div className="h-px w-full bg-linear-to-r from-transparent via-stone-300 to-stone-200" />
    </>
  );

  return (
    <>
      {/* MOBILE TRIGGER: Only visible on small screens */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-stone-50 border border-stone-200 shadow-sm rounded-md text-stone-700"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* MOBILE OVERLAY & DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-64 bg-stone-50 flex flex-col z-50 border-r border-stone-200 lg:hidden shadow-xl"
            >
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR: Hidden on small screens */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-56 bg-stone-50 flex-col z-40 border-r border-stone-200">
        <NavContent />
      </aside>
    </>
  );
}
