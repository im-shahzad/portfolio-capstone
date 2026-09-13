import type { Metadata } from "next";
import { Fraunces, Inter, Geist } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import NoFlashScript from "@/components/portfolio/NoFlashScript";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans',display:'swap'});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shahzad Saeed — AI Engineer",
  description:
    "AI-powered portfolio with a real chat assistant that answers questions about my projects and experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", "dark", fraunces.variable, inter.variable, "font-sans", geist.variable)}
    >
      <head>
        <NoFlashScript />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text font-body px-6 pb-20 md:pb-0">
        <header>
          <NavBar />
        </header>
        {children}
        <footer className="mx-auto w-full max-w-screen-xl px-6 py-6 mt-auto border-t border-border text-sm text-text-muted">
          <p>&copy; {new Date().getFullYear()} Shahzad. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
