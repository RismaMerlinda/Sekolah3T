"use client";

import Sidebar from "@/components/admin/Sidebar";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Hide sidebar on login page
    const isLogin = pathname === "/admin/login" || pathname === "/admin";
    const [mobileOpen, setMobileOpen] = useState(false);

    if (isLogin) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#E6FFFA]">
            {/* Background Glows (Shared) */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#40E0D0]/20 blur-3xl" />
                <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#2CB1A6]/20 blur-3xl" />
            </div>

            {/* Sidebar: Fixed height, no scroll (internal scroll if needed) */}
            <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

            {/* Main Content: Takes remaining width, scrolls independently */}
            <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
                {/* Mobile Header for Sidebar Toggle */}
                <div className="sticky top-0 z-30 flex flex-shrink-0 items-center gap-3 border-b border-[#B2F5EA] bg-white/70 px-4 py-3 backdrop-blur lg:hidden">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="rounded-xl border border-[#B2F5EA] bg-white/80 p-2 text-[#0F2F2E] hover:shadow-md transition"
                        aria-label="Toggle Menu"
                    >
                        <MenuIcon />
                    </button>
                    <div className="font-bold text-[#0F2F2E]">Admin Portal</div>
                </div>

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}

function MenuIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
    );
}
