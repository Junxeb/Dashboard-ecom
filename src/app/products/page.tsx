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

    // 🔐 1. จำลองสถานะด้วย ID ของผู้ใช้งานแทนการใช้ boolean
    // เคสล็อกอิน: ใส่รหัสสตริง เช่น "U963" | เคสไม่ได้ล็อกอิน: เปลี่ยนค่าให้เป็น null
    const [currentUserId, setCurrentUserId] = useState<string | null>("U789"); 

    useEffect (() => {
        fetch("/data.json")
        .then((res) => res.json())
        .then((data) => setSalesData(data.salesData))
    }, []);

    // ลอจิกเดิมกรองแค่ category คลุมด้วย filter ใหม่ที่ดักคำค้นหาจากชื่อสินค้า
    const productData = salesData.filter((item) => {
        const isProduct = item.type === "product";
    
        // 1. ตรวจสอบเงื่อนไขหมวดหมู่ (Category Filter)
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    
        // 2. ตรวจสอบเงื่อนไขคำค้นหาจากชื่อสินค้า (Search Query Filter)
        const matchesSearch = (item.name || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim());

        // สินค้าชิ้นนั้นต้องผ่านทั้งการกรองประเภท, หมวดหมู่ และคำค้นหา
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
                    <div className="flex flex-col  sm:flex-row sm:justify-between sm:items-center  space-x-2">
                        <h1 className="text-white text-xl font-semibold flex items-center">
                            <ShoppingBag className="inline mr-3 text-[#38BDF8]" size={26} />
                            Products
                        </h1>
                        
                        {/* search btn */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1 sm:justify-end ">
                            <div className="relative w-full md:w-64 ">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4f4f4f] w-5 h-5 " />
                                <input 
                                    type="text"
                                    placeholder="Search product..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-[#2f2f2f] border border-[#3f3f3f] text-[#4f4f4f] text-sm rounded-lg  flex items-center justify-between focus:outline-none focus:border-[#121212] focus:ring-1 focus:ring-[#01579b] focus:text-white transition-all"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-2"></div>

                        {/* categories btn */}
                        <div className="relative">
                            <button className="dropdown-toggle px-4 py-2 bg-[#01579b] text-white rounded-lg flex items-center hover:bg-[#3f3f3f] transition"
                                onClick={() => setIsOpen(!isOpen)}>
                                <span className="font-semibold pr-2">{selectedCategory}</span>
                                <ChevronDown width="15px" className="text-xs position-left" />
                            </button>
                            <Dropdown className="w-40" isOpen={isOpen} onClose={() => setIsOpen(false)}>
                                <div className="pt-2 pb-3 px-2 flex flex-col space-y-0.5 max-h-[260px]">
                                    {categories.map((category) => (
                                        <div
                                            key={category}
                                            className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition flex justify-between items-center
                                                ${selectedCategory === category ? 'bg-[#121212] text-white font-medium' : 'text-[#2f2f2f] hover:bg-[#3f3f3f] hover:text-white'}`}
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setIsOpen(false)}}
                                        >
                                            <span>{category}</span>
                                            {selectedCategory === category && <span className="text-xs"></span>}
                                        </div>
                                    ))}
                                </div>
                            </Dropdown>
                        </div>
                    </div>

                    <hr className="border-[#656565] border-1 mt-2 mb-4" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 mt-4">
                        {productData.length > 0 ? (
                            productData.map((product) => (
                                <ProductCardLayout
                                    key={product.id}
                                    id={product.id}
                                    src={product.src}
                                    name={product.name}
                                    detail={`หมวดหมู่: ${product.category}`}
                                    price={product.price}
                                    show={1}
                                    // 🟢 2. ส่งกระสุน currentUserId ลงไปแทนตัวแปรเก่า
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