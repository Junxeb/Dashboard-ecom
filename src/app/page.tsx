"use client"

import react from "react";
import { HomeUserCard } from "../../components/HomeUserCard";
import { Bell, CoinsIcon, HandHeart, Package, ShoppingCart, User, Wallet } from "lucide-react";
import StatCard from "../../components/StatCard";
import ResponsiveImage from "../../components/ResponsiveImage";

export default function Home() {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <main className='max-w-7xl mx-auto py-4 px-4 lg:px-8'>
        <div className='grid gap-5 mb-8'>
          <div className="flex items-center text-sm font-medium text-[#38BDF8]">
            <HandHeart size={40} className='mr-2 ml-2'/> 
            <h1 className='mt-1 text-3xl font-bold text-[#38BDF8]'>Welcome</h1>
          </div>

          <hr className="border-[#656565] border-1 mb-4" />

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
            <StatCard name='Total price orders' icon={CoinsIcon} value="5,879" color_bg="#E57373" color_text="#2f2f2f" color_value="#2f2f2f"/>
            <StatCard name='My Cards' icon={ShoppingCart} value="24" color_bg="#4DB6AC" color_text="#2f2f2f" color_value="#2f2f2f"/>
            <StatCard name='Total Orders' icon={Package} value="69" color_bg="#7986CB" color_text="#2f2f2f" color_value="#2f2f2f"/>
            <StatCard name='Account Status' icon={User} value="Gold" color_bg="#EAB300" color_text="#2f2f2f" color_value="#2f2f2f"/>
          </div>
        </div>
      </main>
    </div>
  );
}