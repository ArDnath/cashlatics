import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Cashlatics - Financial Intelligence",
  description: "Master your financial future with Cashlatics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className="pt-16">{children}</div>
      <Toaster />
    </div>
  );
}
