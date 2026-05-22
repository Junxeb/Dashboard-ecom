"use client"

import react from "react";
import { CoinsIcon, HandHeart, Package, ShoppingBag, ShoppingCart, SquareActivity, User, Users, Wallet } from "lucide-react";
import StatCard from "../../../components/StatCard";


export default function Home() {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <main className='max-w-7xl mx-auto py-4 px-4 lg:px-8'>
        <div className='grid gap-5 mb-8'>

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
            <StatCard name='Total Sales' icon={Wallet} value="5,879" color_bg="#E57373" color_text="#2f2f2f" color_value="#2f2f2f"/>
            <StatCard name='Total Customer' icon={Users} value="24" color_bg="#4DB6AC" color_text="#2f2f2f" color_value="#2f2f2f"/>
            <StatCard name='Total Product' icon={ShoppingBag} value="28" color_bg="#7986CB" color_text="#2f2f2f" color_value="#2f2f2f"/>
            <StatCard name='Stock' icon={SquareActivity} value="Gold" color_bg="#EAB300" color_text="#2f2f2f" color_value="#2f2f2f"/>
          </div>

        </div>
      </main>
    </div>
  );
}