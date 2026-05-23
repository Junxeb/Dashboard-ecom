"use client"

import react from "react";
import { ClipboardCheck , ClipboardX , Van , ClipboardList , PackageSearch ,Warehouse  } from "lucide-react";
import StatCard from "../../../../components/StatCard";
import { motion } from "framer-motion"
import OrderTable from "../../../../components/OrderTable";


export default function Home() {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
        <main className='max-w-7xl mx-auto py-4 px-4 lg:px-8'>
            <div className='grid gap-5 mb-8'>

            <div className="flex items-center text-sm font-medium text-[#38BDF8]">
                <Warehouse   size={40} className='mr-2 ml-2'/> 
                <h1 className='mt-1 text-3xl font-bold text-[#38BDF8]'>Orders </h1>
            </div>

            <hr className="border-[#656565] border-1 mb-4" />

            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8'>
                <StatCard name='Processing' icon={PackageSearch  } value="1" color_bg="#eab300e3" color_text="#2f2f2f" color_value="#2f2f2f"/>
                <StatCard name='Shipped' icon={Van } value="1" color_bg="#38BDF8" color_text="#2f2f2f" color_value="#2f2f2f"/>
                <StatCard name='Completed' icon={ClipboardCheck } value="2" color_bg="#4DB6AC" color_text="#2f2f2f" color_value="#2f2f2f"/>
                <StatCard name='Cancelled' icon={ClipboardX } value="2" color_bg="#E57373" color_text="#2f2f2f" color_value="#2f2f2f"/>
                <StatCard name='All items' icon={ClipboardList } value="5" color_bg="#779ae7" color_text="#2f2f2f" color_value="#2f2f2f"/>
            </div>

                <motion.div whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.5)" }}
                            transition={{ type: "spring", stiffness: 300 }}>
                    <OrderTable/>
                </motion.div>
            

            </div>
        </main>
        </div>
    );
    }