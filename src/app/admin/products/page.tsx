"use client";

import ProductsTable from "../../../../components/ProductsTable";
import {  Store, PackageSearch, CircleDollarSign, ShelvingUnit, Forklift, Package        } from "lucide-react";
import StatCard from "../../../../components/StatCard";
import { motion } from "framer-motion"
import PieCharts from "../../../../components/PieCharts";
import ImageGridWithText from "../../../../components/ImageGridWithText";

export default function Products() {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
        <main className='max-w-7xl mx-auto py-4 px-4 lg:px-8'>
            <div className='grid gap-5 mb-8'>

            <div className="flex items-center text-sm font-medium text-[#38BDF8]">
                <PackageSearch    size={40} className='mr-2 ml-2'/> 
                <h1 className='mt-1 text-3xl font-bold text-[#38BDF8]'>Products   </h1>
            </div>

            <hr className="border-[#656565] border-1 mb-4" />

            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
                <StatCard name='Best selling category' icon={ShelvingUnit   } value="Clothing " color_bg="#38BDF8" color_text="#2f2f2f" color_value="#2f2f2f"/>
                <StatCard name='Best selling products' icon={Package  } value="Shampoo " color_bg="#4DB6AC" color_text="#2f2f2f" color_value="#2f2f2f"/>
                <StatCard name='Sales of all products' icon={Forklift  } value="3,800 " color_bg="#E57373" color_text="#2f2f2f" color_value="#2f2f2f"/>
                <StatCard name='Total sales' icon={CircleDollarSign  } value="362,862.2" color_bg="#779ae7" color_text="#2f2f2f" color_value="#2f2f2f"/>
            </div>

                <motion.div whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.5)" }}
                            transition={{ type: "spring", stiffness: 300 }}>
                    <ProductsTable/>
                </motion.div>

                <div className="flex gap-2">

                <motion.div 
                whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.5)" }}
                className="w-1/2 bg-[#1e1e1e] rounded-xl overflow-auto">

                    <div className="flex items-center text-sm font-medium text-[#EAB300] mb-3">
                        <Store    size={30} className='mr-2 ml-2 mt-2'/> 
                        <h1 className='mt-2 text-xl font-bold text-[#EAB300]'>Best Selling</h1>
                    </div>

                    <div className="flex flex-col gap-4 m-4 h-83 overflow-y-auto">
                        <ImageGridWithText src="https://arkiveheadcare.com/cdn/shop/files/AllDayEverydayShampoo.jpg?v=1687812081" 
                        texts="
                        The ARKIVE All Day Everyday Shampoo, designed to keep your hair feeling fresh, clean, and nourished throughout the day.
                        Its lightweight formula gently removes impurities while maintaining natural moisture balance, leaving your hair soft and manageable.
                        Perfect for daily use, this shampoo works well for all hair types and helps restore shine and vitality.
                        "/>
                        
                    </div>


                    
                    
                    

                </motion.div>

                <div className="w-1/2">
                    <motion.div 
                    className="max-h-98"
                    whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.5)" }}
                        transition={{ type: "spring", stiffness: 300 }}>
                        <PieCharts/>
                    </motion.div>
                </div>

            </div>

            

            </div>
        </main>
        </div>
    )
}