"use client";

import type React from "react";
import { useEffect, useRef } from "react";

interface DropdownProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    isOpen,
    onClose,
    children,
    className = "",
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !(event.target as HTMLElement).closest('.dropdown-toggle')
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);


    if (!isOpen) return null;

    return (
        <div
        ref={dropdownRef}
        className={`absolute z-40  right-0 mt-2  rounded-xl border border-gray-200 bg-white  shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark max-h-[260px] overflow-auto ${className}`}
        >
        {children}
        </div>
    );
};

//
//                          ตัวอย่างการใช้งาน
//
//     <div className="relative inline-block">
//
//         {/* ปุ่ม toggle */}
//         <button
//             className="dropdown-toggle px-4 py-2 bg-blue-500 text-white rounded-lg"
//             onClick={() => setIsOpen(!isOpen)}
//         >
//             Toggle Menu
//         </button>
//
//         {/* Dropdown ปกติ */}
//         <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)}>
//             <div className="p-2">
//             <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 1</div>
//             <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 2</div>
//             <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Option 3</div>
//             </div>
//         </Dropdown>
//     </div>

//      กดปุ่ม Toggle Menu → dropdown โผล่มาใต้ปุ่ม
//      คลิกนอก dropdown หรือปุ่ม toggle → dropdown ปิดเอง
//      เนื้อหาภายใน dropdown ใช้ <div> ธรรมดาได้เลย ไม่จำเป็นต้องใช้ DropdownItem