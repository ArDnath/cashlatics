"use client";

import React, { useState, useEffect, useRef } from "react";

interface Brand {
  id: string;
  name: string;
  metric: string;
  label: string;
}

const brands: Brand[] = [
  { id: "01", name: "JPM_CHASE", metric: "CONNECTED", label: "api" },
  { id: "02", name: "PLAID_CORE", metric: "99.9%", label: "uptime" },
  { id: "03", name: "COINBASE_INST", metric: "42ms", label: "latency" },
  { id: "04", name: "REVOLUT_PRO", metric: "LIVE", label: "feed" },
  { id: "05", name: "VANGUARD_MF", metric: "SYNCED", label: "assets" },
];

const TICKER_ITEMS = [
  "LIQUIDITY FORECASTING",
  "FISCAL QUARTERLY AUDIT",
  "AI_DRIVEN_RETENTION",
  "MULTI_BANK_AGGREGATION",
  "REAL_TIME_P&L",
  "TAX_LOSS_HARVESTING",
];

// Resolves cascading render warning by using a layout effect or standard check
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // requestAnimationFrame ensures the update happens after the browser has painted,
    // satisfying the "cascading render" check by moving it out of the sync execution flow.
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return mounted;
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

const BrandCard = ({ brand, index }: { brand: Brand; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <div
      className="group relative cursor-pointer select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        animationDelay: `${index * 80}ms`,
        animation: "fadeSlideUp 0.5s ease both",
      }}
    >
      <div
        className="absolute inset-0 -m-2 rounded-sm bg-stone-100 transition-all duration-200"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scale(1)" : "scale(0.92)",
        }}
      />

      {clicked && (
        <span
          className="absolute inset-0 -m-2 rounded-full bg-stone-300 opacity-0"
          style={{ animation: "ripple 0.6s ease-out forwards" }}
        />
      )}

      <div className="relative px-2 py-1.5 flex flex-col items-start gap-0.5">
        <div className="flex items-center gap-1.5">
          <span
            className="text-[7px] font-mono tracking-widest transition-colors duration-200"
            style={{ color: hovered ? "#292524" : "#a8a29e" }}
          >
            REF_{brand.id}
          </span>
          <span
            className="w-1 h-1 rounded-full bg-stone-400 transition-all duration-300"
            style={{
              backgroundColor: hovered ? "#22c55e" : "#a8a29e",
              boxShadow: hovered ? "0 0 4px #22c55e" : "none",
            }}
          />
        </div>

        <span
          className="text-xs font-black tracking-tighter leading-none transition-all duration-200 font-mono"
          style={{
            color: hovered ? "#1c1917" : "#57534e",
            letterSpacing: hovered ? "-0.04em" : "-0.02em",
          }}
        >
          {brand.name}
        </span>

        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: hovered ? "20px" : "0px",
            opacity: hovered ? 1 : 0,
          }}
        >
          <span className="text-[9px] font-mono text-stone-500 tabular-nums">
            <span className="text-stone-800 font-bold">{brand.metric}</span>{" "}
            {brand.label}
          </span>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-2 right-2 h-px bg-stone-800 transition-all duration-300"
        style={{
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left",
        }}
      />
    </div>
  );
};

const TickerTape = () => {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden border-t border-stone-200 py-2">
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{ animation: "ticker 22s linear infinite" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 text-[8px] font-mono text-stone-500 tracking-[0.25em] uppercase shrink-0"
          >
            <span className="w-1 h-1 bg-stone-300 rotate-45 inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const SocialProof = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);
  const mounted = useMounted();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const target = 4200;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <>
      <style jsx global>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes ripple {
          0% {
            opacity: 0.3;
            transform: scale(0.9);
          }
          100% {
            opacity: 0;
            transform: scale(1.05);
          }
        }
        @keyframes pulseBar {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="bg-white border-y border-stone-200 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.008) 3px, rgba(0,0,0,0.008) 4px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-3 lg:border-r border-b lg:border-b-0 border-stone-200 py-6 lg:py-8 pr-0 lg:pr-8">
              <div className="flex lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-4 lg:gap-5">
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.3em] flex items-center gap-2 shrink-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"
                    style={{ animation: "pulseBar 2s ease-in-out infinite" }}
                  />
                  Trusted by
                </p>

                <div className="flex items-baseline gap-1">
                  <span
                    className="text-2xl lg:text-3xl font-black font-mono text-stone-900 tabular-nums leading-none"
                    style={{
                      opacity: inView ? 1 : 0,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    {mounted ? count.toLocaleString() : "0"}
                  </span>
                  <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                    +<br />
                    savers
                  </span>
                </div>

                <div className="hidden lg:flex items-end gap-0.5 h-5">
                  {[40, 55, 35, 70, 60, 80, 65, 90, 75, 100].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-stone-200 rounded-sm relative overflow-hidden"
                      style={{ height: `${h}%` }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-stone-700 rounded-sm transition-all"
                        style={{
                          height: inView ? "100%" : "0%",
                          transitionDelay: `${i * 60}ms`,
                          transitionDuration: "400ms",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-9 py-6 lg:py-8 lg:pl-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-row lg:items-center lg:justify-between gap-x-4 gap-y-2 lg:gap-0 transition-all duration-300 grayscale opacity-55 hover:grayscale-[0.3] hover:opacity-90">
                {brands.map((brand, i) => (
                  <BrandCard key={brand.id} brand={brand} index={i} />
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-[9px] font-mono text-stone-400 tracking-widest uppercase">
                  HIGH-PRECISION PERSONAL ECONOMY ENGINE
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    style={{ animation: "pulseBar 1.8s ease-in-out infinite" }}
                  />
                  <span className="text-[9px] font-mono text-stone-400 tracking-wider">
                    ALL SYSTEMS OPERATIONAL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TickerTape />
      </section>
    </>
  );
};

export default SocialProof;
