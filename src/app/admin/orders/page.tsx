"use client"

import React, { useEffect, useState } from "react";
import { ClipboardCheck , ClipboardX , Van , ClipboardList , PackageSearch , Warehouse  } from "lucide-react";
import StatCard from "../../../../components/StatCard";
import { motion } from "framer-motion"
import OrderTable from "../../../../components/OrderTable";

interface Order {
  orderId: string;
  cartId: string;
  userId: string;
  date: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  totalPrice: number;
  status: "Processing" | "Shipped" | "Completed" | "Cancelled";
  paymentMethod: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/data.json");
        const data = await res.json();
        setOrders(data.userOrders ?? []); // ✅ ใช้ userOrders
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };
    fetchOrders();
  }, []);

  const processingCount = orders.filter(o => o.status === "Processing").length;
  const shippedCount = orders.filter(o => o.status === "Shipped").length;
  const completedCount = orders.filter(o => o.status === "Completed").length;
  const cancelledCount = orders.filter(o => o.status === "Cancelled").length;
  const allCount = orders.length;

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <main className='max-w-7xl mx-auto py-4 px-4 lg:px-8'>
        <div className='grid gap-5 mb-8'>
          <div className="flex items-center text-sm font-medium text-[#38BDF8]">
            <Warehouse size={40} className='mr-2 ml-2'/> 
            <h1 className='mt-1 text-3xl font-bold text-[#38BDF8]'>User Orders</h1>
          </div>

          <hr className="border-[#656565] border-1 mb-4" />

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8'>
            <StatCard name='Processing' icon={PackageSearch} value={processingCount} color_bg="#eab300e3" color_text="#2f2f2f" color_value="#2f2f2f"/>
            <StatCard name='Shipped' icon={Van} value={shippedCount} color_bg="#38BDF8" color_text="#2f2f2f" color_value="#2f2f2f"/>
            <StatCard name='Completed' icon={ClipboardCheck} value={completedCount} color_bg="#4DB6AC" color_text="#2f2f2f" color_value="#2f2f2f"/>
            <StatCard name='Cancelled' icon={ClipboardX} value={cancelledCount} color_bg="#E57373" color_text="#2f2f2f" color_value="#2f2f2f"/>
            <StatCard name='All items' icon={ClipboardList} value={allCount} color_bg="#779ae7" color_text="#2f2f2f" color_value="#2f2f2f"/>
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
