"use client"

import { useEffect, useState } from "react";
import { ShoppingCart, Trash2, User, CreditCard } from "lucide-react";

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
    
    // 🔑 1. State สำหรับเก็บ Key ของสินค้าชิ้นที่ผู้ใช้ติ๊กเลือก (รูปแบบ: cartId-productId)
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    
    const currentUserId = "U789"; 

    useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then((data) => {
                const products: ProductItem[] = data.salesData.filter((item: any) => item.type === "product");
                const carts: UserCart[] = data.userCarts;

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
    }, [currentUserId]);

    // 🛠️ 2. ฟังก์ชันจัดการเมื่อติ๊ก / เอาติ๊กออก รายบุคคล
    const handleSelectItem = (itemKey: string) => {
        setSelectedItems(prev => 
            prev.includes(itemKey) 
                ? prev.filter(key => key !== itemKey) // ถ้ามีอยู่แล้วให้เอาออก
                : [...prev, itemKey]                 // ถ้ายังไม่มีให้เพิ่มเข้าไป
        );
    };

    // 🛠️ 3. ฟังก์ชันสำหรับปุ่มเลือกทั้งหมด (Select All) ตรงหัวตาราง
    const handleSelectAll = () => {
        if (selectedItems.length === flattenedItems.length) {
            setSelectedItems([]); // ติ๊กออกทั้งหมด
        } else {
            const allKeys = flattenedItems.map(item => `${item.cartId}-${item.productId}`);
            setSelectedItems(allKeys); // ติ๊กเลือกทั้งหมด
        }
    };

    const handleDelete = (cartId: string, productId: string, productName: string) => {
        const itemKey = `${cartId}-${productId}`;
        const isConfirmed = window.confirm(`คุณแน่ใจหรือไม่ที่จะลบ "${productName}" ออกจากตะกร้าใบนี้ (${cartId})?`);
        if (isConfirmed) {
            setFlattenedItems(prevItems => 
                prevItems.filter(item => !(item.cartId === cartId && item.productId === productId))
            );
            // ลบออกจากสถานะที่เลือกด้วย ถ้าสินค้าชิ้นนั้นโดนลบ
            setSelectedItems(prev => prev.filter(key => key !== itemKey));
            alert("ลบสินค้าเรียบร้อยแล้ว");
        }
    };

    // 💰 4. คำนวณเงินรวมเฉพาะชิ้นที่ "โดนติ๊กเลือก" เท่านั้น!
    const grandTotal = flattenedItems.reduce((sum, item) => {
        const itemKey = `${item.cartId}-${item.productId}`;
        if (selectedItems.includes(itemKey)) {
            return sum + item.totalItemPrice;
        }
        return sum;
    }, 0);

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert("กรุณาเลือกสินค้าในตะกร้าอย่างน้อย 1 ชิ้นก่อนชำระเงินครับ");
            return;
        }
        alert(`กำลังพาท่านไปยังหน้าชำระเงิน...\nยอดเงินรวมทั้งหมดของชิ้นที่เลือก: $${grandTotal.toFixed(2)}`);
    };

    return (
        <div className='flex-1 overflow-auto relative z-10 bg-[#121212] min-h-screen text-white'>
            <div className='max-w-7xl mx-auto py-6 px-4 lg:px-8 mb-5 space-y-6'>
                
                <div className='bg-[#1e1e1e] p-6 rounded-xl border border-[#2d2d2d] shadow-xl'>
                    
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

                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-400 text-sm border-b border-[#333333]">
                                    <th className="py-3 px-4 w-12 text-center">
                                        {/* Checkbox เลือกทั้งหมด */}
                                        <input 
                                            type="checkbox" 
                                            checked={flattenedItems.length > 0 && selectedItems.length === flattenedItems.length}
                                            onChange={handleSelectAll}
                                            className="rounded bg-[#2a2a2a] border-[#444444] text-emerald-500 focus:ring-0 cursor-pointer" 
                                        />
                                    </th>
                                    <th className="py-3 px-4 font-normal">สินค้า</th>
                                    <th className="py-3 px-4 font-normal text-right">ราคา</th>
                                    <th className="py-3 px-4 font-normal text-center">จำนวน</th>
                                    <th className="py-3 px-4 font-normal text-right">ราคารวม</th>
                                    <th className="py-3 px-4 w-16 text-center"></th>
                                </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-[#262626]">
                                {flattenedItems.map((item, index) => {
                                    const itemKey = `${item.cartId}-${item.productId}`;
                                    const isSelected = selectedItems.includes(itemKey);

                                    return (
                                        <tr key={`${itemKey}-${index}`} className="hover:bg-[#1a1a1a] transition-colors text-gray-200">
                                            <td className="py-4 px-4 text-center">
                                                {/* Checkbox รายชิ้นที่ผูกสถานะและฟังก์ชันคลิก */}
                                                <input 
                                                    type="checkbox" 
                                                    checked={isSelected}
                                                    onChange={() => handleSelectItem(itemKey)}
                                                    className="rounded bg-[#2a2a2a] border-[#444444] text-emerald-500 focus:ring-0 cursor-pointer" 
                                                />
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
                                                    onClick={() => handleDelete(item.cartId, item.productId, item.name)}
                                                    className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {flattenedItems.length === 0 && (
                            <p className="text-center text-gray-500 my-12 text-sm">ไม่มีสินค้าในตะกร้าสำหรับผู้ใช้นี้</p>
                        )}
                    </div>

                    {/* แถบสรุปยอดเงินและปุ่มกดจ่ายเงิน */}
                    <div className="border-t border-[#333333] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-400 font-mono">
                            Selected: {selectedItems.length} / {flattenedItems.length} items
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto justify-end">
                            <div className="text-center sm:text-right flex sm:block items-center gap-3">
                                <span className="text-xs text-gray-400 uppercase tracking-wider block">TOTAL SPENT:</span>
                                {/* แสดงยอดตามจริง ถ้าไม่มีการติ๊กเลย จะขึ้นเป็น $0.00 */}
                                <span className="text-2xl font-bold text-emerald-400 font-mono">${grandTotal.toFixed(2)}</span>
                            </div>
                            
                            <button 
                                onClick={handleCheckout}
                                // ถ้ายังไม่ติ๊กเลือกสินค้า ปุ่มจะจางลงเล็กน้อย (opacity-50) เพื่อบอกว่ายังกดไม่ได้
                                className={`w-full sm:w-auto flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-lg transition-all duration-150 shadow-md 
                                    ${selectedItems.length === 0 
                                        ? "bg-emerald-800/40 text-gray-400 cursor-not-allowed opacity-60" 
                                        : "bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-900/20 active:scale-95"
                                    }`}
                            >
                                <CreditCard size={18} />
                                <span>Proceed to Checkout</span>
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}