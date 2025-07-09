import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { Suspense } from "react";
import Loading from "./components/Loading";
import Delay from "./components/Delay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GymNotes",
  description: "Pumping iron",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Navigation />
        <div className="current-page">
          <div className="page-bg-skeleton">
            <Suspense fallback={<Loading>Please wait...</Loading>}>
              <Delay duration={1000}>
                {children}
              </Delay>
            </Suspense>
          </div>
        </div>
      </body>
    </html>
  );
}
