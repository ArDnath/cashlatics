"use client";

import { useSessionState } from "@/hooks/useSessionState";
import Container from "@/components/layout/container";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { session, loading } = useSessionState();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/sign-in");
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <Container className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
        <p className="mt-4">Loading dashboard...</p>
      </Container>
    );
  }

  if (!session) {
    return (
      <Container className="flex flex-col justify-center items-center min-h-screen">
        <p>Redirecting to login...</p>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {session.user?.name}!</h1>
          <p className="text-muted-foreground mt-2">
            Email: {session.user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Account</h2>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-muted-foreground">
              View your financial analytics and reports
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-muted-foreground">
              Configure your app settings and preferences
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
