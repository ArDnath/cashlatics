"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Apple, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "@/server/user";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

function GoogleIcon() {
  return (
    <svg
      className="size-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOAuthLoading] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const { success, message } = await signIn(values.email, values.password);
    if (success) {
      toast.success(message as string);
      if (typeof window !== "undefined") {
        const channel = new BroadcastChannel("auth");
        channel.postMessage({ type: "AUTH_CHANGE" });
        channel.close();
      }
      router.push("/dashboard");
    } else {
      toast.error(message as string);
    }
    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    try {
      setOAuthLoading(provider);
      const response = await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
      if (response) {
        toast.success(`Signed in with ${provider}`);
        if (typeof window !== "undefined") {
          const channel = new BroadcastChannel("auth");
          channel.postMessage({ type: "AUTH_CHANGE" });
          channel.close();
        }
        router.push("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "OAuth sign-in failed";
      toast.error(errorMessage);
    } finally {
      setOAuthLoading(null);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-screen w-full flex-col lg:flex-row overflow-hidden bg-stone-50",
        className,
      )}
      {...props}
    >
      {/* LEFT PANEL — branding */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-stone-900 p-10 lg:flex lg:w-[55%]">
        {/* RESTORED: Full Geometric SVG background */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 700 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <line
            x1="0"
            y1="300"
            x2="420"
            y2="0"
            stroke="#292524"
            strokeWidth="1"
          />
          <line
            x1="420"
            y1="0"
            x2="700"
            y2="420"
            stroke="#292524"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1="300"
            x2="700"
            y2="420"
            stroke="#292524"
            strokeWidth="1"
          />
          <line
            x1="420"
            y1="0"
            x2="280"
            y2="580"
            stroke="#262220"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1="300"
            x2="280"
            y2="580"
            stroke="#262220"
            strokeWidth="1"
          />
          <line
            x1="700"
            y1="420"
            x2="280"
            y2="580"
            stroke="#262220"
            strokeWidth="1"
          />
          <line
            x1="280"
            y1="580"
            x2="700"
            y2="900"
            stroke="#222020"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1="300"
            x2="200"
            y2="900"
            stroke="#222020"
            strokeWidth="1"
          />
          <line
            x1="420"
            y1="0"
            x2="700"
            y2="200"
            stroke="#2d2926"
            strokeWidth="1"
          />
          <line
            x1="200"
            y1="900"
            x2="700"
            y2="420"
            stroke="#222020"
            strokeWidth="1"
          />
          <circle cx="420" cy="0" r="4" fill="#44403c" />
          <circle cx="0" cy="300" r="4" fill="#44403c" />
          <circle cx="700" cy="420" r="4" fill="#44403c" />
        </svg>

        <div className="relative z-10">
          {/* Back link for Desktop */}
          <Link
            href="/"
            className="mb-12 flex items-center gap-2 text-sm font-medium text-stone-400 transition-colors hover:text-stone-100"
          >
            <ArrowLeft className="size-4" />
            Return to Cashlatics
          </Link>

          <h2 className="mb-3 font-['Syne',_sans-serif] text-5xl xl:text-6xl font-bold leading-tight text-stone-100">
            Track Smarter.
            <br />
            <span className="text-stone-500">Grow</span> Faster.
            <br />
            Win Every Day.
          </h2>
          <p className="max-w-xs text-lg leading-relaxed text-stone-600">
            Your personal finance command center. Budgets, goals, and insights —
            all in one sharp view.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-stone-50 px-6 py-12">
        {/* Mobile Header: Logo links back home */}
        <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden group">
          <Image
            src="/wallet.png"
            alt="Cashlatics Logo"
            width={28}
            height={28}
            className="transition-transform group-hover:scale-110"
          />
          <span className="font-['Syne',_sans-serif] text-base font-bold text-stone-900">
            Cashlatics
          </span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="mb-1.5 font-['Syne',_sans-serif] text-2xl font-bold text-stone-900">
              Welcome Back!
            </h1>
            <p className="text-sm text-stone-500">
              Sign in to your Cashlatics account.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        className="h-11 rounded-[3px] border-stone-200 bg-white text-stone-900 placeholder:text-stone-300 focus-visible:border-stone-500 focus-visible:ring-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
                        Password
                      </FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-[11px] text-stone-400 hover:text-stone-700 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-11 rounded-[3px] border-stone-200 bg-white text-stone-900 placeholder:text-stone-300 focus-visible:border-stone-500 focus-visible:ring-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="size-4 cursor-pointer accent-stone-800"
                  {...form.register("remember")}
                />
                <label
                  htmlFor="remember"
                  className="cursor-pointer text-xs text-stone-500 select-none"
                >
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full h-11 overflow-hidden rounded-[3px] bg-stone-900 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-stone-800 disabled:opacity-60"
              >
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-18deg] bg-white/10 transition-transform duration-500 group-hover:translate-x-full"
                  aria-hidden
                />
                {loading ? (
                  <Loader2 className="mx-auto size-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </button>

              <div className="relative my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-stone-200" />
                <span className="text-[11px] text-stone-400">
                  Or continue with
                </span>
                <div className="h-px flex-1 bg-stone-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={oauthLoading === "google"}
                  onClick={() => handleOAuthSignIn("google")}
                  className="flex items-center justify-center gap-2 rounded-[3px] border border-stone-200 bg-white h-10 text-[13px] font-medium text-stone-600 transition-all hover:border-stone-400 hover:text-stone-900 disabled:opacity-50"
                >
                  {oauthLoading === "google" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Google
                </button>
                <button
                  type="button"
                  disabled={oauthLoading === "apple"}
                  onClick={() => handleOAuthSignIn("apple")}
                  className="flex items-center justify-center gap-2 rounded-[3px] border border-stone-200 bg-white h-10 text-[13px] font-medium text-stone-600 transition-all hover:border-stone-400 hover:text-stone-900 disabled:opacity-50"
                >
                  {oauthLoading === "apple" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Apple className="size-4" />
                  )}
                  Apple
                </button>
              </div>

              <p className="mt-8 text-center text-xs text-stone-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-stone-800 hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
