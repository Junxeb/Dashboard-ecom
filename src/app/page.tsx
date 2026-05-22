"use client"

import React, { useEffect, useState } from "react";
import { CoinsIcon, HandHeart, Package, ShoppingCart, User } from "lucide-react";
import StatCard from "../../components/StatCard";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';


export default function Home() {

  const [userCartData, setUserCartData] = useState();
  const [userOrderData, setUserOrderData] = useState();

  const router = useRouter()

  useEffect (() => {
    fetch("/data.json")
    .then((res) => res.json())
    .then((data) => setUserCartData(data.userCarts))
  }, []);

  useEffect (() => {
    fetch("/data.json")
    .then((res) => res.json())
    .then((data) => setUserOrderData(data.userOrders))
  }, []);

  // ใช้คำนวณจำนวนตะกร้า ของที่สั่ง เงินที่จ่ายทั้งหมด
  const totalCarts = userCartData ? userCartData.length : 0;
  const totalOrders = userOrderData ? userOrderData.filter(cart => ["Processing", "Shipped", "Completed"].includes(cart.status)).length : 0;
  const totalSpent = userOrderData ? userOrderData.filter(cart => ["Processing", "Completed", "Shipped"].includes(cart.status)).reduce((sum,cart) => sum + cart.totalPrice, 0) : 0;

  // ดึงเฉพาะ orderId จากทุกรายการสินค้าออกมาเป็นอาเรย์ เช่น ["CRT001", "CRT002", ...]
  const ordersId = userOrderData ? userOrderData.map(order => order.orderId) : [];

  // คำนวณค่าระดับของบัญชีตามจำนวนเงินที่จ่ายไป
  let accountTier = "";
  if (totalSpent >= 5000) {
    accountTier = "Platinum";
  } else if (totalSpent >= 2000) {
    accountTier ="Gold";
  } else if (totalSpent >= 500) {
    accountTier ="Silver"
  } else if (totalSpent >= 1){
    accountTier = "Standard"
  } else {
    accountTier = ""
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed" : return "bg-[#4DB6AC]";
      case "Shipped" : return "bg-[#38BDF8]";
      case "Processing" : return "bg-[#EAB300]";
      default : return "bg-[#E57373]";
    }
  }


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
            <StatCard name='Total spents' icon={CoinsIcon} value={totalSpent} color_bg="#E57373" color_text="#2f2f2f" color_value="#2f2f2f"/>
            <StatCard name='My Carts' icon={ShoppingCart} value={totalCarts} color_bg="#4DB6AC" color_text="#2f2f2f" color_value="#2f2f2f" onClick={() => router.push('/carts')}/>
            <StatCard name='Total Orders' icon={Package} value={totalOrders} color_bg="#7986CB" color_text="#2f2f2f" color_value="#2f2f2f" onClick={() => router.push('/orders')}/>
            <StatCard name='Account Status' icon={User} value={accountTier} color_bg="#EAB300" color_text="#2f2f2f" color_value="#2f2f2f" onClick={() => router.push('/settings')}/>
          </div>

          <div className="flex flex-col lg:flex-row gap-5">
            <div className="lg:w-[70%] space-y-6">
              <motion.div className="bg-[#1e1e1e] p-6 rounded-xl border border-transparent"
                whileHover = {{ y: -5 , boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',borderColor: '#01579b' }}
              >
                <h3 className="text-white font-semibold mb-4">Recent Product</h3>
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  {/* ใส่ table or list */}
                </div>
              </motion.div>

              <motion.div className="bg-[#1e1e1e] p-6 rounded-xl border border-transparent"
                whileHover = {{ y: -5 , boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',borderColor: '#01579b' }}
              >
                <h3 className="text-white font-semibold mb-4">Recent Product</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#121212] rounded-lg">Product A - $ 200</div>
                  <div className="p-4 bg-[#121212] rounded-lg">Product A - $ 200</div>
                  <div className="p-4 bg-[#121212] rounded-lg">Product A - $ 200</div>
                </div>
              </motion.div>
            </div>

            <div className="lg:w-[30%] space-y-6">
              <motion.div className="lg:h-[50%] bg-[#1e1e1e] p-6 rounded-xl border border-transparent"
                whileHover = {{ y: -5 , boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',borderColor: '#01579b' }}
                onClick={() => router.push('/orders')}
              >
                <h4 className="text-white font-semibold mb-4" >Order Status</h4>
                <ul className="space-y-6 relative">
                  {/* ทำเส้น Timeline สีฟ้า */}
                  {userOrderData && userOrderData.slice(0,3).map((order,index) => (
                    <React.Fragment key={order.orderId}>
                      <li className="flex gap-4 relative">
                        <div className={`w-2 h-2 rounded-full mt-2 z-10 ${getStatusColor(order.status)}`}></div>
                        <div>
                          <p className="text-sm text-white">Order on. #{order.orderId}</p>
                          <p className="text-xs text-[#686868]">{order.status} - {order.date}</p>
                        </div>
                      </li>
                      {index < (userOrderData ? userOrderData.slice(0, 3).length - 1 : 0) && <hr className="border-[#656565] border-1 mb-4" />}
                      
                    </React.Fragment>
                  ))}
                  
                </ul>
              </motion.div>

              <motion.div className="lg:h-[46.55%] bg-[#1e1e1e] p-6 rounded-xl border border-transparent"
                whileHover = {{ y: -5 , boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',borderColor: '#01579b' }}
              >
                <h4 className="text-white font-semibold mb-4" >Order Status</h4>
                <ul className="space-y-6 relative">
                  {/* ทำเส้น Timeline สีฟ้า */}
                  <li className="flex gap-4 relative">
                    <div className="w-2 h-2 rounded-full bg-[#38BDF8] mt-2 z-10"></div>
                    <div>
                      <p className="text-sm text-white">0rder #1234</p>
                      <p className="text-xs text-[#686868]">Shipped - 2 mins ago</p>
                    </div>
                  </li>
                  <hr className="border-[#656565] border-1 mb-4" />
                  <li className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#EAB300] mt-2 z-10"></div>
                    <div>
                      <p className="text-sm text-white">0rder #7895</p>
                      <p className="text-xs text-[#686868]">Processing - 1 hour ago</p>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}