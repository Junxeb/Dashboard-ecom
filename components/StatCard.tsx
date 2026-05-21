import React from 'react';
import { motion } from 'framer-motion';

    type StatCardProps = {
        name: string;
        icon: React.ComponentType<{ size?: number; className?: string }>;
        value: string | number;
    };

    function StatCard({ name, icon: Icon, value }: StatCardProps) {
    return (
        <motion.div 
        whileHover = {{ y: -5 , boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',borderColor: '#3b3b3b' }}
        className="bg-[#1e1e1e] backdroop-blur-md overflow-hidden shadow-lg rounded-xl border border-[#1f1f1f]">

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
