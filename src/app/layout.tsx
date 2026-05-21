import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SideBar from "@/layout/SideBar";
import Header from "@/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dashboard",
  description: "....",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#121212] text-white">
        <div className="flex h-screen overflow-hidden ">
          <SideBar />
          <div className="flex flex-col flex-1 overflow-auto bg-[#121212] text-white">
            <div className="max-w-7xl mx-auto w-full">
              <Header />
              <main>{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}