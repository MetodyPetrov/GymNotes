import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/app/components/Navigation/Navigation";
import { Suspense } from "react";
import Loading from "@/app/components/Loading/Loading";
import Delay from "@/app/components/Delay";
import AuthRedirect from "@/app/components/Auth/AuthRedirect";

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
        <AuthRedirect>
          <div className="current-page">
            <div className="page-bg-skeleton">
              <Suspense fallback={<Loading>Please wait...</Loading>}>
              <Delay duration={1000}>
                  {children}
                </Delay>
              </Suspense>
            </div>
          </div>
        </AuthRedirect>
      </body>
    </html>
  );
}
