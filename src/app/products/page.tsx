"use client"
import { ChevronDown, Search } from "lucide-react";
import { Dropdown } from "../../../components/Dropdown";
import { useEffect, useState } from "react";
import ProductCardLayout from "../../../components/ProductCardLayout";
import ProductCard from "../../../components/ProductCard";

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

    useEffect (() => {
        fetch("/data.json")
        .then((res) => res.json())
        .then((data) => setSalesData(data.salesData))
    }, []);

    // const productData = salesData.filter((item) => {
    //     const isProduct = item.type === "product";

    //     const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
        
    //     const matchSearch = item.name ? item.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()) : true;
        
    //     if (selectedCategory === "All") {
    //         return isProduct;
    //     }
    //     return isProduct && item.category === selectedCategory;
    // });

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
        <div className='flex-1 relative z-10'>
            <div className='max-w-7xl mx-auto py-4 px-4 lg:px-8 mb-5 space-y-6'>
                <div className='bg-[#1e1e1e] p-6 rounded-xl items-center header-section'>
                    <div className="flex flex-col  sm:flex-row sm:justify-between sm:items-center  space-x-2">
                        <h1 className="pt-1.5 text-white text-xl font-semibold mb-4">Products</h1>
                        
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
                        {productData.map((product) => (
                            <ProductCardLayout
                                key={product.id}
                                id={product.id}
                                src={product.src}
                                name={product.name}
                                detail={`หมวดหมู่: ${product.category}`}
                                price={product.price}
                                show={1}
                            />
                        ))}
                    </div>

                </div>

            </div>
        </div>
    )
}