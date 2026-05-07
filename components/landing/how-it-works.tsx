"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Link as LinkIcon,
  Target,
  Smartphone,
  Menu,
  Plus,
} from "lucide-react";
import TimelineItem from "@/components/landing/timeline-update"; // Adjust path as needed

const HowItWorksSection: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="relative py-24 px-4 sm:px-6 lg:px-8  overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-200/50 dark:bg-stone-800/50 border border-stone-300/50 dark:border-stone-700/50 text-stone-600 dark:text-stone-300 text-xs font-semibold uppercase tracking-widest mb-8"
            >
              <Zap size={14} className="text-orange-500" fill="currentColor" />
              The Experience
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-stone-900 dark:text-stone-50 tracking-tight leading-[1.1]">
              Crafting clarity <br />
              <span className="text-stone-400">from complexity.</span>
            </h2>

            <div className="mt-12">
              <TimelineItem
                step="01"
                title="Connect Assets"
                desc="Securely link your accounts with 256-bit encryption. It takes less than 30 seconds."
                icon={LinkIcon}
              />
              <TimelineItem
                step="02"
                title="Define Your North Star"
                desc="Specify your milestones. Whether it's a coastal home or early retirement, we track the 'why'."
                icon={Target}
              />
              <TimelineItem
                step="03"
                title="Live Optimization"
                desc="Our engine scans for inefficiencies daily, pushing smart alerts to your devices."
                icon={Smartphone}
                isLast={true}
              />
            </div>
          </div>

          {/* Right Visuals (Modern Geometry Mockup) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative flex items-center justify-center"
          >
            {/* Background Geometric Cards */}
            <div className="absolute top-20 -left-10 w-64 h-64 bg-white dark:bg-stone-800 rounded-3xl shadow-xl -rotate-6 border border-stone-200 dark:border-stone-700 opacity-50 hidden md:block" />
            <div className="absolute bottom-10 -right-5 w-72 h-48 bg-orange-500/10 rounded-3xl backdrop-blur-xl border border-orange-500/20 rotate-12 hidden md:block" />

            {/* Main Phone Mockup */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[320px] h-[640px] bg-stone-950 rounded-[3.5rem] border-[12px] border-stone-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Dynamic Island */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-stone-900 rounded-b-3xl z-30"></div>

              {/* UI Content */}
              <div className="w-full h-full bg-stone-50 dark:bg-stone-950 p-6 pt-12">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-10 h-10 rounded-xl bg-stone-200 dark:bg-stone-800 flex items-center justify-center">
                    <Menu size={18} className="text-stone-600" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-orange-400 to-rose-400" />
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-4xl bg-stone-900 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl" />
                    <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">
                      Portfolio
                    </p>
                    <p className="text-3xl font-bold mt-1">₹84,250</p>
                    <div className="mt-4 flex gap-2">
                      <div className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] rounded-lg">
                        +12.5%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center mb-2">
                        <Plus size={14} className="text-orange-600" />
                      </div>
                      <div className="w-12 h-2 bg-stone-200 dark:bg-stone-800 rounded" />
                    </div>
                    <div className="h-24 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-2">
                        <Target size={14} className="text-stone-500" />
                      </div>
                      <div className="w-12 h-2 bg-stone-200 dark:bg-stone-800 rounded" />
                    </div>
                  </div>

                  {/* Activity Skeleton */}
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800"
                    >
                      <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800" />
                      <div className="space-y-2 flex-1">
                        <div className="w-2/3 h-2 bg-stone-200 dark:bg-stone-800 rounded" />
                        <div className="w-1/3 h-2 bg-stone-100 dark:bg-stone-800 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
