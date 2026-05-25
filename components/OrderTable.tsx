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
  status: "Completed" | "Shipped" | "Processing" | "Cancelled"
  paymentMethod: string
}

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

  const handleStatusChange = (orderId: string, newStatus: UserOrder["status"]) => {
    setOrders(prev =>
      prev.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  const filteredOrders = useMemo(() => {
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

  return (
    <motion.div className="bg-[#1e1e1e] rounded-xl p-3 md:p-5">
      {/* ... ส่วน search และ pagination คงเดิม ... */}

      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {['Order ID', 'Date', 'Status', 'Total', 'Payment', 'Items'].map((header) => (
                <th key={header} className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {paginatedOrders.map((order) => (
              <motion.tr key={order.orderId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <td className="px-6 py-4 text-sm text-gray-100">{order.orderId}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{order.date}</td>
                <td className="px-6 py-4 text-sm">
                  <select
                    title="Order status"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.orderId, e.target.value as UserOrder["status"])}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(order.status)}`}
                  >
                    <option value="Processing" className="bg-[#EAB300] text-gray-900 rounded-lg">Processing</option>
                    <option value="Shipped" className="bg-[#38BDF8] text-gray-900 rounded-lg">Shipped</option>
                    <option value="Completed" className="bg-[#4DB6AC] text-gray-900 rounded-lg">Completed</option>
                    <option value="Cancelled" className="bg-[#E57373] text-gray-900 rounded-lg">Cancelled</option>
                  </select>

                </td>
                <td className="px-6 py-4 text-sm text-gray-300">${order.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{order.paymentMethod}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{order.items.length}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default OrderTable
