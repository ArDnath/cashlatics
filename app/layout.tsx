import type { Metadata } from "next";
import { Poppins, Inter, Geologica } from "next/font/google";
import "@/app/globals.css";
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
