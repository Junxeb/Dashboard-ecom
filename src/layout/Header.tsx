
import React from 'react'
import Image from 'next/image'
import { Bell, LayoutDashboard  } from 'lucide-react'

const Header = () => {
  return (
    <header className = "bg-[#1e1e1e] shadow-lg border-b border-[#1f1f1f] mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg p-4">
      <div className = "max-w-7xl mx-auto py-2 px-4 sm:px-6 flex items-center justify-between">

            {/* <Image
              src="/favicon.ico"
              alt="Admin"
              width={37}
              height={37}
              className = "rounded-full "
            /> */}
            <LayoutDashboard  className = "w-5 sm:w-6 h-5 sm:h-6 text-gray-300 cursor-pointer hover:text-white" />
            <h1 className = "text-xl font-bold text-white ml-3">Dashboard</h1>

        <div className = "flex items-center space-x-3 sm:space-x-6">

          <div className = "relative">
            <Bell className = "w-5 sm:w-6 h-5 sm:h-6 text-gray-300 cursor-pointer hover:text-white" />
          </div>

          <div className = "flex items-center space-x-2 sm:space-x-3">
            <Image
              src="/admin.jpg"
              alt="Admin"
              width={32}
              height={32}
              className = "rounded-full border border-gray-300"
            />
            <span className = "hidden sm:block text-gray-100 font-medium">John Doe</span>
          </div>

        </div>

      </div>
    </header>
  )
}

export default Header