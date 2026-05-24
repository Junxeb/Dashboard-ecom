"use client"

import { useEffect, useState } from "react";
import { ShoppingCart, Trash2, User } from "lucide-react";

type ProductItem = {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    sales: number;
    actions: string;
    src: string;
    type: "product";
}

type CartItem = {
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

type UserCart = {
    cartId: string;
    userId: string;
    date: string;
    items: CartItem[];
    totalPrice: number;
}

type FlatCartItem = {
    cartId: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    totalItemPrice: number;
    imgSrc?: string;
    date: string;
}

export default function Carts() {
    const [flattenedItems, setFlattenedItems] = useState<FlatCartItem[]>([]);
    
    // 🔑 สมมติว่า User ที่ล็อกอินอยู่ตอนนี้คือรหัส "U789" 
    // (สามารถเปลี่ยนเป็นดึงจาก session/auth ของระบบคุณได้เลยครับ)
    const currentUserId = "U789"; 

    useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then((data) => {
                const products: ProductItem[] = data.salesData.filter((item: any) => item.type === "product");
                const carts: UserCart[] = data.userCarts;

                // ⚡️ เพิ่มการ .filter เอาเฉพาะตะกร้าของ user คนนี้ ก่อนเอาไปกระจายแถวสินค้า
                const myCarts = carts.filter((cart) => cart.userId === currentUserId);

                const flatList: FlatCartItem[] = myCarts.flatMap((cart) => 
                    cart.items.map((item) => {
                        const productInfo = products.find((p) => p.id === item.productId);
                        return {
                            cartId: cart.cartId,
                            productId: item.productId,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            totalItemPrice: item.price * item.quantity,
                            imgSrc: productInfo?.src,
                            date: cart.date
                        };
                    })
                );

                setFlattenedItems(flatList);
            })
            .catch((err) => console.error("Error fetching data:", err));
    }, [currentUserId]); // ใส่เป็น dependency เผื่อมีการเปลี่ยน user

    const handleDelete = (cartId: string, productId: string, productName: string) => {
        const isConfirmed = window.confirm(`คุณแน่ใจหรือไม่ที่จะลบ "${productName}" ออกจากตะกร้าใบนี้ (${cartId})?`);
        
        if (isConfirmed) {
            // กรองเอาชิ้นที่สั่งลบออกไปจาก State
            setFlattenedItems(prevItems => 
                prevItems.filter(item => !(item.cartId === cartId && item.productId === productId))
            );
            
            // แจ้งเตือนเมื่อลบสำเร็จ (สามารถเปลี่ยนเป็น Toastสวยๆ ในอนาคตได้)
            alert("ลบสินค้าเรียบร้อยแล้ว");
        }
    };

    return (
        <div className='flex-1 overflow-auto relative z-10 bg-[#121212] min-h-screen text-white'>
            <div className='max-w-7xl mx-auto py-6 px-4 lg:px-8 mb-5 space-y-6'>
                
                <div className='bg-[#1e1e1e] p-6 rounded-xl border border-[#2d2d2d]'>
                    
                    {/* ส่วนหัวตาราง: เพิ่มการแสดงชื่อผู้ใช้เพื่อความชัดเจน */}
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="pt-1.5 text-white text-xl font-semibold flex items-center" >
                            <ShoppingCart className="inline mr-2 text-blue-500" size={24} />
                            My Carts
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#262626] px-3 py-1.5 rounded-lg border border-[#333333]">
                            <User size={14} className="text-blue-400" />
                            <span>User: <strong className="text-white">{currentUserId}</strong></span>
                        </div>
                    </div>
                    
                    <hr className="border-[#656565] border-1 mt-2 mb-4" />

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[gray-400] text-sm bg-[#121212] border-b border-[#333333]">
                                    <th className="py-3 px-4 w-12 text-center">
                                        <input type="checkbox" className="rounded bg-[#2a2a2a] border-[#444444] text-blue-500 focus:ring-0" />
                                    </th>
                                    <th className="py-3 px-4 font-normal">สินค้า</th>
                                    <th className="py-3 px-4 font-normal text-right">ราคา</th>
                                    <th className="py-3 px-4 font-normal text-center">จำนวน</th>
                                    <th className="py-3 px-4 font-normal text-right">ราคารวม</th>
                                    <th className="py-3 px-4 w-16 text-center"></th>
                                </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-[#262626]">
                                {flattenedItems.map((item, index) => (
                                    <tr key={`${item.cartId}-${item.productId}-${index}`} className="hover:bg-[#1a1a1a] transition-colors text-gray-200">
                                        <td className="py-4 px-4 text-center">
                                            <input type="checkbox" className="rounded bg-[#2a2a2a] border-[#444444] text-blue-500 focus:ring-0" />
                                        </td>
                                        
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                {item.imgSrc ? (
                                                    <img 
                                                        src={item.imgSrc} 
                                                        alt={item.name} 
                                                        className="w-12 h-12 object-cover rounded border border-[#3a3a3a] bg-[#121212]" 
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded border border-[#3a3a3a] bg-[#2a2a2a] flex items-center justify-center text-xs text-gray-500">
                                                        No img
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-sm text-gray-200">{item.name}</p>
                                                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">{item.cartId} • {item.date}</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="py-4 px-4 text-right font-mono text-sm">
                                            ${item.price.toFixed(2)}
                                        </td>
                                        
                                        <td className="py-4 px-4 text-center font-mono text-sm text-gray-400">
                                            {item.quantity}
                                        </td>
                                        
                                        <td className="py-4 px-4 text-right font-mono text-sm text-emerald-400 font-semibold">
                                            ${item.totalItemPrice.toFixed(2)}
                                        </td>
                                        
                                        <td className="py-4 px-4 text-center">
                                            <button 
                                            className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded"
                                            onClick={() => handleDelete(item.cartId, item.productId, item.name)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {flattenedItems.length === 0 && (
                            <p className="text-center text-gray-500 my-8 text-sm">ไม่มีสินค้าในตะกร้าสำหรับผู้ใช้นี้</p>
                        )}
                    </div>
                    <div className='bg-[#1e1e1e] p-6 rounded-xl '>
                        <p className="text-sm text-gray-500">Your total items: {flattenedItems.length} items</p>
                    </div>
                </div>

                
            </div>
        </div>
    )
}