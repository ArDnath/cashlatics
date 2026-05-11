"use client";
import { useSessionState } from "@/hooks/useSessionState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Logout } from "@/components/logout";

interface NavbarProps {
  title: string;
  description?: string;
}

export function Navbar({ title, description }: NavbarProps) {
  const { session, loading } = useSessionState();
  const user = session?.user;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="h-14 border-b border-stone-200 bg-stone-50 flex items-center pl-16 pr-4 lg:px-6 gap-4 sticky top-0 z-30">
      {/* Geometric left accent */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex flex-col gap-0.75 shrink-0">
          <div className="h-px w-4 bg-stone-300" />
          <div className="h-px w-2.5 bg-stone-200" />
        </div>

        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.h1
              key={title}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="text-[13px] font-semibold text-stone-900 leading-none tracking-[0.06em] uppercase truncate"
            >
              {title}
            </motion.h1>
          </AnimatePresence>
          {description && (
            <p className="text-[10px] text-stone-500 mt-1 tracking-[0.08em] truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          {loading ? (
            /* Skeleton shimmer */
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 bg-stone-200 animate-pulse" />
              <div className="hidden sm:flex flex-col gap-1.5">
                <div className="h-2 w-20 bg-stone-200 animate-pulse" />
                <div className="h-1.5 w-28 bg-stone-100 animate-pulse" />
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2.5"
            >
              {/* Avatar — square crop */}
              <div className="relative h-7 w-7 shrink-0">
                {/* Geometric corner marks */}
                <span className="absolute -top-px -left-px h-1.5 w-px bg-stone-300" />
                <span className="absolute -top-px -left-px h-px w-1.5 bg-stone-300" />
                <span className="absolute -bottom-px -right-px h-1.5 w-px bg-stone-300" />
                <span className="absolute -bottom-px -right-px h-px w-1.5 bg-stone-300" />

                <Avatar className="h-7 w-7 rounded-none">
                  <AvatarImage
                    src={user?.image || ""}
                    className="rounded-none object-cover"
                  />
                  <AvatarFallback className="rounded-none bg-stone-200 text-stone-900 text-[10px] font-semibold tracking-widest border border-stone-300">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* User info */}
              <div className="hidden sm:block leading-none">
                <p className="text-[12px] font-semibold text-stone-900 tracking-[0.03em] leading-none">
                  {user?.name ?? "—"}
                </p>
                <p className="text-[10px] text-stone-500 mt-1 tracking-[0.02em] truncate max-w-35">
                  {user?.email ?? ""}
                </p>
              </div>
            </motion.div>
          )}
        </div>
        <div className="px-2">
          <Logout />
        </div>
      </div>

      {/* Bottom geometric accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-stone-200 via-stone-300 to-stone-200" />
    </header>
  );
}
