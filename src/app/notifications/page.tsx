"use client";

import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, ShoppingBag, Package, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

type OrderItem = {
    productId: string;
    name: string;
    quantity: number;
    price: number;
};

type OrderData = {
    orderId: string;
    date: string;
    status: string;
    totalPrice: number;
    paymentMethod?: string;
    items: OrderItem[];
};

export default function Notifications() {
    const [userOrderData, setUserOrderData] = useState<OrderData[]>([]);
    const [loading, setLoading] = useState(true);

    // ดึงข้อมูลออเดอร์จาก data.json เหมือนหน้าแรก
    useEffect(() => {
        fetch("/data.json")
        .then((res) => res.json())
        .then((data) => {
            setUserOrderData(data.userOrders || []);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching data:", err);
            setLoading(false);
        });
    }, []);

    // ฟังก์ชันดึงสีตามสถานะออเดอร์ (ล้อตามฟังก์ชันหน้าหลัก)
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed": return "bg-[#4DB6AC]";
            case "Shipped": return "bg-[#38BDF8]";
            case "Processing": return "bg-[#EAB300]";
            default: return "bg-[#E57373]";
        }
    };

    return (
        <div className="flex-1 overflow-auto relative z-10 bg-[#121212] min-h-screen text-white">
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 space-y-6">
        
            {/* Card บล็อกหลัก */}
            <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2d2d2d] shadow-xl">

                {/* ส่วนหัวข้อและจำนวนแจ้งเตือนทั้งหมด */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h4 className="text-white text-xl font-semibold flex items-center">
                            <Bell className="inline mr-3 text-[#38BDF8]" size={26} />
                            My Notifications
                        </h4>
                        <p className="text-sm text-[#686868] mt-1">
                            {loading ? "กำลังโหลดข้อมูล..." : `You have ${userOrderData.length} notifications in total`}
                        </p>
                    </div>
                </div>

                <hr className="border-[#333333] mt-4 mb-6" />
          
                {/* ส่วนแสดงรายการ Notification */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-[#686868] gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-[#38BDF8]" />
                            <p className="text-sm">Loading notifications...</p>
                        </div>
                    ) : userOrderData && userOrderData.length > 0 ? (

                    // เรียงจากใหม่ล่าสุดไปเก่าสุด และแสดงรายการทั้งหมดที่มีในฐานข้อมูล
                        [...userOrderData].reverse().map((order, index) => {
                            let icon = <ShoppingBag className="w-5 h-5 text-white" />;
                            let statusText = "New order";
                            let statusColor = getStatusColor(order.status);

                            if (order.status === "Completed") {
                                icon = <CheckCircle className="w-5 h-5 text-white" />;
                                statusText = "Order completed";
                            } else if (order.status === "Processing") {
                                icon = <Loader2 className="w-5 h-5 text-white animate-spin" />;
                                statusText = "Order is processing";
                            } else if (order.status === "Shipped") {
                                icon = <Package className="w-5 h-5 text-white" />;
                                statusText = "Order shipped";
                            } else if (order.status === "Cancelled") {
                                icon = <XCircle className="w-5 h-5 text-white" />;
                                statusText = "Order cancelled";
                            }

                            return (
                            <motion.div
                                key={order.orderId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex gap-4 p-4 rounded-xl bg-[#161616] hover:bg-[#1c1c1c] transition-all border border-[#2a2a2a]/40 hover:border-[#38BDF8]/30 group"
                            >
                                {/* วงกลมใส่ไอคอนตามสถานะออเดอร์ */}
                                <div className={`w-10 h-10 rounded-xl ${statusColor} flex items-center justify-center shrink-0 shadow-lg`}>
                                    {icon}
                                </div>

                                {/* ข้อความและรายละเอียดภายในออเดอร์ */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                        <p className="text-sm font-semibold text-white flex items-center gap-2">
                                            {statusText} 
                                            <span className="font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded text-xs">
                                                #{order.orderId}
                                            </span>
                                        </p>
                                        <span className="text-xs text-gray-500 font-mono sm:self-center">
                                            {order.date}
                                        </span>
                                    </div>

                                    {/* รายละเอียดเพิ่มเติม แสดงราคาและการจ่ายเงิน */}
                                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                                        Your order has a total amount of{" "}
                                        <span className="text-white font-medium">
                                            ${order.totalPrice ? order.totalPrice.toLocaleString() : "0"}
                                        </span>{" "}
                                        paid by. {order.paymentMethod || "ระบบอัติโนมัติ"} already completed.
                                    </p>
                                </div>

                                </motion.div>
                            );
                        })
                    ) : (
                            <div className="text-center py-12 text-[#686868]">
                                <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No notifications to display</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}