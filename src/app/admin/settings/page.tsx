"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Settings() {
    const router = useRouter()

    // 🔑 ใช้ State ตัวนี้เป็นหลักดักจับ ID จริงที่ล็อกอินมาจากระบบ
    // 🧪 เปลี่ยนจาก useState<string | null>(null) มาใส่เป็น "a001" ตรงๆ เพื่อทดสอบลบ
    const [currentUserId, setCurrentUserId] = useState<string | null>("a001");

    // ดึงค่า userId จาก localStorage มารอไว้ตั้งแต่ตอนเปิดหน้านี้
    // 🔍 ลองตรวจเช็ค useEffect ชุดนี้ในไฟล์หน้าจอ Settings ของคุณครับ
    useEffect(() => {
    if (typeof window !== "undefined") {
        // 🚨 ลองดูว่าระบบล็อกอินของคุณเซ็ตชื่อคีย์ไว้ว่าอะไร เช่น "userId", "uid", หรือ "user"?
        const storedId = localStorage.getItem("userId"); 
        setCurrentUserId(storedId);
    }
    }, []);

    // States สำหรับข้อมูลฟอร์ม
    const [fullName, setFullName] = useState("Admin")
    const [email, setEmail] = useState("admin@example.com")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [bio, setBio] = useState(
        "Building admin dashboards with React, Tailwind and simple components."
    )

    // States สำหรับจัดการ Error และ Success Message
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    // 1. ฟังก์ชันอัปเดตข้อมูล (ปรับมาใช้ currentUserId จากระบบจริง)
    const handleUpdate = async () => {
        setError("")
        setSuccess(false)

        if (!currentUserId) {
            setError("ไม่พบข้อมูลผู้ใช้ หรือเซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่")
            return;
        }

        try {
            const res = await fetch("/api/users", {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "updateProfile", 
                    userId: currentUserId, // ✅ ใช้ ID จริงของผู้ล็อกอิน
                    name: fullName,
                    email: email,
                    address: address,
                    phone: phone,
                    bio: bio,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(true)
                setSuccessMessage("Profile updated successfully!")
            } else {
                setError(data.error || "Failed to update profile")
            }
        } catch (err) {
            console.error(err)
            setError("Something went wrong. Please try again.")
        }
    }

    // 2. ฟังก์ชันลบแอกเคาน์
    const handleDelete = async () => {
        setError("")
        setSuccess(false)

        if (!currentUserId) {
            alert("ไม่พบข้อมูลผู้ใช้ หรือเซสชันหมดอายุ");
            return;
        }

        if (confirm("Are you sure you want to permanently delete this account? This action cannot be undone.")) {
            try {
                const response = await fetch("/api/users", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: currentUserId }),
                });

                const result = await response.json();

                // ✅ เช็คทั้งสถานะ response และ success จาก API ของคุณ
                if (response.ok && (result.success || !result.error)) {
                    alert("Account deleted successfully.");
                    localStorage.clear(); // 🧹 ล้าง Session ออกจากบราวเซอร์
                    window.location.href = "/signin"; // 🚪 ดีดกลับหน้า Sign In
                } else {
                    alert("Error: " + (result.error || "Failed to delete account"));
                }
            } catch (err) {
                alert("Failed to delete account. Please try again.");
            }
        }
    };

    // ฟังก์ชันเคลียร์ค่าในฟอร์ม
    const handleClear = () => {
        setFullName("")
        setEmail("")
        setPhone("")
        setAddress("")
        setBio("")
        setError("")
        setSuccess(false)
    }

    // ฟังก์ชัน Export ข้อมูลออกเป็นไฟล์ JSON
    const handleExport = () => {
        const data = { fullName, email, phone, address, bio }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "account-export.json"
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
                <div className="grid gap-5 mb-8">

                    {/* แสดงกล่องข้อความแจ้งเตือน Error / Success */}
                    {error && (
                        <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-4 bg-green-900/50 border border-green-500 text-green-200 rounded-lg text-sm">
                            {successMessage}
                        </div>
                    )}

                    {/* Section: Profile */}
                    <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2a2a2a]">
                        <h3 className="text-white text-lg font-semibold mb-4">Profile</h3>
                        <p className="text-sm text-gray-400 mb-6">Update your personal information visible across the app.</p>

                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">DU</div>
                                <div className="mt-3 flex gap-3">
                                    <button className="px-3 py-1 bg-[#2d2d2d] rounded-md text-sm text-white">Upload photo</button>
                                    <button className="px-3 py-1 text-sm text-gray-400">Remove</button>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="fullName" className="text-sm text-gray-300 block mb-1">Full name</label>
                                        <input id="fullName" title="Full name" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-3 py-2 text-sm text-gray-100" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="text-sm text-gray-300 block mb-1">Email</label>
                                        <input id="email" title="Email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-3 py-2 text-sm text-gray-100" />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="text-sm text-gray-300 block mb-1">Phone</label>
                                        <input id="phone" title="Phone" placeholder="(555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-3 py-2 text-sm text-gray-100" />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="text-sm text-gray-300 block mb-1">Address</label>
                                        <input
                                            id="address"
                                            title="Address"
                                            placeholder="123 Main St, City"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-3 py-2 text-sm text-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label htmlFor="bio" className="text-sm text-gray-300 block mb-1">Bio</label>
                                    <textarea id="bio" title="Bio" placeholder="Short bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full bg-[#141414] border border-[#3a3a3a] rounded-md px-3 py-2 text-sm text-gray-100" />
                                </div>

                                <div className="mt-4 flex justify-end gap-3">
                                    <button onClick={handleClear} className="px-4 py-2 bg-transparent border border-[#3a3a3a] rounded-md text-sm text-white">Clear</button>
                                    <button onClick={handleUpdate} className="px-4 py-2 bg-[#10b981] text-white rounded-md text-sm">Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Danger Zone */}
                    <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2a2a2a]">
                        <h4 className="text-red-400 font-semibold mb-2">Danger zone</h4>
                        <p className="text-sm text-gray-400 mb-4">Permanent actions that affect your account.</p>

                        <div className="space-y-4">
                            <div className="bg-[#121212] border border-[#2a2a2a] rounded-md p-4 flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-gray-100">Export account data</div>
                                    <div className="text-sm text-gray-400">Download a JSON export of your profile, orders, and settings.</div>
                                </div>
                                <div>
                                    <button onClick={handleExport} className="px-3 py-1 bg-[#2d2d2d] rounded-md text-sm text-white">Request export</button>
                                </div>
                            </div>

                            <div className="bg-[#2a1515] border border-[#3a1e1e] rounded-md p-4 flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-red-200">Delete account</div>
                                    <div className="text-sm text-red-100">Permanently remove your account and all associated data.</div>
                                </div>
                                <div>
                                    {/* 🔴 แก้ไขมาเรียก handleDelete แบบถูกต้องไม่ผ่าน Parameter ค้างคา */}
                                    <button 
                                        onClick={handleDelete} 
                                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
                                    >
                                        ลบ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}