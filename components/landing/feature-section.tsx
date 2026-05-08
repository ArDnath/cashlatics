"use client";

import React, { useState } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { PieChart, Zap, TrendingUp, Shield, Users, Globe } from "lucide-react";

// Types
type Feature = {
  id: string;
  icon: React.ComponentType<
    React.SVGProps<SVGSVGElement> & { size?: number | string }
  >;
  title: string;
  desc: string;
  stat: string;
  statLabel: string;
};

const features: Feature[] = [
  {
    id: "F.01",
    icon: PieChart,
    title: "AI-Powered Budgeting",
    desc: "Set smart budgets for your lifestyle. AI learns your patterns and alerts you before overspending.",
    stat: "94%",
    statLabel: "accuracy",
  },
  {
    id: "F.02",
    icon: Zap,
    title: "Real-Time Sync",
    desc: "Connect securely. Transactions auto-categorized by AI in milliseconds.",
    stat: "48ms",
    statLabel: "sync latency",
  },
  {
    id: "F.03",
    icon: TrendingUp,
    title: "Wealth Tracking",
    desc: "Monitor your net worth across all assets. Watch AI-driven insights grow your wealth.",
    stat: "+12.4%",
    statLabel: "avg. gain",
  },
  {
    id: "F.04",
    icon: Shield,
    title: "Enterprise Security",
    desc: "Your data is encrypted with bank-grade protocols. We never sell your personal information.",
    stat: "256-bit",
    statLabel: "encryption",
  },
  {
    id: "F.05",
    icon: Users,
    title: "Family Finances",
    desc: "Sync with family. Share goals and let AI guide collective wealth building.",
    stat: "∞",
    statLabel: "shared goals",
  },
  {
    id: "F.06",
    icon: Globe,
    title: "Global Support",
    desc: "Invest worldwide. AI handles multi-currency tracking seamlessly.",
    stat: "120+",
    statLabel: "currencies",
  },
];

const sparks: Record<string, number[]> = {
  "F.01": [30, 50, 40, 94],
  "F.02": [20, 35, 28, 48],
  "F.03": [50, 45, 70, 75],
  "F.04": [100, 100, 100, 100],
  "F.05": [10, 30, 50, 72],
  "F.06": [60, 75, 85, 95],
};

const MiniSparkline = ({
  id,
  isHovered,
}: {
  id: string;
  isHovered: boolean;
}) => {
  const pts = sparks[id] || [10, 20, 10, 20];
  const w = 60;
  const h = 20;
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const range = max - min || 1;
  const points = pts.map((v, i) => ({
    x: (i / (pts.length - 1)) * w,
    y: h - ((v - min) / range) * h,
  }));

  const pathData = `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`;

  return (
    <div className="overflow-hidden">
      <svg width={w} height={h} className="overflow-visible">
        <motion.path
          d={pathData}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: isHovered ? 1 : 0.4,
            opacity: isHovered ? 1 : 0.3,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-stone-600"
        />
      </svg>
    </div>
  );
};

const FeatureCard = ({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Magnetic effect for the icon
  const iconX = useSpring(useTransform(mouseX, [-100, 100], [-5, 5]), {
    stiffness: 200,
    damping: 20,
  });
  const iconY = useSpring(useTransform(mouseY, [-100, 100], [-5, 5]), {
    stiffness: 200,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      className="group relative border border-stone-200 bg-white p-8 overflow-hidden cursor-crosshair h-full flex flex-col justify-between"
    >
      {/* Scanline Hover Effect */}
      <motion.div
        className="absolute inset-0 bg-stone-100 z-0 pointer-events-none"
        initial={{ y: "-100%" }}
        whileHover={{ y: "100%" }}
        transition={{ duration: 0.4, ease: "linear" }}
        style={{ opacity: 0.4 }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-12">
          {/* Magnetic Icon Container */}
          <motion.div
            style={{ x: iconX, y: iconY }}
            className="relative w-12 h-12 border border-stone-200 flex items-center justify-center bg-white group-hover:border-stone-900 transition-colors duration-500"
          >
            <feature.icon
              size={18}
              className="text-stone-500 group-hover:text-stone-900 transition-colors"
            />

            {/* Geometric Corners */}
            <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-stone-900 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1" />
            <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-stone-900 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
          </motion.div>
          <span className="font-mono text-[10px] text-stone-300 group-hover:text-stone-500 transition-colors">
            {feature.id}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-bold text-stone-900 mb-2 uppercase tracking-wider">
            {feature.title}
          </h3>
          <p className="text-stone-500 text-sm leading-relaxed max-w-[240px]">
            {feature.desc}
          </p>
        </div>

        <div className="mt-12 flex items-end justify-between border-t border-stone-100 pt-4">
          <div>
            <motion.div
              animate={{ y: isHovered ? -2 : 0 }}
              className="font-mono text-xl font-bold text-stone-800"
            >
              {feature.stat}
            </motion.div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-stone-400">
              {feature.statLabel}
            </div>
          </div>
          <div className="pb-1">
            <MiniSparkline id={feature.id} isHovered={isHovered} />
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default function FeaturesSection() {
  return (
    <section id="feature-section" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex items-center gap-2 text-stone-400 font-mono text-[10px] tracking-[0.3em] uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-stone-800" />
            AI-Powered Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-stone-900 tracking-tighter"
          >
            Precision engineering <br />
            <span className="text-stone-400">for your wealth.</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-200 border border-stone-200">
          {features.map((f, i) => (
            <FeatureCard key={f.id} feature={f} index={i} />
          ))}
        </div>

        {/* Global Footer Status */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-stone-300" />
            <span className="font-mono text-[9px] text-stone-400 tracking-[0.2em] uppercase">
              AI Engine: Ready for deployment
            </span>
          </div>
          <div className="text-stone-300 font-mono text-[9px]">0x42_AI_01</div>
        </motion.div>
      </div>
    </section>
  );
}
