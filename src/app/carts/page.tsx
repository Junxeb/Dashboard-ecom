"use client"

import { useEffect, useState } from "react";
import { ShoppingCart, Trash2, User, CreditCard, Plus, Minus } from "lucide-react";

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

    // 🛠️ ฟังก์ชันเพิ่มจำนวนสินค้าในตะกร้า
    const handleIncrementQty = (cartId: string, productId: string) => {
        setFlattenedItems(prevItems =>
            prevItems.map(item => {
                if (item.cartId === cartId && item.productId === productId) {
                    const newQty = item.quantity + 1;
                    return {
                        ...item,
                        quantity: newQty,
                        totalItemPrice: item.price * newQty // คำนวณราคารวมของชิ้นนี้ใหม่
                    };
                }
                return item;
            })
        );
    };

    // 🛠️ ฟังก์ชันลดจำนวนสินค้าในตะกร้า (ล็อกขั้นต่ำไว้ที่ 1 ชิ้น)
    const handleDecrementQty = (cartId: string, productId: string) => {
        setFlattenedItems(prevItems =>
            prevItems.map(item => {
                if (item.cartId === cartId && item.productId === productId && item.quantity > 1) {
                    const newQty = item.quantity - 1;
                    return {
                        ...item,
                        quantity: newQty,
                        totalItemPrice: item.price * newQty // คำนวณราคารวมของชิ้นนี้ใหม่
                    };
                }
                return item;
            })
        );
    };

    const handleSelectItem = (itemKey: string) => {
        setSelectedItems(prev => 
            prev.includes(itemKey) ? prev.filter(key => key !== itemKey) : [...prev, itemKey]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === flattenedItems.length) {
            setSelectedItems([]);
        } else {
            const allKeys = flattenedItems.map(item => `${item.cartId}-${item.productId}`);
            setSelectedItems(allKeys);
        }
    };

    const handleDelete = (cartId: string, productId: string, productName: string) => {
        const itemKey = `${cartId}-${productId}`;
        const isConfirmed = window.confirm(`คุณแน่ใจหรือไม่ที่จะลบ "${productName}" ออกจากตะกร้าใบนี้ (${cartId})?`);
        if (isConfirmed) {
            setFlattenedItems(prevItems => 
                prevItems.filter(item => !(item.cartId === cartId && item.productId === productId))
            );
            setSelectedItems(prev => prev.filter(key => key !== itemKey));
            alert("ลบสินค้าเรียบร้อยแล้ว");
        }
    };

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
                        <h1 className="pt-1.5 text-white text-xl font-semibold flex items-center" >
                            <ShoppingCart className="inline mr-2 text-[#38BDF8]" size={24} />
                            My Carts
                        </h1>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-[#262626] px-3 py-1.5 rounded-lg border border-[#333333]">
                            <User size={14} className="text-[#38BDF8]" />
                            <span>User: <strong className="text-white">{currentUserId}</strong></span>
                        </div>
                    </div>
                    
                    <hr className="border-[#333333] mt-4 mb-5" />

                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left border-collapse table-auto">
                            <thead>
                                <tr className="text-gray-400 text-sm bg-[#121212] border-b border-[#333333]">
                                    <th className="py-3 px-4 w-[60px] text-center">
                                        <input 
                                            type="checkbox" 
                                            checked={flattenedItems.length > 0 && selectedItems.length === flattenedItems.length}
                                            onChange={handleSelectAll}
                                            className="rounded bg-[#2a2a2a] border-[#444444] text-[#34D399] focus:ring-0 cursor-pointer" 
                                        />
                                    </th>
                                    <th className="py-3 px-4 font-normal min-w-[220px]">สินค้า</th>
                                    <th className="py-3 px-4 font-normal text-right w-[120px]">ราคา</th>
                                    {/* ปรับความกว้างคอลัมน์จำนวนให้รองรับปุ่ม */}
                                    <th className="py-3 px-4 font-normal text-center w-[140px]">จำนวน</th>
                                    <th className="py-3 px-4 font-normal text-right w-[140px]">ราคารวม</th>
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
                                                <input 
                                                    type="checkbox" 
                                                    checked={isSelected}
                                                    onChange={() => handleSelectItem(itemKey)}
                                                    className="rounded bg-[#2a2a2a] border-[#444444] text-[#34D399] focus:ring-0 cursor-pointer" 
                                                />
                                            </td>
                                            
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div style={{
                                                        width: '48px', height: '48px',
                                                        minWidth: '48px', minHeight: '48px',
                                                        maxWidth: '48px', maxHeight: '48px',
                                                        overflow: 'hidden', borderRadius: '8px',
                                                        border: '1px solid #3a3a3a', backgroundColor: '#121212',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}>
                                                        {item.imgSrc ? (
                                                            <img 
                                                                src={item.imgSrc} 
                                                                alt={item.name} 
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="text-[10px] text-gray-500">No img</div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="overflow-hidden">
                                                        <p className="font-medium text-sm text-gray-200 truncate">{item.name}</p>
                                                        <p className="text-[11px] text-gray-500 font-mono mt-0.5">{item.cartId} • {item.date}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td className="py-4 px-4 text-right font-mono text-sm">
                                                ${item.price.toFixed(2)}
                                            </td>
                                            
                                            {/* 🛠️ ช่องตารางจำนวนสินค้าที่มีปุ่ม เพิ่ม-ลด */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center bg-[#121212] rounded-md border border-[#333333] p-0.5 max-w-[100px] mx-auto">
                                                    {/* ปุ่มลดจำนวน */}
                                                    <button
                                                        onClick={() => handleDecrementQty(item.cartId, item.productId)}
                                                        disabled={item.quantity <= 1}
                                                        className="p-1 text-gray-400 hover:text-white hover:bg-[#262626] rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                                    >
                                                        <Minus size={12} />
                                                    </button>

                                                    {/* ตัวเลขแสดงจำนวนปัจจุบัน */}
                                                    <span className="w-8 text-center text-sm font-semibold font-mono text-white select-none">
                                                        {item.quantity}
                                                    </span>

                                                    {/* ปุ่มเพิ่มจำนวน */}
                                                    <button
                                                        onClick={() => handleIncrementQty(item.cartId, item.productId)}
                                                        className="p-1 text-gray-400 hover:text-white hover:bg-[#262626] rounded transition-colors cursor-pointer"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </td>
                                            
                                            <td className="py-4 px-4 text-right font-mono text-sm text-[#34D399] font-semibold">
                                                ${item.totalItemPrice.toFixed(2)}
                                            </td>
                                            
                                            <td className="py-4 px-4 text-center">
                                                <button 
                                                    onClick={() => handleDelete(item.cartId, item.productId, item.name)}
                                                    className="text-gray-500 hover:text-[#E57373] transition-colors p-1 rounded"
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

                    <div className="border-t border-[#333333] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-400 font-mono">
                            Selected: {selectedItems.length} / {flattenedItems.length} items
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto justify-end">
                            <div className="text-center sm:text-right flex sm:block items-center gap-3">
                                <span className="text-xs text-gray-400 uppercase tracking-wider block">TOTAL SPENT:</span>
                                <span className="text-2xl font-bold text-[#34D399] font-mono">${grandTotal.toFixed(2)}</span>
                            </div>
                            
                            <button 
                                onClick={handleCheckout}
                                className={`w-full sm:w-auto flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-lg transition-all duration-150 shadow-md 
                                    ${selectedItems.length === 0 
                                        ? "bg-[#059669]/40 text-gray-400 cursor-not-allowed opacity-60" 
                                        : "bg-[#34D399] hover:bg-[#78d8b5] text-white hover:shadow-emerald-900/20 active:scale-95"
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