"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FAQ {
  id: string;
  question: string;
  answer: string;
  tag: string;
}

interface FaqItemProps {
  faq: FAQ;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const faqs: FAQ[] = [
  {
    id: "Q.01",
    question: "How does the AI guide my financial decisions?",
    answer:
      "Our AI learns your spending patterns, income variability, and financial goals. It then provides personalized recommendations for budgeting, savings, and investment optimization. Unlike static tools, your AI guide adapts as your situation changes.",
    tag: "AI Guide",
  },
  {
    id: "Q.02",
    question: "Is my financial data secure and private?",
    answer:
      "Absolutely. We use bank-level 256-bit AES encryption and never sell your data. We connect via Plaid, meaning we never see or store your login credentials — only tokenised read-only access. Your privacy is guaranteed.",
    tag: "Security",
  },
  {
    id: "Q.03",
    question: "Can the AI track crypto and stocks?",
    answer:
      "Yes. Our AI guide supports over 10,000 financial institutions, including major stock brokers and crypto exchanges like Coinbase and Binance. All assets are unified into a single AI-powered net-worth view with personalized insights.",
    tag: "Assets",
  },
  {
    id: "Q.04",
    question: "How is the AI guide helping me save money?",
    answer:
      "The AI identifies spending inefficiencies, forgotten subscriptions, and tax-saving opportunities automatically. It alerts you before overspending and suggests smarter allocation strategies based on your financial goals.",
    tag: "Savings",
  },
  {
    id: "Q.05",
    question: "Is there a free version with AI features?",
    answer:
      "The Starter plan is completely free and includes basic AI-guided insights. Upgrade anytime for advanced AI forecasting, multi-currency support, family sharing, and premium guidance features.",
    tag: "Pricing",
  },
];

// ── FaqItem ───────────────────────────────────────────────────────────────────

const FaqItem: React.FC<FaqItemProps> = ({ faq, index, isOpen, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.07,
      }}
      className={`group relative bg-white border overflow-hidden transition-colors duration-200 ${
        isOpen ? "border-stone-800" : "border-stone-200 hover:border-stone-400"
      }`}
    >
      {/* Top sweep line */}
      <motion.div
        className="absolute top-0 left-0 h-px bg-stone-800"
        animate={{ width: isOpen ? "100%" : "0%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Trigger */}
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-5 px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        {/* ID tag */}
        <span
          className={`font-mono text-[8px] font-bold tracking-[0.25em] pt-0.5 shrink-0 transition-colors duration-200 ${
            isOpen ? "text-stone-800" : "text-stone-300"
          }`}
        >
          {faq.id}
        </span>

        {/* Question */}
        <span
          className={`flex-1 text-sm font-bold tracking-tight leading-snug transition-colors duration-200 ${
            isOpen
              ? "text-stone-900"
              : "text-stone-600 group-hover:text-stone-800"
          }`}
        >
          {faq.question}
        </span>

        {/* Tag pill */}
        <span
          className={`font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 border shrink-0 transition-all duration-200 ${
            isOpen
              ? "border-stone-800 text-stone-800"
              : "border-stone-200 text-stone-300"
          }`}
        >
          {faq.tag}
        </span>

        {/* Toggle icon */}
        <div
          className={`w-5 h-5 flex items-center justify-center shrink-0 border transition-all duration-300 ${
            isOpen
              ? "border-stone-800 bg-stone-900"
              : "border-stone-200 bg-transparent"
          }`}
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`block w-2.5 h-px ${isOpen ? "bg-white" : "bg-stone-400"}`}
            style={{ position: "relative" }}
          >
            <motion.span
              animate={{ rotate: isOpen ? 0 : 90, opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 w-2.5 h-px bg-stone-400 block"
              style={{ transformOrigin: "center" }}
            />
          </motion.span>
        </div>
      </button>

      {/* Answer panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-[52px]">
              <div className="flex gap-4">
                <div className="w-px bg-stone-200 self-stretch shrink-0" />
                <p className="text-[13px] text-stone-500 leading-relaxed font-mono">
                  {faq.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Section ───────────────────────────────────────────────────────────────────

const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>("Q.01");

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section id="faq" className="py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-3xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <motion.span
              className="w-1.5 h-1.5 bg-stone-800 inline-block"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="font-mono text-[9px] font-bold tracking-[0.3em] text-stone-400 uppercase">
              AI Guidance
            </span>
            <span className="h-px w-6 bg-stone-300" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight leading-tight">
              Frequently asked
              <br />
              <span className="text-stone-400">about AI guidance.</span>
            </h2>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-mono text-[11px] text-stone-400 leading-relaxed max-w-[200px]"
            >
              Can&apos;t find an answer?{" "}
              <span className="text-stone-700 underline underline-offset-2 cursor-pointer">
                Reach out →
              </span>
            </motion.p>
          </motion.div>
        </div>

        {/* ── Items ── */}
        <div className="flex flex-col gap-px bg-stone-200">
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              index={i}
              isOpen={openId === faq.id}
              onToggle={() => toggle(faq.id)}
            />
          ))}
        </div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 flex items-center justify-between"
        >
          <p className="font-mono text-[9px] tracking-[0.22em] text-stone-300 uppercase">
            {faqs.length} questions · updated Mar 2024
          </p>
          <div className="flex items-center gap-2">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <span className="font-mono text-[9px] tracking-wider text-stone-400 uppercase">
              AI support available
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
