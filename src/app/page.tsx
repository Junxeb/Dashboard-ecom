"use client"

import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, CoinsIcon, HandHeart, Package, ShoppingBag, ShoppingCart, User, Loader2, XCircle, LogIn } from "lucide-react";
import StatCard from "../../components/StatCard";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import ProductCardLayout from "../../components/ProductCardLayout";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

type MothlySales = {
  type: "month",
  name: string,
  sales: string,
  profit: number,
  cost: number
}

type ProductBase ={
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
  // 🔑 เริ่มต้นด้วยสถานะว่างเปล่า เพื่อป้องกัน Hydration Mismatch ระหว่าง Server กับ Client
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userCartData, setUserCartData] = useState([]);
  const [userOrderData, setUserOrderData] = useState([]);
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  
  // ⏳ ให้สถานะเริ่มเป็นจริงเสมอเพื่อรอตรวจสอบ Session บน Browser 
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // 🔄 1. ตรวจสอบและอัปเดตสถานะ User จาก localStorage ทุกครั้งที่มีการโหลดหน้าจอหรือย้ายหน้ากลับมา
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setCurrentUserId(storedUserId);
    
    // หากตรวจสอบแล้วว่าไม่มีไอดีในระบบ ให้ปิดหน้าจอโหลดทันทีเพื่อแสดงหน้าปุ่ม Sign In
    if (!storedUserId) {
      setIsLoading(false);
    }
  }, []);

  // 🔄 2. วิ่งไปดาวน์โหลดข้อมูลจำลองเมื่อค่ายืนยันตัวตนสำเร็จ (มีค่าแน่ชัดแล้ว)
  useEffect(() => {
    if (!currentUserId) return;

    setIsLoading(true);
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setUserCartData(data.userCarts || []);
        setUserOrderData(data.userOrders || []);
        setSalesData(data.salesData || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setIsLoading(false);
      });
  }, [currentUserId]); 

  // 🎯 กรองข้อมูลตะกร้าสินค้าเฉพาะของ User ปัจจุบัน
  const myCartData = userCartData ? userCartData.filter((cart: any) => cart.userId === currentUserId) : [];
  const totalCarts = myCartData.length;

  // 🎯 กรองข้อมูล Order เฉพาะของ User ปัจจุบัน
  const myOrderData = userOrderData ? userOrderData.filter((order: any) => order.userId === currentUserId) : [];
  
  const validStatuses = ["Paid", "Processing", "Shipped", "Completed"];

  // คำนวณจำนวนออร์เดอร์ และ ยอดรวมเงินที่จ่ายไป
  const totalOrders = myOrderData.filter(order => validStatuses.includes(order.status)).length;
  const totalSpent = myOrderData.filter(order => validStatuses.includes(order.status)).reduce((sum, order) => sum + order.totalPrice, 0);

  const ordersId = myOrderData.map(order => order.orderId);

  // คำนวณค่าระดับของบัญชีตามจำนวนเงินที่จ่ายไป
  let accountTier = "";
  if (totalSpent >= 5000) {
    accountTier = "Platinum";
  } else if (totalSpent >= 2000) {
    accountTier = "Gold";
  } else if (totalSpent >= 500) {
    accountTier = "Silver";
  } else {
    accountTier = "Standard";
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed" : return "bg-[#4DB6AC]";
      case "Shipped" : return "bg-[#38BDF8]";
      case "Processing" : return "bg-[#EAB300]";
      case "Paid" : return "bg-[#7986CB]";
      default : return "bg-[#E57373]";
    }
  }

  const chartData = salesData?.filter(item => item.type === "month");

  // 🚪 หน้าจอระหว่างรอเช็คสถานะการเข้าสู่ระบบ
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen text-gray-400 font-medium bg-[#121212]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#38BDF8] animate-spin" />
          <span>กำลังตรวจสอบสิทธิ์เข้าใช้งาน...</span>
        </div>
      </div>
    );
  }

  // 🚪 กรณีผู้ใช้ยังไม่ได้ Login จะแสดงหน้าต่างแจ้งเตือนให้เข้าสู่ระบบ
  if (!currentUserId) {
    return (
      <div className="flex-1 relative z-10 bg-[#121212] min-h-screen">
        <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8 mb-5 space-y-6">
          <div className="bg-[#1e1e1e] py-24 px-6 rounded-xl border border-[#2d2d2d] flex flex-col items-center justify-center text-center shadow-2xl space-y-6 header-section">
            <div className="w-16 h-16 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-full flex items-center justify-center text-[#38BDF8] shrink-0">
              <LogIn size={32} />
            </div>

            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-bold text-white tracking-wide">Welcome to CARTLY</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                กรุณาเข้าสู่ระบบเพื่อใช้งานแดชบอร์ด ดูข้อมูลคำสั่งซื้อ ตะกร้าสินค้า และรับการแจ้งเตือนต่างๆ ของคุณ
              </p>
            </div>

            <div className="w-full max-w-xs pt-2">
              <button 
                onClick={() => router.push('/signin')} 
                className="w-full py-3 px-6 text-sm font-semibold rounded-lg text-white bg-[#38BDF8] hover:bg-[#29a3d6] transition-colors shadow-lg cursor-pointer transform active:scale-[0.98]"
              >
                Sign In
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 📊 แสดงผลหน้า Dashboard ตามข้อมูลจริงเมื่อล็อกอินสำเร็จแล้ว
  return (
    <div className='flex-1 overflow-auto relative z-10 bg-[#121212] min-h-screen text-white'>
      <main className='max-w-7xl mx-auto py-4 px-4 lg:px-8'>
        <div className='grid gap-5 mb-8'>
          <div className="flex items-center text-sm font-medium text-[#38BDF8]">
            <HandHeart size={40} className='mr-2 ml-2'/> 
            <h1 className='mt-1 text-3xl font-bold text-[#38BDF8]'>Welcome</h1>
          </div>

          <hr className="border-[#656565] border-1 mb-4" />

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
            <StatCard name='Total spents' icon={CoinsIcon} value={`$${totalSpent.toLocaleString()}`} color_bg="#E57373" color_text="#2f2f2f" color_value="#2f2f2f"/>
            <StatCard name='My Carts' icon={ShoppingCart} value={totalCarts} color_bg="#4DB6AC" color_text="#2f2f2f" color_value="#2f2f2f" onClick={() => router.push('/carts')}/>
            <StatCard name='Total Orders' icon={Package} value={totalOrders} color_bg="#7986CB" color_text="#2f2f2f" color_value="#2f2f2f" onClick={() => router.push('/orders')}/>
            <StatCard name='Account Status' icon={User} value={accountTier || "Standard"} color_bg="#EAB300" color_text="#2f2f2f" color_value="#2f2f2f" onClick={() => router.push('/settings')}/>
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
        
                      <Area type="monotone" dataKey="sales" stroke="#38BDF8" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" name="Total Sales" />
                      <Area type="monotone" dataKey="profit" stroke="#4DB6AC" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" name="Net Profit"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div className="bg-[#1e1e1e] p-6 rounded-xl border border-transparent"
                whileHover = {{ y: -5 , boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)', borderColor: '#01579b' }}
              >
                <div className="flex">
                  <ShoppingBag className="mr-2"/>
                  <h3 className="text-white font-semibold mb-4">Recent Product</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {myOrderData && myOrderData.length > 0 ? (
                    [...myOrderData].reverse().slice(0, 2).map((order) => 
                      order.items.map((item: any) => {
                        const product = salesData?.find(
                          (p) => p.type === "product" && p.id === item.productId
                        );

                        return (
                          <ProductCardLayout 
                            key={item.productId}
                            src={product?.src || "/api/placeholder/150/150"}
                            alt={item.name}
                            name={item.name}
                            detail={`Order on. #${order.orderId} | จำนวน: ${item.quantity} ชิ้น`}
                            price={item.price} />
                        );
                      })
                    )
                  ) : (
                    <p className="text-sm text-gray-500 col-span-full py-8 text-center">ไม่มีรายการสินค้าที่เพิ่งสั่งซื้อ</p>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="lg:w-[30%] space-y-6">
              <motion.div className="lg:h-[50%] bg-[#1e1e1e] p-6 rounded-xl border border-transparent"
                whileHover = {{ y: -5 , boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)', borderColor: '#01579b' }}
                onClick={() => router.push('/orders')}
              >
                <div className="flex">
                  <Package className="mr-2" />
                  <h4 className="text-white font-semibold mb-4" >Order Status</h4>
                </div>

                <ul className="space-y-6 relative">
                  {myOrderData && myOrderData.length > 0 ? (
                    myOrderData.slice(0, 3).map((order, index) => (
                      <React.Fragment key={order.orderId}>
                        <li className="flex gap-4 relative">
                          <div className={`w-2 h-2 rounded-full mt-2 z-10 ${getStatusColor(order.status)}`}></div>
                          <div>
                            <p className="text-sm text-white">Order on. #{order.orderId}</p>
                            <p className="text-xs text-[#686868]">{order.status} - {order.date}</p>
                          </div>
                        </li>
                        {index < (myOrderData.slice(0, 3).length - 1) && <hr className="border-[#2d2d2d] border-1 my-2" />}
                      </React.Fragment>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 py-4 text-center">ไม่มีสถานะคำสั่งซื้อ</p>
                  )}
                </ul>
              </motion.div>

              <motion.div className="lg:h-[46.55%] bg-[#1e1e1e] p-6 rounded-xl border border-transparent"
                whileHover = {{ y: -5 , boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)', borderColor: '#01579b' }}
                onClick={() => router.push('/notifications')}
              >
                <div className="flex">
                  <Bell className="mr-2" />
                  <h4 className="text-white font-semibold mb-4" >Notifications</h4> 
                  {myOrderData.length > 0 && (
                    <span className="relative inline-flex h-2 w-2 ml-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E57373] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#cb5e5e]"></span>
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#686868] mb-4">You have {myOrderData.slice(0, 4).length} recent updates</p>
                
                <div className="space-y-4 overflow-y-auto flex-1 max-h-[220px] pr-1 scrollbar-thin">
                  {myOrderData && myOrderData.length > 0 ? (
                    [...myOrderData].reverse().slice(0, 4).map((order) => {
                      let icon = <ShoppingBag className="w-4 h-4 text-[#38BDF8] "/>;
                      let statusText = "New order";
                      let statusColor = "bg-[#38BDF8]/10 text-[#38BDF8]";

                      if(order.status === "Completed") {
                        icon = <CheckCircle className="w-4 h-4 text-[#4DB6AC] "/>;
                        statusText = "Order completed";
                        statusColor = "bg-[#4DB6AC]/10 text-[#4DB6AC]";
                      } else if (order.status === "Processing"){
                        icon = <Loader2 className="w-4 h-4 text-[#EAB300] animate-spin"/>;
                        statusText = "Order processing";
                        statusColor = "bg-[#EAB300]/10 text-[#EAB300]";
                      } else if (order.status === "Shipped"){
                        icon = <Package className="w-4 h-4 text-[#38BDF8] "/>;
                        statusText = "Order shipped";
                        statusColor = "bg-[#38BDF8]/10 text-[#38BDF8]";
                      } else if (order.status === "Cancelled"){
                        icon = <XCircle className="w-4 h-4 text-[#E57373] "/>;
                        statusText = "Order cancelled";
                        statusColor = "bg-[#E57373]/10 text-[#E57373]";
                      }

                      return (
                        <div 
                          key={order.orderId} 
                          className="flex gap-3 p-3 rounded-lg bg-[#121212] hover:bg-[#161616] transition-colors border border-[#2a2a2a]/30"
                        >
                          <div className={`w-8 h-8 rounded-full ${statusColor} flex items-center justify-center shrink-0 mt-0.5`}>
                            {icon}
                          </div>

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
                    <p className="text-sm text-gray-500 text-center py-4">No notifications to display</p>
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