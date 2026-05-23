"use client"

import React, { useEffect, useState } from "react"
import ProductCardLayout from "./ProductCardLayout"

type Product = {
    id: string
    name: string
    category: string
    price: number
    stock: number
    sales: number
    src: string;
    type: "product"
}

type ProductListProps = {
    id?: string        // ✅ เลือกสินค้าเฉพาะ id
    src?: string       // ✅ ใส่ path รูปเอง
    detail?: string    // ✅ ใส่รายละเอียดเอง
    show?: number | string // จำนวนรายการที่จะแสดง (รองรับ string จาก JSX attribute)
    }

export default function ProductCard({ id, src, detail, show }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([])
    const parseShow = (v: number | string | undefined) => {
        if (!v) return 9
        const n = typeof v === "string" ? parseInt(v, 10) : v
        return Number.isFinite(n) && n > 0 ? n : 9
    }
    const [itemsToShow, setItemsToShow] = useState<number>(() => parseShow(show))

    useEffect(() => {
        fetch("/data.json")
        .then(res => res.json())
        .then(data => {
            let productData: Product[] = data.salesData.filter(
            (item: Product) => item.type === "product"
            )
            if (id) {
            productData = productData.filter(p => p.id === id) // กรองตาม id
            }
            setProducts(productData)
        })
    }, [id])

    useEffect(() => {
        setItemsToShow(parseShow(show))
    }, [show])

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
            {products.slice(0, itemsToShow).map(product => (
                <ProductCardLayout
                    key={product.id}
                    src={src ?? product.src ?? `/images/${product.id}.jpg`}   // ถ้าไม่ส่ง src จะใช้จาก data.json หรือ default
                    alt={`รูปภาพของ ${product.name}`}
                    name={product.name}
                    detail={detail ?? `สินค้าในหมวด ${product.category}`} // ถ้าไม่ส่ง detail จะใช้ default
                    price={product.price}
                />
            ))}
        </div>
    )
}

//
//                  วิธีเรียกใช้งาน
//
//      แสดงเฉพาะสินค้า Smartphone (P001) พร้อมกำหนดรูปและรายละเอียดเอง:
//
//          <ProductCard 
//              id="P001"         
//          />
//
//         แสดงสินค้าตามจำนวนที่อยากให้แสดง
//
//       <ProductCard show="6" /> หรือ <ProductCard show={6} />
//