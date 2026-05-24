"use client"

import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, CoinsIcon, HandHeart, Package, ShoppingBag, ShoppingCart, User, Loader2, XCircle } from "lucide-react";
import StatCard from "../../components/StatCard";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import ProductCardLayout from "../../components/ProductCardLayout";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { span } from "framer-motion/m";

type MothlySales = {
  type: "month",
  name: string,
  sales: string,
  profit: number,
  cost: number
}

type  ProductBase ={
  type: "product",
  id: string,
  name: string,
  category: string,
  price: number,
  stock: number,
  sales: number,
  src: string,
  action?: string,
}

type SaleData = MothlySales | ProductBase;

export default function Home() {

  const [userCartData, setUserCartData] = useState([]);
  const [userOrderData, setUserOrderData] = useState([]);
  const [ salesData, setSalesData ] = useState<SaleData[]>([]);

  const router = useRouter()

  useEffect (() => {
    fetch("/data.json")
    .then((res) => res.json())
    .then((data) => {
      setUserCartData(data.userCarts);
      setUserOrderData(data.userOrders);
      setSalesData(data.salesData);
    })
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

  const chartData = salesData?.filter(item => item.type === "month");

  


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
              <motion.div 
                className="bg-[#1e1e1e] p-6 rounded-xl border border-transparent lg:col-span-2"
                whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)', borderColor: '#01579b' }}
              >
                <h3 className="text-white font-semibold mb-6">Sales & Profit Overview</h3>
  
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                        </linearGradient>

                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4DB6AC" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4DB6AC" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
        
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`}/>                 
                      <Tooltip contentStyle={{ backgroundColor: '#121212', border: 'none', borderRadius: '8px', color: '#fff' }} itemStyle={{ fontSize: '12px' }} />
                      <Legend />
        
                      {/* เส้นยอดขาย (Sales) */}
                      <Area type="monotone" dataKey="sales" stroke="#38BDF8" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" name="Total Sales" />
        
                      {/* เส้นกำไร (Profit) */}
                      <Area type="monotone" dataKey="profit" stroke="#4DB6AC" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" name="Net Profit"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>


              {/* แสดงสินค้าที่ทำการซื้อล่าสุด */}
              <motion.div className="bg-[#1e1e1e] p-6 rounded-xl border border-transparent"
                whileHover = {{ y: -5 , boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',borderColor: '#01579b' }}
                onClick={() => router.push('/products')}
              >
                <div className="flex">
                  <ShoppingBag className="mr-2"/>
                  <h3 className="text-white font-semibold mb-4">Recent Product</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {userOrderData && userOrderData.length > 0 ? (
                    [...userOrderData].reverse().slice(0,2).map((order) => 
                      order.items.map((item) => {
                        const product = salesData?.find(
                          (p) => p.type === "product" && p.id === item.productId
                        );

                        return (
                          <ProductCardLayout 
                            key={item.productId}
                            src={product?.src}
                            alt={item.name}
                            name={item.name}
                            detail={`Order on. #${order.orderId} | จำนวน: ${item.quantity} ชิ้น`}
                            price={item.price} />
                        );
                      })
                    )
                  ): (
                    <p className="text-sm text-[#2f2f2f] col-span-full py-4 text-center">Loading....</p>
                  )}
                </div>
              </motion.div>
            </div>


            {/* my orders  components*/}
            <div className="lg:w-[30%] space-y-6">
              <motion.div className="lg:h-[50%] bg-[#1e1e1e] p-6 rounded-xl border border-transparent"
                whileHover = {{ y: -5 , boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',borderColor: '#01579b' }}
                onClick={() => router.push('/orders')}
              >
                <div className="flex">
                  <Package className="mr-2" />
                  <h4 className="text-white font-semibold mb-4" >Order Status</h4>
                </div>

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


              {/* Notifications components */}
              <motion.div className="lg:h-[46.55%] bg-[#1e1e1e] p-6 rounded-xl border border-transparent"
                whileHover = {{ y: -5 , boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',borderColor: '#01579b' }}
                onClick={() => router.push('/notifications')}
              >
                <div className="flex">
                  <Bell className="mr-2" />
                  <h4 className="text-white font-semibold mb-4" >Notifications</h4> 
                  <span className="relative inline-flex h-2 w-2 ml-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E57373] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#cb5e5e]"></span>
                  </span>
                </div>
                <p className="text-sm text-[#686868] mb-4">You have 4 new notifications</p>
                

                <div className="space-y-4 overflow-y-auto flex-1 max-h[380px] pr-1 scrollbar-thin ">
                  {userOrderData && userOrderData.length > 0 ? (
                    [...userOrderData].reverse().slice(0,4).map((order) => {
                      let icon = <ShoppingBag className="w-4 h-4 text-[#38BDF8] "/>;
                      let statusText = "New order";
                      let statusColor = "getStatusColor(cart.status)";

                      if(order.status === "Completed") {
                        icon = <CheckCircle className="w-4 h-4 text-[getStatusColor(order.status)] "/>;
                        statusText = "Order completed";
                        statusColor = getStatusColor(order.status);
                      } else if (order.status === "Processing"){
                        icon = <Loader2 className="w-4 h-4 text-[getStatusColor(order.status)] animate-spin"/>;
                        statusText = "Order is processing";
                        statusColor = getStatusColor(order.status);
                      } else if (order.status === "Shipped"){
                        icon = <Package className="w-4 h-4 text-[getStatusColor(order.status)] "/>;
                        statusText = "Order shipped";
                        statusColor = getStatusColor(order.status);
                      } else if (order.status === "Cancelled"){
                        icon = <XCircle className="w-4 h-4 text-[getStatusColor(order.status)] "/>;
                        statusText = "Order cancelled";
                        statusColor = getStatusColor(order.status);
                      }

                      return (
                        <div 
                          key={order.orderId} 
                          className="flex gap-3 p-3 rounded-lg bg-[#121212] hover:bg-[#161616] transition-colors border border-[#2a2a2a]/30"
                        >
                          {/* วงกลมใส่ไอคอนตามสถานะ */}
                          <div className={`w-8 h-8 rounded-full ${statusColor} flex items-center justify-center shrink-0 mt-0.5`}>
                            {icon}
                          </div>

                          {/* ข้อความแจ้งเตือน */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-white truncate">
                              {statusText} <span className="font-mono text-[#38BDF8]">#{order.orderId}</span>
                            </p>
                            <span className="text-[10px] text-gray-500 shrink-0 font-mono">
                              {order.date}
                            </span>
                          </div>
                            <p className="text-[11px] text-gray-400 mt-1 truncate">
                              Total price: ${order.totalPrice.toLocaleString()} by. {order.paymentMethod || "system"}
                            </p>
                          </div>
                        </div>
                      );
                    })
                    ) : (
                      <p className="text-sm text-[#686868]">No notifications to display</p>
                    )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}