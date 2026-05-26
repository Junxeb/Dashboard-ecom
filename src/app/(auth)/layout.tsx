// src/app/(auth)/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css"; // ปรับ path ให้ถอยกลับไปหา globals.css ให้ถูก (ถ้าอยู่ชั้น (auth) ต้องถอย 2 ชั้น)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    /* ✅ 1. เปลี่ยน <html> และ <body> เป็น <div> ธรรมดา
      ✅ 2. ย้ายตัวแปรฟอนต์ (${geistSans.variable} ${geistMono.variable}) มาใส่ที่นี่แทน 
      ✅ 3. ตกแต่งพื้นหลัง Dark Mode ตามที่คุณต้องการ
    */
<div className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#121212] text-white flex items-center justify-center p-4`}>
      <div className="w-full max-w-7xl ">
        <main className="w-full max-w-7xl ">
        {children}
      </main>

      </div>
      

    </div>
  );
}