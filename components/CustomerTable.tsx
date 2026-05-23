    "use client"

    import React, { useEffect, useMemo, useState } from 'react'
    import { motion } from "framer-motion"
    import { Search, Edit, Trash2, Save } from "lucide-react"

    interface Customer {
    name: string;
    address: string;
    email: string;
    }

    const CustomerTable = () => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [editingRow, setEditingRow] = useState<string | null>(null)
    const [pageSize, setPageSize] = useState(5)
    const [currentPage, setCurrentPage] = useState(1)

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.address.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [customers, searchTerm])

    const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize))
    const effectiveCurrentPage = Math.min(currentPage, totalPages)

    const paginatedCustomers = useMemo(() => {
        const startIndex = (effectiveCurrentPage - 1) * pageSize
        return filteredCustomers.slice(startIndex, startIndex + pageSize)
    }, [filteredCustomers, effectiveCurrentPage, pageSize])

    const handleEditClick = (email: string) => {
        setEditingRow(email)
    }

    const handleSaveClick = () => {
        setEditingRow(null)
    }

    const handleChange = (email: string, field: keyof Customer, value: string) => {
        setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
            customer.email === email ? { ...customer, [field]: value } : customer
        )
        )
    }

    const handleDeleteClick = (email: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer?")
        if (confirmDelete) {
        const nextCustomers = customers.filter((customer) => customer.email !== email)
        const nextTotalPages = Math.max(1, Math.ceil(nextCustomers.length / pageSize))
        setCustomers(nextCustomers)
        setCurrentPage((prev) => Math.min(prev, nextTotalPages))
        }
    }

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

                                {/* Page of */}

            {/* <div className="flex items-center gap-2 text-sm text-gray-300"> */}
            {/* <span>Page {effectiveCurrentPage} of {totalPages}</span>

                        {/* Previous & Next */} 

            {/* <button
                type="button"
                disabled={effectiveCurrentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="rounded-lg border border-[#3a3a3a] bg-[#2d2d2d] px-3 py-2 text-gray-100 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#3a3a3a]"
            >
                Previous
            </button> */}
            {/* <button
                type="button"
                disabled={effectiveCurrentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="rounded-lg border border-[#3a3a3a] bg-[#2d2d2d] px-3 py-2 text-gray-100 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#3a3a3a]"
            > */}
                {/* Next
            </button> */} 
            {/* </div> */}
        </div>

        <div className="overflow-x-auto w-full">
            <table className="min-w-full w-full divide-y divide-gray-700">
            <thead>
                <tr>
                {['Name', 'Address', 'Email', 'Actions'].map((header) => (
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
                        {editingRow === customer.email ? (
                            <input
                            type="text"
                            value={customer.name}
                            onChange={(e) => handleChange(customer.email, 'name', e.target.value)}
                            aria-label="Edit customer name"
                            placeholder="Name"
                            className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-2 py-1 text-sm text-gray-100"
                            />
                        ) : (
                            <div className="text-sm font-medium text-gray-100 truncate">{customer.name}</div>
                        )}
                        </div>
                        <div className="flex space-x-1 -mt-1 -mr-1">
                        <button
                            className="text-indigo-500 hover:text-indigo-300"
                            onClick={() => editingRow === customer.email ? handleSaveClick() : handleEditClick(customer.email)}
                            aria-label={editingRow === customer.email ? 'Save customer' : 'Edit customer'}
                            title={editingRow === customer.email ? 'Save' : 'Edit'}
                        >
                            {editingRow === customer.email ? <Save size={20} /> : <Edit size={20} />}
                        </button>
                        <button
                            className="text-red-500 hover:text-red-300"
                            onClick={() => handleDeleteClick(customer.email)}
                            aria-label="Delete customer"
                            title="Delete"
                        >
                            <Trash2 size={20} />
                        </button>
                        </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-300 space-y-2">
                        <div>
                        <span className="font-medium">Address:</span>{' '}
                        {editingRow === customer.email ? (
                            <input
                            type="text"
                            value={customer.address}
                            onChange={(e) => handleChange(customer.email, 'address', e.target.value)}
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
                            onChange={(e) => handleChange(customer.email, 'email', e.target.value)}
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
                        onChange={(e) => handleChange(customer.email, 'name', e.target.value)}
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
                        onChange={(e) => handleChange(customer.email, 'address', e.target.value)}
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
                        onChange={(e) => handleChange(customer.email, 'email', e.target.value)}
                        aria-label="Edit customer email"
                        placeholder="Email"
                        className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-2 py-1 text-sm text-gray-100"
                        />
                    ) : (
                        customer.email
                    )}
                    </td>

                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex space-x-2">
                        <button
                        className="text-indigo-500 hover:text-indigo-300"
                        onClick={() => editingRow === customer.email ? handleSaveClick() : handleEditClick(customer.email)}
                        aria-label={editingRow === customer.email ? 'Save customer' : 'Edit customer'}
                        title={editingRow === customer.email ? 'Save' : 'Edit'}
                        >
                        {editingRow === customer.email ? <Save size={18} /> : <Edit size={18} />}
                        </button>
                        <button
                        className="text-red-500 hover:text-red-300"
                        onClick={() => handleDeleteClick(customer.email)}
                        aria-label="Delete customer"
                        title="Delete"
                        >
                        <Trash2 size={20} />
                        </button>
                    </div>
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
