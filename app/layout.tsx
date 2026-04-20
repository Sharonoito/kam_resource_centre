import { Playfair_Display, DM_Sans, Poppins, Geist } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Chatbot from "@/components/Chatbot";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "KAM Resource Centre",
  description: "Empowering Kenyan manufacturers through data-driven intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(playfair.variable, dmSans.variable, poppins.variable, "font-sans", geist.variable)}>
      <head>
        <script src="/chat-toggle.js" async defer />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900">
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}

