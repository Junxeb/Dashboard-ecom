import type React from "react";
import Link from "next/link";

interface DropdownItemProps {
    tag?: "a" | "button";
    href?: string;
    onClick?: () => void;
    onItemClick?: () => void;
    baseClassName?: string;
    className?: string;
    children: React.ReactNode;
}

    export const DropdownItem: React.FC<DropdownItemProps> = ({
        tag = "button",
        href,
        onClick,
        onItemClick,
        baseClassName = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        className = "",
        children,
    }) => {
    const combinedClasses = `${baseClassName} ${className}`.trim();

    const handleClick = (event: React.MouseEvent) => {
        if (tag === "button") {
            event.preventDefault();
        }
            if (onClick) onClick();
            if (onItemClick) onItemClick();
    };

    if (tag === "a" && href) {
        return (
        <Link href={href} className={combinedClasses} onClick={handleClick}>
            {children}
        </Link>
        );
    }

    return (
        <button onClick={handleClick} className={combinedClasses}>
            {children}
        </button>
    );
};

//
//                                      ตัวอย่างการใช้งาน
//
//     <div className="relative inline-block">
//         {/* ปุ่ม toggle */}
//         <button
//             className="dropdown-toggle px-4 py-2 bg-blue-500 text-white rounded-lg"
//             onClick={() => setIsOpen(!isOpen)}
//         >
//             Toggle Menu
//         </button>
//
//         {/* Dropdown พร้อม DropdownItem */}
//         <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)}>
//             <DropdownItem
//             tag="a"
//             href="/profile"
//             onItemClick={() => setIsOpen(false)}
//             >
//             Profile
//             </DropdownItem>
//
//             <DropdownItem
//             onClick={() => console.log("Settings clicked")}
//             onItemClick={() => setIsOpen(false)}
//             >
//             Settings
//             </DropdownItem>
//
//             <DropdownItem
//             onClick={() => console.log("Logout")}
//             onItemClick={() => setIsOpen(false)}
//             className="text-red-600 hover:bg-red-100"
//             >
//             Logout
//             </DropdownItem>
//         </Dropdown>
//     </div>
//
//
//      DropdownItem จะ render เป็น <Link> ของ Next.js ถ้า tag="a" และมี href
//      ถ้าไม่ใช่ → จะ render เป็น <button>
//      onClick → action หลักของ item (เช่น console.log, logout)
//      onItemClick → action เสริม เช่น ปิด dropdown หลังเลือกเมนู
//      baseClassName → style พื้นฐาน (hover, padding, text)
//      className → เพิ่ม style เฉพาะของ item นั้นๆ
//