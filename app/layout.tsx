import type { Metadata } from "next";
import { Poppins, Inter, Geologica } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "sonner";

const geologica = Geologica({
  subsets: ["latin"],
  variable: "--font-geologica",
  display: "swap",
});
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={`${geologica.variable} ${poppins.variable} ${inter.className}`}
      >
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
        <div className="pt-16">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
