// src/app/(auth)/layout.tsx
import "../../globals.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
      <main className="w-full max-w-7xl p-5 rounded-lg shadow-lg bg-gray-900">
        {children}
      </main>
    </div>
  );
}
