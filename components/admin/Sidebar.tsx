"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (open: boolean) => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("admin_auth");
        window.location.href = "/admin";
    };

    const menu = [
        { label: "Dashboard", href: "/admin/dashboard", icon: <DashboardIcon /> },
        { label: "Verifikasi", href: "/admin/verifikasi", icon: <CheckIcon /> },
        { label: "Laporan", href: "/admin/laporan", icon: <ReportIcon /> },
        { label: "Donatur", href: "/admin/donatur", icon: <WalletIcon /> },
        { label: "Profil Sekolah", href: "/admin/profil-sekolah", icon: <SchoolIcon /> },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-[280px] shrink-0 bg-white/90 backdrop-blur-md border-r border-[#B2F5EA]/50 shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="px-8 py-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#40E0D0] to-[#2CB1A6] flex items-center justify-center text-white shadow-lg shadow-[#40E0D0]/30">
                                <LogoIcon />
                            </div>
                            <div>
                                <div className="text-xl font-extrabold text-[#0F2F2E] tracking-tight">Admin</div>
                                <div className="text-xs font-semibold text-[#6B8E8B] tracking-wide">SAHABAT3T</div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 px-4 py-4">
                        {menu.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-200 ${isActive
                                        ? "bg-gradient-to-r from-[#0F2F2E] to-[#1A4D4A] text-white shadow-lg shadow-[#0F2F2E]/20"
                                        : "text-[#5A7E7B] hover:bg-[#E6FFFA]/50 hover:text-[#0F2F2E]"
                                        }`}
                                >
                                    <span className={`transition-colors ${isActive ? "text-[#40E0D0]" : "text-[#B2F5EA] group-hover:text-[#40E0D0]"}`}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                    {isActive && (
                                        <div className="absolute right-4 h-2 w-2 rounded-full bg-[#40E0D0] shadow-[0_0_8px_#40E0D0]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer / Logout */}
                    <div className="p-6">
                        <div className="rounded-3xl bg-gradient-to-b from-[#E6FFFA]/50 to-white border border-[#B2F5EA]/30 p-4 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-[#E6FFFA] flex items-center justify-center text-[#0F2F2E] border border-[#B2F5EA]">
                                    <UserIcon />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-[#0F2F2E]">Administrator</div>
                                    <div className="text-xs text-[#6B8E8B]">admin@sekolah3t.id</div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full h-11 rounded-xl bg-white border border-[#EF4444]/20 text-[#EF4444] text-sm font-bold hover:bg-[#EF4444] hover:text-white hover:shadow-lg hover:shadow-[#EF4444]/20 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <LogoutIcon />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

// Icons
function DashboardIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
    );
}
function CheckIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
    );
}
function ReportIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>
    );
}
function WalletIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-7" /><path d="M14 21V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2Z" /><path d="M8 7v14" /><rect width="20" height="14" x="2" y="7" rx="2" ry="2" fill="none" stroke="none" /><path d="M16 7v0a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" /></svg>
    );
}
function SchoolIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 6 8-4 8 4" /><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" /><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" /><path d="M18 5v17" /><path d="M6 5v17" /></svg>
    );
}
function LogoIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M17 21v-8.83a3 3 0 0 0-3-3v0a3 3 0 0 0-3 3V21" /></svg>
    );
}
function UserIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    );
}
function LogoutIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
    );
}
