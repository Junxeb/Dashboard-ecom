"use client"

import React, { useEffect, useState } from "react";
import { 
    Package, 
    CheckCircle, 
    Truck, 
    Clock, 
    XCircle, 
    Calendar, 
    CreditCard, 
    Wallet, 
    ArrowRight,
    User
} from "lucide-react";

// --- Types ---
type OrderItem = {
    productId: string;
    name: string;
    quantity: number;
    price: number;
};

type UserOrder = {
    orderId: string;
    cartId: string;
    userId: string;
    date: string;
    items: OrderItem[];
    totalPrice: number;
    status: "Completed" | "Shipped" | "Processing" | "Cancelled";
    paymentMethod: string;
};

type ProductItem = {
    id: string;
    src: string;
};

export default function MyOrders() {
    const [orders, setOrders] = useState<UserOrder[]>([]);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const currentUserId = "U789";

    useEffect(() => {
        fetch("/data.json")
        .then((res) => res.json())
        .then((data) => {
            // กรองเฉพาะ Order ของ User U789
            const myOrders = data.userOrders.filter((o: any) => o.userId === currentUserId);
            setOrders(myOrders);
        
            // เก็บข้อมูลสินค้าไว้ดึงรูปภาพ
            const productList = data.salesData.filter((s: any) => s.type === "product");
            setProducts(productList);
        })
        .catch((err) => console.error("Error loading orders:", err));
    }, []);

    // ฟังก์ชันดึงรูปภาพสินค้า
    const getImg = (pid: string) => {
        const found = products.find(p => p.id === pid);
        return found?.src || "";
    };

    // ฟังก์ชันจัดการสีและไอคอนตาม Status
    const getStatusDisplay = (status: UserOrder["status"]) => {
        switch (status) {
            case "Completed":
                return { color: "text-[#4DB6AC] bg-[#4DB6AC]/10 border-[#4DB6AC]/20", icon: <CheckCircle size={14} /> };
            case "Shipped":
                return { color: "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/20", icon: <Truck size={14} /> };
            case "Processing":
                return { color: "text-[#FFC107] bg-[#FFC107]/10 border-[#FFC107]/20", icon: <Clock size={14} /> };
            case "Cancelled":
                return { color: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20", icon: <XCircle size={14} /> };
            default:
                return { color: "text-gray-400 bg-gray-400/10 border-gray-400/20", icon: <Package size={14} /> };
        }
    };

    return (
        <div className="flex-1 overflow-auto relative z-10 bg-[#121212] min-h-screen text-white">
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 space-y-6">
        
                {/* Header Section */}
                <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2d2d2d] shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h4 className="text-white text-xl font-semibold flex items-center">
                            <Package className="inline mr-3 text-[#38BDF8]" size={26} />
                            My Orders
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#262626] px-4 py-2 rounded-lg border border-[#333333]">
                            <User size={14} className="text-blue-400" />
                            <span>History for: <strong className="text-white">{currentUserId}</strong></span>
                        </div>
                    </div>
                <hr className="border-[#333333] mt-4 mb-2" />

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.length > 0 ? (
                        orders.map((order) => {
                            const statusUI = getStatusDisplay(order.status);
                            return (
                                <div 
                                    key={order.orderId} 
                                    className="bg-[#1e1e1e] rounded-xl border border-[#2d2d2d] overflow-hidden hover:border-[#3d3d3d] transition-all"
                                >

                                {/* Top Bar: Order Info & Status */}
                                <div className="bg-[#252525]/50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-[#2d2d2d]">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Order ID</p>
                                            <p className="text-sm font-mono text-blue-400 font-semibold">{order.orderId}</p>
                                        </div>

                                    <div className="h-8 w-[1px] bg-[#333]"></div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Date</p>
                                            <p className="text-sm text-gray-300">{order.date}</p>
                                        </div>
                                    </div>
                    
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${statusUI.color}`}>
                                        {statusUI.icon}
                                        {order.status}
                                    </div>
                                </div>

                                {/* Content: Items in Order */}
                                <div className="p-6">
                                    <div className="divide-y divide-[#2d2d2d]">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <img 
                                                        src={getImg(item.productId)} 
                                                        alt={item.name} 
                                                        className="w-16 h-16 object-cover rounded-lg border border-[#333] bg-[#1a1a1a]"
                                                    />

                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-100">{item.name}</h5>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Qty: <span className="text-gray-300">{item.quantity}</span> × ${item.price.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-sm font-mono text-gray-300">
                                                    ${(item.quantity * item.price).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Bottom Bar: Payment & Total */}
                            <div className="px-6 py-4 bg-[#252525]/30 border-t border-[#2d2d2d] flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Wallet size={14} className="text-gray-500" />
                                    Paid via: <span className="text-gray-200">{order.paymentMethod}</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Total Amount</span>
                                    <span className="text-xl font-bold text-emerald-400 font-mono">
                                        ${order.totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })
                ) : (
                        <div className="bg-[#1e1e1e] p-20 rounded-xl border border-[#2d2d2d] flex flex-col items-center justify-center text-gray-500">
                            <Package size={48} className="mb-4 opacity-20" />
                            <p>No orders found for this user.</p>
                        </div>
                    )}
                    </div>
                </div>
            </main>
        </div>
    );
}