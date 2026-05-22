"use client"

import Image from 'next/image'
import { ShoppingCart  } from 'lucide-react'


type ProductCardLayoutProps = {
    src: string;       // path ของรูป
    alt?: string;      // คำอธิบายรูป
    name: string;
    detail: string;
    price?: number;      
};

function ProductCardLayout({ src, alt, name, detail, price }: ProductCardLayoutProps) {
    return (
        <div className = 'shadow-lg rounded-lg overflow-hidden'>

                            {/* image */}
            <div className = 'relative aspec-[2/3]'>
                <Image src = {src} alt = {alt ?? ""} fill className = "objict-cover hover:scale-105 transition-all duration-300" />
            </div>

                            {/* detail */}
            <div className = 'flex flex-col gap-4 p-4'>
                <h1 className = "font-mediun">
                    {name}
                </h1>
                <p className = "text-sm text-gray-500">
                    {detail}
                </p>  

                            {/* price and add to cart */}
                <div className = 'flex item-center justify-between'>
                    <p>{price?.toFixed(2)}</p>
                    <button className='ring-1 ring-gray-200 shadow-lg rounded-md px-2 py-1 text-sm cursor-pointer hover:text-white hover:bg-black transition-all duration-300 flex item-center gap-2'>
                        <ShoppingCart /> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCardLayout

//
//               แบบใส่เอง
//
//      <ProductCardLayout
//          src=""   // ใส่เองตามไฟล์รูป
//          alt="" // ใส่เอง
//          name="" // ใส่เอง                  
//          detail="" // ใส่เอง
//          price="" // ใส่เอง           
//      />
//