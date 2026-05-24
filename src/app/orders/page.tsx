"use client"

import { data } from "framer-motion/client";
import { useEffect, useState } from "react";

export default function Orders() {
    const [ userOrderData, setUserOrderData ] = useState();
    const [  SalesData, setSalesData] = useState();

    useEffect (() => {
        fetch("/data.json")
        .then((res) => res.json())
        .then((data) => setUserOrderData(data.userOrders))
    }, []);

    useEffect (() => {
        fetch("/data.json")
        .then((res) => res.json())
        .then((data) => setSalesData(data.salesData))
    }, []);
    

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <div className='max-w-7xl mx-auto py-4 px-4 lg:px-8 mb-5 space-y-6'>
                <div className='bg-[#1e1e1e] p-6 rounded-xl'>
                    <h4 className="pt-1.5 text-white text-xl font-semibold mb-4" >My Orders</h4>
                    <hr className="border-[#656565] border-1 mt-2 mb-4" />
                </div>

                <div className='bg-[#1e1e1e] p-6 rounded-xl'>

                </div>
            </div>
        </div>

    )
}