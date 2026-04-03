import type { Metadata } from "next";
import { Mrs_Saint_Delafield, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import Footer from "@/components/Footer";
import "./globals.css";

const mrsSaintDelafield = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--font-delafield" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    template: "%s | Corporate Website",
    default: "Corporate Website | Your Trusted Industry Partner",
  },
  description: "Delivering industry-leading solutions and certifications around the globe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mrsSaintDelafield.variable} ${inter.variable}`}>
      <body>
        <SmoothScroll />
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
