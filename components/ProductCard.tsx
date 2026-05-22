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
    type: "product"
}

type ProductListProps = {
    id?: string        // ✅ เลือกสินค้าเฉพาะ id
    src?: string       // ✅ ใส่ path รูปเอง
    detail?: string    // ✅ ใส่รายละเอียดเอง
    }

export default function ProductCard({ id, src, detail }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([])

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

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
        {products.map(product => (
            <ProductCardLayout
                key={product.id}
                src={src ?? `/images/${product.id}.jpg`}   // ถ้าไม่ส่ง src จะใช้ default
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
//              src="/images/custom-smartphone.jpg" 
//              detail="มือถือรุ่นใหม่ กล้องชัด แบตอึด" 
//          />
//
