"use client"

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    BarChart,
    ResponsiveContainer,
} from "recharts";

interface SalesData {
    type: string;
    name: string;
    sales: number;
    profit?: number;
    cost?: number;
}

interface BarChartProps {
    metrics: ("sales" | "profit" | "cost")[]; // เลือกหลายค่าได้
}

const Bar_Chart: React.FC<BarChartProps> = ({ metrics }) => {
    const [salesData, setSalesData] = useState<SalesData[]>([]);

    useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then((data) => {
                const monthlyData = data.salesData.filter(
                    (item: SalesData) => item.type === "month"
                );
                setSalesData(monthlyData);
            });
    }, []);

    // กำหนดสีสำหรับแต่ละ metric
    const colors: Record<string, string> = {
        sales: "#a855f7",
        profit: "#3b82f6",
        cost: "#f97316",
    };

    return (
        <motion.div
            className="bg-[#1e1e1e] shadow-lg rounded-xl border border-[#1f1f1f] p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
        >
            <h2 className="text-base font-medium md:text-lg mb-4 text-gray-100 text-center md:text-left">
                Sales Overview ({metrics.join(", ")})
            </h2>

            <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid stroke="#2f2f2f" strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1e1e1e", border: "none" }}
                            itemStyle={{ color: "#888888" }}
                        />
                        {/* วนสร้าง Bar ตาม metrics ที่เลือก */}
                        {metrics.map((metric) => (
                            <Bar key={metric} dataKey={metric} fill={colors[metric]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default Bar_Chart;

//
//                  วิธีเรียกใช้
//
//          {/* แสดงเฉพาะ sales */}
//      <Bar_Chart metrics={["sales"]} />
//
//          {/* แสดง sales + profit */}
//      <Bar_Chart metrics={["sales", "profit"]} />
//
//          {/* แสดง sales + profit + cost */}
//      <Bar_Chart metrics={["sales", "profit", "cost"]} />
//