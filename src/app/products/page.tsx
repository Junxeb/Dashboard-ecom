"use client"
import { ChevronDown, Search, ShoppingBag } from "lucide-react";
import { Dropdown } from "../../../components/Dropdown";
import { useEffect, useState } from "react";
import ProductCardLayout from "../../../components/ProductCardLayout";

type ProductItem = {
    type: "product" | "month";
    id?: string;
    name?: string;
    category?: string;
    price?: number;
    stock?: number;
    sales?: number;
    actions?: string;
    src?: string;
}

export default function Products() {

    const [ salesData, setSalesData ] = useState<ProductItem[]>([]);
    const [ isOpen, setIsOpen ] = useState(false)
    const [ selectedCategory, setSelectedCategory ] = useState("All");
    const [ searchQuery, setSearchQuery ] = useState("")

    // 🔒 1. ปรับค่าเริ่มต้นเป็น null เพื่อรอรับค่าจริงจากการ Login
    const [currentUserId, setCurrentUserId] = useState<string | null>(null); 

    useEffect (() => {
        // ดึงข้อมูลสินค้าจาก data.json
        fetch("/data.json")
        .then((res) => res.json())
        .then((data) => setSalesData(data.salesData));

        // 🔒 2. ดึงไอดีผู้ใช้จริงจาก localStorage มาเก็บไว้ในสเตตหลังโหลดหน้าจอสำเร็จ
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("userId");
            setCurrentUserId(storedUserId);
        }
    }, []);

    // ลอจิกเดิมกรองข้อมูลสินค้าตาม Category และคำค้นหา
    const productData = salesData.filter((item) => {
        const isProduct = item.type === "product";
    
        // ตรวจสอบเงื่อนไขหมวดหมู่
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    
        // ตรวจสอบเงื่อนไขคำค้นหาจากชื่อสินค้า
        const matchesSearch = (item.name || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim());

        return isProduct && matchesCategory && matchesSearch;
    });

    const categories = [
        "All",
        "Electronics",
        "Clothing",
        "Sports",
        "Books",
        "Furniture",
        "Toys",
        "Garden",
        "Health & Beauty",
        "Automotive",
    ]

    return (
        <div className='flex-1 relative z-10'>
            <div className='max-w-7xl mx-auto py-4 px-4 lg:px-8 mb-5 space-y-6'>
                <div className='bg-[#1e1e1e] p-6 rounded-xl items-center header-section'>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0 gap-3">
                        <h1 className="text-white text-xl font-semibold flex items-center">
                            <ShoppingBag className="inline mr-3 text-[#38BDF8]" size={26} />
                            Products
                        </h1>
                        
                        {/* ส่วนค้นหาและเลือกหมวดหมู่สินค้า */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1 sm:justify-end">
                            {/* Input Search */}
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#656565] w-5 h-5" />
                                <input 
                                    type="text"
                                    placeholder="Search product..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    // 🛠️ ปรับสีข้อความเริ่มต้นเป็น text-white เพื่อให้พิมพ์แล้วเห็นข้อความชัดเจน
                                    className="w-full pl-9 pr-4 py-2 bg-[#2f2f2f] border border-[#3f3f3f] text-white text-sm rounded-lg flex items-center justify-between focus:outline-none focus:border-[#01579b] focus:ring-1 focus:ring-[#01579b] text-sm transition-all placeholder-[#656565]"
                                />
                            </div>

                            {/* Categories Dropdown */}
                            <div className="relative w-full sm:w-auto">
                                <button 
                                    className="dropdown-toggle w-full sm:w-auto px-4 py-2 bg-[#01579b] text-white rounded-lg flex items-center justify-between sm:justify-start hover:bg-[#0277bd] transition"
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <span className="font-semibold pr-2">{selectedCategory}</span>
                                    <ChevronDown width="15px" className="text-xs" />
                                </button>
                                
                                <Dropdown className="w-40" isOpen={isOpen} onClose={() => setIsOpen(false)}>
                                    <div className="pt-2 pb-3 px-2 flex flex-col space-y-0.5 max-h-[260px] overflow-y-auto">
                                        {categories.map((category) => (
                                            <div
                                                key={category}
                                                className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition flex justify-between items-center
                                                    ${selectedCategory === category 
                                                        ? 'bg-[#121212] text-white font-medium' 
                                                        : 'text-gray-300 hover:bg-[#3f3f3f] hover:text-white'}`}
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setIsOpen(false);
                                                }}
                                            >
                                                <span>{category}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Dropdown>
                            </div>
                        </div>
                    </div>

                    <hr className="border-[#2f2f2f] border-1 mt-6 mb-6" />

                    {/* แสดงรายการสินค้า */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 mt-4">
                        {productData.length > 0 ? (
                            productData.map((product) => (
                                <ProductCardLayout
                                    key={product.id}
                                    id={product.id}
                                    src={product.src || "/placeholder-product.jpg"} // ป้องกันเคสไม่มีรูปภาพ
                                    name={product.name || "Unnamed Product"}
                                    detail={`หมวดหมู่: ${product.category}`}
                                    price={product.price}
                                    currentUserId={currentUserId} 
                                />
                            ))
                        ) : (
                            <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex flex-col items-center justify-center py-16 px-4 bg-[#121212]/50 border border-[#2f2f2f] rounded-xl text-center">
                                <svg 
                                    className="w-12 h-12 text-[#4f4f4f] mb-3" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-white text-base font-medium">ไม่พบสินค้าที่คุณค้นหา</p>
                                <p className="text-[#656565] text-xs mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่ใหม่อีกครั้ง</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}