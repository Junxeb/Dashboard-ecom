 "use client"

import React, { useState } from "react"

export default function Settings() {
    const [fullName, setFullName] = useState("Admin")
    const [email, setEmail] = useState("admin@example.com")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

    const [bio, setBio] = useState(
        "Building admin dashboards with React, Tailwind and simple components."
    )

    const handleUpdate = async () => {
        const response = await fetch("/api/user", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                userId: "a001",
                name: fullName,
                email: email,
                address: address,
                phone: phone,
                }),
        });

        const result = await response.json();
        if (result.success) {
            alert("Profile updated successfully!");
            console.log(result.user);
        } else {
            alert("Error: " + result.error);
        }
};



// 
    const handleClear = () => {
        // สามารถรีเซ็ตเป็นค่าเริ่มต้นหรือล้างสถานะได้
        setFullName("")
        setEmail("admin@example.com")
        setPhone("")

        setBio("")
    }

    const handleExport = () => {
        const data = { fullName, email, phone,  }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "account-export.json"
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleDelete = () => {
        if (confirm("Are you sure you want to permanently delete this account?")) {
            // ในโปรเจคจริง: เรียก API ลบ
            alert("Account deleted (demo)")
        }
    }

    return (
        <div className="flex-1 overflow-auto relative z-10">
            <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
                <div className="grid gap-5 mb-8">

                    <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2a2a2a]">
                        <h3 className="text-white text-lg font-semibold mb-4">Profile</h3>
                        <p className="text-sm text-gray-400 mb-6">Update your personal information visible across the app.</p>

                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">DU</div>
                                <div className="mt-3 flex gap-3">
                                    <button className="px-3 py-1 bg-[#2d2d2d] rounded-md text-sm">Upload photo</button>
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
                                    <button onClick={handleClear} className="px-4 py-2 bg-transparent border border-[#3a3a3a] rounded-md text-sm">Clear</button>
                                    <button onClick={handleUpdate} className="px-4 py-2 bg-[#10b981] text-white rounded-md text-sm">Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                    <button onClick={handleExport} className="px-3 py-1 bg-[#2d2d2d] rounded-md text-sm">Request export</button>
                                </div>
                            </div>

                            <div className="bg-[#2a1515] border border-[#3a1e1e] rounded-md p-4 flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-red-200">Delete account</div>
                                    <div className="text-sm text-red-100">Permanently remove your account and all associated data.</div>
                                </div>
                                <div>
                                    <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}