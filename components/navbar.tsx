"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logout } from "./logout";
import { useSessionState } from "@/hooks/useSessionState";

function Navbar() {
  const router = useRouter();
  const { session, loading } = useSessionState();

  if (loading) {
    return (
      <div className="h-16 flex justify-between items-center px-8 border-b-2">
        <Link href="/">Cashlatics</Link>
        <button></button>
      </div>
    );
  }

  return (
    <div className="h-16 flex justify-between items-center px-8 border-b-2">
      <Link href="/">Cashlatics</Link>
      {session ? (
        <Logout />
      ) : (
        <Button
          onClick={() => router.push("/login")}
          className="px-4 py-2 shadow-[10px_6.5px_0px_0_rgba(0,0,0,0.3)] hover:shadow-[0_0_0_0_rgba(0,0,0,0)] transition-shadow border-slate-800 border-2 rounded-sm "
          variant="outline"
          size="lg"
        >
          Login
        </Button>
      )}
    </div>
  );
}

export default Navbar;
