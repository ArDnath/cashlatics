"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface StatItemProps {
  stat: Stat;
  inView: boolean;
}

// ── Animated Counter Hook ─────────────────────────────────────────────────────

const useCounter = (
  target: number,
  duration: number = 1200,
  inView: boolean,
) => {
  const [val, setVal] = useState(0);
  const ran = useRef(false);

  useEffect(() => {
    if (!inView || ran.current) return;
    ran.current = true;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return val;
};

// ── Components ────────────────────────────────────────────────────────────────

const StatItem: React.FC<StatItemProps> = ({ stat, inView }) => {
  const count = useCounter(stat.value, 1100, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-1 border-l border-stone-200 pl-4 py-1"
    >
      <span className="font-mono text-xl font-bold text-stone-900 tabular-nums">
        {count.toLocaleString()}
        {stat.suffix}
      </span>
      <span className="font-mono text-[8px] tracking-[0.2em] text-stone-400 uppercase">
        {stat.label}
      </span>
    </motion.div>
  );
};

const CtaSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);

  const stats: Stat[] = [
    { value: 4200, suffix: "+", label: "AI Users" },
    { value: 98, suffix: "%", label: "Uptime SLA" },
    { value: 14, suffix: "d", label: "Free Trial" },
  ];

  return (
    <section className="py-32 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-stone-200 border border-stone-200 shadow-sm">
          {/* ── Left Column: Main Content ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8 bg-white p-8 md:p-16 relative overflow-hidden"
          >
            {/* Geometric Accent */}
            <div className="absolute top-0 left-0 w-32 h-32 border-r border-b border-stone-100 pointer-events-none" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-4 mb-10"
              >
                <span className="font-mono text-[10px] font-bold tracking-[0.4em] text-stone-400 uppercase">
                  Ready to Begin
                </span>
                <motion.div
                  className="h-px flex-1 bg-stone-100"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{ originX: 0 }}
                />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold text-stone-900 tracking-tighter leading-none mb-8"
              >
                AI-Guided
                <br />
                <span className="text-stone-300">Financial Freedom.</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-mono text-sm text-stone-500 leading-relaxed max-w-md mb-12"
              >
                Stop managing money manually. Let your AI guide automate
                budgeting, track wealth across all accounts, and guide you
                toward your financial goals. Personal finance, engineered for
                you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="bg-stone-900 text-stone-50 px-8 py-4 font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-3 transition-colors hover:bg-stone-800"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Your AI Journey
                  <motion.span
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Right Column: Technical Stats ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-4 bg-stone-50/50 flex flex-col"
          >
            {/* Stat Blocks */}
            <div className="flex-1 grid grid-rows-3">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="bg-white border-b border-stone-200 p-8 flex items-center transition-colors hover:bg-stone-50"
                >
                  <StatItem stat={s} inView={inView} />
                </div>
              ))}
            </div>

            {/* Terminal Style Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-8 bg-stone-900"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[9px] text-stone-400 tracking-widest uppercase font-bold">
                  AI Engine: Active
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  "AI_GUIDANCE_ENABLED",
                  "SECURITY_VERIFIED",
                  "UPTIME_99.9",
                ].map((spec) => (
                  <motion.div
                    key={spec}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="font-mono text-[8px] text-stone-600 flex justify-between"
                  >
                    <span>{spec}</span>
                    <span className="text-emerald-900/50">[OK]</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Outer Metadata ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-stone-100 pt-8"
        >
          <div className="flex gap-6">
            <span className="font-mono text-[9px] text-stone-400 tracking-widest uppercase">
              Free Starter
            </span>
            <span className="font-mono text-[9px] text-stone-400 tracking-widest uppercase">
              No Card Required
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
                  className="w-6 h-6 rounded-full border-2 border-stone-50 bg-linear-to-br from-blue-300 to-green-400"
                />
              ))}
            </div>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="font-mono text-[12px] text-green-800 uppercase tracking-tight"
            >
              +4k AI-guided users
            </motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
