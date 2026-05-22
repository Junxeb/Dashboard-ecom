"use client";

import { Bell, Coins, House, Info, LayoutDashboardIcon, Menu, Settings, ShoppingBag, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

type NavItems = {
    name: string;
    icon: React.ReactNode;
    path: string;
}

const navItems: NavItems[] = [
    { icon: <House />, name: "Home", path: "/" },
    { icon: <ShoppingBag />, name: "Products", path: "/products" },
    { icon: <Users />, name: "Profile", path: "/profile" },
    { icon: <ShoppingCart />, name: "My Carts", path: "/orders" },
    { icon: <Bell />, name: "Notifications", path: "/notifications" },
    { icon: <Settings />, name: "Settings", path: "/settings" },
    { icon: <Info />, name: "Help", path: "/help" },
]

const adminItems: NavItems[] = [
    { icon: <LayoutDashboardIcon />, name: "Dashboard", path: "/admin"},
    { icon: <ShoppingBag />, name: "Products", path: "/admin/products" },
    { icon: <Users />, name: "Customer", path: "/admin/customer" },
    { icon: <Coins />, name: "Sales", path: "/admin/sales" },
    { icon: <ShoppingCart />, name: "Manage Orders", path: "/admin/orders" },
    { icon: <Settings />, name: "Settings", path: "/admin/settings" },
]

const SideBar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname =  usePathname();

    const isAdminRoute = usePathname().startsWith('/admin')

    const currentNavItems = isAdminRoute ? adminItems : navItems;

    return (
        <div className={`relative z-10  transition-all duration-300 ease-in-out flex-shrink-0  ${isSidebarOpen ? "w-64" : "w-16"}`}>
            <div className = "h-full bg-[#1e1e1e] backdrop-blur-md p-4 text-white flex flex-col border-r border-[#2f2f2f] ">
                {/* ส่วนของ burger icon */}
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className = {`p-2 rounded-full hover:bg-[#2f2f2f] transition-colors max-w-fit cursor-pointer 
                    ${isSidebarOpen ? "justify-start px-4" : "justify-center px-1"}`}>
                    <Menu size={20}/>
                </button>

                <hr className="border-[#2f2f2f] border-1 mt-4 mb-2" />

                {/* ส่วนของ Navbar user */}
                <nav className="mt-8 flex-grow ">
                    {currentNavItems.map((item) => {
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
