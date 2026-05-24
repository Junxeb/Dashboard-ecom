"use client"

import { useEffect, useState } from "react";

type ProductItem = {
    id: string;
    name: string;
    category: string;
    price: number;
    src: string;
    type: "product";
}

type userCarts = {
    name: string;
    price: number;
    quantity: number;
    src: string;
    cartId: string;
    userId: string;
    date: string;
    totalPrice: number;
}

export default function Carts() {

    const [userCartData, setUserCartData] = useState([]);
    const [ salesData, setSalesData ] = useState<ProductItem[]>([]);

    useEffect (() => {
        fetch("/data.json")
        .then((res) => res.json())
        .then((data) => {
            setUserCartData(data.userCarts);
            setSalesData(data.salesData);
        })
    }, []);

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <div className='max-w-7xl mx-auto py-4 px-4 lg:px-8 mb-5 space-y-6'>
                <div className='bg-[#1e1e1e] p-6 rounded-xl'>
                    <h4 className="pt-1.5 text-white text-xl font-semibold mb-4" >My Carts</h4>
                    <hr className="border-[#656565] border-1 mt-2 mb-4" />

                    <div className='space-y-4'>
                        {/* Cart items would be displayed here */}

                    </div>
                </div>

                <div className='bg-[#1e1e1e] p-6 rounded-xl'>

                </div>
            </div>
        </div>
    )
}