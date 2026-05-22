"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {  ResponsiveContainer, Pie, Tooltip, PieChart, Cell } from 'recharts';

const COLORS = [
  "#a855f7", // ม่วง
  "#3b82f6", // น้ำเงิน
  "#f97316", // ส้ม
  "#10b981", // เขียว
  "#f30606", // แดง
  "#eab308", // เหลือง
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#f43f5e"  // Rose
];

interface ProductData {
    type: string;
    name: string;
    category: string;
    sales: number;
}

interface CategorySales {
    name: string;
    value: number;
}


const PieCharts = () => {

    const [categoryData, setCategoryData] = useState<CategorySales[]>([]);

    useEffect(() => {
        fetch("/data.json")
        .then((res) => res.json())
        .then((data) => {
        // กรองเฉพาะ product
            const products: ProductData[] = data.salesData.filter(
                (item: ProductData) => item.type === "product"
            );

        // รวมยอดขายตาม category
        const grouped: Record<string, number> = {};
            products.forEach((p) => {
                grouped[p.category] = (grouped[p.category] || 0) + p.sales;
            });

        // แปลงเป็น array สำหรับ PieChart
        const result: CategorySales[] = Object.entries(grouped).map(([cat, val]) => ({
            name: cat,
            value: val,
        }));

        setCategoryData(result);
        });
    }, []);

    return (
        <div className="w-full h-[400px] bg-[#1e1e1e] rounded-xl p-6">
        <h2 className="text-lg text-gray-100 mb-4">Product Sales by Category</h2>
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    dataKey="value"
                    label={({ name, percent = 0 }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                }
                >
                    {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                    backgroundColor: "rgba(31,41,55,0.8)",
                    borderRadius: "8px",
                    padding: "8px",
                    fontSize: "12px",
                    }}
                    itemStyle={{ color: "#f9fafb" }}
                />
            </PieChart>
        </ResponsiveContainer>
        </div>
    );
};

export default PieCharts
