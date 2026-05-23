"use client"
import { ChevronDown } from "lucide-react";
import { Dropdown } from "../../../components/Dropdown";
import { useEffect, useState } from "react";

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

    useEffect (() => {
        fetch("/data.json")
        .then((res) => res.json())
        .then((data) => setSalesData(data.salesData))
    }, []);

    // ใช้ข้อมูลเฉพาะที่ type = product
    const productData = salesData.filter((item) => {
        const isProduct = item.type === "product";
        if (selectedCategory === "All") {
            return isProduct;
        }
        return isProduct && item.category === selectedCategory;
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
        <div className='flex-1 overflow-auto relative z-10'>
            <div className='max-w-7xl mx-auto py-4 px-4 lg:px-8 mb-5 space-y-6'>
                <div className='bg-[#1e1e1e] p-6 rounded-xl flex justify-between space-x-2 items-center header-section'>
                    <div className="pt-4">
                        <h1 className="text-white text-xl font-semibold mb-4 flex">Products</h1>
                        {/* <p className="text-xl font-medium text-white/70">({selectedCategory})</p> */}
                    </div>

                    <div className="relative">
                        <button className="dropdown-toggle px-2 py-2 bg-[#121212] text-white rounded-lg flex items-center hover:bg-[#161616] transition"
                            onClick={() => setIsOpen(!isOpen)}>
                            <span className="font-semibold pr-2">{selectedCategory}</span>
                            <ChevronDown width="15px" className="text-xs position-left" />
                    </button>
                    <Dropdown className="w-40" isOpen={isOpen} onClose={() => setIsOpen(false)}>
                        {/* <div className="pt-2 pb-3 px-2 flex flex-col space-y-0.5">
                            {categories.map((category) => (
                                <div
                                    key={category}
                                    className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition`}
                                >

                                </div>
                            ))}

                        </div> */}
                        <div className="py-2 pl-2 pr-6 flex flex-col space-y-1">
                            <div className="px-2 py-0.5 hover:bg-[#3f3f3f] hover:text-white rounded-xl cursor-pointer text-[#2f2f2f]">{categories[0]}</div>
                            <div className="px-2 py-0.5 hover:bg-[#3f3f3f] hover:text-white rounded-xl cursor-pointer text-[#2f2f2f]">{categories[1]}</div>
                            <div className="px-2 py-0.5 hover:bg-[#3f3f3f] hover:text-white rounded-xl cursor-pointer text-[#2f2f2f]">{categories[2]}</div>
                            <div className="px-2 py-0.5 hover:bg-[#3f3f3f] hover:text-white rounded-xl cursor-pointer text-[#2f2f2f]">{categories[3]}</div>
                            <div className="px-2 py-0.5 hover:bg-[#3f3f3f] hover:text-white rounded-xl cursor-pointer text-[#2f2f2f]">{categories[4]}</div>
                            <div className="px-2 py-0.5 hover:bg-[#3f3f3f] hover:text-white rounded-xl cursor-pointer text-[#2f2f2f]">{categories[5]}</div>
                            <div className="px-2 py-0.5 hover:bg-[#3f3f3f] hover:text-white rounded-xl cursor-pointer text-[#2f2f2f]">{categories[6]}</div>
                            <div className="px-2 py-0.5 hover:bg-[#3f3f3f] hover:text-white rounded-xl cursor-pointer text-[#2f2f2f]">{categories[7]}</div>
                            <div className="px-2 py-0.5 hover:bg-[#3f3f3f] hover:text-white rounded-xl cursor-pointer text-[#2f2f2f]">{categories[8]}</div>
                            <div className="px-2 py-0.5 hover:bg-[#3f3f3f] hover:text-white rounded-xl cursor-pointer text-[#2f2f2f]">{categories[9]}</div>
                            <div className="px-2 py-0.5 hover:bg-[#3f3f3f] hover:text-white rounded-xl cursor-pointer text-[#2f2f2f]">{categories[10]}</div>
                        </div>
                    </Dropdown>
                    </div>
                    
                    
                    
                    
                </div>

                <div className='bg-[#1e1e1e] p-6 rounded-xl'>

                </div>
            </div>
        </div>
    )
}