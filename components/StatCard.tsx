import React from 'react';
import { motion } from 'framer-motion';

    type StatCardProps = {
        name: string;
        icon: React.ComponentType<{ size?: number; className?: string }>;
        value: string | number;
        color?: string;
    };

    function StatCard({ name, icon: Icon, value, color = "#1e1e1e" }: StatCardProps) {
    return (
        <motion.div 
        whileHover = {{ y: -5 , boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',borderColor: '#3b3b3b' }}
        className="backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-[#1f1f1f]"
        style={{ backgroundColor: color }}
        >

            <div className="px-4 py-5 sm:p-6">

                <span className="flex items-center text-sm font-medium text-gray-300">
                    <Icon size={20} className="mr-2" />
                    {name}
                </span>

                <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
                
            </div>

        </motion.div>
    );
    }

export default StatCard;

//
// วิธีใช้งาน
//
// <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//       <StatCard name="Users" icon={LayoutDashboard} value="1200" color="#01579b" />
//       <StatCard name="Revenue" icon={LayoutDashboard} value="$45K" color="rgba(255,0,128,0.6)" />
//       <StatCard name="Active" icon={LayoutDashboard} value="87%" color="#0066cc" />
// </div>
//