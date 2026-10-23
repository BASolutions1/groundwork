import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./motion.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Groundwork",
  description:
    "Every step to get a new business running in Canada, in the right order, with someone who's already done it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={`${inter.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full bg-white text-ink antialiased">{children}</body>
    </html>
  );
}
