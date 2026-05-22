import React from 'react';
import { motion } from 'framer-motion';

    type StatCardProps = {
        name: string;
        icon: React.ComponentType<{ size?: number; className?: string }>;
        value: string | number;
        color_bg?: string;
        color_text?: string;
        color_value?: string;
        onClick?: () => void;
    };

    function StatCard({ name, icon: Icon, value, color_bg = "#1e1e1e", color_text = "#e0e0e0", color_value = "#ffffff", onClick }: StatCardProps) {
    return (
        <motion.div 
        onClick={onClick}
        whileHover = {{ y: -5 , boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',borderColor: '#3b3b3b' }}
        className="backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-[#1f1f1f]"
        style={{ backgroundColor: color_bg }}
        >

            <div className="px-4 py-5 sm:p-6">

                <span className="flex items-center text-sm font-medium"
                style={{ color: color_text}}
                >
                    <Icon size={20} className="mr-2" />
                    {name}
                </span>

                <p className="mt-1 text-3xl font-semibold"
                style={{ color: color_value}}
                >
                    {value}
                </p>
                
            </div>

        </motion.div>
    );
    }

export default StatCard;

//
// วิธีใช้งาน
//
// <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//     <StatCard 
//          name="Users" 
//          icon={Users} 
//          value={1200} 
//          color_bg="#1e1e1e" 
//          color_text="#e0e0e0" 
//          color_value="#ffffff" 
//      />
// </div>
//
//
// Card แต่ละใบจะมีสีพื้นหลัง (color_bg) ตามที่กำหนด
// ชื่อ + icon จะมีสี (color_text) ตามที่กำหนด
// ค่าตัวเลขจะมีสี (color_value) ตามที่กำหนด
//