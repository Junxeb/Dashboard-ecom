"use client"

import Image from 'next/image'
import { Bell, LayoutDashboard, Search } from 'lucide-react'
import { usePathname } from "next/navigation";



const Header = () => {
  
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const userName = isAdminRoute ? "Admin" : "Somchai P";
  const userAvatar = isAdminRoute ? "/admin.jpg" : "/user-avatar.png";

  return (
    <header className="bg-[#1e1e1e] shadow-lg border-b border-[#2f2f2f] mx-3 sm:mx-5 lg:mx-7 mt-4 mb-4 rounded-lg p-3 sm:p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left - Logo */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="p-2 bg-[#0066cc] rounded-lg hover:bg-[#0052a3] transition-colors cursor-pointer flex-shrink-0">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate">CARTLY</h1>
        </div>
        

        {/* Right - Search + Profile */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

          {/* Search */}
          <div className="hidden lg:flex items-center bg-[#2f2f2f] rounded-lg px-3 py-2 max-w-xs">
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-white placeholder-gray-400 outline-none w-full text-sm truncate"
            />
          </div>

          {/* Notifications */}
          <button className="p-2 hover:bg-[#2f2f2f] rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-300 hover:text-white transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0">
            <Image
              src={userAvatar}
              alt="user avatar"
              width={36}
              height={36}
              className="rounded-full border-2 border-gray-400 group-hover:border-[#0066cc] transition-colors"
            />
            <span className="hidden sm:block text-sm text-gray-100 font-medium group-hover:text-white transition-colors whitespace-nowrap">
              <>{userName}</>
            </span>
          </div>

        </div>
      </div>
    </header>
  )
}

export default Header