"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowLeft, ArrowRight } from 'lucide-react'

type OrderItem = {
  productId: string
  name: string
  quantity: number
  price: number
}

type UserOrder = {
  orderId: string
  cartId: string
  date: string
  items: OrderItem[]
  totalPrice: number
  status: string
  paymentMethod: string
}

const OrderTable = () => {
  const [orders, setOrders] = useState<UserOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setOrders(data.userOrders ?? []))
      .catch((err) => console.error("Error loading orders", err))
  }, [])

  const filteredOrders = useMemo(() => {
    if (!orders) return []
    const term = searchTerm.toLowerCase()
    return orders.filter((order) =>
      order.orderId.toLowerCase().includes(term) ||
      order.cartId.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term) ||
      order.paymentMethod.toLowerCase().includes(term)
    )
  }, [orders, searchTerm])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize))
  const effectiveCurrentPage = Math.min(currentPage, totalPages)

  const paginatedOrders = useMemo(() => {
    const startIndex = (effectiveCurrentPage - 1) * pageSize
    return filteredOrders.slice(startIndex, startIndex + pageSize)
  }, [filteredOrders, effectiveCurrentPage, pageSize])

  const statusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-[#4DB6AC] text-[#0f172a]"
      case "Shipped":
        return "bg-[#38BDF8] text-[#0f172a]"
      case "Processing":
        return "bg-[#EAB300] text-[#0f172a]"
      default:
        return "bg-[#E57373] text-[#0f172a]"
    }
  }

  return (
    <motion.div
      className="bg-[#1e1e1e] backdrop-blur-md shadow-lg rounded-xl border border-[#1f1f1f] p-3 md:p-5 mx-2 md:mx-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
        <h2 className="text-lg md:text-xl font-semibold text-gray-100 text-center md:text-left">
          User Orders
        </h2>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-[#2d2d2d] text-gray-100 placeholder:text-gray-500 border border-[#3a3a3a] rounded-lg pl-10 pr-4 py-2 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-[#5586f7] transition duration-200 text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
        </div>
      </div>

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

        <div className="text-sm text-gray-300">
          <span>Page {effectiveCurrentPage} of {totalPages}</span>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {['Order ID', 'Date', 'Status', 'Total', 'Payment', 'Items'].map((header) => (
                <th
                  key={header}
                  className={`px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${header === 'Items' ? 'hidden md:table-cell' : ''}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {paginatedOrders.map((order) => (
              <motion.tr
                key={order.orderId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-b-0 border-gray-700 md:border-none p-3 md:p-0"
              >
                <td className="md:hidden px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-100 truncate">{order.orderId}</div>
                      <div className="text-xs text-gray-500 truncate">{order.date}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase ${statusBadge(order.status)}`}>
                      {order.status}
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-300 space-y-1">
                    <div>
                      <span className="font-medium text-gray-100">Total:</span> ${order.totalPrice.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-100">Payment:</span> {order.paymentMethod}
                    </div>
                    <div>
                      <span className="font-medium text-gray-100">Items:</span> {order.items.length}
                    </div>
                  </div>
                </td>

                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-100">
                  {order.orderId}
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.date}
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${order.totalPrice.toFixed(2)}
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.paymentMethod}
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.items.length}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-400">Showing {paginatedOrders.length} of {filteredOrders.length} orders</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={effectiveCurrentPage === 1}
            aria-label="Previous page"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="rounded-lg border border-[#3a3a3a] bg-[#2d2d2d] px-3 py-2 text-gray-100 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#3a3a3a]"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            disabled={effectiveCurrentPage === totalPages}
            aria-label="Next page"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="rounded-lg border border-[#3a3a3a] bg-[#2d2d2d] px-3 py-2 text-gray-100 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[#3a3a3a]"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default OrderTable
