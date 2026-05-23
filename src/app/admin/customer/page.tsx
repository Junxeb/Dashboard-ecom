"use client";

import CustomerTable from "../../../../components/CustomerTable";
import {  Users, UserRoundPlus, UserRoundX, UserRoundCheck   } from "lucide-react";
import StatCard from "../../../../components/StatCard";
import { motion } from "framer-motion"

export default function Clients() {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
        <main className='max-w-7xl mx-auto py-4 px-4 lg:px-8'>
            <div className='grid gap-5 mb-8'>

            <div className="flex items-center text-sm font-medium text-[#38BDF8]">
                <Users   size={40} className='mr-2 ml-2'/> 
                <h1 className='mt-1 text-3xl font-bold text-[#38BDF8]'>Customer  </h1>
            </div>

            <hr className="border-[#656565] border-1 mb-4" />

            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
                <StatCard name='New' icon={UserRoundPlus   } value="2" color_bg="#38BDF8" color_text="#2f2f2f" color_value="#2f2f2f"/>
                <StatCard name='Online' icon={UserRoundCheck  } value="1" color_bg="#4DB6AC" color_text="#2f2f2f" color_value="#2f2f2f"/>
                <StatCard name='Off-Online' icon={UserRoundX  } value="2" color_bg="#E57373" color_text="#2f2f2f" color_value="#2f2f2f"/>
                <StatCard name='All' icon={Users } value="5" color_bg="#779ae7" color_text="#2f2f2f" color_value="#2f2f2f"/>
            </div>

                <motion.div whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.5)" }}
                            transition={{ type: "spring", stiffness: 300 }}>
                    <CustomerTable/>
                </motion.div>
            

            </div>
        </main>
        </div>
    )
}