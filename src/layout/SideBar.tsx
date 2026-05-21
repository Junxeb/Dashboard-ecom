"use client";

import { Bell, Coins, House, Info, Menu, Settings, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

type NavItems = {
    name: string;
    icon: React.ReactNode;
    path: string;
}

const navItems: NavItems[] = [
    { icon: <House />, name: "Dashboard", path: "/" },
    { icon: <ShoppingBag />, name: "Products", path: "/products" },
    { icon: <Users />, name: "Clients", path: "/clients" },
    { icon: <Coins />, name: "Sales", path: "/sales" },
    { icon: <ShoppingCart />, name: "Orders", path: "/orders" },
    { icon: <Settings />, name: "Settings", path: "/settings" },
    { icon: <Bell />, name: "Notifications", path: "/notifications" },
    { icon: <Info />, name: "Help", path: "/help" },
]
const SideBar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname =  usePathname();

    return (
        <div className={`relative z-10  transition-all duration-300 ease-in-out flex-shrink-0  ${isSidebarOpen ? "w-64" : "w-16"}`}>
            <div className = "h-full bg-[#1e1e1e] backdrop-blur-md p-4 text-white flex flex-col border-r border-[#2f2f2f] ">
                {/* ส่วนของ burger icon */}
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className = {`p-2 rounded-full hover:bg-[#00a1e4] transition-colors max-w-fit cursor-pointer 
                    ${isSidebarOpen ? "justify-start px-4" : "justify-center px-1"}`}>
                    <Menu size={20}/>
                </button>

                <nav className="mt-8 flex-grow ">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;

                        return (
                            <Link key={item.name} href={item.path}>
                                <div className={`flex items-center p-4 text-sm font-medium rounded-lg  hover:bg-[#2f2f2f] transition-colors mb-2 
                                    ${isSidebarOpen ? "justify-start px-4" : "justify-center px-0"}
                                    ${isActive ? "bg-[#01579b]" : ""}`}>
                                    {item.icon}
                                    {isSidebarOpen && (<span className="ml-4 whitespace-nowrap"> {item.name}</span>)}
                                </div>
                            </Link>
                        )
                    })}

                </nav>
            </div>
        </div>
    )
}

export default SideBar
