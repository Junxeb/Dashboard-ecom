// src/layout/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import SideBar from "@/layout/SideBar";
import Header from "@/layout/Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup");

  if (isAuthPage) {
    return <main className="flex items-center justify-center min-h-screen bg-[#121212]">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <div className="flex flex-col flex-1 overflow-auto bg-[#121212] text-white">
        <div className="max-w-7xl mx-auto w-full">
          <Header />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
