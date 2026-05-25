"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { motion } from 'framer-motion'

type ProductCardLayoutProps = {
    id?: string;        // 🆕 เพิ่ม id ของสินค้าเข้ามาเพื่อใช้คู่กับ userId ตอนส่งข้อมูล
    src: string;       // path ของรูป
    alt?: string;      // คำอธิบายรูป
    name: string;
    detail: string;
    price?: number;      
    currentUserId: string | null; // 🟢 เปลี่ยนมารับ currentUserId แทน boolean แล้ว
};

function ProductCardLayout({ id, src, alt, name, detail, price, currentUserId }: ProductCardLayoutProps) {
    // 1. เพิ่ม state สำหรับเก็บจำนวนสินค้าที่ต้องการสั่งซื้อ (เริ่มที่ 1)
    const [quantity, setQuantity] = useState<number>(1);

    // ฟังก์ชันเพิ่มจำนวน
    const handleIncrement = () => {
        setQuantity(prev => prev + 1);
    };

    // ฟังก์ชันลดจำนวน (ป้องกันไม่ให้ต่ำกว่า 1)
    const handleDecrement = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    // 🛠️ 2. เช็กสิทธิ์การกดลงตะกร้าด้วย currentUserId
    const handleAddToCart = () => {
        // ถ้าระบบไม่มีไอดีผู้ใช้ส่งเข้ามา (เป็น null หรือไม่มีค่า) ให้ดักฟังก์ชันและเตือนทันที
        if (!currentUserId) {
            alert("🔒 กรุณาเข้าสู่ระบบเพื่อใช้งานตะกร้าสินค้าของคุณ");
            return;
        }

        // 🟢 กรณีเข้าสู่ระบบแล้ว: สามารถส่งข้อมูลเซ็ตนี้ไปใช้งานต่อที่ Context หรือยิงหลังบ้านได้เลย
        alert(`User [ID: ${currentUserId}] added ${quantity} x ${name} (Product ID: ${id ?? "N/A"}) to cart!`);
    };

    return (
        <motion.div className='shadow-lg rounded-xl overflow-hidden bg-[#121212] border border-[#2d2d2d]'
                    whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)', borderColor: '#01579b' }}
        >
            {/* image */}
            <div className='p-3'>
                <div className='p-5 relative aspect-square w-full bg-white overflow-hidden rounded-xl '>
                    <Image src={src} alt={alt ?? ""} fill className="object-contain hover:scale-105 transition-all duration-300 rounded-xl" />
                </div>
            </div>

            {/* detail */}
            <div className='flex flex-col gap-4 p-4'>
                <div>
                    <h1 className="font-medium text-white text-base truncate">
                        {name}
                    </h1>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                        {detail}
                    </p>
                </div>

                {/* แถวเลือกจำนวนสินค้า */}
                <div className='flex items-center justify-between border-t border-[#2d2d2d] pt-3'>
                    <span className='text-xs text-gray-400'>Quantity</span>
                    <div className='flex items-center bg-[#1e1e1e] rounded-md border border-[#333333] p-0.5'>
                        {/* ปุ่มลดจำนวน */}
                        <button 
                            onClick={handleDecrement}
                            className='p-1.5 text-gray-400 hover:text-white hover:bg-[#222222] rounded transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'
                            disabled={quantity <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        
                        {/* ตัวเลขแสดงจำนวน */}
                        <span className='w-8 text-center text-sm font-semibold font-mono text-white'>
                            {quantity}
                        </span>
                        
                        {/* ปุ่มเพิ่มจำนวน */}
                        <button 
                            onClick={handleIncrement}
                            className='p-1.5 text-gray-400 hover:text-white hover:bg-[#222222] rounded transition-colors cursor-pointer'
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>

                {/* price and add to cart */}
                <div className='flex items-center justify-between gap-3 border-t border-[#2d2d2d] pt-3'>
                    <div>
                        <span className='block text-[10px] text-gray-500 uppercase tracking-wider'>Total Price</span>
                        {/* แสดงราคารวมตามจำนวนสินค้าที่เลือก */}
                        <p className='text-base font-bold text-[#38BDF8] font-mono'>
                            ${price ? (price * quantity).toFixed(2) : "0.00"}
                        </p>
                    </div>
                    
                    {/* 🛒 3. เปลี่ยนไปเรียกฟังก์ชัน handleAddToCart เพื่อตรวจสอบสิทธิ์ currentUserId */}
                    <button 
                        onClick={handleAddToCart}
                        className='ring-1 ring-transparent shadow rounded-lg px-3 py-2 text-sm cursor-pointer text-white bg-[#01579b] hover:bg-[#0277bd] active:scale-95 transition-all duration-200 inline-flex items-center gap-2 whitespace-nowrap flex-shrink-0 font-medium'
                    >
                        <ShoppingCart size={16} />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default ProductCardLayout