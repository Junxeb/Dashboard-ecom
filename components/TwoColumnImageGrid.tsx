import React from 'react'
import Image from 'next/image'

type TwoColumnImageGridProps = {
        src1: string;       // path ของรูป
        alt1?: string;      // คำอธิบายรูป
        src2: string;       // path ของรูป
        alt2?: string;      // คำอธิบายรูป
}

function TwoColumnImageGrid({ src1, alt1 = "", src2, alt2 = "" } : TwoColumnImageGridProps) {
    return (
        <div className = "grid grid-cols-1 gap-5 sm:grid-cols-2">

            <div>
                <Image
                    src = {src1}
                    alt = {alt1 ?? ""}
                    className = "w-full border border-gray-200 rounded-xl dark:border-gray-800"
                    width={517}
                    height={295}
                />
            </div>

            <div>
                <Image
                    src = {src2}
                    alt = {alt2 ?? ""}
                    className = "w-full border border-gray-200 rounded-xl dark:border-gray-800"
                    width={517}
                    height={295}
                />
            </div>
        </div>
    )
}

export default TwoColumnImageGrid

//
//          วิธีเรียกใช้
//
//     <main className="p-6">
//         <TwoColumnImageGrid
//             src1="/example1.jpg"
//             alt1="รูปตัวอย่าง 1"
//             src2="/example2.jpg"
//             alt2="รูปตัวอย่าง 2"
//         />
//     </main>
//