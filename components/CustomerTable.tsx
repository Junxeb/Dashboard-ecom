    "use client"

    import React, { useEffect, useMemo, useState } from 'react'
    import { motion } from "framer-motion"
    import { Search} from "lucide-react"

    interface Customer {
    name: string;
    address: string;
    email: string;
    phone: string;
    }

        const CustomerTable = () => {
        const [customers, setCustomers] = useState<Customer[]>([])
        const [searchTerm, setSearchTerm] = useState("")
        const [editingRow, setEditingRow] = useState<string | null>(null)
        
        const [pageSize, setPageSize] = useState(5)
        const [currentPage, setCurrentPage] = useState(1)

        // กรอง duplicate ออก
        const uniqueCustomers = useMemo(() => {
            return customers.filter((customer, index, self) =>
            index === self.findIndex(
                (c) =>
                c.name === customer.name &&
                c.email === customer.email &&
                c.address === customer.address &&
                c.phone === customer.phone
            )
            )
        }, [customers])

    const filteredCustomers = useMemo(() => {
    return customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
    )
    }, [customers, searchTerm])


    const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize))
    const effectiveCurrentPage = Math.min(currentPage, totalPages)


    const paginatedCustomers = useMemo(() => {
        const startIndex = (effectiveCurrentPage - 1) * pageSize
        return filteredCustomers.slice(startIndex, startIndex + pageSize)
    }, [filteredCustomers, effectiveCurrentPage, pageSize])



    useEffect(() => {
        const fetchCustomer = async () => {
        try {
            const res = await fetch("/data.json")
            const data = await res.json()
            setCustomers(data.customer ?? [])
        } catch (error) {
            console.error("Error fetching customer data", error)
        }
        }

        fetchCustomer()
    }, [])

    return (
        <motion.div
        className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl border border-[#1f1f1f] p-3 md:p-5 mx-2 md:mx-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        >

                                     {/* Customer List */}
                                    
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
            <h2 className="text-lg md:text-xl font-semibold text-gray-100 text-center md:text-left">
            Customer List
            </h2>

                        {/* Search customers... */}

            <div className="relative w-full md:w-auto">
            <input
                type="text"
                placeholder="Search customers..."
                onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
                }}
                value={searchTerm}
                className="bg-[#2d2d2d] text-gray-100 placeholder:text-gray-500 border border-[#3a3a3a] rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#5586f7] transition duration-200 text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
            </div>
        </div>

                            {/* Show per page */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
            <label htmlFor="pageSize" className="font-medium">Show</label>
            <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
                }}
                className="bg-[#2d2d2d] text-gray-100 border border-[#3a3a3a] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5586f7]"
            >
                {[5, 10, 15].map((size) => (
                <option key={size} value={size}>{size}</option>
                ))}
            </select>
            <span>per page</span>
            </div>

        </div>

        <div className="overflow-x-auto w-full">
            <table className="min-w-full w-full divide-y divide-gray-700">
            <thead>
                <tr>
                {['Name', 'Address', 'Email' ,'Phone'].map((header) => (
                    <th
                    key={header}
                    className={`px-3 md:px-6 py-2 md:py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${header !== 'Name' ? 'hidden md:table-cell' : ''}`}
                    >
                    {header}
                    </th>
                ))}
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
                {paginatedCustomers.map((customer) => (
                <motion.tr
                    key={customer.email}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className={`flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0 border-gray-700 md:border-none p-2 md:p-0 ${editingRow === customer.email ? 'bg-[#2d2d2d]' : ''}`}
                >
                    <td className="md:hidden px-3 py-2">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0">
                        
                        </div>
                        
                    </div>

                    <div className="mt-2 text-xs text-gray-300 space-y-2">
                        <div>
                        <span className="font-medium">Address:</span>{' '}
                        {editingRow === customer.email ? (
                            <input
                            type="text"
                            value={customer.address}
                            aria-label="Edit customer address"
                            placeholder="Address"
                            className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-2 py-1 text-xs text-gray-100"
                            />
                        ) : (
                            customer.address
                        )}
                        </div>
                        <div>
                        <span className="font-medium">Email:</span>{' '}
                        {editingRow === customer.email ? (
                            <input
                            type="email"
                            value={customer.email}
                            aria-label="Edit customer email"
                            placeholder="Email"
                            className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-2 py-1 text-xs text-gray-100"
                            />
                        ) : (
                            customer.email
                        )}
                        </div>
                    </div>
                    </td>

                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {editingRow === customer.email ? (
                        <input
                        type="text"
                        value={customer.name}
                        aria-label="Edit customer name"
                        placeholder="Name"
                        className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-2 py-1 text-sm text-gray-100"
                        />
                    ) : (
                        customer.name
                    )}
                    </td>

                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {editingRow === customer.email ? (
                        <input
                        type="text"
                        value={customer.address}
                        aria-label="Edit customer address"
                        placeholder="Address"
                        className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-2 py-1 text-sm text-gray-100"
                        />
                    ) : (
                        customer.address
                    )}
                    </td>

                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {editingRow === customer.email ? (
                        <input
                        type="email"
                        value={customer.email}
                        aria-label="Edit customer email"
                        placeholder="Email"
                        className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-2 py-1 text-sm text-gray-100"
                        />
                    ) : (
                        customer.email
                    )}
                    </td>

                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {editingRow === customer.phone ? (
                        <input
                        type="number"
                        value={customer.phone}
                        aria-label="Edit customer email"
                        placeholder="Email"
                        className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-2 py-1 text-sm text-gray-100"
                        />
                    ) : (
                        customer.phone
                    )}
                    
                    </td>
                </motion.tr>
                ))}
            </tbody>
            </table>

            <div className="mt-5 mb-3 flex justify-between">
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

    export default CustomerTable
