import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import { useState, createContext } from "react";

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

type NavBarContextType = {
  setPageTitle: (title:string)=>void
  pageTitle: string
}

export const NavBarContext = createContext<NavBarContextType>({ setPageTitle: ()=>{}, pageTitle: '' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [pageTitle, setPageTitle] = useState<string>('')
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NavBarContext.Provider value={{setPageTitle,pageTitle}}>
          <Navigation pfPage={pageTitle} />
          <div className="current-page">
            <div className="page-bg-skeleton">
              {children}
            </div>
          </div>
        </NavBarContext.Provider>
      </body>
    </html>
  );
}
