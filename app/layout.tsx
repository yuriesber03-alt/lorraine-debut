import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Great_Vibes, Montserrat } from "next/font/google";
import { invitation } from "@/config/invitation";
import "./globals.css";
import "./sections.css";
import "./royal.css";

const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" });
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-sans", display: "swap" });

const caps = Cinzel({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-caps", display: "swap" });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: invitation.headline,
  description: `You're invited to ${invitation.headline}`,
  openGraph: {
    type: "website",
    title: invitation.headline,
    description: `You're invited to ${invitation.headline}`,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-phase="intro" suppressHydrationWarning className={`${script.variable} ${serif.variable} ${sans.variable} ${caps.variable}`}>
      <body>{children}</body>
    </html>
  );
}
