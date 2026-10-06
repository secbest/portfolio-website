import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/providers/SmoothScroll";
import TransitionProvider from "@/components/providers/TransitionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jasper Teo | Portfolio",
    template: "%s | Jasper Teo",
  },
  description:
    "Portfolio of Jasper Teo, an IT student and front-end developer building interactive web experiences.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Intro />
        <SmoothScroll />
        <Cursor />
        <TransitionProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </TransitionProvider>
      </body>
    </html>
  );
}
