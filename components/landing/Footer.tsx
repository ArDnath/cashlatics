"use client";
import React from "react";
import {
  ChartLineUp,
  GithubLogo,
  LinkedinLogo,
  ArrowUpRight,
  EnvelopeSimple,
  TerminalWindow,
} from "@phosphor-icons/react";

const Footer = () => {
  return (
    <footer className="relative border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 overflow-hidden">
      {/* Subtle Geometric Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          color: "#78716c", // stone-500
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand & Resume Context Section */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                {/* Geometric Logo Container */}
                <div
                  className="w-10 h-10 bg-stone-900 dark:bg-stone-100 flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300"
                  style={{ borderRadius: "12px 4px 12px 4px" }}
                >
                  <ChartLineUp
                    className="text-stone-50 dark:text-stone-900 w-5 h-5 -rotate-3 hover:rotate-0"
                    weight="bold"
                  />
                </div>
                <span className="font-sans font-bold text-2xl tracking-tight text-stone-900 dark:text-stone-50">
                  Cashlatics
                </span>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed max-w-sm">
                A modern, elegant solution for comprehensive wealth tracking and
                personal finance analytics. Built with precision for the modern
                web.
              </p>
            </div>

            {/* Developer Portfolio Links */}
            <div className="mt-8 pt-8 border-t border-stone-200/60 dark:border-stone-800/60 inline-block">
              <div className="flex items-center gap-2 mb-4">
                <TerminalWindow className="w-4 h-4 text-stone-400" />
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
                  Developer Portfolio
                </p>
              </div>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-2 border border-stone-200 dark:border-stone-800 rounded-md text-stone-500 hover:text-stone-900 hover:border-stone-400 dark:hover:text-stone-100 dark:hover:border-stone-600 transition-all"
                >
                  <GithubLogo className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 border border-stone-200 dark:border-stone-800 rounded-md text-stone-500 hover:text-stone-900 hover:border-stone-400 dark:hover:text-stone-100 dark:hover:border-stone-600 transition-all"
                >
                  <LinkedinLogo className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-2 border border-stone-200 dark:border-stone-800 rounded-md text-stone-500 hover:text-stone-900 hover:border-stone-400 dark:hover:text-stone-100 dark:hover:border-stone-600 transition-all"
                >
                  <EnvelopeSimple className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Links Grid with Geometric Vertical Dividers */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 lg:pl-12 lg:border-l border-stone-200/60 dark:border-stone-800/60">
            <div>
              <h4 className="font-semibold mb-6 text-stone-900 dark:text-stone-100 tracking-wide">
                Platform
              </h4>
              <ul className="space-y-4 text-sm text-stone-500 dark:text-stone-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center group"
                  >
                    Dashboard
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    Net Worth Tracker
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    Expense Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    Data Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-stone-900 dark:text-stone-100 tracking-wide">
                Project Details
              </h4>
              <ul className="space-y-4 text-sm text-stone-500 dark:text-stone-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    Case Study
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    System Architecture
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    Tech Stack
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    Source Code
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-stone-900 dark:text-stone-100 tracking-wide">
                Legal
              </h4>
              <ul className="space-y-4 text-sm text-stone-500 dark:text-stone-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    MIT License
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    Terms of Use
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Status & Copyright Bar */}
        <div className="mt-16 pt-8 border-t border-stone-200/60 dark:border-stone-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400 dark:text-stone-500">
          <p>
            © {new Date().getFullYear()} Cashlatics. Created as a demonstration
            project.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></span>
              <span className="font-medium text-stone-600 dark:text-stone-300">
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
