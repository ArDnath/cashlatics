"use client";

import { authClient } from "@/lib/auth-client";

export function useSessionState() {
  const {
    data: session,
    isPending: loading,
    error,
    refetch,
  } = authClient.useSession();

  return {
    session,
    loading,
    error,
    isAuthenticated: !!session,
    refetchSession: refetch,
  };
}
