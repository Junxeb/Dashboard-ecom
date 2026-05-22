import React from 'react'
import Image from 'next/image'

type ImageGridWithTextProps = {
    src: string;
    alt?: string;
    texts: string;
    reverse?: boolean
}

function ImageGridWithText({src, alt, texts, reverse = false}:ImageGridWithTextProps) {
    return (

        <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${
        reverse ? "sm:[&>*:first-child]:order-2 sm:[&>*:last-child]:order-1" : ""}`}>

            <div>
                <Image
                    src = {src}
                    alt = {alt ?? ""}
                    className = "w-full border border-gray-200 rounded-xl dark:border-gray-800"
                    width={517}
                    height={295}
                />
            </div>

            <div>
                {texts}
            </div>
        
        </div>
    )
}

export default ImageGridWithText

//
// วิธีเรียกใช้
//
//     <main className="p-6">
//         <ImageGridWithText
//              src="/example.jpg"
//              alt="รูปตัวอย่าง"
//              texts="นี่คือคำอธิบายรูปภาพ"
//              reverse={true}   // จะสลับตำแหน่ง: ข้อความซ้าย รูปขวา
//          />
//     </main>
//
//      ถ้า reverse={false} หรือไม่ใส่ → รูปอยู่ซ้าย ข้อความอยู่ขวา
//
//      ถ้า reverse={true} → ข้อความอยู่ซ้าย รูปอยู่ขวา
//