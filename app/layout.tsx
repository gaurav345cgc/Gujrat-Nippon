import type { Metadata } from "next";
import { Mrs_Saint_Delafield } from "next/font/google";
import Navbar from "@/components/Navbar";

const mrsSaintDelafield = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400", variable: "--font-delafield" });
import Footer from "@/components/Footer";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    template: "%s | Corporate Website",
    default: "Corporate Website | Your Trusted Industry Partner",
  },
  description: "Delivering industry-leading solutions and certifications around the globe.",
  openGraph: {
    title: "Corporate Website",
    description: "Delivering industry-leading solutions and certifications around the globe.",
    url: "https://www.corporatewebsite.com",
    siteName: "Corporate Website",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={mrsSaintDelafield.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <main>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
