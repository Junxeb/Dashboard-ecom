"use client"
import React, { useEffect, useState } from "react";
import {
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Line,
    ResponsiveContainer,
    LineChart,
    Legend,
} from "recharts";
import { motion } from "framer-motion";

// ✅ กำหนด type ของข้อมูล
interface MonthData {
    type: "month";
    name: string;
    sales: number;
    profit: number;
    cost: number;
}

interface ProductData {
    type: "product";
    name: string;
    id: string;
    category: string;
    price: number;
    stock: number;
    sales: number;
    actions: string;
}

type SalesData = MonthData | ProductData;

    const SalesOverviewChart: React.FC = () => {
    const [salesData, setSalesData] = useState<MonthData[]>([]);

    useEffect(() => {
        fetch("/data.json")
        .then((res) => res.json())
        .then((data) => {
            // กรองเฉพาะข้อมูลที่เป็นรายเดือน
            const monthlyData = (data.salesData as SalesData[]).filter(
            (item): item is MonthData => item.type === "month"
            );
            setSalesData(monthlyData);
        });
    }, []);

    return (
        <motion.div
        className="bg-[#1e1e1e] background-blur-md overflow-hidden shadow-lg rounded-xl border border-[#1f1f1f] p-4 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        >
        <h2 className="text-base font-medium md:text-lg mb-4 text-gray-100 text-center md:text-left">
            Sales Overview (Monthly)
        </h2>

        <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={salesData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
                <CartesianGrid stroke="#2f2f2f" strokeDasharray="3 3" />
                <XAxis
                dataKey="name"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
                />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} width={40} />
                <Tooltip
                contentStyle={{ backgroundColor: "#1e1e1e", border: "none" }}
                itemStyle={{ color: "#fff" }}
                />
                <Legend />

                {/* เส้นยอดขาย */}
                <Line
                type="monotone"
                dataKey="sales"
                stroke="#a855f7"
                strokeWidth={2}
                dot
                />

                {/* เส้นกำไร */}
                <Line
                type="monotone"
                dataKey="profit"
                stroke="#22c55e"
                strokeWidth={2}
                dot
                />

                {/* เส้นต้นทุน */}
                <Line
                type="monotone"
                dataKey="cost"
                stroke="#ef4444"
                strokeWidth={2}
                dot
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
        </motion.div>
    );
};

export default SalesOverviewChart;
