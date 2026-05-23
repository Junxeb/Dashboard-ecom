    "use client"

    import { TrendingUp , TrendingDown , Calculator, HandCoins, CircleDollarSign, PackageSearch, Store } from "lucide-react";
    import StatCard from "../../../../components/StatCard";
    import { motion } from "framer-motion"
    import SalesOverviewChart from "../../../../components/SalesOverviewChart";
    import PieCharts from "../../../../components/PieCharts";
    import ProductCard from "../../../../components/ProductCard";
    import ImageGridWithText from "../../../../components/ImageGridWithText";

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


            <div className="flex items-center text-sm font-medium text-[#38BDF8]">
                <PackageSearch   size={40} className='mr-2 ml-2'/> 
                <h1 className='mt-1 text-3xl font-bold text-[#38BDF8]'>Product</h1>
            </div>

            <hr className="border-[#656565] border-1 mb-4" />

            <div className="flex gap-2">

                <div className="w-1/2 bg-[#1e1e1e] rounded-xl overflow-auto">

                    <div className="flex items-center text-sm font-medium text-[#EAB300] mb-3">
                        <Store    size={30} className='mr-2 ml-2 mt-2'/> 
                        <h1 className='mt-2 text-xl font-bold text-[#EAB300]'>Best Selling</h1>
                    </div>

                    <div className="flex flex-col gap-4 m-4 h-83 overflow-y-auto">
                        <ImageGridWithText src="https://i2.cloudfable.net/styles/735x735/8.51/Black/ed-tuxedo-bow-tie-suit-father-shirt-20221011202515-ezbmu23z.jpg" 
                        texts="
                        เสื้อยืดสีดำตัวนี้ถูกออกแบบให้มีลายพิมพ์เป็นชุดสูททักซิโด้ที่ดูเหมือนจริงมากจนทำให้ผู้สวมใส่ดูเหมือนใส่ชุดทางการในขณะที่ยังคงความสบายของเสื้อยืด.
                        ลวดลายด้านหน้ามีเส้นสีขาวที่วาดเป็นเสื้อสูทเต็มตัวพร้อมรายละเอียดของปกเสื้อและกระดุมที่เรียงลงมาตามแนวกลาง.
                        ตรงบริเวณคอเสื้อมีการพิมพ์โบว์ไทสีดำที่ทำให้เสื้อดูเหมือนมีเครื่องแต่งกายครบชุด.
                        การออกแบบนี้สร้างความตลกและความแปลกใหม่เพราะมันผสมผสานระหว่างความเป็นทางการกับความชิล.
                        "/>
                        
                    </div>


                    
                    
                    

                </div>

                <div className="w-1/2 ">
                    <motion.div 
                    className="max-h-96"
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