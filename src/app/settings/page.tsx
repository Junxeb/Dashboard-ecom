"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
    User, Mail, MapPin, Shield, CheckCircle, Camera, Trash2, 
    Phone, Calendar, Users, Globe, Coins, ShieldAlert, X
} from "lucide-react";

type CustomerItem = {
    name: string;
    address: string;
    email: string;
    userId: string;
    phone?: string;
    birthday?: string;
    gender?: string;
    language?: string;
    currency?: string;
}

export default function Settings() {
    const [profile, setProfile] = useState<CustomerItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    
    // 💡 State สำหรับควบคุมการเปิด/ปิด Alert Modal ตอนกดลบ
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then((data) => {
                const targetUser = data.customer?.find((c: CustomerItem) => c.userId === "U789");
                if (targetUser) {
                    setProfile({
                        ...targetUser,
                        phone: "081-234-5678",
                        birthday: "1992-05-24",
                        gender: "Male",
                        language: "English (UK)",
                        currency: "THB (฿)"
                    });
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
        }, 1000);
    };

    // ฟังก์ชันจำลองการกดยืนยันลบไอดีจริง
    const handleDeleteAccount = () => {
        setIsDeleting(true);
        setTimeout(() => {
            setIsDeleting(false);
            setShowDeleteModal(false);
            alert("Account U789 has been successfully deleted.");
            // ตรงนี้ในระบบจริงสามารถใส่คำสั่งสั่งย้ายหน้า เช่น router.push('/login') ได้ครับ
        }, 1500);
    };

    if (isLoading) return <div className="flex-grow flex items-center justify-center min-h-[500px] text-gray-500 font-medium">Loading details...</div>;

    return (
        <div className="flex-1 overflow-auto relative z-10 bg-[#121212] min-h-screen text-white">
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 space-y-6">
                
                {/* 📦 การ์ดเมนูตั้งค่าหลัก */}
                <div className="bg-[#1e1e1e] rounded-2xl border border-[#2d2d2d] shadow-2xl overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-[#01579b] to-[#012d50] relative" />

                    <div className="p-6 md:p-8 pt-0">
                        <form onSubmit={handleSave} className="space-y-8">
                            
                            {/* บล็อกภาพอวาตาร์หัวเรื่อง */}
                            <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-12 mb-4 text-center sm:text-left px-2">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-2xl border-4 border-[#1e1e1e] overflow-hidden bg-[#121212] shadow-xl">
                                        <Image src="/user-avatar.png" alt="User Avatar" width={112} height={112} className="object-cover w-full h-full" />
                                    </div>
                                    <button type="button" className="absolute bottom-1.5 right-1.5 p-2 bg-[#01579b] text-white rounded-lg shadow-lg hover:bg-[#014780] transition-all"><Camera size={14} /></button>
                                </div>
                                <div className="flex-1 pb-1">
                                    <h2 className="text-xl font-bold text-white">{profile?.name}</h2>
                                    <p className="text-gray-400 text-xs mt-0.5">Account ID: <span className="text-[#01579b] font-mono">{profile?.userId}</span></p>
                                </div>
                            </div>

                            {/* หมวดหมู่ที่ 1: Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-[#01579b] tracking-wider uppercase border-b border-[#2d2d2d] pb-2">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><User size={14} /> Full Name</label>
                                        <input type="text" value={profile?.name} onChange={(e) => setProfile({...profile!, name: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Users size={14} /> Gender</label>
                                        <select value={profile?.gender} onChange={(e) => setProfile({...profile!, gender: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all cursor-pointer">
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other / Not Specified</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Calendar size={14} /> Birthday</label>
                                        <input type="date" value={profile?.birthday} onChange={(e) => setProfile({...profile!, birthday: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Shield size={14} /> Role Status</label>
                                        <input type="text" value="Verified Customer" disabled className="w-full px-4 py-2 bg-[#161616] border border-[#2d2d2d] text-emerald-500 text-sm rounded-lg cursor-not-allowed font-medium" />
                                    </div>
                                </div>
                            </div>

                            {/* หมวดหมู่ที่ 2: Contact & Logistics */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-[#01579b] tracking-wider uppercase border-b border-[#2d2d2d] pb-2">Contact & Logistics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Mail size={14} /> Email Address</label>
                                        <input type="email" value={profile?.email} onChange={(e) => setProfile({...profile!, email: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Phone size={14} /> Phone Number</label>
                                        <input type="text" value={profile?.phone} onChange={(e) => setProfile({...profile!, phone: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><MapPin size={14} /> Primary Shipping Address</label>
                                        <textarea rows={3} value={profile?.address} onChange={(e) => setProfile({...profile!, address: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all resize-none" />
                                    </div>
                                </div>
                            </div>

                            {/* หมวดหมู่ที่ 3: Preferences */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-[#01579b] tracking-wider uppercase border-b border-[#2d2d2d] pb-2">Preferences</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Globe size={14} /> Display Language</label>
                                        <select value={profile?.language} onChange={(e) => setProfile({...profile!, language: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all cursor-pointer">
                                            <option value="English (UK)">English (UK)</option>
                                            <option value="Thai (TH)">Thai (TH)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Coins size={14} /> Default Currency</label>
                                        <select value={profile?.currency} onChange={(e) => setProfile({...profile!, currency: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all cursor-pointer">
                                            <option value="THB (฿)">THB (฿)</option>
                                            <option value="USD ($)">USD ($)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* โซนสรุปท้ายฟอร์มและปุ่มกดเซฟ */}
                            <div className="flex items-center justify-between border-t border-[#2d2d2d] pt-6">
                                <div className="min-h-[20px]">
                                    {savedSuccess && (
                                        <div className="flex items-center gap-2 text-emerald-400 text-xs"><CheckCircle size={14} /><span>All details have been updated.</span></div>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <button type="button" className="text-xs text-gray-400 hover:text-white transition-colors">Discard</button>
                                    <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-[#01579b] text-white text-xs font-semibold rounded-lg hover:bg-[#014780] shadow-lg transition-all disabled:opacity-50">
                                        {isSaving ? "Saving..." : "Save All Details"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* ⚠️ Danger Zone */}
                <div className="bg-[#1e1e1e] p-5 rounded-2xl border border-[#2d2d2d] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl"><ShieldAlert size={20} /></div>
                        <div>
                            <h3 className="text-white text-sm font-semibold">Delete Account</h3>
                            <p className="text-xs text-gray-500">Permanently close and purge all information data from database.</p>
                        </div>
                    </div>
                    {/* 💡 เมื่อกดปุ่มนี้ จะสั่งให้เปิด Modal แจ้งเตือน */}
                    <button 
                        type="button" 
                        onClick={() => setShowDeleteModal(true)} 
                        className="px-4 py-2 border border-red-500/30 text-red-500 text-xs rounded-lg hover:bg-red-500/10 transition-all font-medium"
                    >
                        Delete Account
                    </button>
                </div>

            </main>

            {/* 🚨 ========================================== */}
            {/* 🚨 POPUP ALERT MODAL (หน้าต่างแจ้งเตือนตอนลบ) */}
            {/* 🚨 ========================================== */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    
                    {/* ฉากสีดำโปร่งแสงด้านหลัง (Overlay Backdrop) */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                        onClick={() => !isDeleting && setShowDeleteModal(false)} 
                    />
                    
                    {/* ตัวกล่องกล่องป๊อปอัพแจ้งเตือน */}
                    <div className="relative w-full max-w-md bg-[#1e1e1e] rounded-2xl border border-red-500/20 shadow-2xl p-6 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* ปุ่มปิดมุมขวาบน */}
                        <button 
                            type="button" 
                            disabled={isDeleting}
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex flex-col items-center text-center mt-2">
                            {/* ไอคอนแจ้งเตือนสีแดง */}
                            <div className="p-4 bg-red-500/10 text-red-500 rounded-full mb-4 ring-8 ring-red-500/5">
                                <ShieldAlert size={32} />
                            </div>

                            <h3 className="text-white text-lg font-bold">Are you absolutely sure?</h3>
                            
                            <p className="text-gray-400 text-sm mt-2 px-2">
                                This action cannot be undone. This will permanently delete the account 
                                <span className="text-red-400 font-semibold"> Somchai Prasert ({profile?.userId})</span> and remove all store metadata from our logs.
                            </p>
                        </div>

                        {/* โซนปุ่มกดยืนยัน / ยกเลิก */}
                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-2.5 bg-[#2d2d2d] border border-[#404040] text-gray-300 text-sm font-medium rounded-xl hover:bg-[#363636] hover:text-white transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleDeleteAccount}
                                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 active:bg-red-800 shadow-lg shadow-red-600/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        <span>Yes, Delete</span>
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}