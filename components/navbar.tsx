"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logout } from "./logout";
import { useSessionState } from "@/hooks/useSessionState";
import { List, X } from "@phosphor-icons/react";
import { useState } from "react";
import Image from "next/image";
import { Jacquard_24 } from "next/font/google";

function Navbar() {
  const router = useRouter();
  const { session, loading } = useSessionState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#feature-section" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Success Stories", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="h-16 flex justify-between items-center px-8 border-b-2 border-stone-700 sticky top-0 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div
            className="w-10 h-10 bg-stone-900 dark:bg-stone-100 flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300"
            style={{ borderRadius: "12px 4px 12px 4px" }}
          >
            <Image
              src="/wallet.png"
              alt="Cashlatics Logo"
              width={24}
              height={24}
            />
          </div>
          <span className="font-sans font-bold text-2xl tracking-tight text-stone-900 dark:text-stone-50 hidden sm:inline">
            Cashlatics
          </span>
        </Link>
        <div className="h-10 w-20 bg-stone-100 animate-pulse rounded-sm border border-stone-200" />
      </div>
    );
  }

  return (
    <>
      <div className="h-16 flex justify-between items-center px-8 border-b-2 border-stone-600 bg-stone-50/60 backdrop-blur-md sticky top-0 z-50 transition-all">
        {/* Logo - Links to top */}
        <a
          href="#"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity scroll-smooth"
        >
          <div className="w-10 h-10 flex items-center justify-center transform hover:rotate-0">
            <Image
              src="/wallet.png"
              alt="Cashlatics Logo"
              width={38}
              height={38}
            />
          </div>
          <span className="font-sans font-bold text-2xl tracking-tight text-stone-900 dark:text-stone-50 hidden sm:inline">
            Cashlatics
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors duration-200 scroll-smooth"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 hover:bg-stone-200 rounded-sm transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-stone-900" weight="bold" />
            ) : (
              <List className="w-5 h-5 text-stone-900" weight="bold" />
            )}
          </button>

          {/* Auth Button */}
          {session ? (
            <Logout />
          ) : (
            <Button
              onClick={() => router.push("/login")}
              className="px-4 py-2 shadow-[10px_6.5px_0px_0_rgba(0,0,0,0.3)] hover:shadow-[0_0_0_0_rgba(0,0,0,0)] transition-shadow border-slate-800 border-2 rounded-sm"
              variant="outline"
              size="lg"
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b-2 border-stone-200 md:hidden shadow-md">
          <nav className="flex flex-col p-4 gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors duration-200 px-3 py-2 rounded-sm"
                onClick={handleNavClick}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Smooth scroll behavior for entire document */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}

export default Navbar;
