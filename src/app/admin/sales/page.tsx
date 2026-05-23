    "use client"

    import { TrendingUp , TrendingDown , Calculator, HandCoins, CircleDollarSign, PackageSearch, Store } from "lucide-react";
    import StatCard from "../../../../components/StatCard";
    import { motion } from "framer-motion"
    import SalesOverviewChart from "../../../../components/SalesOverviewChart";
    import PieCharts from "../../../../components/PieCharts";
    import ProductCard from "../../../../components/ProductCard";
    import ImageGridWithText from "../../../../components/ImageGridWithText";
    import Bar_Chart from "../../../../components/Bar_Chart";


    export default function Sales() {
        return (
        <div className='flex-1 overflow-auto relative z-10'>
        <main className='max-w-7xl mx-auto py-4 px-4 lg:px-8'>
            <div className='grid gap-5 mb-8'>

            <div className="flex items-center text-sm font-medium text-[#38BDF8]">
                <HandCoins  size={40} className='mr-2 ml-2'/> 
                <h1 className='mt-1 text-3xl font-bold text-[#38BDF8]'>Profit </h1>
            </div>

            <hr className="border-[#656565] border-1 mb-4" />

            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
                <StatCard name='Highest  ' icon={TrendingUp  } value="4500" color_bg="#4DB6AC" color_text="#2f2f2f" color_value="#2f2f2f"/>
                <StatCard name='Lowest ' icon={TrendingDown   } value="700" color_bg="#E57373" color_text="#2f2f2f" color_value="#2f2f2f"/>
                <StatCard name='Average ' icon={Calculator  } value="2,333" color_bg="#3fc0f7da" color_text="#2f2f2f" color_value="#2f2f2f"/>
                <StatCard name='Sum' icon={CircleDollarSign   } value="28,000" color_bg="#EAB300" color_text="#2f2f2f" color_value="#2f2f2f"/>
            </div>

            <motion.div whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.5)" }}
                        transition={{ type: "spring", stiffness: 300 }}>
                <SalesOverviewChart/>
            </motion.div>

            <motion.div whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.5)" }}
                        transition={{ type: "spring", stiffness: 300 }}>
                <Bar_Chart metrics={["profit", "cost"]}/>
            </motion.div>


            </div>
        </main>
        </div>
        )
    }