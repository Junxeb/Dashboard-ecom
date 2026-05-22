import React from 'react'
import Image from 'next/image'

type ResponsiveImageProps = {
  src: string;       // path ของรูป
  alt?: string;      // คำอธิบายรูป
  width?: number;    // ความกว้าง
  height?: number;   // ความสูง
};

function ResponsiveImage({ src, alt = "", width = 1054, height = 600 }: ResponsiveImageProps) {
    return (
        <div className = "relative">
            <div className = "overflow-hidden">
                <Image 
                src = {src}
                alt = {alt ?? ""}
                className = "w-full border border-gray-200 rounded-xl dark:border-gray-800"
                width = {width}
                height = {height}
                />
            </div>
        </div>
    )
}

export default ResponsiveImage

// วิธีเรียกใช้
//  {/* ใช้รูปจาก public/ */}
//       <ResponsiveImage src="/example.jpg" alt="ตัวอย่างรูป" />

//       {/* ใช้รูปจาก URL */}
//       <ResponsiveImage src="https://picsum.photos/800/400" alt="Random image" width={800} height={400} />
//     </main>