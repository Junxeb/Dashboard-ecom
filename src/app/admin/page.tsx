"use client"

import react from "react";
import {  ChartLine , ShoppingBag, HeartHandshake , UserRoundPlus ,Users, Wallet } from "lucide-react";
import StatCard from "../../../components/StatCard";
import Bar_Chart from "../../../components/Bar_Chart";
import { motion } from "framer-motion"


export default function Home() {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <main className='max-w-7xl mx-auto py-4 px-4 lg:px-8'>
        <div className='grid gap-5 mb-8'>

            <div className="flex items-center text-sm font-medium text-[#38BDF8]">
                <HeartHandshake   size={40} className='mr-2 ml-2'/> 
                <h1 className='mt-1 text-3xl font-bold text-[#38BDF8]'>Welcome </h1>
            </div>

            <hr className="border-[#656565] border-1 mb-4" />

            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
              <StatCard name='Total Sales' icon={Wallet} value="3,800" color_bg="#E57373" color_text="#2f2f2f" color_value="#2f2f2f"/>
              <StatCard name='Total Customer' icon={Users} value="5" color_bg="#4DB6AC" color_text="#2f2f2f" color_value="#2f2f2f"/>
              <StatCard name='Total Product' icon={ShoppingBag} value="20" color_bg="#7986CB" color_text="#2f2f2f" color_value="#2f2f2f"/>
              <StatCard name='New Customer' icon={UserRoundPlus } value="2" color_bg="#EAB300" color_text="#2f2f2f" color_value="#2f2f2f"/>
            </div>

            <hr className="border-[#656565] border-1 " />

            <div className="flex items-center text-sm font-medium text-[#38BDF8]">
                <ChartLine    size={40} className='mr-2 ml-2'/> 
                <h1 className='mt-1 text-3xl font-bold text-[#38BDF8]'>Graph </h1>
            </div>

            <motion.div
            whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.5)" }}
            transition={{ type: "spring", stiffness: 300 }}
            >
              <Bar_Chart metrics={["profit"]}/>
            </motion.div>

        </div>
      </main>
    </div>
  );
}