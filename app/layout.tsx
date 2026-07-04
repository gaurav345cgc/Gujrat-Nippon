import type { Metadata } from "next";
import { headers } from "next/headers";
import { Mrs_Saint_Delafield, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import Footer from "@/components/Footer";
import { getCachedPublishedContactInfo } from "@/lib/cms/cache/queries";
import { getFallbackContactInfo } from "@/lib/cms/payloads";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import RuleBasedChatbot from "@/components/RuleBasedChatbot";
import "./globals.css";

const mrsSaintDelafield = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--font-delafield" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    template: "%s | Gujarat Nippon International Pvt Ltd",
    default: "Gujarat Nippon International Pvt Ltd | Your Trusted Industry Partner",
  },
  description:
    "Gujarat Nippon International supplies turnkey plant machinery, industrial spares, and capital equipment for steel, plastics, and energy industries across India, Africa, and GCC.",
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");
  const contactPublished = isAdmin ? null : await getCachedPublishedContactInfo();
  const contact = contactPublished ?? getFallbackContactInfo();

  return (
    <html lang="en" className={`${mrsSaintDelafield.variable} ${inter.variable}`}>
      <body>
        {!isAdmin && <SmoothScroll />}
        {!isAdmin && <AnalyticsTracker />}
        {!isAdmin && <Navbar />}
        <main className={isAdmin ? 'admin-layout-main' : undefined}>{children}</main>
        {!isAdmin && <Footer contact={contact} />}
      </body>
    </html>
  );
}
