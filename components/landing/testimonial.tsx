"use client";

import React, { useState, useEffect, useRef, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"; // Ensure you import the Next.js Image component

// ── Types ────────────────────────────────────────────────────────────────────

interface Testimonial {
  id: string;
  initials: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  quote: string;
  image: string; // Added image field
}

interface StarsProps {
  rating: number;
  active: boolean;
}

// ── Data: Cashlatics Context ─────────────────────────────────────────────────

const testimonials: Testimonial[] = [
  {
    id: "T.01",
    initials: "AS",
    author: "Alex Sterling",
    role: "Full-stack Developer",
    rating: 5.0,
    date: "12 Apr, 2026",
    quote:
      "The AI advisor caught a forgotten subscription I'd been paying for months. It's like having an intelligent CFO in my pocket that actually understands variable developer income and gives real guidance.",
    image: "/avatars/avatar-alex-starling.png", // Ensure this matches your public folder exactly
  },
  {
    id: "T.02",
    initials: "MK",
    author: "Marcus Kane",
    role: "Digital Nomad",
    rating: 4.9,
    date: "08 May, 2026",
    quote:
      "The AI's tax-saving investment guidance saved me $2k this season. It learns my spending patterns and proactively suggests optimizations. Finally, an app that gives smart advice, not just data.",
    image: "/avatars/avatar-markas-kane.png",
  },
  {
    id: "T.03",
    initials: "LY",
    author: "Lena Yang",
    role: "UX Designer",
    rating: 5.0,
    date: "19 Feb, 2026",
    quote:
      "The AI insights into my lifestyle spending versus long-term wealth goals gave me the reality check I needed. It's not just tracking—it's actively guiding me toward better financial decisions.",
    image: "/avatars/avatar-lena-yang.png",
  },
];

const INTERVAL_MS = 1800;

// ── Sub-Components ───────────────────────────────────────────────────────────

const Stars: FC<StarsProps> = ({ rating, active }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width="9" height="9" viewBox="0 0 24 24">
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          fill={
            s <= Math.round(rating) ? (active ? "#1c1917" : "#d6d3d1") : "none"
          }
          stroke={
            s <= Math.round(rating)
              ? active
                ? "#1c1917"
                : "#d6d3d1"
              : "#e7e5e4"
          }
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ))}
    <span
      className="font-mono text-[9px] ml-0.5 font-bold transition-colors duration-300"
      style={{ color: active ? "#1c1917" : "#d6d3d1" }}
    >
      {rating.toFixed(1)}
    </span>
  </div>
);

// ── Main Section ─────────────────────────────────────────────────────────────

const TestimonialsSection: FC = () => {
  const [active, setActive] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % testimonials.length);
    }, INTERVAL_MS);
  };

  useEffect(() => {
    if (!paused) {
      startTimer();
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const pick = (i: number) => {
    setActive(i);
    startTimer();
  };

  const t = testimonials[active];

  return (
    <section
      id="testimonials"
      className="py-24 px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="w-8 h-0.5 bg-stone-900 block" />
          <h2 className="font-bold text-stone-900 text-xl tracking-tight uppercase italic">
            AI-Guided Success Stories
          </h2>
          <span className="font-mono text-[8px] tracking-widest text-stone-300 uppercase border border-stone-200 px-2 py-0.5">
            LATEST_REVIEWS // 2026
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white border border-stone-200 shadow-sm overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
            <div className="relative px-8 py-10 border-b md:border-b-0 md:border-r border-stone-100">
              <div className="absolute left-[51px] top-[88px] bottom-[88px] w-px bg-stone-100" />
              <div className="flex flex-col gap-8">
                {testimonials.map((item, i) => {
                  const isActive = active === i;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      onClick={() => pick(i)}
                      className="flex items-center gap-3 text-left relative z-10 w-full group outline-none"
                      aria-label={`Select ${item.author}`}
                    >
                      <motion.div
                        animate={{
                          width: isActive ? 50 : 36,
                          height: isActive ? 50 : 36,
                          borderColor: isActive ? "#292524" : "#e7e5e4",
                          boxShadow: isActive
                            ? "0 0 0 3px #f5f5f4, 0 0 0 5px #292524"
                            : "0 0 0 0px transparent",
                        }}
                        transition={{
                          duration: 0.38,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="rounded-full flex-shrink-0 border-2 bg-stone-100 flex items-center justify-center overflow-hidden"
                      >
                        {/* Swapped Initials for actual Image */}
                        <Image
                          src={item.image}
                          alt={item.author}
                          width={50}
                          height={50}
                          className={`object-cover w-full h-full transition-all duration-500 ${
                            isActive ? "grayscale-0" : "grayscale"
                          }`}
                        />
                      </motion.div>

                      <motion.div
                        animate={{ x: isActive ? 3 : 0 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="min-w-0"
                      >
                        <motion.p
                          animate={{ color: isActive ? "#1c1917" : "#a8a29e" }}
                          className="font-bold text-sm tracking-tight leading-tight uppercase"
                        >
                          {item.author}
                        </motion.p>
                        <div className="mt-0.5">
                          <Stars rating={item.rating} active={isActive} />
                        </div>
                        {isActive && (
                          <div className="mt-2 h-px w-full bg-stone-100 overflow-hidden">
                            <motion.div
                              className="h-full bg-stone-800"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{
                                duration: INTERVAL_MS / 1000,
                                ease: "linear",
                              }}
                            />
                          </div>
                        )}
                      </motion.div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Right Display Panel */}
            <div className="relative px-10 py-10 flex flex-col justify-center min-h-[280px]">
              <span
                className="absolute top-5 left-8 font-serif text-8xl leading-none text-stone-100 select-none pointer-events-none"
                aria-hidden
              >
                "
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div className="mb-8">
                    <p className="text-stone-600 leading-relaxed text-[15px]">
                      <span className="float-left font-serif text-5xl font-bold text-stone-900 leading-none mr-2 mt-1 select-none">
                        {t.quote.charAt(0)}
                      </span>
                      <span className="italic">{t.quote.slice(1)}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-5 border-t border-stone-100 clear-both">
                    <div className="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {/* Substituted background span with author image */}
                      <Image
                        src={t.image}
                        alt={t.author}
                        width={28}
                        height={28}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800 leading-none mb-0.5 tracking-tight uppercase">
                        {t.author}
                      </p>
                      <p className="font-mono text-[9px] text-stone-400 tracking-wider uppercase">
                        {t.role} · {t.date}
                      </p>
                    </div>
                    <span className="ml-auto font-mono text-[8px] tracking-widest text-stone-300 uppercase">
                      {t.id}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Navigation Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center items-center gap-2 mt-6"
        >
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => pick(i)}
              aria-label={`Review ${i + 1}`}
              className="outline-none"
            >
              <motion.div
                animate={{
                  width: active === i ? 22 : 6,
                  backgroundColor: active === i ? "#292524" : "#d6d3d1",
                }}
                className="h-1.5 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
