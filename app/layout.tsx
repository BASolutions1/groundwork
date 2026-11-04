import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Every step to get a new business running, in the right order, with someone who's already done it. Based in Canada, used worldwide.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={`${inter.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full bg-white text-ink antialiased">{children}</body>
    </html>
  );
}
