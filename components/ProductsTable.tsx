"use client"
import React, { useState, useEffect, useMemo  } from "react"
import { motion } from "framer-motion"
import { Search, Edit, Trash2, Save} from "lucide-react"
import Image from "next/image"

type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    sales: number;
    src: string;
    type: "product";
    [key: string]: string | number;
};

const ProductsTable = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingRow, setEditingRow] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);


    const filterProducts = useMemo(() => {
    if (!products) return [];
        return products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
}, [products, searchTerm]);


    const handleEditClick = (id: string) => {
        setEditingRow(id)
    }

    const handleSaveClick = () => {
        setEditingRow(null)
    }

    const handleChange = (id: string, field: string, value: string) => {
        if (!/^\d*\.?\d*$/.test(value)) return; // ตรวจสอบให้แน่ใจว่าเป็นตัวเลขหรือจุดทศนิยมเท่านั้น
        setProducts((prevProducts) => 
            prevProducts.map((product) => 
                product.id === id ? { ...product, [field]: Number(value) } : product
            ));
    }

    const handleDeleteClick = (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?")
        if (confirmDelete) {
            const nextProducts = products.filter((product) => product.id !== id);
            const nextFilterLength = nextProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())
            ).length;
            const nextTotalPages = Math.max(1, Math.ceil(nextFilterLength / pageSize));
            setProducts(nextProducts);
            setCurrentPage((prev) => Math.min(prev, nextTotalPages));
        }
    }

    useEffect(() => {
    fetch("/data.json")
    .then((res) => res.json())
    .then((data: { salesData: Product[] }) => {
        // กรองเอาเฉพาะข้อมูลที่มี type เป็น product เท่านั้นมาเก็บใน State สินค้า
        const onlyProducts = data.salesData.filter((item) => item.type === "product");
        setProducts(onlyProducts);
    })
    .catch((err) => console.error(err));
}, [])

    const totalPages = Math.max(1, Math.ceil(filterProducts.length / pageSize));
    const effectiveCurrentPage = Math.min(currentPage, totalPages);
    const paginatedProducts = useMemo(() => {
        const startIndex = (effectiveCurrentPage - 1) * pageSize;
        return filterProducts.slice(startIndex, startIndex + pageSize);
    }, [filterProducts, effectiveCurrentPage, pageSize]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }

    const handlePageSizeChange = (value: number) => {
        setPageSize(value);
        setCurrentPage(1);
    }

    return (
        <motion.div
        className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl border border-[#1f1f1f] p-3 md:p-5 mx-2 md:mx-0 "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        >

                            {/* Products List */}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
                <h2 className="text-lg md:text-xl font-semibold text-gray-100 text-center md:text-left">
                Products List
                </h2>

                        {/* Search products... */}

                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search products..."
                        onChange={(e) => handleSearchChange(e.target.value)}
                        value={searchTerm}
                        className="bg-[#2d2d2d] text-gray-100 placeholder:text-gray-500 border border-[#3a3a3a] rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#5586f7] transition duration-200 tesxt-sm"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-500" size={20}/>
                </div>
            </div>

                        {/* Show per page */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <label htmlFor="pageSize" className="font-medium">Show</label>
                    <select
                        id="pageSize"
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        className="bg-[#2d2d2d] text-gray-100 border border-[#3a3a3a] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5586f7]"
                    >
                        {[5, 10, 15].map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                    <span>per page</span>
                </div>

                                {/* Previous & Next and  Page  of */}

                <div className="flex items-center gap-2 text-sm text-gray-300">

                                    {/* Page  of */}

                    {/* <span>Page {effectiveCurrentPage} of {totalPages}</span> */}

                                {/* Previous & Next */}

                    {/* <button
                        type="button"
                        disabled={effectiveCurrentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="rounded-lg border border-[#3a3a3a] bg-[#2d2d2d] px-3 py-2 text-gray-100 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#3a3a3a]"
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="rounded-lg border border-[#3a3a3a] bg-[#2d2d2d] px-3 py-2 text-gray-100 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#3a3a3a]"
                    >
                        Next
                    </button> */}
                </div>
            </div>

            <div className="overflow-x-auto w-full">
                <table className="min-w-full w-full divide-y divide-gray-700" >
                    <thead>
                        <tr>
                            {["Name", 
                            "Product ID",
                            "Category",
                            "Price",
                            "Stock",
                            "Sales",
                            "Actions"
                            ].map((header) => (
                                <th key={header} className="px-3 md:px-6 py-2 md:py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700 ">
                        {paginatedProducts.map((product) =>  
                            <motion.tr 
                            key={product.id} 
                            initial={{opacity: 0, y: 10}} 
                            animate={{opacity: 1, y: 0}} 
                            transition={{delay: 0.1, duration: 0.3}}
                            className={`flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0 border-gray-700 md:border-none p-2 md:p-0 ${editingRow === product.id ? "bg-[#2d2d2d] " : ""}`}>
                                <td className = "md:hidden px-3 py-2">
                                    <div className = "flex items-center justify-between">
                                        <div className = "flex items-center">
                                            <Image 
                                            src={product.src} 
                                            alt={product.name} 
                                            width={36} 
                                            height={36}
                                            className="w-9 h-9 rounded-full"
                                            />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-100">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {product.id}
                                                </div>
                                            </div>
                                        </div>

                                        <div className = "flex space-x-1 -mt-1 -mr-1">
                                            <button 
                                                className = "text-indigo-500 hover:text-indigo-300"
                                                onClick={() => editingRow === product.id ? handleSaveClick() : handleEditClick(product.id)}
                                                aria-label={editingRow === product.id ? "Save product" : "Edit product"}
                                                title={editingRow === product.id ? "Save" : "Edit"}
                                            >
                                                {editingRow === product.id ? <Save size={20}/> : <Edit size={20}/>}
                                            </button>
                                            <button 
                                                className = "text-red-500 hover:text-red-300" 
                                                onClick={() => handleDeleteClick(product.id)}
                                                aria-label="Delete product"
                                                title="Delete"
                                            >
                                                <Trash2 size={20}/>
                                            </button>
                                        </div>
                                    </div>

                                    <div className = "mt-2 text-xs text-gray-300">
                                        <div>
                                            Category: {product.category}
                                        </div>
                                        {["price", "stock", "sales"].map((field) => (
                                            <div key={field}>
                                                <span className = "capitalize"> 
                                                    {field} : 
                                                </span>
                                                {editingRow === product.id ? (
                                                    <input 
                                                        type="text"
                                                        value={product[field]}
                                                        onChange={(e) => handleChange(product.id, field, e.target.value)}
                                                        placeholder={`Enter ${field}`}
                                                        aria-label={`Edit ${field}`}
                                                    />
                                                ) : (
                                                    field === "price" ? `$${product[field].toFixed(2)}` : product[field]
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </td>

                                <td className = "hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100"> 
                                    <div className = "flex items-center">
                                        <Image 
                                        src={product.src} 
                                        alt={product.name}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full"
                                        />
                                        <div className = "ml-4 ">
                                            {product.name}
                                        </div>
                                    </div>
                                </td>

                                <td className = "hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {product.id}
                                </td>

                                <td className = "hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {product.category}
                                </td>

                                {["price", "stock", "sales"].map((field) => (
                                    <td key={field} className = {`hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300 ${editingRow === product.id ? "bg-[#2d2d2d]" : ""}`}>
                                        {editingRow === product.id ? (
                                            <input 
                                                type="text"
                                                value={product[field]}
                                                onChange={(e) => handleChange(product.id, field, e.target.value)}
                                                placeholder={`Enter ${field}`}
                                                aria-label={`Edit ${field}`}
                                            />
                                        ) : (
                                            field === "price" ? `$${product[field].toFixed(2)}` : product[field]
                                        )}
                                    </td>
                                ))}

                                <td className = "hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    <div className = "flex space-x-2">
                                        <button 
                                            className = "text-indigo-500 hover:text-indigo-300"
                                            onClick={() => editingRow === product.id ? handleSaveClick() : handleEditClick(product.id)}
                                            aria-label={editingRow === product.id ? "Save product" : "Edit product"}
                                            title={editingRow === product.id ? "Save" : "Edit"}
                                        >
                                            {editingRow === product.id ? <Save size={18}/> : <Edit size={18}/>}
                                        </button>
                                        <button 
                                            className = "text-red-500 hover:text-red-300" 
                                            onClick={() => handleDeleteClick(product.id)}
                                            aria-label="Delete product"
                                            title="Delete"
                                        >
                                            <Trash2 size={20}/>
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        )}
                    </tbody>
                </table>

                <div className="mt-5 flex justify-between">
                    <span>Page {effectiveCurrentPage} of {totalPages}</span>

                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <button
                        type="button"
                        disabled={effectiveCurrentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="rounded-lg border border-[#3a3a3a] bg-[#2d2d2d] px-3 py-2 text-gray-100 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#3a3a3a]"
                    >
                        Previous
                    </button>
                    <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="rounded-lg border border-[#3a3a3a] bg-[#2d2d2d] px-3 py-2 text-gray-100 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#3a3a3a]"
                    >
                        Next
                    </button>
                    </div>
                </div>

                
            </div>

    </motion.div>
    )
}

export default ProductsTable
