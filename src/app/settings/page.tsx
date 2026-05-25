"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { 
    User, Mail, MapPin, Shield, CheckCircle, Camera, Trash2, 
    Phone, Calendar, Users, Globe, Coins, ShieldAlert, X,
    Lock, LogIn, Home, RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";

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

type SettingsProps = {
    currentUserId?: string | null;
    onLoginSuccess?: (id: string) => void; // ฟังก์ชัน Callback เผื่อเอาไว้เรียกอัปเดต State ล็อกอินที่ Component พ่อ
};

export default function Settings({ currentUserId = "U789", onLoginSuccess }: SettingsProps) {
    const [profile, setProfile] = useState<CustomerItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // 🆕 เพิ่ม State เช็กว่ากดลบแอคเคาน์สำเร็จแล้วหรือยัง
    const [isDeleted, setIsDeleted] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!currentUserId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        fetch("/data.json")
            .then((res) => res.json())
            .then((data) => {
                const targetUser = data.customer?.find((c: CustomerItem) => c.userId === currentUserId);
                if (targetUser) {
                    setProfile({
                        ...targetUser,
                        phone: targetUser.phone || "111-111-1111",
                        birthday: targetUser.birthday || "0000-00-00",
                        gender: targetUser.gender || "Other",
                        language: targetUser.language || "English (UK)",
                        currency: targetUser.currency || "THB (฿)"
                    });
                } else {
                    setProfile(null);
                }
                setIsLoading(false);
            })
            .catch(() => {
                setProfile(null);
                setIsLoading(false);
            });
    }, [currentUserId, isDeleted]); // รีเฟรชฟังก์ชันเมื่อ id เปลี่ยน หรือถูกสั่ง Reset ระบบจากการลบ

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
        }, 1000);
    };

    const handleDeleteAccount = () => {
        setIsDeleting(true);
        setTimeout(() => {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setIsDeleted(true); // 🟢 เปิดสวิตช์เปลี่ยนไปหน้าลบแอคเคาน์สำเร็จ
        }, 1500);
    };

    // 🔄 ฟังก์ชันจำลองการกดชุบชีวิตไอดีกลับมาเทสใหม่ หรือปุ่มพากลับหน้าหลัก
    const handleResetDemo = () => {
        setIsDeleted(false);
        if (onLoginSuccess) {
            onLoginSuccess("U963");
        } else {
            window.location.reload();
        }
    };

    // 🚨 1. UI แบบที่หนึ่ง: หน้าแสดงผลเมื่อ "กดลบแอคเคาน์สำเร็จแล้ว" (Account Deleted UI)
    if (isDeleted) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-[#121212] px-4 text-white">
                <div className="w-full max-w-md bg-[#1e1e1e] border border-red-500/20 rounded-2xl p-8 text-center shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="mx-auto w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center ring-8 ring-red-500/5">
                        <Trash2 size={32} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold tracking-tight text-white">Account Permanently Deleted</h2>
                        <p className="text-sm text-gray-400">
                            Your account with ID <span className="font-mono text-red-400 font-semibold">{profile?.userId || currentUserId}</span> and all associated data has been successfully removed from our system.
                        </p>
                    </div>
                    <div className="pt-2 flex flex-col gap-3">
                        <button 
                            onClick={() => window.location.href = "/"}
                            className="w-full py-2.5 bg-[#121212] border border-[#2d2d2d] text-gray-300 text-sm font-medium rounded-xl hover:bg-[#222222] hover:text-white transition-all inline-flex items-center justify-center gap-2"
                        >
                            <Home size={16} />
                            <span>Return to Homepage</span>
                        </button>
                        <button 
                            onClick={handleResetDemo}
                            className="w-full py-2.5 bg-red-600/10 text-red-400 text-xs font-medium rounded-xl hover:bg-red-600/20 transition-all inline-flex items-center justify-center gap-1.5"
                        >
                            <RefreshCw size={12} />
                            <span>Reset Demo (เทสระบบใหม่อีกรอบ)</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 🔒 2. UI แบบที่สอง: หน้าแสดงผลเมื่อ "ผู้ใช้งานไม่ได้ทำการล็อกอิน" (Guest / Not Logged In UI)
    if (!currentUserId) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-[#121212] px-4 text-white">
                <div className="w-full max-w-md bg-[#1e1e1e] border border-[#2d2d2d] rounded-2xl p-8 text-center shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-300">
                    <div className="mx-auto w-16 h-16 bg-[#01579b]/10 text-[#38BDF8] rounded-full flex items-center justify-center ring-8 ring-[#01579b]/5">
                        <Lock size={30} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold tracking-tight text-white">Access Denied</h2>
                        <p className="text-sm text-gray-400 px-2">
                            Sorry, you must be logged in to view and manage your account settings. Please log in to access your profile information and preferences.
                        </p>
                    </div>
                    <div className="pt-2">
                        {/* ปุ่ม Login จำลอง */}
                        <button 
                            onClick={() => router.push('/signin')}
                            className="w-full py-3 bg-[#01579b] hover:bg-[#0277bd] text-white text-sm font-semibold rounded-xl shadow-lg shadow-[#01579b]/20 active:scale-98 transition-all inline-flex items-center justify-center gap-2"
                        >
                            <LogIn size={16} />
                            <span>Sign in to Account</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) return <div className="flex-grow flex items-center justify-center min-h-[500px] text-gray-500 font-medium">Loading details...</div>;

    // 👤 3. UI แบบที่สาม: หน้าจัดการฟอร์มโปรไฟล์ปกติ (Logged In State)
    return (
        <div className="flex-1 overflow-auto relative z-10 bg-[#121212] min-h-screen text-white">
            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8 space-y-6">
                
                {/* 📦 การ์ดเมนูตั้งค่าหลัก */}
                <div className="bg-[#1e1e1e] rounded-2xl border border-[#2d2d2d] shadow-2xl overflow-hidden">
                    <div className="h-32 bg-linear-to-r from-[#01579b] to-[#012d50] relative" />

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
                                    <h2 className="text-xl font-bold text-white">{profile?.name || "ไม่พบชื่อผู้ใช้งาน"}</h2>
                                    <p className="text-gray-400 text-xs mt-0.5">Account ID: <span className="text-[#01579b] font-mono">{profile?.userId || currentUserId}</span></p>
                                </div>
                            </div>

                            {/* หมวดหมู่ที่ 1: Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-[#01579b] tracking-wider uppercase border-b border-[#2d2d2d] pb-2">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><User size={14} /> Full Name</label>
                                        <input type="text" value={profile?.name || ""} onChange={(e) => setProfile({...profile!, name: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Users size={14} /> Gender</label>
                                        <select value={profile?.gender || "Male"} onChange={(e) => setProfile({...profile!, gender: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border  border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all cursor-pointer">
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other / Not Specified</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Calendar size={14}  /> Birthday</label>
                                        <input type="date" value={profile?.birthday || ""} onChange={(e) => setProfile({...profile!, birthday: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all [color-scheme:light] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
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
                                        <input type="email" value={profile?.email || ""} onChange={(e) => setProfile({...profile!, email: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Phone size={14} /> Phone Number</label>
                                        <input type="text" value={profile?.phone || ""} onChange={(e) => setProfile({...profile!, phone: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><MapPin size={14} /> Primary Shipping Address</label>
                                        <textarea rows={3} value={profile?.address || ""} onChange={(e) => setProfile({...profile!, address: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all resize-none" />
                                    </div>
                                </div>
                            </div>

                            {/* หมวดหมู่ที่ 3: Preferences */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-[#01579b] tracking-wider uppercase border-b border-[#2d2d2d] pb-2">Preferences</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Globe size={14} /> Display Language</label>
                                        <select value={profile?.language || "English (UK)"} onChange={(e) => setProfile({...profile!, language: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all cursor-pointer">
                                            <option value="English (UK)">English (UK)</option>
                                            <option value="Thai (TH)">Thai (TH)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400 flex items-center gap-2"><Coins size={14} /> Default Currency</label>
                                        <select value={profile?.currency || "THB (฿)"} onChange={(e) => setProfile({...profile!, currency: e.target.value})} className="w-full px-4 py-2 bg-[#121212] border border-[#2d2d2d] text-white text-sm rounded-lg focus:border-[#01579b] outline-none transition-all cursor-pointer">
                                            <option value="THB (฿)">THB (฿)</option>
                                            <option value="USD ($)">USD ($)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* โซนสรุปท้ายฟอร์มและปุ่มกดเซฟ */}
                            <div className="flex items-center justify-between border-t border-[#2d2d2d] pt-6">
                                <div className="min-h-2">
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
                    <button 
                        type="button" 
                        onClick={() => setShowDeleteModal(true)} 
                        className="px-4 py-2 border border-red-500/30 text-red-500 text-xs rounded-lg hover:bg-red-500/10 transition-all font-medium"
                    >
                        Delete Account
                    </button>
                </div> 

            </main>

            {/* 🚨 POPUP ALERT MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                        onClick={() => !isDeleting && setShowDeleteModal(false)} 
                    />
                    
                    <div className="relative w-full max-w-md bg-[#1e1e1e] rounded-2xl border border-red-500/20 shadow-2xl p-6 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            type="button" 
                            disabled={isDeleting}
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex flex-col items-center text-center mt-2">
                            <div className="p-4 bg-red-500/10 text-red-500 rounded-full mb-4 ring-8 ring-red-500/5">
                                <ShieldAlert size={32} />
                            </div>

                            <h3 className="text-white text-lg font-bold">Are you absolutely sure?</h3>
                            
                            <p className="text-gray-400 text-sm mt-2 px-2">
                                This action cannot be undone. This will permanently delete the account 
                                <span className="text-red-400 font-semibold"> {profile?.name || "User"} ({profile?.userId || currentUserId})</span> and remove all store metadata from our logs.
                            </p>
                        </div>

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