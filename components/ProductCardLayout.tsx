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
        <div className='shadow-lg rounded-lg overflow-hidden'>

            {/* image */}
            <div className='relative aspect-[2/3] w-full overflow-hidden'>
                <Image src={src} alt={alt ?? ""} fill className="object-cover hover:scale-105 transition-all duration-300" />
            </div>

            {/* detail */}
            <div className='flex flex-col gap-4 p-4'>
                <h1 className="font-medium">
                    {name}
                </h1>
                <p className="text-sm text-gray-500">
                    {detail}
                </p>

                {/* price and add to cart */}
                <div className='flex items-center justify-between gap-3'>
                    <p className='mr-2'>{price?.toFixed(2)}</p>
                    <button className='ring-1 ring-gray-200 shadow rounded-md px-2 py-2 text-sm cursor-pointer text-black bg-white hover:text-white hover:bg-black transition-all duration-300 inline-flex items-center gap-2 whitespace-nowrap flex-shrink-0 min-w-[44px] sm:min-w-[88px]'>
                        <ShoppingCart />
                        <span className="hidden sm:inline">Add to Cart</span>
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