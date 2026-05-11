"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const stats = [
  { num: "₹2.4M", label: "Total Assets" },
  { num: "+23%", label: "This Month" },
  { num: "98k+", label: "Active Users" },
];

const HeroSection = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [startLoading, setStartLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // Changed pt-20 to pt-12 to close the gap with the Navbar
    <section className="relative min-h-screen pt-12 pb-16 overflow-hidden bg-white text-black ">
      {/* Background Texture - Simplified for cleaner white look */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 39px, #000 39px, #000 40px)`,
        }}
      />

      {/* Margin Lines - Shifted slightly for better framing */}
      <div className="absolute top-0 bottom-0 left-12 w-px bg-black/5" />
      <div className="absolute top-0 bottom-0 right-12 w-px bg-black/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: 7/12 width for better text spacing */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="inline-flex items-center gap-2 border border-stone-950  rounded-sm px-3 py-1 text-[10px] tracking-widest uppercase mb-10 w-fit shadow-md">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Intelligence Report v1.0
            </div>

            {/* Headline Section - Improved Line Heights */}
            <h1 className="font-(family-name:--font-geologica) font-[850]  text-stone-800 text-[clamp(60px,8vw,120px)] leading-[0.85] uppercase tracking-tighter">
              Master <br /> Your
            </h1>

            {/* The Italic contrast font */}
            <span className="font-(family-name:--font-geologica) text-[clamp(40px,5vw,80px)] leading-none text-black/40 block mt-2">
              Financial Future
            </span>

            <div className="w-24 h-px bg-black my-10" />

            <p className="text-[13px] leading-relaxed text-black/60 max-w-md mb-10 font-medium">
              The high-precision interface for your personal economy. Sync
              assets, automate tracking, and use AI to predict your liquidity
              for the year ahead
            </p>

            <div className="flex items-center gap-8 mb-16">
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    setStartLoading(true);
                    // Call session check endpoint (no-cache) to ensure we read current session state.
                    const res = await fetch("/api/auth/get-session", {
                      method: "GET",
                      cache: "no-store",
                    });
                    if (res.ok) {
                      const json = await res.json();
                      // The endpoint returns session info when logged in; adapt to your API response shape.
                      if (json?.session) {
                        // navigate to dashboard when session exists
                        router.push("/dashboard");
                      } else {
                        // if no session, send users to login/signup flow
                        router.push("/login");
                      }
                    } else {
                      router.push("/login");
                    }
                  } catch (err) {
                    router.push("/login");
                  } finally {
                    setStartLoading(false);
                  }
                }}
                className="relative bg-stone-900 text-white px-1 py-1 text-[11px] tracking-widest rounded-md uppercase hover:bg-stone-800 flex items-center gap-3 transition-shadow"
                aria-label="Start Now"
              >
                <div className="flex gap-2 border-stone-200 border-2 px-4 py-3 text-xl items-center">
                  {startLoading ? "Checking…" : "Start Now"}
                  <ArrowUpRight size={16} />
                </div>
              </button>

              <button className="text-[11px] tracking-widest uppercase border-b border-black pb-1 flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                Live Demo <ArrowRight size={14} />
              </button>
            </div>

            {/* Stats Row */}
            <div className="flex gap-12 border-t border-black/5 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold">{s.num}</div>
                  <div className="text-[9px] uppercase tracking-widest opacity-40">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: 5/12 width for the "Figure" */}
          <div className="lg:col-span-5 lg:pt-20">
            <div className="text-[9px] tracking-[0.3em] opacity-30 uppercase mb-4 flex justify-between">
              <span>Fig. 01 // Global_Terminal</span>
              <span>Pos. 40.7128° N</span>
            </div>

            <div className="relative border border-black/10 p-1 bg-white shadow-2xl">
              <div
                className={`overflow-hidden transition-all duration-1000 ease-out ${scrolled ? "scale-[0.98]" : "scale-100"}`}
              >
                <Image
                  src="/money-gif-4.gif" // Ensure this path is correct in your public folder
                  width={1000}
                  height={800}
                  alt="Interface"
                  className="w-full grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Marquee/Ticker Inside the image box */}
              <div className="absolute bottom-1 left-1 right-1 bg-black text-[9px] text-white py-2 overflow-hidden whitespace-nowrap">
                <div className="inline-block animate-marquee px-4">
                  SYSTEM ACTIVE • ENCRYPTION AES-256 • REAL-TIME FEED ENABLED •
                </div>
                <div className="inline-block animate-marquee px-4">
                  SYSTEM ACTIVE • ENCRYPTION AES-256 • REAL-TIME FEED ENABLED •
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rule and Meta Info */}
        <div className="w-full h-px bg-black/5 mt-20 mb-4" />
        <div className="flex justify-between text-[9px] tracking-widest opacity-30 uppercase">
          <span>Terminal ID: 099-X2</span>
          <span>© 2026 Cashlatics Finance Corp.</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
